const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

class GeminiAPI {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  /**
   * Generate AI response for a chat message
   * @param {string} userMessage - The user's message
   * @param {Object} context - Chat context including relationship info
   * @param {string} promptTemplate - The formatted prompt template
   * @returns {Promise<Object>} AI response with suggestions
   */
  async generateResponse(userMessage, context, promptTemplate) {
    try {
      const fullPrompt = `${promptTemplate}\n\nUser's current message: "${userMessage}"`;
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseResponse(text);
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback response for API failures
      return {
        aiResponse: "I'm having trouble processing your request right now. Please try again in a moment.",
        suggestedReplies: [
          "Could you rephrase that?",
          "I'm not sure I understand. Can you explain more?",
          "Let's try a different approach to this conversation."
        ],
        error: true
      };
    }
  }

  /**
   * Parse the AI response to extract insight and suggestions
   * @param {string} rawResponse - Raw response from Gemini
   * @returns {Object} Parsed response with insight and suggestions
   */
  parseResponse(rawResponse) {
    try {
      // Look for INSIGHT and SUGGESTIONS sections
      const insightMatch = rawResponse.match(/INSIGHT:\s*(.*?)(?=SUGGESTIONS:|$)/s);
      const suggestionsMatch = rawResponse.match(/SUGGESTIONS:\s*([\s\S]*?)$/);
      
      let aiResponse = rawResponse;
      let suggestedReplies = [];
      
      if (insightMatch) {
        aiResponse = insightMatch[1].trim();
      }
      
      if (suggestionsMatch) {
        const suggestionsText = suggestionsMatch[1].trim();
        // Extract numbered suggestions (1., 2., 3., etc.)
        const suggestionMatches = suggestionsText.match(/\d+\.\s*([^\n]+)/g);
        if (suggestionMatches) {
          suggestedReplies = suggestionMatches.map(s => s.replace(/^\d+\.\s*/, '').trim());
        }
      }
      
      // If no structured format found, try to extract suggestions from the text
      if (suggestedReplies.length === 0) {
        const quoteMatches = rawResponse.match(/"([^"]+)"/g);
        if (quoteMatches && quoteMatches.length >= 2) {
          suggestedReplies = quoteMatches.slice(0, 3).map(s => s.replace(/"/g, ''));
        }
      }
      
      // Fallback suggestions if none found
      if (suggestedReplies.length === 0) {
        suggestedReplies = [
          "That's a good point. How do you feel about that?",
          "I understand. What would you like to do next?",
          "That makes sense. Can you tell me more about that?"
        ];
      }
      
      return {
        aiResponse: aiResponse || "I understand your situation. Let me help you think through this conversation.",
        suggestedReplies: suggestedReplies.slice(0, 3), // Limit to 3 suggestions
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return {
        aiResponse: rawResponse || "I understand your situation. Let me help you think through this conversation.",
        suggestedReplies: [
          "That's a good point. How do you feel about that?",
          "I understand. What would you like to do next?",
          "That makes sense. Can you tell me more about that?"
        ],
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Test the API connection
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      const result = await this.model.generateContent("Hello, this is a test message.");
      await result.response;
      return true;
    } catch (error) {
      console.error('Gemini API connection test failed:', error);
      return false;
    }
  }
}

module.exports = GeminiAPI;
