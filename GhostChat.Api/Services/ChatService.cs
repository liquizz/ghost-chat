using System.Collections.Concurrent;
using Google.Protobuf;
using Grpc.Core;
using GhostChat.Api.Models;

namespace GhostChat.Api.Services;

/// <summary>
/// Implementation of the Chat gRPC service
/// </summary>
public class ChatService(IChatSessionManager sessionManager, ILogger<ChatService> logger)
    : GhostChat.Api.ChatService.ChatServiceBase
{
    private class KeyExchangeState
    {
        public byte[] KeyMaterial { get; set; }
        public bool NotificationSent { get; set; }
        public DateTimeOffset LastUpdate { get; set; }
    }

    // Store key exchange state for each pair of users
    private readonly ConcurrentDictionary<(string From, string To), KeyExchangeState?> _keyExchangeStates = new();

    /// <summary>
    /// Handles a request to join the chat and creates a new anonymous session
    /// </summary>
    public override Task<SessionResponse> JoinChat(SessionRequest request, ServerCallContext context)
    {
        logger.LogInformation("JoinChat request received with pseudonym: {Pseudonym}",
            string.IsNullOrEmpty(request.Pseudonym) ? "(anonymous)" : request.Pseudonym);

        var session = sessionManager.CreateSession(request.Pseudonym);
        var timestamp = new DateTimeOffset(session.CreatedAt.Ticks, TimeSpan.Zero).ToUnixTimeMilliseconds();

        return Task.FromResult(new SessionResponse
        {
            SessionId = session.SessionId,
            CreatedAt = timestamp,
            Success = true
        });
    }

    /// <summary>
    /// Handles an incoming encrypted message and routes it to the intended recipient
    /// </summary>
    public override Task<MessageAck> SendMessage(MessageRequest request, ServerCallContext context)
    {
        logger.LogInformation("SendMessage request received from {SenderId} to {RecipientId}",
            request.SenderId, request.RecipientId);

        // Validate sender exists
        var sender = sessionManager.GetSession(request.SenderId);
        if (sender == null)
        {
            logger.LogWarning("Message rejected: Sender session {SenderId} not found", request.SenderId);
            return Task.FromResult(new MessageAck
            {
                Success = false,
                ErrorMessage = "Sender session not found"
            });
        }

        // Update sender's last activity timestamp
        sessionManager.UpdateSessionActivity(request.SenderId);

        // Generate a unique message ID
        var messageId = Guid.NewGuid().ToString();

        // Create the message object
        var message = new ChatMessage
        {
            MessageId = messageId,
            SenderId = request.SenderId,
            RecipientId = request.RecipientId,
            EncryptedPayload = request.EncryptedPayload.ToByteArray(),
            Timestamp = DateTimeOffset.UtcNow,
            Nonce = request.Nonce?.ToByteArray()
        };

        // Route the message to the recipient (if online)
        var recipient = sessionManager.GetSession(request.RecipientId);
        if (recipient is { StreamWriter: not null })
        {
            _ = DeliverMessageAsync(recipient, message);
        }
        else
        {
            logger.LogWarning("Recipient {RecipientId} is offline or has no active stream", request.RecipientId);
            // In a real app, you might queue the message for future delivery. This sample just logs a warning.
        }

        // Return acknowledgment
        var serverTimestamp = new DateTimeOffset(message.Timestamp.Ticks, TimeSpan.Zero).ToUnixTimeMilliseconds();
        return Task.FromResult(new MessageAck
        {
            Success = true,
            MessageId = messageId,
            ServerTimestamp = serverTimestamp
        });
    }

    /// <summary>
    /// Establishes a server-sent events stream for receiving messages in real-time
    /// </summary>
    public override async Task MessageStream(StreamRequest request, IServerStreamWriter<MessageResponse> responseStream, ServerCallContext context)
    {
        var sessionId = request.SessionId;
        logger.LogInformation("MessageStream request received for session {SessionId}", sessionId);

        // Validate the session exists
        var session = sessionManager.GetSession(sessionId);
        if (session == null)
        {
            logger.LogWarning("MessageStream rejected: Session {SessionId} not found", sessionId);
            throw new RpcException(new Status(StatusCode.NotFound, "Session not found"));
        }

        // Set up cancellation
        var cts = new CancellationTokenSource();
        try
        {
            // Update the session with the stream writer
            session.StreamWriter = responseStream;
            session.CancellationTokenSource = cts;

            // Update session activity
            sessionManager.UpdateSessionActivity(sessionId);

            // Keep the stream open until the client disconnects
            var tcs = new TaskCompletionSource<bool>();
            await using var ctr = context.CancellationToken.Register(() => tcs.TrySetResult(true));
            await using var ctsReg = cts.Token.Register(() => tcs.TrySetResult(true));
            await tcs.Task;
        }
        catch (OperationCanceledException)
        {
            // Expected when the client disconnects
            logger.LogInformation("MessageStream ended for session {SessionId}", sessionId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error in MessageStream for session {SessionId}", sessionId);
        }
        finally
        {
            // Clean up
            session.StreamWriter = null;
            session.CancellationTokenSource = null;
            cts.Dispose();
        }
    }

    /// <summary>
    /// Handles key exchange between clients using a combined dictionary key
    /// </summary>
    public override Task<KeyResponse> KeyExchange(KeyRequest request, ServerCallContext context)
    {
        logger.LogInformation("KeyExchange request received from {SessionId} to {RecipientId}",
            request.SessionId, string.IsNullOrEmpty(request.RecipientId) ? "(server)" : request.RecipientId);

        // Validate sender exists
        var sender = sessionManager.GetSession(request.SessionId);
        if (sender == null)
        {
            logger.LogWarning("KeyExchange rejected: Sender session {SessionId} not found", request.SessionId);
            return Task.FromResult(new KeyResponse
            {
                Success = false,
                ErrorMessage = "Sender session not found",
                SessionId = request.SessionId
            });
        }

        // Update sender activity
        sessionManager.UpdateSessionActivity(request.SessionId);

        // If there's a specific recipient, we attempt a peer-to-peer key exchange
        if (!string.IsNullOrEmpty(request.RecipientId))
        {
            var recipient = sessionManager.GetSession(request.RecipientId);
            if (recipient == null)
            {
                logger.LogWarning("KeyExchange rejected: Recipient session {RecipientId} not found", request.RecipientId);
                return Task.FromResult(new KeyResponse
                {
                    Success = false,
                    ErrorMessage = "Recipient session not found",
                    SessionId = request.SessionId
                });
            }

            var dictKey = (request.SessionId, request.RecipientId);
            var reverseKey = (request.RecipientId, request.SessionId);

            // If the request included a key, store it and notify the recipient
            if (request.KeyMaterial?.Length > 0)
            {
                // Only store the key if we don't already have one from this sender
                _keyExchangeStates.AddOrUpdate(
                    dictKey,
                    // Creation:
                    _ => new KeyExchangeState
                    {
                        KeyMaterial = request.KeyMaterial.ToByteArray(),
                        NotificationSent = false,
                        LastUpdate = DateTimeOffset.UtcNow
                    },
                    // Update:
                    (_, existingState) =>
                    {
                        // If the existing state is null, replace it completely
                        if (existingState == null)
                        {
                            return new KeyExchangeState
                            {
                                KeyMaterial = request.KeyMaterial.ToByteArray(),
                                NotificationSent = false,
                                LastUpdate = DateTimeOffset.UtcNow
                            };
                        }

                        // Even if it's less than 5 minutes old, go ahead and update 
                        // the key material and timestamp now.
                        existingState.KeyMaterial = request.KeyMaterial.ToByteArray();
                        existingState.NotificationSent = false;
                        existingState.LastUpdate = DateTimeOffset.UtcNow;

                        return existingState;
                    });

                // Get the current state after potential update
                var currentState = _keyExchangeStates[dictKey];
                
                // Only notify if we haven't sent a notification and recipient has a stream
                if (!currentState.NotificationSent && recipient.StreamWriter != null)
                {
                    currentState.NotificationSent = true;
                    _ = NotifyKeyExchangeRequestAsync(recipient, request.SessionId);
                }
                
                logger.LogInformation("Stored/Retrieved key from {SenderId} for {RecipientId}", 
                    request.SessionId, request.RecipientId);
            }

            // Look up any key that the recipient might have posted for this sender
            if (_keyExchangeStates.TryGetValue(reverseKey, out var recipientState) && 
                recipientState.KeyMaterial?.Length > 0)
            {
                // Don't remove the key immediately - keep it for a while in case of retries
                logger.LogInformation("Found pending key from {RecipientId} for {SenderId}", 
                    request.RecipientId, request.SessionId);

                // Start a cleanup task that will remove the key after some time
                _ = Task.Delay(TimeSpan.FromMinutes(5))
                    .ContinueWith(_ => { _keyExchangeStates.TryRemove(reverseKey, out var _); });

                return Task.FromResult(new KeyResponse
                {
                    Success = true,
                    SessionId = request.SessionId,
                    KeyMaterial = ByteString.CopyFrom(recipientState.KeyMaterial)
                });
            }

            // Return a "wait for recipient's key" response if we stored our key but the other side has not yet posted theirs
            if (request.KeyMaterial?.Length > 0)
            {
                logger.LogInformation("No pending key from {RecipientId} for {SenderId} yet, client should retry", 
                    request.RecipientId, request.SessionId);
                
                return Task.FromResult(new KeyResponse
                {
                    Success = true,
                    SessionId = request.SessionId,
                    KeyMaterial = ByteString.Empty
                });
            }

            // If client didn't send a key and there's no pending key, return an error
            logger.LogWarning("KeyExchange failed: No key material provided and no pending key found");
            return Task.FromResult(new KeyResponse
            {
                Success = false,
                ErrorMessage = "No key material provided and no pending key found",
                SessionId = request.SessionId
            });
        }

        // If no recipient was specified, we assume a server handshake (or just a do-nothing)
        return Task.FromResult(new KeyResponse
        {
            Success = true,
            SessionId = request.SessionId,
            KeyMaterial = ByteString.Empty
        });
    }

    /// <summary>
    /// Delivers a message to a recipient's active stream
    /// </summary>
    private async Task DeliverMessageAsync(ChatSession recipient, ChatMessage message)
    {
        if (recipient.StreamWriter == null)
        {
            logger.LogWarning("Cannot deliver message: Recipient {RecipientId} has no active stream",
                recipient.SessionId);
            return;
        }

        try
        {
            var response = new MessageResponse
            {
                MessageId = message.MessageId,
                SenderId = message.SenderId,
                RecipientId = message.RecipientId,
                EncryptedPayload = ByteString.CopyFrom(message.EncryptedPayload),
                Timestamp = new DateTimeOffset(message.Timestamp.Ticks, TimeSpan.Zero).ToUnixTimeMilliseconds()
            };

            if (message.Nonce != null)
            {
                response.Nonce = ByteString.CopyFrom(message.Nonce);
            }

            await recipient.StreamWriter.WriteAsync(response);
            logger.LogInformation("Message {MessageId} delivered to {RecipientId}",
                message.MessageId, recipient.SessionId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to deliver message {MessageId} to {RecipientId}",
                message.MessageId, recipient.SessionId);

            // If delivering failed, the client might have disconnected, so cancel
            recipient.CancellationTokenSource?.Cancel();
        }
    }

    /// <summary>
    /// Notifies a client that another client wants to exchange keys with them
    /// </summary>
    private async Task NotifyKeyExchangeRequestAsync(ChatSession recipient, string senderId)
    {
        if (recipient.StreamWriter == null)
        {
            logger.LogWarning("Cannot notify recipient: {RecipientId} has no active stream", recipient.SessionId);
            return;
        }

        try
        {
            var response = new MessageResponse
            {
                MessageId = Guid.NewGuid().ToString(),
                SenderId = senderId,
                RecipientId = recipient.SessionId,
                IsKeyExchangeRequest = true,
                Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
            };

            await recipient.StreamWriter.WriteAsync(response);
            logger.LogInformation("Key exchange request notification sent to {RecipientId} from {SenderId}",
                recipient.SessionId, senderId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to send key exchange notification to {RecipientId}",
                recipient.SessionId);
            recipient.CancellationTokenSource?.Cancel();
        }
    }
}
