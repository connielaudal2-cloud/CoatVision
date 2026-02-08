# CoatVision - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying CoatVision to Vercel with proper configuration.

## Prerequisites

1. A Vercel account (free tier works)
2. A Supabase project with database set up
3. An OpenAI API key with access to chat completions

## Required Environment Variables

The following environment variables **MUST** be configured in Vercel before deployment:

### Public Variables (Exposed to Browser)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Server-Only Variables (Secure)
```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Optional Variables
```
OPENAI_MODEL=gpt-4o-mini
```
Default: `gpt-4o-mini` (recommended for cost-effectiveness)

## Database Setup

### 1. Run Migrations in Supabase

Go to your Supabase project → SQL Editor and run these migrations in order:

#### Migration 001: Initial Schema
```sql
-- Run the contents of: supabase/migrations/001_initial_schema.sql
```

This creates:
- `profiles` table
- `chats` table  
- `messages` table
- `analyses` table
- RLS policies for all tables
- Storage buckets (`images`, `overlays`)

#### Migration 002: Add Labels
```sql
-- Run the contents of: supabase/migrations/002_add_labels_to_analyses.sql
```

This adds:
- `labels` JSONB column to analyses table
- Index for better query performance

### 2. Verify Storage Buckets

In Supabase Dashboard → Storage:
1. Ensure `images` bucket exists and is PUBLIC
2. Ensure `overlays` bucket exists and is PUBLIC
3. Verify RLS policies allow:
   - Users can upload to their own folders (`{user_id}/...`)
   - Public read access for all images/overlays

## Vercel Deployment Steps

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import the `CoatVision` repository from GitHub
4. Select the repository and click "Import"

### Step 2: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js
- **Root Directory:** `./` (leave empty for root)
- **Build Command:** `npm run build` (default)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Step 3: Set Environment Variables

**IMPORTANT:** Set these for **ALL** environments (Production, Preview, Development)

1. Go to Project Settings → Environment Variables
2. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase URL
   - Environments: ✅ Production ✅ Preview ✅ Development
3. Repeat for all required variables listed above

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Vercel will provide a deployment URL

## Post-Deployment Verification

### 1. Check Health Endpoint

Visit: `https://your-app.vercel.app/api/health`

Expected response:
```json
{
  "ok": true,
  "timestamp": "2024-...",
  "service": "CoatVision API",
  "env": {
    "supabaseConfigured": true,
    "openaiConfigured": true
  },
  "version": "abc123"
}
```

### 2. Check Diagnostics Page

Visit: `https://your-app.vercel.app/debug`

Verify:
- ✅ System Health shows "Healthy"
- ✅ Supabase shows "Configured"
- ✅ OpenAI shows "Configured"

### 3. Test Auth Flow

1. Go to `/auth/signup`
2. Create a test account
3. Verify you can log in
4. Check Supabase Dashboard → Auth → Users to see the new user

### 4. Test GPT Chat

1. After logging in, go to home page
2. Click on GPT Chat section
3. Send a message about coating (e.g., "What's the best way to apply ceramic coating?")
4. Verify you get an AI response
5. Check Supabase → Database → `chats` and `messages` tables for entries

### 5. Test Image Analysis

1. Go to Analyze section
2. Upload a test image (any image works)
3. Click "Analyze"
4. Verify you see:
   - Original image displayed
   - Overlay with colored regions
   - Stats (coverage%, CQI, etc.)
5. Check Supabase → Database → `analyses` table
6. Check Supabase → Storage → `images` and `overlays` buckets

## Troubleshooting

### Build Fails with "Missing environment variables"

**Solution:** Ensure all env vars are set in Vercel for the correct environment.
- Go to Project Settings → Environment Variables
- Verify each variable is checked for Production/Preview/Development
- Redeploy after adding variables

### "/api/gpt returns 500 error"

**Possible causes:**
1. OPENAI_API_KEY not set or invalid
   - Check key in Vercel dashboard
   - Verify key works by testing in OpenAI Playground
   
2. OPENAI_API_KEY has no credits
   - Check your OpenAI account billing
   
3. User not authenticated
   - Ensure you're logged in
   - Check browser cookies are enabled

### "/api/analyze returns 500 error"

**Possible causes:**
1. SUPABASE_SERVICE_ROLE_KEY not set
   - Check in Vercel environment variables
   
2. Storage buckets not created
   - Go to Supabase → Storage
   - Create `images` and `overlays` buckets
   - Make them PUBLIC
   
3. RLS policies blocking uploads
   - Check policies in Supabase Dashboard
   - Verify user_id folders are allowed

### "Can't log in / Sign up fails"

