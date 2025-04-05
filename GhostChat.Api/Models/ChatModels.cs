using System.Collections.Concurrent;
using Grpc.Core;

namespace GhostChat.Api.Models;

/// <summary>
/// Represents a user's chat session
/// </summary>
public class ChatSession
{
    /// <summary>
    /// Unique identifier for this session
    /// </summary>
    public string SessionId { get; set; } = null!;
    
    /// <summary>
    /// Optional pseudonym for the user
    /// </summary>
    public string? Pseudonym { get; set; }
    
    /// <summary>
    /// When the session was created
    /// </summary>
    public DateTimeOffset CreatedAt { get; set; }
    
    /// <summary>
    /// When the session was last active
    /// </summary>
    public DateTimeOffset LastActive { get; set; }
    
    /// <summary>
    /// The server stream for sending messages to this client
    /// </summary>
    public IServerStreamWriter<MessageResponse>? StreamWriter { get; set; }
    
    /// <summary>
    /// The cancellation token source for this session's stream
    /// </summary>
    public CancellationTokenSource? CancellationTokenSource { get; set; }
}

/// <summary>
/// Represents a chat message in the system
/// </summary>
public class ChatMessage
{
    /// <summary>
    /// Unique identifier for this message
    /// </summary>
    public string MessageId { get; set; } = null!;
    
    /// <summary>
    /// Session ID of the sender
    /// </summary>
    public string SenderId { get; set; } = null!;
    
    /// <summary>
    /// Session ID of the recipient
    /// </summary>
    public string RecipientId { get; set; } = null!;
    
    /// <summary>
    /// Encrypted message content
    /// </summary>
    public byte[] EncryptedPayload { get; set; } = null!;
    
    /// <summary>
    /// When the message was sent
    /// </summary>
    public DateTimeOffset Timestamp { get; set; }
    
    /// <summary>
    /// Optional initialization vector for encryption
    /// </summary>
    public byte[]? Nonce { get; set; }
}