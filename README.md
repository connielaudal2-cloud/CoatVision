# CoatVision

AI-powered coating analysis and chat assistant built with Next.js, Supabase, and OpenAI.

## 🚀 Deploy Now (One Click)

**Not deployed yet?** Click here to deploy in 15 minutes:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fconnielaudal2-cloud%2FCoatVision&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,OPENAI_API_KEY&envDescription=Required%20API%20keys%20for%20CoatVision&envLink=https%3A%2F%2Fgithub.com%2Fconnielaudal2-cloud%2FCoatVision%2Fblob%2Fmain%2FENV_SETUP.md&project-name=coatvision&repository-name=coatvision)

**→ Follow the simple 3-step guide: [ONE_CLICK_DEPLOY.md](./ONE_CLICK_DEPLOY.md)**

---

## 🚀 Quick Start

### For Production Deployment

**→ See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete Vercel deployment guide**

**→ See [ENV_SETUP.md](./ENV_SETUP.md) for environment variables setup**

**→ See [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md) for App Store deployment**

### For Local Development

```bash
# 1. Clone the repository
git clone https://github.com/connielaudal2-cloud/CoatVision.git
cd CoatVision

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your actual credentials

# 4. Run development server
npm run dev

# 5. Open http://localhost:3000
```

---

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

### 🚀 Vercel Deployment (Recommended)

**Complete guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)

**Quick Steps**:

1. **Prepare Environment Variables**
   - See [ENV_SETUP.md](./ENV_SETUP.md) for detailed setup
   - Get Supabase keys from your dashboard
   - Get OpenAI API key from platform.openai.com

2. **Deploy to Vercel**
   ```bash
   # Option 1: Via Vercel Dashboard (easiest)
   # - Go to vercel.com
   # - Import your GitHub repository
   # - Add environment variables
   # - Deploy
   
   # Option 2: Via Vercel CLI
   npm i -g vercel
   vercel login
   vercel
   ```

3. **Configure Supabase**
   - Add your Vercel URL to Supabase redirect URLs
   - Test authentication and features

**Required Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL` (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (public)
- `SUPABASE_SERVICE_ROLE_KEY` (secret)
- `OPENAI_API_KEY` (secret)
- `OPENAI_MODEL` (optional, default: gpt-4o-mini)

### 📱 Mobile Deployment (App Store & Play Store)

**Complete guide**: [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md)

Three options for mobile deployment:
1. **Progressive Web App (PWA)** - Fastest (1-2 days)
2. **Capacitor** - Recommended (2-3 weeks)
3. **React Native** - Full rewrite (2-3 months)

### ✅ Deployment Checklist

Before deploying:

- [ ] All environment variables configured
- [ ] `npm run build` passes locally
- [ ] Supabase database migration ran successfully
- [ ] Authentication tested locally
- [ ] Chat functionality tested locally
- [ ] Image analysis tested locally
- [ ] Health endpoint returns 200 OK
- [ ] No secrets in Git repository
- [ ] `.env.local` in `.gitignore`

After deploying:

- [ ] Vercel build succeeded
- [ ] Health check works: `/api/health`
- [ ] Sign up flow works
- [ ] Login flow works
- [ ] Chat sends and receives messages
- [ ] Image analysis processes images
- [ ] All error messages are user-friendly

The application includes:
- Next.js App Router with Node.js runtime
- Automatic API route optimization
- Static and dynamic rendering
- Edge-ready configuration
- Proper error handling and user feedback
- Cookie-based authentication with @supabase/ssr

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