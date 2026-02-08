import { NextResponse } from 'next/server'
import { checkEnvStatus } from '@/lib/env'

export async function GET() {
  const envStatus = checkEnvStatus()
  
  // Get git SHA if available (Vercel sets this)
  const gitSha = process.env.VERCEL_GIT_COMMIT_SHA
  
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    service: 'CoatVision API',
    env: {
      supabaseConfigured: envStatus.supabaseConfigured,
      openaiConfigured: envStatus.openaiConfigured,
    },
    version: gitSha ? gitSha.substring(0, 7) : 'unknown'
  })
}
