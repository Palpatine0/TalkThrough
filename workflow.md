# TalkThrough - End-to-End Workflow

## Project Overview
**TalkThrough** is a conversation guidance app that helps users navigate difficult conversations using AI-powered insights and suggested responses. Built for a 4-hour hackathon demo.

## Tech Stack
- **Frontend**: React, Next.js, TypeScript
- **Backend**: Next.js API Routes, TypeScript
- **AI**: Google Gemini API (free tier)
- **Storage**: In-memory (for demo) - no database persistence
- **Deployment**: Local development for hackathon

## Complete User Journey

### 1. Landing Page
- User visits the app homepage
- Sees ChatGPT-like interface with sidebar
- Clicks "New Chat" button to start

### 2. Relationship Type Selection
- Modal/page appears with relationship type options:
  - **Personal**: Family, Friends, Romantic
  - **Professional**: Boss, Colleague, Client  
  - **Casual**: Acquaintances, neighbors, etc.
- User selects appropriate relationship type

### 3. Dynamic Survey
- Based on relationship type, user gets tailored survey questions
- **Example for Romantic**:
  - "How long have you been together?" (dropdown)
  - "How close are you (1-10 scale)?" (slider)
  - "What's the main conflict?" (multiple choice)
  - "Describe the situation" (text area)
- **Example for Professional**:
  - "What's your working relationship?" (Boss/Peer/Report)
  - "How long have you worked together?" (timeframe)
  - "What's the issue?" (Communication/Performance/Conflict)
  - "Describe the context" (text area)

### 4. Chat Interface Initialization
- System processes survey responses
- Generates personalized prompt for Gemini API
- Creates chat session with unique sessionId
- Shows initial AI message acknowledging the situation

### 5. Conversation Flow
**User sends message**: "I don't know how to tell my partner I feel neglected"

**AI processes**:
- Takes user message + relationship context + survey data
- Generates empathetic response with insights
- Provides 2-3 suggested reply options

**Response format**:
- **AI Insight**: "It sounds like you're feeling disconnected from your partner. This is common in relationships, especially around the 6-month mark. Here are some gentle ways to approach this..."
- **Suggested Replies**:
  1. "I've been feeling like we haven't been connecting lately, and I'd love to talk about it"
  2. "Can we set aside some time to chat about how we're doing as a couple?"
  3. "I miss feeling close to you. How do you think we can work on that together?"

### 6. Ongoing Conversation
- User can either:
  - Use one of the suggested replies (clicks button to add to input)
  - Type their own message
  - Ask for alternative suggestions
- AI maintains context throughout the conversation
- Each response includes both guidance and practical suggestions

## Technical Architecture

### Frontend Structure
```
components/
├── ChatInterface.jsx          # Main chat container
├── Sidebar.jsx               # New chat, session list
├── MessageBubble.jsx         # Individual messages
├── SuggestedReplies.jsx      # Clickable reply buttons
├── RelationshipSelector.jsx   # Relationship type picker
├── SurveyForm.jsx            # Dynamic survey based on type
└── LoadingSpinner.jsx        # Loading states

hooks/
├── useChat.js                # Chat state management
├── useSurvey.js             # Survey form handling
└── useSession.js            # Session management

pages/
├── index.js                 # Landing page
├── chat/[sessionId].js      # Chat interface
└── api/                     # API routes
```

### Backend Structure
```
pages/api/
├── chat/
│   ├── new.js              # POST - Create new chat session
│   └── [sessionId]/
│       └── message.js      # POST - Send message, get AI response
└── relationships/
    └── survey/
        └── [type].js       # GET - Get survey questions for type

lib/
├── gemini.js              # Gemini API integration
├── promptEngine.js        # Prompt generation logic
├── sessionManager.js      # In-memory session storage
└── surveyQuestions.js     # Static survey data

types/
└── index.ts              # TypeScript type definitions
```

### Data Flow

1. **Session Creation**:
   ```
   User selects relationship type → 
   Frontend calls GET /api/relationships/survey/[type] →
   User fills survey →
   Frontend calls POST /api/chat/new with survey data →
   Backend creates session with Gemini prompt →
   Returns sessionId and initial message
   ```

2. **Message Exchange**:
   ```
   User types message →
   Frontend calls POST /api/chat/[sessionId]/message →
   Backend sends to Gemini with context →
   Gemini returns response + suggestions →
   Frontend displays AI response and suggested replies
   ```

### Prompt Engineering Strategy

**Base Prompt Template**:
```
You are TalkThrough, an AI conversation coach. Help users navigate difficult conversations with empathy and practical advice.

User Context:
- Relationship Type: {relationshipType}
- Duration: {duration}
- Closeness Level: {closeness}/10
- Main Issue: {conflictType}
- Situation: {specificContext}

Your responses should:
1. Provide empathetic insight about the situation
2. Offer 2-3 specific, actionable response suggestions
3. Consider the relationship dynamics and context
4. Be encouraging but realistic

Format your response as:
INSIGHT: [Your analysis and guidance]
SUGGESTIONS: [3 numbered response options]
```

