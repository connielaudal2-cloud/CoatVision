# CoatVision Deployment Guide

## 🚀 Quick Deployment to Vercel

### Prerequisites

Before deploying, ensure you have:

1. **Supabase Account** - Set up at [supabase.com](https://supabase.com)
2. **OpenAI Account** - Get API key from [platform.openai.com](https://platform.openai.com)
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **GitHub Repository** - Your code pushed to GitHub

---

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `coatvision`
   - Database Password: (save this securely)
   - Region: Choose closest to your users
5. Click "Create new project"

### 1.2 Run Database Migration

1. In your Supabase project, go to SQL Editor
2. Create a new query
3. Copy and paste the contents from `supabase/migrations/001_initial_schema.sql`
4. Run the query
5. Verify tables are created: `profiles`, `chats`, `messages`, `analyses`

### 1.3 Configure Authentication

1. Go to Authentication > Settings
2. Enable Email provider
3. Set Site URL to your domain (or `http://localhost:3000` for testing)
4. Configure Redirect URLs:
   - Add your Vercel domain: `https://your-app.vercel.app/**`
   - Add localhost for testing: `http://localhost:3000/**`

### 1.4 Get Your Supabase Keys

1. Go to Settings > API
2. Copy these values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret!

---

## Step 2: Get OpenAI API Key

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Name it "CoatVision Production"
5. Copy the key → `OPENAI_API_KEY` ⚠️ Keep secret!
6. Set up billing if you haven't already

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository `CoatVision`
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   OPENAI_API_KEY=sk-proj-...
   OPENAI_MODEL=gpt-4o-mini
   ```

   ⚠️ **Important**: 
   - `NEXT_PUBLIC_*` variables are exposed to the browser
   - `SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only
   - Never commit these values to Git

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Get your deployment URL: `https://your-app.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts to link project and set up environment variables
```

---

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Redirect URLs

1. Go to Supabase Dashboard
2. Authentication > URL Configuration
3. Add your Vercel URL to redirect URLs:
   ```
   https://your-app.vercel.app/**
   ```

### 4.2 Test Your Deployment

1. Visit your Vercel URL
2. Test signup: `https://your-app.vercel.app/auth/signup`
3. Create an account
4. Test chat functionality
5. Test image analysis

### 4.3 Monitor Health

- Health check: `https://your-app.vercel.app/api/health`
- Should return: `{"status":"ok","timestamp":"...","service":"CoatVision API"}`

---

## Environment Variables Reference

### Required Variables

| Variable | Type | Description | Where to Get |
|----------|------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL | Supabase Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Supabase anonymous key | Supabase Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Supabase service role key | Supabase Settings > API |
| `OPENAI_API_KEY` | Secret | OpenAI API key | platform.openai.com/api-keys |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model to use |

---

## Troubleshooting

### Build Fails

**Issue**: `npm run build` fails in Vercel

**Solutions**:
1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Verify Node.js version (should use v20+)

### Authentication Errors

**Issue**: "Authentication required" errors

**Solutions**:
1. Check Supabase URL and keys are correct
2. Verify redirect URLs in Supabase include your Vercel domain
3. Check browser console for CORS errors
4. Ensure cookies are enabled

### OpenAI Errors

**Issue**: "OpenAI API key is not configured"

**Solutions**:
1. Verify `OPENAI_API_KEY` is set in Vercel
2. Check API key is valid at platform.openai.com
3. Ensure billing is set up in OpenAI
4. Check API key has not expired

### Database Connection Issues

**Issue**: Cannot connect to Supabase

**Solutions**:
1. Verify Supabase project is active
2. Check database migration ran successfully
3. Verify RLS policies are enabled
4. Check service role key is correct

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Domains"
3. Enter your domain (e.g., `coatvision.com`)
4. Follow DNS configuration instructions
5. Update Supabase redirect URLs with custom domain

---

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches (e.g., `develop`)
- **Pull Requests**: Automatic preview deployments

### Deployment Workflow

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Vercel will automatically:
# 1. Detect the push
# 2. Run npm run build
# 3. Deploy to production
# 4. Send deployment notification
```

---

## Performance Optimization

### Recommended Vercel Settings

1. **Edge Functions**: Already configured (serverless API routes)
2. **Image Optimization**: Automatic with Next.js Image component
3. **Caching**: Automatic for static assets
4. **Compression**: Automatic gzip/brotli

### Monitoring

- View analytics in Vercel Dashboard
- Set up error tracking (optional): Sentry integration
- Monitor costs in OpenAI dashboard
- Track database usage in Supabase dashboard

---

## Security Checklist

- ✅ Environment variables are not committed to Git
- ✅ Service role key is only used server-side
- ✅ OpenAI API key is only used server-side
- ✅ Row Level Security (RLS) enabled in Supabase
- ✅ HTTPS enforced (automatic with Vercel)
- ✅ Cookie-based authentication with httpOnly cookies
- ✅ No placeholder keys in production

---

## Cost Estimates

### Vercel
- **Hobby**: Free (1 project, community support)
- **Pro**: $20/month (unlimited projects, analytics)

### Supabase
- **Free Tier**: 500MB database, 1GB file storage, 50k MAU
- **Pro**: $25/month (8GB database, 100GB storage)

### OpenAI
- **Pay-as-you-go**: ~$0.15 per 1M tokens (gpt-4o-mini)
- Estimate: ~$5-20/month for moderate usage

---

## Support

- **Vercel Issues**: [vercel.com/support](https://vercel.com/support)
- **Supabase Issues**: [supabase.com/support](https://supabase.com/support)
- **OpenAI Issues**: [help.openai.com](https://help.openai.com)

---

## Next Steps: Mobile App (App Store)

This web application can be converted to a mobile app using:

1. **Progressive Web App (PWA)**: Add to home screen on iOS/Android
2. **Capacitor**: Wrap web app in native container
3. **React Native**: Rebuild as native app

See `MOBILE_DEPLOYMENT.md` (coming soon) for mobile deployment guide.
