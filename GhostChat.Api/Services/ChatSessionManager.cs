using System.Collections.Concurrent;
using GhostChat.Api.Models;

namespace GhostChat.Api.Services;

/// <summary>
/// Service for managing anonymous chat sessions in memory
/// </summary>
public interface IChatSessionManager
{
    /// <summary>
    /// Creates a new chat session
    /// </summary>
    /// <param name="pseudonym">Optional pseudonym for the user</param>
    /// <returns>The created session</returns>
    ChatSession CreateSession(string? pseudonym);
    
    /// <summary>
    /// Gets a session by its ID
    /// </summary>
    /// <param name="sessionId">The session ID to look up</param>
    /// <returns>The session if found, null otherwise</returns>
    ChatSession? GetSession(string sessionId);
    
    /// <summary>
    /// Removes a session by its ID
    /// </summary>
    /// <param name="sessionId">The session ID to remove</param>
    /// <returns>True if the session was removed, false if it wasn't found</returns>
    bool RemoveSession(string sessionId);
    
    /// <summary>
    /// Gets all active sessions
    /// </summary>
    /// <returns>Collection of active sessions</returns>
    IEnumerable<ChatSession> GetAllSessions();
    
    /// <summary>
    /// Updates the last active timestamp of a session
    /// </summary>
    /// <param name="sessionId">The session ID to update</param>
    void UpdateSessionActivity(string sessionId);
}

/// <summary>
/// In-memory implementation of IChatSessionManager
/// </summary>
public class InMemoryChatSessionManager : IChatSessionManager
{
    private readonly ConcurrentDictionary<string, ChatSession> _sessions = new();
    private readonly ILogger<InMemoryChatSessionManager> _logger;
    
    public InMemoryChatSessionManager(ILogger<InMemoryChatSessionManager> logger)
    {
        _logger = logger;
    }
    
    public ChatSession CreateSession(string? pseudonym)
    {
        var session = new ChatSession
        {
            SessionId = Guid.NewGuid().ToString(),
            Pseudonym = pseudonym,
            CreatedAt = DateTimeOffset.UtcNow,
            LastActive = DateTimeOffset.UtcNow
        };
        
        _sessions[session.SessionId] = session;
        _logger.LogInformation("Created new session with ID {SessionId}", session.SessionId);
        return session;
    }
    
    public ChatSession? GetSession(string sessionId)
    {
        if (_sessions.TryGetValue(sessionId, out var session))
        {
            return session;
        }
        
        _logger.LogWarning("Session {SessionId} not found", sessionId);
        return null;
    }
    
    public bool RemoveSession(string sessionId)
    {
        if (_sessions.TryRemove(sessionId, out _))
        {
            _logger.LogInformation("Removed session {SessionId}", sessionId);
            return true;
        }
        
        _logger.LogWarning("Failed to remove session {SessionId} (not found)", sessionId);
        return false;
    }
    
    public IEnumerable<ChatSession> GetAllSessions()
    {
        return _sessions.Values;
    }
    
    public void UpdateSessionActivity(string sessionId)
    {
        if (_sessions.TryGetValue(sessionId, out var session))
        {
            session.LastActive = DateTimeOffset.UtcNow;
        }
    }
}