# TalkThrough Server

Backend API server for the TalkThrough conversation guidance app.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment configuration:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3001
   ```

3. **Get Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy it to your `.env` file

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:3001`

## Testing

Run the integration test:
```bash
node test-integration.js
```

## API Endpoints

### Chat Endpoints

- `POST /api/chat/new` - Create new chat session
- `POST /api/chat/:sessionId/message` - Send message and get AI response
- `GET /api/chat/:sessionId/messages` - Get all messages for a session
- `GET /api/chat/:sessionId` - Get session details
- `DELETE /api/chat/:sessionId` - Delete a session

### Relationship Endpoints

- `GET /api/relationships/types` - Get all relationship types
- `GET /api/relationships/survey/:type` - Get survey questions for relationship type
- `POST /api/relationships/validate` - Validate survey answers

### Health Check

- `GET /api/health` - Server health status

## Example Usage

### Create a new chat session:

```bash
curl -X POST http://localhost:3001/api/chat/new \
  -H "Content-Type: application/json" \
  -d '{
    "relationshipType": "romantic",
    "surveyAnswers": {
      "duration": "6 months",
      "closeness": 7,
      "conflictType": "communication",
      "specificContext": "We have been arguing about spending time together"
    }
  }'
```

### Send a message:

```bash
curl -X POST http://localhost:3001/api/chat/SESSION_ID/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I don'\''t know how to tell my partner I feel neglected"
  }'
```

## Architecture

- **lib/gemini.js** - Gemini API wrapper and response parsing
- **lib/promptEngine.js** - Prompt generation for different relationship types
- **lib/sessionManager.js** - In-memory session storage
- **routes/chat.js** - Chat-related API endpoints
- **routes/relationships.js** - Relationship and survey endpoints

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error description",
  "message": "Detailed error message",
  "status": 400
}
```

Common error codes:
- `400` - Bad Request (missing/invalid data)
- `404` - Not Found (session doesn't exist)
- `500` - Internal Server Error (API failures)
