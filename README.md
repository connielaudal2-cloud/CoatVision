# CoatVision

AI-powered coating analysis and chat assistant built with Next.js, Supabase, and OpenAI.

## Features

- **Authentication**: Secure email/password authentication via Supabase Auth with SSR
  - Sign up / Login pages
  - Cookie-based session management using @supabase/ssr
  - Auto-profile creation on first login
  - No localStorage dependencies

- **GPT Chat**: Interactive chat interface powered by OpenAI
  - Create new chats with "Ny chat" button
  - Messages are saved to Supabase database
  - Full chat history persistence
  - Real-time error handling with user-friendly messages
  - Uses modern OpenAI models (gpt-4o-mini default)

- **Image Analysis**: Automated coating defect detection
  - Upload images for analysis
  - Automatic storage in Supabase Storage
  - Generates overlay visualization with CoatVision color codes:
    - Coating: #00FF66
    - Not Coating: #FFD500
    - Noise: #999999
    - Cured: #0066FF
    - New Coating: #00FFFF
  - Returns detailed statistics (defects, confidence, processing time, regions)
  - Always returns results (never blank)

- **Health Check**: `/api/health` endpoint for monitoring

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration (public)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Server-only keys (never expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
OPENAI_API_KEY=your_openai_api_key_here

# Optional: OpenAI model (defaults to gpt-4o-mini)
OPENAI_MODEL=gpt-4o-mini
```

### Required Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (found in project settings) - **Required**
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key (found in project API settings) - **Required**
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (found in project API settings) - **Server-side only, never expose to client** - **Required**
- `OPENAI_API_KEY`: Your OpenAI API key (get from https://platform.openai.com/api-keys) - **Server-side only, never exposed to client** - **Required**
- `OPENAI_MODEL` (optional): OpenAI model to use (defaults to `gpt-4o-mini`)

**Important**: The application will fail with clear error messages if required environment variables are not set. No placeholder fallbacks are used in production.

## Technical Architecture

### Supabase SSR Integration

This application uses `@supabase/ssr` for proper server-side rendering with cookie-based sessions:

- **Browser Client** (`lib/supabase/browser.ts`): For client-side operations
- **Server Client** (`lib/supabase/server.ts`): For server-side operations with cookie management
- **Auth Utilities** (`lib/auth/server.ts`): Server-side authentication helpers

### API Routes

All API routes use cookie-based authentication:
- User authentication is verified via `getUser()` from cookies
- No `userId` is accepted from client requests
- RLS policies are enforced with `auth.uid()`

## Database Setup

The application requires the following Supabase tables:

1. **profiles** - User profiles (auto-created on login)
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

### Supabase Auth Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email auth provider
3. Configure email templates (optional)
4. Set Site URL to your application URL

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

**Authentication**: Required (session token)

**Request Body:**
```json
{
  "chatId": "chat-id (optional for new chat)",
  "message": "Your message"
}
```

**Response:**
```json
{
  "ok": true,
  "chatId": "chat-id",
  "assistant": {
    "role": "assistant",
    "content": "Assistant response"
  }
}
```

### POST /api/analyze
Analyze coating images for defects.

**Authentication**: Required (session token)

**Request Body:** FormData
- `image`: Image file

**Response:**
```json
{
  "id": "analysis-id",
  "imageUrl": "https://...",
  "overlayUrl": "https://...",
  "stats": {
    "detected_defects": 3,
    "confidence": 0.87,
    "processing_time_ms": 1234,
    "regions": [
      {"type": "coating", "area": 15000},
      {"type": "notCoating", "area": 8000}
    ]
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
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL` (optional)
4. Deploy

The application includes:
- Next.js App Router with Node.js runtime
- Automatic API route optimization
- Static and dynamic rendering
- Edge-ready configuration
- Proper error handling and user feedback

## Security

- ✅ Real Supabase Auth (email/password)
- ✅ Server-side only API keys (never exposed to client)
- ✅ Row Level Security (RLS) on all database tables
- ✅ Authenticated API routes with session verification
- ✅ Auto-profile creation on first login
- ✅ Storage bucket policies for user isolation
- ✅ No placeholder keys in production

## Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Supabase** - Backend as a Service (database, storage, auth)
- **OpenAI** - GPT for chat completions
- **Sharp** - Image processing for overlay generation
- **Tailwind CSS** - Styling

## License

MIT

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