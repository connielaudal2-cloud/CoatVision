# Pre-Deployment Checklist

Use this checklist before deploying CoatVision to production.

---

## ✅ Environment Setup

### Supabase Configuration
- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Ran database migration (`supabase/migrations/001_initial_schema.sql`)
- [ ] Verified all tables exist: `profiles`, `chats`, `messages`, `analyses`
- [ ] Enabled Email authentication in Supabase
- [ ] Configured Site URL in Supabase Auth settings
- [ ] Got Project URL (NEXT_PUBLIC_SUPABASE_URL)
- [ ] Got Anon/Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [ ] Got Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
- [ ] Verified RLS policies are enabled on all tables
- [ ] Created storage buckets: `images`, `overlays`
- [ ] Set storage bucket policies

### OpenAI Configuration
- [ ] Created OpenAI account
- [ ] Set up billing in OpenAI
- [ ] Generated API key (OPENAI_API_KEY)
- [ ] Chose model (default: gpt-4o-mini)
- [ ] Verified API key works (test in playground)

### Local Testing
- [ ] Copied `.env.example` to `.env.local`
- [ ] Filled in all environment variables
- [ ] Ran `npm install`
- [ ] Ran `npm run build` successfully
- [ ] Tested signup flow locally
- [ ] Tested login flow locally
- [ ] Tested chat functionality locally
- [ ] Tested image analysis locally
- [ ] Tested health endpoint: `http://localhost:3000/api/health`
- [ ] No console errors in browser
- [ ] No build warnings

---

## ✅ Code Quality

### Code Review
- [ ] All TypeScript types are correct
- [ ] No `any` types (or justified)
- [ ] No hardcoded secrets or keys
- [ ] All API routes have proper error handling
- [ ] All user-facing errors are clear and actionable
- [ ] Loading states implemented for all async operations
- [ ] Authentication checks on all protected routes

### Security
- [ ] `.env.local` is in `.gitignore`
- [ ] No secrets committed to Git
- [ ] Service role key only used server-side
- [ ] OpenAI API key only used server-side
- [ ] RLS policies prevent unauthorized access
- [ ] Cookie-based auth with httpOnly cookies
- [ ] CORS configured correctly
- [ ] SQL injection prevented (using Supabase client)
- [ ] XSS prevention (React automatic escaping)

### Performance
- [ ] Images optimized
- [ ] No unnecessary dependencies
- [ ] API routes return quickly
- [ ] Loading states for slow operations
- [ ] Error boundaries implemented
- [ ] Build output is reasonable size

---

## ✅ Vercel Deployment

### Account Setup
- [ ] Created Vercel account
- [ ] Connected GitHub account
- [ ] Verified payment method (if going beyond free tier)

### Project Configuration
- [ ] Pushed code to GitHub
- [ ] Imported repository to Vercel
- [ ] Selected correct framework (Next.js)
- [ ] Chose production branch (usually `main`)
- [ ] Set root directory (if needed)

### Environment Variables
- [ ] Added `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Added `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Added `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Added `OPENAI_API_KEY`
- [ ] Added `OPENAI_MODEL` (optional)
- [ ] Verified no typos in variable names
- [ ] Verified no extra spaces in values
- [ ] All variables set for Production environment

### Deployment
- [ ] Triggered initial deployment
- [ ] Deployment succeeded (no build errors)
- [ ] Got deployment URL (e.g., `your-app.vercel.app`)
- [ ] Visited deployment URL successfully

---

## ✅ Post-Deployment Verification

### Supabase Updates
- [ ] Added Vercel URL to Supabase redirect URLs
  ```
  https://your-app.vercel.app/**
  ```
- [ ] Updated Site URL in Supabase if using custom domain
- [ ] Tested auth from production URL

### Functional Testing
- [ ] Health check works: `https://your-app.vercel.app/api/health`
- [ ] Homepage loads correctly
- [ ] Login page works
- [ ] Signup page works
- [ ] Can create new account
- [ ] Can login to existing account
- [ ] Can create new chat
- [ ] Can send messages in chat
- [ ] Chat receives AI responses
- [ ] Can upload image for analysis
- [ ] Image analysis returns results
- [ ] Can logout
- [ ] Redirects work correctly

