import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

export async function getUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function ensureProfile(userId: string, email?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
  }
  
  // Use service role key to bypass RLS for profile operations
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)
  
  // Use upsert pattern to create or update profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      email: email || null,
      updated_at: new Date().toISOString(),
    } as any, {
      onConflict: 'id'
    })
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to ensure profile: ${error.message}`)
  }
  
  return profile
}