**Relationship-Specific Variations**:
- **Romantic**: Focus on intimacy, vulnerability, long-term relationship health
- **Professional**: Emphasize professionalism, boundaries, career implications  
- **Family**: Consider family dynamics, history, emotional complexity
- **Friendly**: Balance honesty with maintaining friendship

## API Specifications

### POST /api/chat/new
**Request**:
```json
{
  "relationshipType": "romantic",
  "surveyAnswers": {
    "duration": "6 months",
    "closeness": 7,
    "conflictType": "communication",
    "specificContext": "We've been arguing about spending time together"
  }
}
```

**Response**:
```json
{
  "sessionId": "uuid-string",
  "initialMessage": "I understand you're having communication challenges with your romantic partner..."
}
```

### POST /api/chat/[sessionId]/message
**Request**:
```json
{
  "message": "I don't know how to bring this up without sounding needy"
}
```

**Response**:
```json
{
  "aiResponse": "It's natural to worry about coming across as needy when expressing emotional needs...",
  "suggestedReplies": [
    "I've been thinking about us lately and would love to share some thoughts with you",
    "Can we talk about how we're both feeling in our relationship?", 
    "I want to make sure we're both happy - can we check in with each other?"
  ],
  "timestamp": "2025-09-05T10:30:00Z"
}
```

### GET /api/relationships/survey/[type]
**Response for "romantic"**:
```json
{
  "relationshipType": "romantic",
  "questions": [
    {
      "id": "duration",
      "type": "select",
      "question": "How long have you been together?",
      "options": ["Less than 1 month", "1-6 months", "6-12 months", "1-2 years", "2+ years"]
    },
    {
      "id": "closeness", 
      "type": "range",
      "question": "How emotionally close are you? (1-10)",
      "min": 1,
      "max": 10
    },
    {
      "id": "conflictType",
      "type": "select",
      "question": "What's the main challenge?",
      "options": ["Communication", "Trust issues", "Future planning", "Intimacy", "Time together", "Other"]
    },
    {
      "id": "specificContext",
      "type": "textarea", 
      "question": "Describe the specific situation you need help with",
      "placeholder": "e.g., We've been arguing about..."
    }
  ]
}
```

## Error Handling

### Frontend Error States
- Loading states for all API calls
- Error messages for failed requests  
- Fallback UI for missing data
- Retry mechanisms for failed API calls

### Backend Error Responses
```json
{
  "error": "Session not found",
  "code": "SESSION_NOT_FOUND",
  "status": 404
}
```

### Gemini API Error Handling
- Rate limit handling (retry with backoff)
- Invalid response parsing
- Fallback responses for API failures
- Content filtering compliance

## Development Workflow

### Phase 1 (Hour 1): Foundation
- **Eugene**: Set up Gemini API integration and basic prompt
- **Ethan**: Create API route structure and session management
- **Seth**: Build basic chat UI components
- **Emily**: Create relationship selector and survey forms

### Phase 2 (Hour 2): Integration  
- **Eugene**: Refine prompts for different relationship types
- **Ethan**: Complete API endpoints with proper error handling
- **Seth**: Integrate chat UI with backend APIs
- **Emily**: Connect survey flow to chat initialization

### Phase 3 (Hour 3): Polish
- **Eugene**: Test and optimize AI responses
- **Ethan**: Add proper TypeScript types and validation
- **Seth**: Improve UI/UX and responsive design
- **Emily**: End-to-end testing and bug fixes

### Phase 4 (Hour 4): Demo Prep
- **All**: Final testing, demo scenarios, presentation prep
- **Focus**: Ensure core user journey works smoothly
- **Backup plan**: Static demo data if APIs fail

## Demo Scenarios

### Scenario 1: Romantic Relationship
- **Setup**: 6-month relationship, communication issues
- **User message**: "My partner seems distant lately and I don't know how to bring it up"
- **Expected AI response**: Empathetic guidance + 3 gentle conversation starters

### Scenario 2: Professional Conflict
- **Setup**: Colleague relationship, project disagreement  
- **User message**: "My coworker keeps undermining my ideas in meetings"
- **Expected AI response**: Professional advice + diplomatic response options

### Scenario 3: Family Tension
- **Setup**: Parent relationship, life choices conflict
- **User message**: "My parents don't support my career change"
- **Expected AI response**: Understanding family dynamics + respectful communication strategies

## Success Metrics for Demo
- **Core flow works**: Landing → Survey → Chat → AI Response
- **AI responses are relevant** to relationship context
- **Suggested replies are practical** and usable
- **UI is intuitive** and similar to ChatGPT experience
- **No major bugs** in happy path scenarios

## Potential Extensions (Post-Hackathon)
- User authentication and persistent conversations
- Conversation history and progress tracking
- More sophisticated relationship analysis
- Voice message support
- Integration with calendar for follow-up reminders
- Analytics on conversation success rates