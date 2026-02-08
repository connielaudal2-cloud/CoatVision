# 🚀 One-Click Deploy to Vercel

**Status**: ❌ **Application is NOT deployed yet**

**Good News**: Everything is ready! You just need to click a button and add 4 keys.

**Time Required**: ~15 minutes total

---

## 🎯 Three Simple Steps

### Step 1: Deploy to Vercel (2 minutes) ⚡

Click this button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fconnielaudal2-cloud%2FCoatVision&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,OPENAI_API_KEY&envDescription=Required%20API%20keys%20for%20CoatVision&envLink=https%3A%2F%2Fgithub.com%2Fconnielaudal2-cloud%2FCoatVision%2Fblob%2Fmain%2FENV_SETUP.md&project-name=coatvision&repository-name=coatvision)

**Or** go to: https://vercel.com/new

1. Log in to Vercel (create free account if needed)
2. Click "Import Project"
3. Paste your GitHub repo URL: `https://github.com/connielaudal2-cloud/CoatVision`
4. Click "Import"

⏳ **Vercel will ask for environment variables** - Don't worry, we'll get them in Step 2!

---

### Step 2: Get Your API Keys (10 minutes) 🔑

You need 4 keys. Get them one by one:

#### Key 1-3: Supabase Keys (5 minutes)

1. Go to: https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - Name: `CoatVision`
   - Database Password: (generate a strong password)
   - Region: Choose closest to you
4. Click "Create new project" (wait 2 minutes for setup)
5. Go to **Settings** → **API**
6. Copy these 3 keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

#### Key 4: OpenAI API Key (5 minutes)

1. Go to: https://platform.openai.com/api-keys
2. Log in (create account if needed)
3. Click "Create new secret key"
4. Name it: `CoatVision`
5. Copy the key:

```
OPENAI_API_KEY=sk-proj-xxxxx
```

#### Add Keys to Vercel

1. Go back to Vercel
2. In your project, go to **Settings** → **Environment Variables**
3. Add all 4 keys (paste the values you copied above)
4. Click "Save"

---

### Step 3: Setup Database & Deploy (3 minutes) 🗄️

#### A. Run Database Migration

1. Go to your Supabase project
2. Click **SQL Editor** in the left menu
3. Click "New query"
4. Copy the entire contents of: [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql)
5. Paste it into the SQL editor
6. Click "Run" (wait 5 seconds)
7. You should see "Success. No rows returned"

#### B. Configure Redirect URLs

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add these URLs (replace `your-app` with your actual Vercel URL):

```
Site URL: https://your-app.vercel.app
Redirect URLs: 
  https://your-app.vercel.app/auth/login
  https://your-app.vercel.app/auth/signup
```

#### C. Trigger Deployment

1. Go back to Vercel
2. Go to **Deployments** tab
3. Click "Redeploy" (if it hasn't deployed automatically)
4. Wait ~2 minutes for build to complete

---

## ✅ Your App is Live!

### Test Your Application

1. Click your Vercel URL: `https://your-app.vercel.app`
2. You should see CoatVision homepage
3. Click "Sign Up" and create an account
4. Try the Chat feature (click "GPT Chat" tab)
5. Try the Analysis feature (click "Image Analysis" tab)

### Your URLs

- **Live App**: `https://your-app.vercel.app`
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard

---

## 🆘 Troubleshooting

### Build Fails?

Check Vercel build logs:
1. Go to Vercel → Your Project → Deployments
2. Click the failed deployment
3. Click "View Build Logs"

Common issues:
- Missing environment variables → Add them in Settings
- Wrong variable names → Must match exactly

### App Shows Error?

1. Check browser console (F12 → Console)
2. Check if all 4 environment variables are set in Vercel
3. Check if database migration ran successfully
4. Verify redirect URLs in Supabase

### Chat Not Working?

- Check if `OPENAI_API_KEY` is set correctly
- Make sure you have OpenAI credits/billing enabled
- Check OpenAI dashboard for API errors

### Analysis Not Working?

- Check if Supabase Storage buckets exist (`images` and `overlays`)
- The migration should have created them automatically
- Check Supabase Storage dashboard

---

## 💰 Costs

- **Vercel**: Free (Hobby plan)
- **Supabase**: Free (up to 500MB database, 1GB storage)
- **OpenAI**: ~$0.50-$5/month (depending on usage)

**Total**: ~$1-$5/month

---

## 📞 Need Help?

1. Read the detailed guide: [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Check environment setup: [ENV_SETUP.md](./ENV_SETUP.md)
3. Follow the checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 🎉 That's It!

You should now have CoatVision running live on Vercel!

**Your app URL**: `https://[your-project-name].vercel.app`

Share it with anyone! 🚀
