import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST() {
  try {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as Error
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to logout' },
      { status: 500 }
    )
  }
}