**Possible causes:**
1. Supabase anon key is wrong
   - Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
   
2. Auth not enabled in Supabase
   - Go to Supabase → Authentication → Providers
   - Enable Email provider
   
3. Email confirmation required
   - In Supabase → Auth → Email Templates
   - Disable email confirmation for testing
   - Or check spam folder for confirmation email

### "RLS policies blocking database access"

**Solution:** Ensure migrations were run correctly.

Check in Supabase SQL Editor:
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

If policies are missing, re-run migrations.

## Performance Optimization

### 1. Enable Vercel Analytics (Optional)

1. Go to Project → Analytics
2. Enable Web Analytics
3. Monitor page load times and Core Web Vitals

### 2. Configure Caching

Images and overlays are cached for 1 hour (3600s) by default.
To adjust, modify the `cacheControl` in API routes:

```typescript
// In app/api/analyze/route.ts
cacheControl: '3600' // 1 hour in seconds
```

### 3. Database Indexes

For better query performance, consider adding indexes:
```sql
-- Already included in migrations, but verify:
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_labels ON analyses USING GIN (labels);
```

## Monitoring

### Check Deployment Logs

1. Go to Vercel Dashboard → Your Project
2. Click on a deployment
3. View "Building" and "Runtime" logs
4. Look for errors or warnings

### Check Function Logs

1. Go to Project → Functions
2. Click on a function (e.g., `/api/gpt`)
3. View invocation logs and errors

### Common Log Patterns

**Success:**
```
GET /api/health 200 (50ms)
POST /api/gpt 200 (2.3s)
POST /api/analyze 200 (3.1s)
```

**Errors to watch for:**
```
Error: Missing required environment variables
Error: OpenAI API quota exceeded
Error: Failed to upload image
ECONNREFUSED (Supabase connection failed)
```

## Scaling Considerations

### Free Tier Limits (Vercel)

- 100 GB bandwidth/month
- 100 hours serverless function execution/month
- 1000 builds/month

### Free Tier Limits (Supabase)

- 500 MB database
- 1 GB file storage
- 2 GB bandwidth

### Free Tier Limits (OpenAI)

- Varies by account
- Monitor usage in OpenAI Dashboard

### Upgrade Path

When you hit limits:
1. **Vercel Pro** ($20/month) - 1 TB bandwidth, unlimited functions
2. **Supabase Pro** ($25/month) - 8 GB database, 100 GB storage
3. **OpenAI Pay-as-you-go** - $0.15-$1.50 per 1M tokens (depends on model)

## Security Checklist

- [ ] All server-only env vars (SERVICE_ROLE_KEY, OPENAI_API_KEY) are NOT in public vars
- [ ] RLS is enabled on all tables
- [ ] Storage buckets have proper policies (users can only write to own folders)
- [ ] Email confirmation is enabled in production (optional for testing)
- [ ] CORS is properly configured (Next.js handles this by default)
- [ ] Rate limiting is considered (add if needed with Vercel Edge Config)

## Support

If you encounter issues:

1. Check `/debug` page first
2. Review Vercel deployment logs
3. Check Supabase logs (Dashboard → Logs)
4. Verify all environment variables are set correctly
5. Test API endpoints individually using curl or Postman

## Example curl Tests

### Test Health Endpoint
```bash
curl https://your-app.vercel.app/api/health
```

### Test GPT (requires auth token)
```bash
curl -X POST https://your-app.vercel.app/api/gpt \
  -H "Content-Type: application/json" \
  -H "Cookie: sb-access-token=YOUR_TOKEN" \
  -d '{"message": "Hello, what is ceramic coating?"}'
```

## Next Steps After Deployment

1. ✅ Verify all three test endpoints work
2. ✅ Create a real user account
3. ✅ Test full user flow (signup → GPT chat → image analysis)
4. ✅ Monitor logs for first 24 hours
5. ✅ Set up custom domain (optional)
6. ✅ Configure proper email templates in Supabase
7. ✅ Add proper app icons (replace placeholder SVGs)
8. ✅ Consider adding monitoring/alerts

## Maintenance

### Regular Tasks

- **Weekly:** Check Vercel function logs for errors
- **Monthly:** Review OpenAI API usage and costs
- **Monthly:** Check Supabase storage usage
- **Quarterly:** Update dependencies (`npm update`)
- **As needed:** Update OpenAI model when new versions release

### Updates and Redeployment

To deploy updates:
1. Push changes to your GitHub repository
2. Vercel automatically detects changes and redeploys
3. Or manually redeploy from Vercel Dashboard → Deployments → Redeploy

---

**Last Updated:** February 2024
**CoatVision Version:** 1.0.0
