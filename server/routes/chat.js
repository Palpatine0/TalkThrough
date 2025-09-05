const express = require('express');
const { v4: uuidv4 } = require('uuid');
const GeminiAPI = require('../lib/gemini');
const PromptEngine = require('../lib/promptEngine');
const sessionManager = require('../lib/sessionManager');

const router = express.Router();
const geminiAPI = new GeminiAPI();
const promptEngine = new PromptEngine();

/**
 * POST /api/chat/new
 * Create a new chat session
 */
router.post('/new', async (req, res) => {
  try {
    const { relationshipType, surveyAnswers } = req.body;

    // Validate required fields
    if (!relationshipType) {
      return res.status(400).json({
        error: 'Missing required field: relationshipType',
        status: 400
      });
    }

    if (!surveyAnswers || typeof surveyAnswers !== 'object') {
      return res.status(400).json({
        error: 'Missing required field: surveyAnswers',
        status: 400
      });
    }

    // Validate relationship type
    if (!promptEngine.isValidRelationshipType(relationshipType)) {
      return res.status(400).json({
        error: 'Invalid relationship type',
        validTypes: promptEngine.getRelationshipTypes(),
        status: 400
      });
    }

    // Generate session ID
    const sessionId = uuidv4();

    // Generate prompt template
    const promptTemplate = promptEngine.generatePrompt(relationshipType, surveyAnswers);

    // Create session
    const sessionData = {
      relationshipType,
      surveyAnswers,
      promptTemplate
    };

    const session = sessionManager.createSession(sessionId, sessionData);

    // Generate initial AI message
    const initialMessage = await geminiAPI.generateResponse(
      "Hello, I'm here to help you navigate this conversation. What would you like to discuss?",
      { relationshipType, surveyAnswers },
      promptTemplate
    );

    // Add initial message to session
    sessionManager.addMessage(sessionId, {
      type: 'ai',
      content: initialMessage.aiResponse,
      suggestedReplies: initialMessage.suggestedReplies
    });

    res.json({
      sessionId,
      initialMessage: initialMessage.aiResponse,
      suggestedReplies: initialMessage.suggestedReplies,
      relationshipType,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error creating new chat session:', error);
    res.status(500).json({
      error: 'Failed to create chat session',
      message: error.message,
      status: 500
    });
  }
});

/**
 * POST /api/chat/:sessionId/message
 * Send a message and get AI response
 */
router.post('/:sessionId/message', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    // Validate required fields
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        error: 'Message is required and must be a non-empty string',
        status: 400
      });
    }

    // Get session
    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND',
        status: 404
      });
    }

    // Add user message to session
    sessionManager.addMessage(sessionId, {
      type: 'user',
      content: message.trim()
    });

    // Generate AI response
    const aiResponse = await geminiAPI.generateResponse(
      message.trim(),
      {
        relationshipType: session.relationshipType,
        surveyAnswers: session.surveyAnswers
      },
      session.promptTemplate
    );

    // Add AI response to session
    sessionManager.addMessage(sessionId, {
      type: 'ai',
      content: aiResponse.aiResponse,
      suggestedReplies: aiResponse.suggestedReplies
    });

    res.json({
      aiResponse: aiResponse.aiResponse,
      suggestedReplies: aiResponse.suggestedReplies,
      timestamp: aiResponse.timestamp,
      sessionId
    });

  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
      status: 500
    });
  }
});

/**
 * GET /api/chat/:sessionId/messages
 * Get all messages for a session
 */
router.get('/:sessionId/messages', (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND',
        status: 404
      });
    }

    const messages = sessionManager.getMessages(sessionId);

    res.json({
      sessionId,
      messages,
      totalMessages: messages.length,
      relationshipType: session.relationshipType
    });

  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({
      error: 'Failed to get messages',
      message: error.message,
      status: 500
    });
  }
});

/**
 * GET /api/chat/:sessionId
 * Get session details
 */
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = sessionManager.getSession(sessionId);
    if (!session) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND',
        status: 404
      });
    }

    // Return session without messages for privacy
    const { messages, ...sessionInfo } = session;

    res.json({
      ...sessionInfo,
      messageCount: messages.length
    });

  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({
      error: 'Failed to get session',
      message: error.message,
      status: 500
    });
  }
});

/**
 * DELETE /api/chat/:sessionId
 * Delete a session
 */
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;

    const deleted = sessionManager.deleteSession(sessionId);
    if (!deleted) {
      return res.status(404).json({
        error: 'Session not found',
        code: 'SESSION_NOT_FOUND',
        status: 404
      });
    }

    res.json({
      message: 'Session deleted successfully',
      sessionId
    });

  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Failed to delete session',
      message: error.message,
      status: 500
    });
  }
});

module.exports = router;
