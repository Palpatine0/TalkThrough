/**
 * Prompt Engine for TalkThrough
 * Generates relationship-specific prompts for the Gemini API
 */

class PromptEngine {
  constructor() {
    this.basePrompt = `You are an elite relationship therapist with years of experience helping people transform their relationships. Your goal is to guide users toward genuine self-awareness and practical breakthroughs.

CONVERSATION APPROACH:
- Build on each response naturally - never repeat the same validation phrases
- Use varied, authentic language to show understanding ("I can see how that would...", "That must feel...", "It makes sense that...")
- Ask insightful questions that help users discover patterns and deeper truths about themselves
- Offer meaningful observations that connect their behavior to underlying needs or fears

CONVERSATION STAGES:
1. EXPLORATION: Help them see patterns in their relationship dynamics through thoughtful questions
2. INSIGHT: Guide them to understand their role and their partner's perspective 
3. ACTION: When they show readiness, provide specific, practical steps they can take

RESPONSE STYLE:
- 3-5 sentences that feel substantial and thoughtful
- Vary your language - avoid repetitive phrases
- Balance empathy with gentle challenges that promote growth
- Reference their specific situation, don't give generic advice

You're not just validating - you're helping them grow and see their relationships more clearly.`;
  }

  /**
   * Generate a personalized prompt based on relationship type and survey data
   * @param {string} relationshipType - Type of relationship (romantic, professional, family, etc.)
   * @param {Object} surveyAnswers - User's survey responses
   * @returns {string} Formatted prompt for the AI
   */
  generatePrompt(relationshipType, surveyAnswers) {
    const context = this.buildContext(relationshipType, surveyAnswers);
    const relationshipGuidance = this.getRelationshipGuidance(relationshipType);
    
    return `${this.basePrompt}

User Context:
${context}

${relationshipGuidance}

Remember to tailor your advice specifically to this relationship type and the user's specific situation.`;
  }

  /**
   * Build context string from survey answers
   * @param {string} relationshipType - Type of relationship
   * @param {Object} surveyAnswers - Survey responses
   * @returns {string} Formatted context
   */
  buildContext(relationshipType, surveyAnswers) {
    const contextParts = [`- Relationship Type: ${relationshipType}`];
    
    // Add optional background context if provided
    if (surveyAnswers.backgroundContext) {
      contextParts.push(`- Background Context: ${surveyAnswers.backgroundContext}`);
    }
    
    // Add relationship-specific context
    if (surveyAnswers.duration) {
      contextParts.push(`- Duration: ${surveyAnswers.duration}`);
    }
    
    if (surveyAnswers.closeness !== undefined) {
      contextParts.push(`- Closeness Level: ${surveyAnswers.closeness}/10`);
    }
    
    if (surveyAnswers.conflictType) {
      contextParts.push(`- Main Issue: ${surveyAnswers.conflictType}`);
    }
    
    if (surveyAnswers.specificContext) {
      contextParts.push(`- Situation: ${surveyAnswers.specificContext}`);
    }
    
    // Add any additional context fields
    const processedKeys = ['duration', 'closeness', 'conflictType', 'specificContext', 'backgroundContext'];
    Object.keys(surveyAnswers).forEach(key => {
      if (!processedKeys.includes(key) && surveyAnswers[key]) {
        contextParts.push(`- ${this.formatKey(key)}: ${surveyAnswers[key]}`);
      }
    });
    
    return contextParts.join('\n');
  }

  /**
   * Get relationship-specific guidance for the AI
   * @param {string} relationshipType - Type of relationship
   * @returns {string} Relationship-specific guidance
   */
  getRelationshipGuidance(relationshipType) {
    const guidanceMap = {
      'personal': `Personal Relationship Guidance:
- Focus on emotional connection, trust, and long-term relationship health
- Consider the depth of the relationship (family bonds, romantic intimacy, friendship history)
- Balance honesty with maintaining the personal connection
- Address both parties' emotional needs and feelings
- Suggest approaches that strengthen rather than damage the personal bond`,

      'professional': `Professional Relationship Guidance:
- Emphasize professionalism, boundaries, and career implications
- Consider workplace dynamics, hierarchy, and business objectives
- Focus on clear, respectful communication that maintains working relationships
- Address both personal and business concerns appropriately
- Suggest diplomatic approaches that protect professional reputation`,

      'casual': `Casual Relationship Guidance:
- Keep interactions appropriate for the relationship level
- Focus on polite, respectful communication without overstepping
- Consider social norms and expectations in casual settings
- Address issues while maintaining comfortable social interactions
- Suggest light, friendly approaches that don't create awkwardness`
    };

    return guidanceMap[relationshipType] || guidanceMap['personal'];
  }

