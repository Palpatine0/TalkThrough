const express = require('express');
const PromptEngine = require('../lib/promptEngine');

const router = express.Router();
const promptEngine = new PromptEngine();

/**
 * GET /api/relationships/survey/:type
 * Get survey questions for a specific relationship type
 */
router.get('/survey/:type', (req, res) => {
  try {
    const { type } = req.params;

    // Validate relationship type
    if (!promptEngine.isValidRelationshipType(type)) {
      return res.status(400).json({
        error: 'Invalid relationship type',
        validTypes: promptEngine.getRelationshipTypes(),
        status: 400
      });
    }

    // Get sample questions for the relationship type
    const questions = promptEngine.getSampleQuestions(type);

    res.json({
      relationshipType: type,
      questions: questions.map((q, index) => ({
        ...q,
        required: true,
        order: index + 1
      }))
    });

  } catch (error) {
    console.error('Error getting survey questions:', error);
    res.status(500).json({
      error: 'Failed to get survey questions',
      message: error.message,
      status: 500
    });
  }
});

/**
 * GET /api/relationships/types
 * Get all available relationship types
 */
router.get('/types', (req, res) => {
  try {
    const types = promptEngine.getRelationshipTypes();
    
    const typeDescriptions = {
      'romantic': 'Dating, marriage, or romantic partnerships',
      'professional': 'Workplace relationships with colleagues, bosses, or clients',
      'family': 'Family members including parents, siblings, and extended family',
      'friendly': 'Friends and close acquaintances',
      'acquaintances': 'Casual relationships and small talk scenarios'
    };

    const response = types.map(type => ({
      type,
      description: typeDescriptions[type] || 'General relationship guidance'
    }));

    res.json({
      relationshipTypes: response,
      total: types.length
    });

  } catch (error) {
    console.error('Error getting relationship types:', error);
    res.status(500).json({
      error: 'Failed to get relationship types',
      message: error.message,
      status: 500
    });
  }
});

/**
 * POST /api/relationships/validate
 * Validate survey answers for a relationship type
 */
router.post('/validate', (req, res) => {
  try {
    const { relationshipType, surveyAnswers } = req.body;

    // Validate relationship type
    if (!promptEngine.isValidRelationshipType(relationshipType)) {
      return res.status(400).json({
        error: 'Invalid relationship type',
        validTypes: promptEngine.getRelationshipTypes(),
        status: 400
      });
    }

    // Basic validation of survey answers
    if (!surveyAnswers || typeof surveyAnswers !== 'object') {
      return res.status(400).json({
        error: 'Survey answers must be an object',
        status: 400
      });
    }

    // Get expected questions for validation
    const expectedQuestions = promptEngine.getSampleQuestions(relationshipType);
    const missingFields = [];
    const invalidFields = [];

    // Check for required fields
    expectedQuestions.forEach(question => {
      if (question.required && !surveyAnswers[question.id]) {
        missingFields.push(question.id);
      }
    });

    // Basic type validation
    Object.keys(surveyAnswers).forEach(key => {
      const value = surveyAnswers[key];
      if (typeof value === 'string' && value.trim().length === 0) {
        invalidFields.push(`${key}: cannot be empty`);
      }
    });

    const isValid = missingFields.length === 0 && invalidFields.length === 0;

    res.json({
      isValid,
      missingFields,
      invalidFields,
      relationshipType,
      message: isValid ? 'Survey answers are valid' : 'Survey answers have validation errors'
    });

  } catch (error) {
    console.error('Error validating survey answers:', error);
    res.status(500).json({
      error: 'Failed to validate survey answers',
      message: error.message,
      status: 500
    });
  }
});

module.exports = router;
