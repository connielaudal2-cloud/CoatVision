# CoatVision Deployment Guide

## ✅ What's Already Done
- All code is complete and merged to main
- Build works perfectly
- Ready to deploy!

---

## 🚀 Deploy in 3 Steps (30 minutes total)

### Step 1: Deploy to Vercel (5 minutes)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Click "Sign Up" (or "Log In" if you have an account)
   - Choose "Continue with GitHub"

2. **Import Your Project**
   - Click "Add New..." → "Project"
   - Find and select `CoatVision` from your repositories
   - Click "Import"

3. **Deploy (Don't configure yet)**
   - Keep all default settings
   - Click "Deploy"
   - Wait ~2 minutes for it to build
   - **Don't worry if it fails** - we need to add environment variables first
   - **Save your deployment URL** (looks like: `coatvision-xxxxx.vercel.app`)

---

### Step 2: Set Up Supabase Database (10 minutes)

1. **Create Supabase Account**
   - Visit: https://supabase.com
   - Click "Start your project"
   - Choose "Sign in with GitHub"

2. **Create New Project**
   - Click "New Project"
   - Fill in:
     - **Name**: CoatVision
     - **Database Password**: Create a strong password (save it somewhere safe!)
     - **Region**: Choose closest to you
   - Click "Create new project"
   - Wait ~2 minutes for database to provision

3. **Get Your Supabase Credentials**
   - Once ready, click on "Project Settings" (gear icon in left sidebar)
   - Click "API" in the settings menu
   - **Copy and save these 3 values:**
     ```
     Project URL: https://xxxxx.supabase.co
     anon/public key: eyJhbGc... (long string)
     service_role key: eyJhbGc... (different long string)
     ```

4. **Run Database Migrations**
   - In Supabase dashboard, click "SQL Editor" in left sidebar
   - Click "New Query"
   - Copy the contents of `supabase/migrations/001_initial_schema.sql` from your repo
   - Paste into the query editor
   - Click "Run" button
   - You should see "Success. No rows returned"

---

### Step 3: Connect Everything (5 minutes)

1. **Add Environment Variables to Vercel**
   - Go back to Vercel dashboard
   - Click on your `CoatVision` project
   - Click "Settings" tab
   - Click "Environment Variables" in left menu
   - Add these 5 variables (click "+ Add" for each):

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: [Your Supabase Project URL from Step 2]
   (Select all environments: Production, Preview, Development)

   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: [Your Supabase anon/public key from Step 2]
   (Select all environments)

   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [Your Supabase service_role key from Step 2]
   (Select all environments)

   Name: OPENAI_API_KEY
   Value: [Your OpenAI API key - see below if you don't have one]
   (Select all environments)

   Name: OPENAI_MODEL
   Value: gpt-4o-mini
   (Select all environments)
   ```

2. **Get OpenAI API Key (if you don't have one)**
   - Visit: https://platform.openai.com/api-keys
   - Sign up or log in
   - Click "Create new secret key"
   - Give it a name: "CoatVision"
   - Copy the key (starts with `sk-`)
   - **Important**: Save it immediately - you won't see it again!

3. **Redeploy**
   - In Vercel, click "Deployments" tab
   - Click the three dots "..." on the latest deployment
   - Click "Redeploy"
   - Check "Use existing Build Cache"
   - Click "Redeploy"
   - Wait ~2 minutes

---

## 🎉 You're Live!

Visit your Vercel URL (e.g., `https://coatvision-xxxxx.vercel.app`)

**Test the app:**
1. Create an account (signup page)
2. Log in
3. Try the Chat GPT feature
4. Upload an image for analysis

---

## 🛠️ Troubleshooting

**If you see errors:**
1. Visit: `https://your-app.vercel.app/debug`
2. Check what's missing or misconfigured
3. Go back to Vercel Settings → Environment Variables
4. Fix the missing/wrong values
5. Redeploy

**Common issues:**
- "Missing environment variables" → Double-check all 5 variables are added in Vercel
- "Database error" → Make sure you ran the SQL migration in Supabase
- "OpenAI error" → Check your API key is correct and has credits

---

## 📱 Optional: Custom Domain

**Want your own domain (e.g., coatvision.com)?**
1. In Vercel project settings, click "Domains"
2. Follow the instructions to add your domain
3. Vercel handles SSL certificates automatically

---

## 💰 Cost Breakdown

- **Vercel**: Free tier (perfect for this app)
- **Supabase**: Free tier includes 500MB database, 2GB storage
- **OpenAI**: Pay-per-use (~$0.15 per 1000 requests with gpt-4o-mini)

All platforms offer generous free tiers - you won't pay anything unless you get significant traffic.

---

## 🆘 Need Help?

If you get stuck at any step, take a screenshot of the error and I can help you fix it!
