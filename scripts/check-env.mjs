#!/usr/bin/env node

/**
 * Environment Variable Checker
 * Checks which required environment variables are missing without exposing their values
 */

const requiredVars = {
  'Public (Client-side)': [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ],
  'Server-only': [
    'SUPABASE_SERVICE_ROLE_KEY',
    'OPENAI_API_KEY',
  ],
  'Optional': [
    'OPENAI_MODEL',
  ]
}

console.log('🔍 Checking environment variables...\n')

let allConfigured = true
let hasWarnings = false

for (const [category, vars] of Object.entries(requiredVars)) {
  console.log(`${category}:`)
  
  for (const varName of vars) {
    const isSet = !!process.env[varName]
    const isOptional = category === 'Optional'
    
    if (isSet) {
      console.log(`  ✅ ${varName}`)
    } else {
      if (isOptional) {
        console.log(`  ⚠️  ${varName} (optional, using default)`)
        hasWarnings = true
      } else {
        console.log(`  ❌ ${varName} (MISSING)`)
        allConfigured = false
      }
    }
  }
  console.log('')
}

if (allConfigured) {
  console.log('✅ All required environment variables are configured!')
  if (hasWarnings) {
    console.log('⚠️  Some optional variables are not set (using defaults)')
  }
  process.exit(0)
} else {
  console.log('❌ Some required environment variables are missing!')
  console.log('\nTo fix this:')
  console.log('1. Copy .env.example to .env.local')
  console.log('2. Fill in the missing values')
  console.log('3. Restart your development server')
  console.log('\nFor production (Vercel):')
  console.log('1. Go to your Vercel project settings')
  console.log('2. Navigate to Environment Variables')
  console.log('3. Add the missing variables')
  console.log('4. Redeploy your application')
  process.exit(1)
}
