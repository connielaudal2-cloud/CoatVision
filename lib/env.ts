/**
 * Environment variable validation and configuration
 * Server-only module for validating required environment variables at runtime
 */

export interface EnvConfig {
  // Public (client-side) variables
  supabaseUrl: string
  supabaseAnonKey: string
  
  // Server-only variables
  supabaseServiceRoleKey?: string
  openaiApiKey?: string
  openaiModel?: string
}

export interface EnvValidationResult {
  valid: boolean
  missing: string[]
  config?: EnvConfig
}

/**
 * Validates required environment variables
 * @param requireServerKeys - If true, validates server-only keys as well
 * @returns Validation result with missing keys
 */
export function validateEnv(requireServerKeys: boolean = false): EnvValidationResult {
  const missing: string[] = []
  
  // Check public (client-side) variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseAnonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  // Check server-only variables if required
  let supabaseServiceRoleKey: string | undefined
  let openaiApiKey: string | undefined
  
  if (requireServerKeys) {
    supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    openaiApiKey = process.env.OPENAI_API_KEY
    
    if (!supabaseServiceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')
    if (!openaiApiKey) missing.push('OPENAI_API_KEY')
  }
  
  if (missing.length > 0) {
    return {
      valid: false,
      missing
    }
  }
  
  return {
    valid: true,
    missing: [],
    config: {
      supabaseUrl: supabaseUrl!,
      supabaseAnonKey: supabaseAnonKey!,
      supabaseServiceRoleKey,
      openaiApiKey,
      openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini'
    }
  }
}

/**
 * Get validated environment config or throw an error
 * Use this at the start of API routes to fail fast
 * @param requireServerKeys - If true, validates server-only keys as well
 */
export function getEnvConfig(requireServerKeys: boolean = false): EnvConfig {
  const result = validateEnv(requireServerKeys)
  
  if (!result.valid) {
    const missingVars = result.missing.join(', ')
    throw new Error(
      `Missing required environment variables: ${missingVars}. ` +
      `Please configure these in your .env.local file or deployment platform. ` +
      `See /debug for diagnostics.`
    )
  }
  
  return result.config!
}

/**
 * Check if specific environment variables are configured (returns boolean only)
 * Safe to expose to client - no actual values are returned
 */
export function checkEnvStatus() {
  return {
    supabaseConfigured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    supabaseServiceRoleConfigured: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
  }
}
