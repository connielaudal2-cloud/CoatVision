# CoatVision

AI-powered coating analysis and chat assistant built with Next.js, Supabase, and OpenAI.

## Features

- **GPT Chat**: Interactive chat interface powered by OpenAI GPT-3.5-turbo
  - Create new chats with "Ny chat" button
  - Messages are saved to Supabase database
  - Full chat history persistence
  - Error handling with user-friendly messages

- **Image Analysis**: Automated coating defect detection
  - Upload images for analysis
  - Automatic storage in Supabase Storage
  - Generates overlay visualization with detected defects
  - Returns detailed statistics (defects, confidence, processing time)
  - Always returns results (never blank)

- **Health Check**: `/api/health` endpoint for monitoring

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server-only keys (never expose to client)
OPENAI_API_KEY=your_openai_api_key_here
```

### Required Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (found in project settings)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (found in project API settings)
- `OPENAI_API_KEY`: Your OpenAI API key (get from https://platform.openai.com/api-keys) - **Server-side only, never exposed to client**

## Database Setup

The application requires the following Supabase tables:

1. **profiles** - User profiles
2. **chats** - Chat sessions
3. **messages** - Chat messages
4. **analyses** - Image analysis results

Run the SQL migration file to set up the database schema:

```sql
-- See supabase/migrations/001_initial_schema.sql
```

This will create:
- All required tables with proper relationships
- Row Level Security (RLS) policies
- Storage buckets for images and overlays
- Automatic triggers for updated_at timestamps

### Storage Buckets

The application uses two public storage buckets:
- `images` - Original uploaded images
- `overlays` - Generated analysis overlays

## Installation

```bash
# Install dependencies
npm install

# Set up environment variables (see above)
cp .env.example .env.local
# Edit .env.local with your actual values

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### POST /api/gpt
Send messages to GPT chat assistant.

**Request Body:**
```json
{
  "userId": "user-id",
  "chatId": "chat-id (optional for new chat)",
  "message": "Your message",
  "isNewChat": true
}
```

**Response:**
```json
{
  "chatId": "chat-id",
  "message": "Assistant response",
  "success": true
}
```

### POST /api/analyze
Analyze coating images for defects.

**Request Body:** FormData
- `image`: Image file
- `userId`: User ID
- `modelUrl`: Optional model URL (generates dummy data if not provided)

**Response:**
```json
{
  "id": "analysis-id",
  "imageUrl": "https://...",
  "overlayUrl": "https://...",
  "stats": {
    "detected_defects": 3,
    "confidence": 0.87,
    "processing_time_ms": 1234
  },
  "status": "completed",
  "success": true
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "service": "CoatVision API"
}
```

## Deployment

This application is optimized for Vercel deployment:

1. Push your code to a Git repository
2. Import the project in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

The application includes:
- Next.js App Router
- Automatic API route optimization
- Static and dynamic rendering
- Edge-ready configuration

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (database, storage, auth)
- **OpenAI** - GPT-3.5-turbo for chat
- **Sharp** - Image processing for overlay generation
- **Tailwind CSS** - Styling

## License

MIT