  /**
   * Format survey answer keys for display
   * @param {string} key - The survey answer key
   * @returns {string} Formatted key
   */
  formatKey(key) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Get available relationship types
   * @returns {Array} List of supported relationship types
   */
  getRelationshipTypes() {
    return [
      'personal',     // Family, Friends, Romantic
      'professional', // Boss, Colleague, Client
      'casual'        // Acquaintances, neighbors, gym buddies
    ];
  }

  /**
   * Validate relationship type
   * @param {string} relationshipType - Type to validate
   * @returns {boolean} True if valid
   */
  isValidRelationshipType(relationshipType) {
    return this.getRelationshipTypes().includes(relationshipType);
  }

  /**
   * Get sample survey questions for a relationship type
   * @param {string} relationshipType - Type of relationship
   * @returns {Array} Sample survey questions
   */
  getSampleQuestions(relationshipType) {
    // Optional cultural context - only if user wants to provide it
    const optionalCulturalQuestions = [
      { 
        id: 'backgroundContext', 
        question: 'Any relevant background about you or them? (optional)', 
        type: 'textarea',
        placeholder: 'e.g., different backgrounds, communication styles, family expectations, etc.',
        required: false
      }
    ];

    const questionMap = {
      'personal': [
        { 
          id: 'relationshipType', 
          question: 'What type of personal relationship is this?', 
          type: 'select',
          options: ['Romantic partner', 'Family member', 'Close friend', 'Friend']
        },
        { 
          id: 'duration', 
          question: 'How long have you known each other?', 
          type: 'select',
          options: ['Less than 6 months', '6-12 months', '1-3 years', '3-5 years', '5+ years']
        },
        { 
          id: 'closeness', 
          question: 'How close are you? (1-10)', 
          type: 'range',
          min: 1, max: 10
        },
        { 
          id: 'conflictType', 
          question: 'What\'s the main challenge?', 
          type: 'select',
          options: ['Communication', 'Trust issues', 'Boundaries', 'Values/expectations', 'Time/attention', 'Life changes', 'Other']
        },
        { 
          id: 'specificContext', 
          question: 'Describe the specific situation you need help with', 
          type: 'textarea',
          placeholder: 'e.g., We\'ve been having issues with...'
        },
        ...optionalCulturalQuestions
      ],
      'professional': [
        { 
          id: 'workingRelationship', 
          question: 'What\'s your working relationship?', 
          type: 'select',
          options: ['They are my boss', 'We are peers/colleagues', 'They report to me', 'Client/Customer', 'Vendor/Supplier', 'Other']
        },
        { 
          id: 'duration', 
          question: 'How long have you worked together?', 
          type: 'select',
          options: ['Less than 1 month', '1-6 months', '6-12 months', '1-2 years', '2+ years']
        },
        { 
          id: 'conflictType', 
          question: 'What\'s the issue?', 
          type: 'select',
          options: ['Communication style', 'Work performance', 'Deadlines/expectations', 'Team dynamics', 'Authority/hierarchy', 'Other']
        },
        { 
          id: 'specificContext', 
          question: 'Describe the workplace context', 
          type: 'textarea',
          placeholder: 'e.g., During meetings they...'
        },
        ...optionalCulturalQuestions
      ],
      'casual': [
        { 
          id: 'context', 
          question: 'How do you know this person?', 
          type: 'select',
          options: ['Neighbor', 'Gym/activity buddy', 'Classmate', 'Social acquaintance', 'Online community', 'Through mutual friends', 'Other']
        },
        { 
          id: 'frequency', 
          question: 'How often do you interact?', 
          type: 'select',
          options: ['Daily', 'Weekly', 'Monthly', 'Occasionally', 'Rarely']
        },
        { 
          id: 'conflictType', 
          question: 'What\'s the issue?', 
          type: 'select',
          options: ['Awkward interaction', 'Social expectations', 'Communication barrier', 'Boundary confusion', 'Annoying behavior', 'Other']
        },
        { 
          id: 'specificContext', 
          question: 'Describe the situation', 
          type: 'textarea',
          placeholder: 'e.g., When I see them at the gym...'
        },
        ...optionalCulturalQuestions
      ]
    };

    return questionMap[relationshipType] || questionMap['personal'];
  }
}

module.exports = PromptEngine;
