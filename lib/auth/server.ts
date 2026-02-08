import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../database.types'

export async function createServerClient() {
  const cookieStore = await cookies()
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storage: {
        getItem: (key) => cookieStore.get(key)?.value ?? null,
        setItem: (key, value) => {
          cookieStore.set(key, value, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
          })
        },
        removeItem: (key) => {
          cookieStore.delete(key)
        },
      },
    },
  })
}

export async function getUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function ensureProfile(userId: string, email?: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
  }
  
  // Use service role key to bypass RLS for profile creation
  const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)
  
  // Check if profile exists
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single()
  
  if (existingProfile) {
    return existingProfile
  }
  
  // Create profile
  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email: email || null,
    } as any)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`)
  }
  
  return newProfile
}