### Cross-Browser Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari (if available)
- [ ] Tested in Edge
- [ ] Tested on mobile (iOS)
- [ ] Tested on mobile (Android)

### Error Handling
- [ ] Test with missing env vars (should show clear error)
- [ ] Test with invalid credentials (should show clear error)
- [ ] Test with network errors (should show clear error)
- [ ] Test with large image uploads
- [ ] Test with invalid image formats
- [ ] All errors are user-friendly (no stack traces)

---

## ✅ Monitoring & Maintenance

### Analytics Setup (Optional)
- [ ] Set up Vercel Analytics (if on Pro plan)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Set up uptime monitoring
- [ ] Set up cost alerts for OpenAI
- [ ] Set up cost alerts for Supabase

### Documentation
- [ ] Updated README with deployment URL
- [ ] Documented any custom configurations
- [ ] Created user guide (if needed)
- [ ] Shared credentials with team (securely)

### Backup & Recovery
- [ ] Documented Supabase backup strategy
- [ ] Saved Supabase credentials securely
- [ ] Saved OpenAI credentials securely
- [ ] Exported database schema
- [ ] Documented rollback procedure

---

## ✅ Optional Enhancements

### Domain Configuration
- [ ] Purchased custom domain
- [ ] Configured DNS settings
- [ ] Added domain in Vercel
- [ ] Verified SSL certificate
- [ ] Updated Supabase URLs with custom domain
- [ ] Tested with custom domain

### Performance Optimization
- [ ] Enabled Vercel Edge Functions (if applicable)
- [ ] Configured caching headers
- [ ] Set up CDN for static assets
- [ ] Optimized images with Next.js Image
- [ ] Minimized bundle size

### Feature Additions
- [ ] Set up email notifications
- [ ] Add user profile management
- [ ] Add chat history page
- [ ] Add analysis history page
- [ ] Add export functionality
- [ ] Add sharing features

---

## ✅ Mobile App (Future)

See [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md) for mobile deployment checklist.

### PWA Setup
- [ ] Add manifest.json
- [ ] Add service worker
- [ ] Add app icons
- [ ] Test "Add to Home Screen"

### App Store Preparation
- [ ] Choose mobile strategy (PWA/Capacitor/React Native)
- [ ] Set up Apple Developer account
- [ ] Set up Google Play Developer account
- [ ] Create app icons and screenshots
- [ ] Prepare app store listings

---

## 🚨 Rollback Plan

If something goes wrong:

1. **Vercel Rollback**
   - Go to Vercel Dashboard → Deployments
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Database Rollback**
   - Have database backup ready
   - Restore from Supabase backup
   - Or run reverse migration

3. **Key Rotation**
   - If keys compromised, rotate immediately
   - Update in Vercel
   - Redeploy

---

## 📞 Support Contacts

- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support
- **OpenAI Support**: https://help.openai.com

---

## ✅ Final Sign-Off

Before considering deployment complete:

- [ ] All items in this checklist are complete
- [ ] Team has been notified of deployment
- [ ] All stakeholders have tested
- [ ] Monitoring is in place
- [ ] Backup plan is documented
- [ ] Support contacts are shared

**Deployment Date**: _______________

**Deployed By**: _______________

**Production URL**: _______________

**Status**: ✅ Complete / ⚠️ Issues / ❌ Failed

**Notes**:
```
[Add any deployment notes here]
```

---

## 🎉 Success!

If all items are checked, congratulations! Your CoatVision application is successfully deployed to production.

Monitor the application for the first 24 hours and address any issues promptly.
