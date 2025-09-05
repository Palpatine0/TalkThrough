/**
 * In-memory session management for TalkThrough
 * Stores chat sessions and their context
 */

class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create a new chat session
   * @param {string} sessionId - Unique session identifier
   * @param {Object} sessionData - Session data including relationship info
   * @returns {Object} Created session
   */
  createSession(sessionId, sessionData) {
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      relationshipType: sessionData.relationshipType,
      surveyAnswers: sessionData.surveyAnswers,
      messages: [],
      promptTemplate: sessionData.promptTemplate
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get a session by ID
   * @param {string} sessionId - Session identifier
   * @returns {Object|null} Session data or null if not found
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Add a message to a session
   * @param {string} sessionId - Session identifier
   * @param {Object} message - Message data
   * @returns {boolean} True if message was added successfully
   */
  addMessage(sessionId, message) {
    const session = this.getSession(sessionId);
    if (!session) {
      return false;
    }

    const messageData = {
      id: this.generateMessageId(),
      timestamp: new Date().toISOString(),
      ...message
    };

    session.messages.push(messageData);
    session.lastActivity = new Date().toISOString();
    
    return true;
  }

  /**
   * Get all messages for a session
   * @param {string} sessionId - Session identifier
   * @returns {Array} Array of messages
   */
  getMessages(sessionId) {
    const session = this.getSession(sessionId);
    return session ? session.messages : [];
  }

  /**
   * Update session data
   * @param {string} sessionId - Session identifier
   * @param {Object} updates - Data to update
   * @returns {boolean} True if session was updated successfully
   */
  updateSession(sessionId, updates) {
    const session = this.getSession(sessionId);
    if (!session) {
      return false;
    }

    Object.assign(session, updates);
    session.lastActivity = new Date().toISOString();
    
    return true;
  }

  /**
   * Delete a session
   * @param {string} sessionId - Session identifier
   * @returns {boolean} True if session was deleted
   */
  deleteSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  /**
   * Get all sessions (for debugging/admin purposes)
   * @returns {Array} Array of all sessions
   */
  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  /**
   * Clean up old sessions (older than specified hours)
   * @param {number} hours - Hours after which to clean up sessions
   * @returns {number} Number of sessions cleaned up
   */
  cleanupOldSessions(hours = 24) {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    let cleanedCount = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (new Date(session.lastActivity) < cutoffTime) {
        this.sessions.delete(sessionId);
        cleanedCount++;
      }
    }

    return cleanedCount;
  }

  /**
   * Generate a unique message ID
   * @returns {string} Unique message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session statistics
   * @returns {Object} Session statistics
   */
  getStats() {
    const sessions = this.getAllSessions();
    const totalMessages = sessions.reduce((sum, session) => sum + session.messages.length, 0);
    
    return {
      totalSessions: sessions.length,
      totalMessages: totalMessages,
      averageMessagesPerSession: sessions.length > 0 ? Math.round(totalMessages / sessions.length) : 0
    };
  }
}

// Export singleton instance
module.exports = new SessionManager();
