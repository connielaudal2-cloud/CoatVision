# Environment Variables Setup

## Quick Setup Guide

### Step 1: Copy Environment Template

```bash
cp .env.example .env.local
```

### Step 2: Fill in Your Values

Open `.env.local` and replace all placeholder values with your actual credentials.

---

## Required Variables

### Supabase Configuration

**Get from**: [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
```
- This is your project URL
- It's safe to expose to the browser (starts with `NEXT_PUBLIC_`)
- Format: `https://[project-ref].supabase.co`

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- This is your "anon" or "public" key
- It's safe to expose to the browser (starts with `NEXT_PUBLIC_`)
- Long JWT token starting with `eyJ`

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- This is your "service_role" key
- ⚠️ **NEVER** expose to browser - server-side only!
- Has admin privileges - keep it secret
- Long JWT token starting with `eyJ`

### OpenAI Configuration

**Get from**: [OpenAI Platform](https://platform.openai.com/api-keys)

```env
OPENAI_API_KEY=sk-proj-...
```
- Create a new API key in your OpenAI account
- ⚠️ **NEVER** expose to browser - server-side only!
- Starts with `sk-proj-` or `sk-`
- Make sure billing is set up in OpenAI

---

## Optional Variables

```env
OPENAI_MODEL=gpt-4o-mini
```
- Default: `gpt-4o-mini`
- Other options: `gpt-4o`, `gpt-4`, `gpt-3.5-turbo`
- `gpt-4o-mini` is recommended (cheap and fast)

---

## Validation Checklist

Before deploying, verify each variable:

### ✅ Supabase URL
- [ ] Starts with `https://`
- [ ] Ends with `.supabase.co`
- [ ] Matches your project URL in Supabase dashboard

### ✅ Supabase Anon Key
- [ ] Starts with `eyJ`
- [ ] Very long string (hundreds of characters)
- [ ] Copied from "anon public" section in API settings

### ✅ Supabase Service Role Key
- [ ] Starts with `eyJ`
- [ ] Very long string (hundreds of characters)
- [ ] Copied from "service_role" section in API settings
- [ ] Different from anon key

### ✅ OpenAI API Key
- [ ] Starts with `sk-proj-` or `sk-`
- [ ] Created in OpenAI dashboard
- [ ] Billing is set up
- [ ] Has not been revoked

---

## Testing Your Configuration

### Local Testing

1. **Start development server**:
```bash
npm run dev
```

2. **Test health endpoint**:
```bash
curl http://localhost:3000/api/health
```
Should return: `{"status":"ok","timestamp":"...","service":"CoatVision API"}`

3. **Test Supabase connection**:
   - Go to http://localhost:3000/auth/signup
   - Try to create an account
   - If successful, Supabase is configured correctly

4. **Test OpenAI**:
   - Login to your account
   - Go to chat interface
   - Send a message
   - If you get a response, OpenAI is configured correctly

### Production Testing (After Vercel Deployment)

1. **Check environment variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Verify all 4 required variables are set
   - Verify no typos in variable names

2. **Test endpoints**:
```bash
# Health check
curl https://your-app.vercel.app/api/health

# Should return 200 OK
```

3. **Browser testing**:
   - Visit your Vercel URL
   - Test signup
   - Test login
   - Test chat
   - Test image analysis

---

## Common Issues

### "Missing Supabase environment variables"

**Cause**: `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` not set

**Solution**:
1. Check variable names (must be exact)
2. Check values are not empty
3. Restart dev server after changing .env.local
4. In Vercel: redeploy after setting variables

### "OpenAI API key is not configured"

**Cause**: `OPENAI_API_KEY` not set or invalid

**Solution**:
1. Verify key starts with `sk-`
2. Check key is not revoked in OpenAI dashboard
3. Ensure billing is set up
4. Create a new key if needed

### "Authentication required"

**Cause**: Supabase Auth not configured or redirect URLs wrong

**Solution**:
1. Check Supabase Auth is enabled
2. Verify Site URL in Supabase Auth settings
3. Add your domain to allowed redirect URLs
4. Check RLS policies are enabled on tables

### "Failed to create profile"

**Cause**: Missing `SUPABASE_SERVICE_ROLE_KEY` or RLS issues

**Solution**:
1. Verify service role key is set correctly
2. Check database migration ran successfully
3. Verify profiles table exists
4. Check service role key has not been rotated

---

## Security Best Practices

### DO ✅
- Use `.env.local` for local development
- Add `.env.local` to `.gitignore` (already done)
- Set environment variables in Vercel dashboard
- Rotate keys if compromised
- Use different keys for development and production
- Enable 2FA on Supabase and OpenAI accounts

### DON'T ❌
- Commit `.env.local` to Git
- Share your service role key
- Share your OpenAI API key
- Use production keys in development
- Hardcode keys in source code
- Store keys in frontend code

---

## Rotating Keys

If a key is compromised, rotate it immediately:

### Supabase Keys
1. Go to Supabase Dashboard → Settings → API
2. Scroll to "Reset database password" or "Rotate keys"
3. Generate new keys
4. Update in Vercel and local `.env.local`
5. Redeploy

### OpenAI Keys
1. Go to OpenAI Platform → API Keys
2. Revoke compromised key
3. Create new key
4. Update in Vercel and local `.env.local`
5. Redeploy

---

## Environment-Specific Configurations

### Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (dev key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (dev key)
OPENAI_API_KEY=sk-... (dev key)
OPENAI_MODEL=gpt-4o-mini
```

### Production (Vercel)
```env
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ... (prod key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (prod key)
OPENAI_API_KEY=sk-... (prod key)
OPENAI_MODEL=gpt-4o-mini
```

**Best Practice**: Use separate Supabase projects for dev/prod

---

## Help & Support

If you're still having issues:

1. Check [Supabase Documentation](https://supabase.com/docs)
2. Check [OpenAI Documentation](https://platform.openai.com/docs)
3. Check [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
4. Review Vercel build logs
5. Check browser console for errors
6. Check server logs in Vercel

---

## Quick Reference Card

| Variable | Type | Starts With | Where to Get |
|----------|------|-------------|--------------|
| NEXT_PUBLIC_SUPABASE_URL | Public | https:// | Supabase API Settings |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public | eyJ | Supabase API Settings (anon) |
| SUPABASE_SERVICE_ROLE_KEY | Secret | eyJ | Supabase API Settings (service_role) |
| OPENAI_API_KEY | Secret | sk- | OpenAI Platform API Keys |
| OPENAI_MODEL | Optional | gpt- | Your choice (default: gpt-4o-mini) |
