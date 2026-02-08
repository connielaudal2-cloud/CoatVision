import { NextResponse } from 'next/server'
import { getUser, ensureProfile } from '@/lib/auth/server'

export async function POST() {
  try {
    const user = await getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    await ensureProfile(user.id, user.email)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const err = error as Error
    console.error('Ensure profile error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to ensure profile' },
      { status: 500 }
    )
  }
}
