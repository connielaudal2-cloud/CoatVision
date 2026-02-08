# CoatVision - Copilot Development Tasks

This document provides a checklist for GitHub Copilot when making changes to the CoatVision project.

## Development Workflow

When making changes to CoatVision, follow these guidelines:

### Before Making Changes

- [ ] Read existing code to understand the current implementation
- [ ] Check `/debug` page to understand current environment configuration
- [ ] Review API routes to understand data flow
- [ ] Check if new environment variables are needed

### Making Changes

- [ ] Keep changes minimal and focused on a single feature or fix
- [ ] Use TypeScript types consistently
- [ ] Follow existing code patterns and conventions
- [ ] Add error handling with `ok` and `error` fields in API responses
- [ ] Keep routes unchanged unless absolutely necessary
- [ ] If adding new environment variables:
  - [ ] Add to `.env.example`
  - [ ] Add to `lib/env.ts` validation
  - [ ] Add to `scripts/check-env.mjs`
  - [ ] Update `/debug` page if needed
  - [ ] Document in PR description

### Before Submitting PR

- [ ] Run `npm run doctor` to verify all checks pass
- [ ] Test changes locally
- [ ] Verify no TypeScript errors (`npm run typecheck`)
- [ ] Verify no linting errors (`npm run lint`)
- [ ] Verify build succeeds (`npm run build`)
- [ ] Test `/debug` page if environment changes were made
- [ ] Write clear PR description following template

### API Development

When working with API routes:

- [ ] Always use `getEnvConfig()` at the start of routes that need env vars
- [ ] Return consistent JSON structure: `{ ok: boolean, error?: string, ...data }`
- [ ] Add proper error handling and logging
- [ ] Don't use placeholder API keys
- [ ] Validate user authentication first
- [ ] Use `getUser()` and `ensureProfile()` helpers

### Frontend Development

When working with UI components:

- [ ] Show clear error messages if API calls fail
- [ ] Link to `/debug` page when there are configuration errors (for dev/admin)
- [ ] Use Tailwind CSS classes consistently
- [ ] Handle loading and error states
- [ ] Test on different screen sizes

### Environment Variables

Current required variables:

**Public (client-side):**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Server-only:**
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

**Optional:**
- `OPENAI_MODEL` (defaults to `gpt-4o-mini`)

### Quick Commands

```bash
# Check environment variables
npm run check-env

# Run all checks (environment, typecheck, lint, build)
npm run doctor

# Build for Vercel (same as what Vercel runs)
npm run verify

# Development
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Debugging

If something isn't working:

1. Visit `/debug` page to check configuration status
2. Run `npm run check-env` to see missing variables
3. Check browser console for errors
4. Check terminal/server logs for API errors
5. Review Vercel deployment logs if deployed

### Small PR Philosophy

- Make one logical change per PR
- Keep PRs under 500 lines of code when possible
- Split large features into multiple PRs
- Each PR should be independently deployable
- Write descriptive commit messages

### Common Pitfalls to Avoid

- ❌ Don't hardcode API keys or secrets
- ❌ Don't commit `.env.local` file
- ❌ Don't change existing route paths without discussion
- ❌ Don't skip environment validation in API routes
- ❌ Don't remove existing error handling
- ❌ Don't forget to update documentation when adding features

### Testing Checklist

- [ ] Test locally with `npm run dev`
- [ ] Test build with `npm run build`
- [ ] Test production build with `npm start`
- [ ] Test `/debug` page
- [ ] Test `/api/health` endpoint
- [ ] Test main user flows (login, chat, analysis)
- [ ] Check browser console for errors
- [ ] Check server logs for errors

## Project Structure

```
CoatVision/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── analyze/       # Image analysis endpoint
│   │   ├── gpt/           # Chat GPT endpoint
│   │   ├── health/        # Health check endpoint
│   │   └── auth/          # Auth endpoints
│   ├── components/        # React components
│   ├── debug/             # Debug/diagnostics page
│   └── auth/              # Auth pages
├── lib/                   # Shared utilities
│   ├── env.ts             # Environment validation
│   ├── auth/              # Auth helpers
│   └── supabase/          # Supabase client
├── scripts/               # Build and utility scripts
│   └── check-env.mjs      # Environment checker
├── .env.example           # Example environment file
└── package.json           # Dependencies and scripts
```

## Need Help?

- Check existing code examples in the repository
- Review `/debug` page for configuration issues
- Run `npm run doctor` to diagnose problems
- Check Vercel deployment logs for production issues
