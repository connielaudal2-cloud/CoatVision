# 🚀 CoatVision - Quick Deployment Reference

## 📋 Prerequisites Checklist

- [ ] Supabase account → [supabase.com](https://supabase.com)
- [ ] OpenAI account → [platform.openai.com](https://platform.openai.com)
- [ ] Vercel account → [vercel.com](https://vercel.com)
- [ ] GitHub repository with CoatVision code

---

## ⚡ 5-Minute Quick Deploy

### 1️⃣ Get Your Keys (5 minutes)

**Supabase** (Get 3 keys):
```
🔗 Dashboard → Settings → API
✅ NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...
✅ SUPABASE_SERVICE_ROLE_KEY = eyJ...
```

**OpenAI** (Get 1 key):
```
🔗 platform.openai.com/api-keys
✅ OPENAI_API_KEY = sk-proj-...
```

### 2️⃣ Deploy to Vercel (2 minutes)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Add these 4 environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [paste from Supabase]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [paste from Supabase]
   SUPABASE_SERVICE_ROLE_KEY = [paste from Supabase]
   OPENAI_API_KEY = [paste from OpenAI]
   ```
5. Click "Deploy" 🚀

### 3️⃣ Run Database Migration (3 minutes)

1. Supabase Dashboard → SQL Editor
2. Open `supabase/migrations/001_initial_schema.sql`
3. Copy entire contents
4. Paste into SQL Editor
5. Click "Run"
6. Verify tables created ✅

### 4️⃣ Update Supabase URLs (1 minute)

1. Supabase Dashboard → Authentication → URL Configuration
2. Add your Vercel URL:
   ```
   https://your-app.vercel.app/**
   ```
3. Save ✅

### 5️⃣ Test It! (2 minutes)

Visit: `https://your-app.vercel.app`

- [ ] Health check: `/api/health` → Should return `{"status":"ok"}`
- [ ] Sign up works
- [ ] Chat works
- [ ] Image analysis works

**🎉 You're live!**

---

## 📖 Full Documentation

- **Complete Guide**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Environment Setup**: [ENV_SETUP.md](./ENV_SETUP.md)
- **Deployment Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- **Mobile Apps**: [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md)

---

## 🆘 Quick Troubleshooting

| Issue | Fix |
|-------|-----|
| "Missing Supabase environment variables" | Check variable names (exact match required) |
| "OpenAI API key is not configured" | Verify key starts with `sk-` and billing is set up |
| "Authentication required" | Add Vercel URL to Supabase redirect URLs |
| Build fails | Check Vercel build logs, verify all dependencies |

**More help**: See [DEPLOYMENT.md](./DEPLOYMENT.md) → Troubleshooting section

---

## 💰 Cost Estimate

| Service | Tier | Cost |
|---------|------|------|
| Vercel | Hobby | **Free** |
| Supabase | Free | **Free** (500MB DB, 1GB storage) |
| OpenAI | Pay-as-you-go | **~$5-20/month** |
| **Total** | | **~$5-20/month** |

---

## 📱 Mobile App Deployment

**Want to deploy to App Store?**

See [MOBILE_DEPLOYMENT.md](./MOBILE_DEPLOYMENT.md) for:
- Progressive Web App (PWA) - 1-2 days
- Capacitor (Recommended) - 2-3 weeks
- React Native - 2-3 months

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Health endpoint returns 200 OK
- ✅ Users can sign up and login
- ✅ Chat sends messages and receives AI responses
- ✅ Image analysis processes images and returns results
- ✅ No errors in Vercel logs
- ✅ No errors in browser console

---

## 🔐 Security Reminders

- ✅ Never commit `.env.local` to Git
- ✅ Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser
- ✅ Never expose `OPENAI_API_KEY` to browser
- ✅ Rotate keys if compromised
- ✅ Enable 2FA on all accounts

---

## 📞 Need Help?

1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
2. Check [ENV_SETUP.md](./ENV_SETUP.md) for environment setup
3. Use [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) to track progress
4. Contact support:
   - Vercel: [vercel.com/support](https://vercel.com/support)
   - Supabase: [supabase.com/support](https://supabase.com/support)
   - OpenAI: [help.openai.com](https://help.openai.com)

---

## 🎯 Next Steps

After successful deployment:

1. ✅ Set up custom domain (optional)
2. ✅ Enable monitoring and analytics
3. ✅ Set up cost alerts
4. ✅ Share with team
5. ✅ Plan mobile app deployment

---

**Last Updated**: 2026-02-08

**Build Status**: ✅ Passing

**Ready to Deploy**: ✅ Yes
