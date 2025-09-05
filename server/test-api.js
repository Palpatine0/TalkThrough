/**
 * TalkThrough Conversation Flow Test
 * Tests a realistic 10-message conversation about cultural differences in a romantic relationship
 */

const axios = require('axios');
const GeminiAPI = require('./lib/gemini');

const BASE_URL = 'http://localhost:3001';
const userGemini = new GeminiAPI();

// Test scenario: Long-term cross-cultural romantic relationship
const testScenario = {
  relationshipType: 'personal',
  surveyAnswers: {
    relationshipType: 'Romantic partner',
    duration: '3-5 years',
    closeness: 8,
    conflictType: 'Communication',
    specificContext: 'We\'ve been together for 2.5 years and lately I feel like we\'re not understanding each other. Small things become bigger issues.',
    backgroundContext: 'She\'s Korean-American, I\'m white American. Her family is very traditional and she tends to avoid direct conflict.'
  }
};

// Initial user message to start the conversation
const initialUserMessage = "I love my girlfriend but lately every small disagreement turns into her shutting down completely. I don't know how to talk to her when she gets like this.";

// Function to generate realistic user responses using Gemini
async function generateUserResponse(conversationHistory, aiResponse) {
  const userPersona = `You are a 26-year-old white American man in a 2.5-year relationship with a Korean-American woman. You're seeking relationship advice because you're struggling with cultural communication differences. You tend to be direct in your communication style, but you're learning to be more sensitive to cultural differences. You care deeply about your girlfriend and want to understand her better.

Current situation: Your girlfriend shuts down during conflicts, which frustrates you because you prefer direct communication.

Based on the conversation so far and the AI's latest response, provide a natural, realistic response that a person in this situation would give. Keep it conversational, authentic, and focused on the relationship issue. Don't be overly articulate - sound like a real person asking for help.

Conversation history: ${conversationHistory}
AI just said: "${aiResponse}"

Your response (1-2 sentences, natural and conversational):`;

  try {
    const response = await userGemini.generateResponse(userPersona, {}, '');
    return response.aiResponse.trim().replace(/"/g, '');
  } catch (error) {
    console.error('Error generating user response:', error.message);
    return "I'm not sure what to say to that."; // Fallback
  }
}

async function testAPI() {
  console.log('💬 TalkThrough Conversation Flow Test');
  console.log('Scenario: Cross-cultural romantic relationship (2.5 years)\n');

  try {
    // Step 1: Quick health check
    console.log('🏥 Health Check...');
    await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running\n');

    // Step 2: Create chat session with cultural context
    console.log('📋 Creating Chat Session...');
    console.log('Survey Context:');
    console.log(`- Relationship: ${testScenario.relationshipType}, ${testScenario.surveyAnswers.duration}`);
    console.log(`- Closeness: ${testScenario.surveyAnswers.closeness}/10`);
    console.log(`- Issue: ${testScenario.surveyAnswers.conflictType}`);
    console.log(`- Background: ${testScenario.surveyAnswers.backgroundContext}`);
    console.log(`- Situation: ${testScenario.surveyAnswers.specificContext}\n`);

    const newChatResponse = await axios.post(`${BASE_URL}/api/chat/new`, testScenario);
    const sessionId = newChatResponse.data.sessionId;
    
    console.log('✅ Chat session created');
    console.log(`🤖 Initial AI Message: "${newChatResponse.data.initialMessage}"\n`);

    // Step 3: Simulate realistic conversation flow
    console.log('💬 Starting Conversation Flow (10 messages total)...\n');
    console.log('=' .repeat(80));
    
    let messageCount = 1;
    let conversationHistory = '';
    let currentUserMessage = initialUserMessage;

    // Have 5 back-and-forth exchanges
    for (let i = 0; i < 5; i++) {
      // User message
      console.log(`\n👤 USER (Message ${messageCount}):`);
      console.log(`"${currentUserMessage}"`);
      
      const messageResponse = await axios.post(`${BASE_URL}/api/chat/${sessionId}/message`, {
        message: currentUserMessage
      });
      
      conversationHistory += `User: ${currentUserMessage}\n`;
      messageCount++;

      // AI response
      const aiResponse = messageResponse.data.aiResponse;
      console.log(`\n🤖 CHATBOT (Message ${messageCount}):`);
      console.log(`"${aiResponse}"`);
      console.log(`📊 Response Length: ${aiResponse.length} characters`);
      
      conversationHistory += `AI: ${aiResponse}\n`;
      messageCount++;

      // Generate next user response (except for the last iteration)
      if (i < 4) {
        console.log('\n🤔 Generating next user response...');
        currentUserMessage = await generateUserResponse(conversationHistory, aiResponse);
        console.log('\n' + '-'.repeat(80));
      }
    }

    console.log('\n' + '='.repeat(80));

    // Step 4: Get full conversation history
    console.log('\n📜 Full Conversation Summary...');
    const messagesResponse = await axios.get(`${BASE_URL}/api/chat/${sessionId}/messages`);
    const messages = messagesResponse.data.messages;
    
    console.log(`Total messages in conversation: ${messages.length}`);
    console.log('Message flow:', messages.map(m => m.type.toUpperCase()).join(' → '));

    // Step 5: Analyze conversation quality
    console.log('\n📊 Conversation Analysis...');
    const aiMessages = messages.filter(m => m.type === 'ai');
    const avgResponseLength = aiMessages.reduce((sum, m) => sum + m.content.length, 0) / aiMessages.length;
    
    console.log(`Average AI response length: ${Math.round(avgResponseLength)} characters`);
    console.log(`Conversation maintained context: ${messages.length === 11 ? '✅ Yes' : '❌ No'}`); // Initial + 10 messages
    console.log(`Cultural context utilized: ${aiMessages.some(m => m.content.toLowerCase().includes('korean') || m.content.toLowerCase().includes('cultural') || m.content.toLowerCase().includes('traditional')) ? '✅ Yes' : '⚠️  Unclear'}`);

    // Cleanup
    console.log('\n🧹 Cleaning up...');
    await axios.delete(`${BASE_URL}/api/chat/${sessionId}`);
    console.log('✅ Test session deleted');

    console.log('\n🎉 Conversation test completed successfully!');
    console.log('💡 Review the conversation flow above to see how the AI handles cultural context');

  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.error('💡 Make sure your GEMINI_API_KEY is set in .env file');
    }
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure the server is running with: npm run dev');
    }
  }
}

// Check if server is running first
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/api/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('🚨 Server not running!');
    console.log('Please start the server first:');
    console.log('   npm run dev');
    console.log('\nThen run this test:');
    console.log('   node test-api.js');
    return;
  }

  await testAPI();
}

main();