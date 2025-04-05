using System.Collections.Concurrent;
using Google.Protobuf;
using Grpc.Core;
using GhostChat.Api.Models;

namespace GhostChat.Api.Services;

/// <summary>
/// Implementation of the Chat gRPC service
/// </summary>
public class ChatService : GhostChat.Api.ChatService.ChatServiceBase
{
    private readonly IChatSessionManager _sessionManager;
    private readonly ILogger<ChatService> _logger;
    private readonly ConcurrentDictionary<string, ConcurrentBag<KeyRequest>> _pendingKeyRequests = new();
    private readonly ConcurrentDictionary<string, string> _messageIdGenerator = new();

    public ChatService(IChatSessionManager sessionManager, ILogger<ChatService> logger)
    {
        _sessionManager = sessionManager;
        _logger = logger;
    }

    /// <summary>
    /// Handles a request to join the chat and creates a new anonymous session
    /// </summary>
    public override Task<SessionResponse> JoinChat(SessionRequest request, ServerCallContext context)
    {
        _logger.LogInformation("JoinChat request received with pseudonym: {Pseudonym}", 
            string.IsNullOrEmpty(request.Pseudonym) ? "(anonymous)" : request.Pseudonym);
        
        var session = _sessionManager.CreateSession(request.Pseudonym);
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
        _logger.LogInformation("SendMessage request received from {SenderId} to {RecipientId}",
            request.SenderId, request.RecipientId);
        
        // Validate sender exists
        var sender = _sessionManager.GetSession(request.SenderId);
        if (sender == null)
        {
            _logger.LogWarning("Message rejected: Sender session {SenderId} not found", request.SenderId);
            return Task.FromResult(new MessageAck
            {
                Success = false,
                ErrorMessage = "Sender session not found"
            });
        }
        
        // Update sender's last activity timestamp
        _sessionManager.UpdateSessionActivity(request.SenderId);
        
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
        var recipient = _sessionManager.GetSession(request.RecipientId);
        if (recipient != null && recipient.StreamWriter != null)
        {
            // The recipient is online with an active stream
            _ = DeliverMessageAsync(recipient, message);
        }
        else
        {
            _logger.LogWarning("Recipient {RecipientId} is offline or has no active stream", request.RecipientId);
            // In a real application, we might queue the message for delivery when the recipient connects
            // For this simple example, messages are not stored if the recipient is offline
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
        _logger.LogInformation("MessageStream request received for session {SessionId}", sessionId);
        
        // Validate the session exists
        var session = _sessionManager.GetSession(sessionId);
        if (session == null)
        {
            _logger.LogWarning("MessageStream rejected: Session {SessionId} not found", sessionId);
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
            _sessionManager.UpdateSessionActivity(sessionId);
            
            // Keep the stream open until the client disconnects
            var tcs = new TaskCompletionSource<bool>();
            using var ctr = context.CancellationToken.Register(() => tcs.TrySetResult(true));
            using var ctsReg = cts.Token.Register(() => tcs.TrySetResult(true));
            await tcs.Task;
        }
        catch (OperationCanceledException)
        {
            // Expected when the client disconnects
            _logger.LogInformation("MessageStream ended for session {SessionId}", sessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in MessageStream for session {SessionId}", sessionId);
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
    /// Handles key exchange between clients
    /// </summary>
    public override Task<KeyResponse> KeyExchange(KeyRequest request, ServerCallContext context)
    {
        _logger.LogInformation("KeyExchange request received from {SessionId} to {RecipientId}",
            request.SessionId, string.IsNullOrEmpty(request.RecipientId) ? "(server)" : request.RecipientId);
        
        // Validate sender exists
        var sender = _sessionManager.GetSession(request.SessionId);
        if (sender == null)
        {
            _logger.LogWarning("KeyExchange rejected: Sender session {SessionId} not found", request.SessionId);
            return Task.FromResult(new KeyResponse
            {
                Success = false,
                ErrorMessage = "Sender session not found",
                SessionId = request.SessionId
            });
        }
        
        // Update sender activity
        _sessionManager.UpdateSessionActivity(request.SessionId);
        
        // If this is a key exchange with a specific recipient
        if (!string.IsNullOrEmpty(request.RecipientId))
        {
            var recipient = _sessionManager.GetSession(request.RecipientId);
            if (recipient == null)
            {
                _logger.LogWarning("KeyExchange rejected: Recipient session {RecipientId} not found", request.RecipientId);
                return Task.FromResult(new KeyResponse
                {
                    Success = false,
                    ErrorMessage = "Recipient session not found",
                    SessionId = request.SessionId
                });
            }
            
            // Store the key request for the recipient to retrieve
            _pendingKeyRequests.GetOrAdd(request.RecipientId, _ => new ConcurrentBag<KeyRequest>())
                .Add(request);
            
            return Task.FromResult(new KeyResponse
            {
                Success = true,
                SessionId = request.SessionId
            });
        }
        
        // This is a key exchange with the server (not needed for E2EE, but included for flexibility)
        return Task.FromResult(new KeyResponse
        {
            Success = true,
            SessionId = request.SessionId,
            // In a true E2EE system, the server would not store or return key material
            // This is just a placeholder for a possible server-side public key if needed
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
            _logger.LogWarning("Cannot deliver message: Recipient {RecipientId} has no active stream", 
                recipient.SessionId);
            return;
        }
        
        try
        {
            // Convert to the gRPC message format
            var response = new MessageResponse
            {
                MessageId = message.MessageId,
                SenderId = message.SenderId,
                RecipientId = message.RecipientId,
                EncryptedPayload = ByteString.CopyFrom(message.EncryptedPayload),
                Timestamp = new DateTimeOffset(message.Timestamp.Ticks, TimeSpan.Zero).ToUnixTimeMilliseconds()
            };
            
            // Add the nonce if present
            if (message.Nonce != null)
            {
                response.Nonce = ByteString.CopyFrom(message.Nonce);
            }
            
            // Send the message through the stream
            await recipient.StreamWriter.WriteAsync(response);
            _logger.LogInformation("Message {MessageId} delivered to {RecipientId}", 
                message.MessageId, recipient.SessionId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to deliver message {MessageId} to {RecipientId}",
                message.MessageId, recipient.SessionId);
                
            // If we get an error delivering the message, we might want to close the stream
            // as it likely indicates the client has disconnected
            recipient.CancellationTokenSource?.Cancel();
        }
    }
}