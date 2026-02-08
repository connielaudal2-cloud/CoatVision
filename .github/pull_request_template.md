## Description

<!-- Provide a brief description of what was changed and why -->

## Changes Made

<!-- List the main changes made in this PR -->

- 
- 
- 

## How to Test Locally

1. Pull this branch
2. Run `npm install` (if dependencies changed)
3. Copy `.env.example` to `.env.local` and fill in values
4. Run `npm run doctor` to verify everything is configured correctly
5. Run `npm run dev` to start development server
6. Test the changes:
   - 
   - 

## Environment Variables

<!-- Check all that apply -->

- [ ] No environment variables were added or changed
- [ ] New environment variables were added (listed below)
- [ ] Existing environment variables were modified (listed below)
- [ ] Environment variables documentation was updated

<!-- If variables were added/changed, list them here -->

**Added/Changed Variables:**

- 
- 

## Vercel Deployment

<!-- Check all that apply -->

- [ ] This PR is safe to deploy to Vercel as-is
- [ ] Vercel environment variables need to be updated before deployment
- [ ] This PR requires other infrastructure changes

**Required Vercel Actions:**

<!-- If any Vercel actions are needed, describe them here -->

## Pre-submission Checklist

<!-- Verify all of these before submitting -->

- [ ] Code builds successfully (`npm run build`)
- [ ] TypeScript types are correct (`npm run typecheck`)
- [ ] Linting passes (`npm run lint`)
- [ ] All checks pass (`npm run doctor`)
- [ ] Changes are minimal and focused
- [ ] API routes return consistent JSON structure (`ok` + `error` fields)
- [ ] Error messages are user-friendly
- [ ] Documentation updated (if needed)
- [ ] `/debug` page updated (if env variables changed)

## Additional Notes

<!-- Any additional context, screenshots, or information -->
