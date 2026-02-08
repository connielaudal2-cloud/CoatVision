'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface HealthResponse {
  ok: boolean
  timestamp: string
  service: string
  env: {
    supabaseConfigured: boolean
    openaiConfigured: boolean
  }
  version: string
}

interface DiagnosticsState {
  health: HealthResponse | null
  loading: boolean
  error: string | null
}

export default function DebugPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsState>({
    health: null,
    supabaseTest: null,
    openaiTest: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    async function runDiagnostics() {
      try {
        // Check health endpoint
        const healthRes = await fetch('/api/health')
        const healthData = await healthRes.json()
        
        setDiagnostics(prev => ({ ...prev, health: healthData, loading: false }))
        
      } catch (error) {
        setDiagnostics(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to run diagnostics'
        }))
      }
    }

    runDiagnostics()
  }, [])

  const { health, loading, error } = diagnostics

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Running diagnostics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CoatVision Diagnostics</h1>
          <p className="text-gray-600">System health and configuration status</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Health Status */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Health</h2>
          {health ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700 font-medium">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  health.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {health.ok ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700 font-medium">Service</span>
                <span className="text-gray-900">{health.service}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700 font-medium">Version</span>
                <span className="text-gray-900 font-mono">{health.version}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Timestamp</span>
                <span className="text-gray-900 text-sm">{new Date(health.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Health check unavailable</p>
          )}
        </div>

        {/* Environment Configuration */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Environment Configuration</h2>
          {health?.env ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-gray-700 font-medium">Supabase</span>
                <StatusBadge ok={health.env.supabaseConfigured} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">OpenAI</span>
                <StatusBadge ok={health.env.openaiConfigured} />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Environment status unavailable</p>
          )}
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This page only shows whether environment variables are configured (boolean status).
              Actual values are never exposed for security reasons.
            </p>
          </div>
        </div>

        {/* Deployment Logs */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Deployment Logs</h2>
          <div className="space-y-3">
            <p className="text-gray-700">
              To view deployment logs on Vercel:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-2">
              <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">vercel.com</a></li>
              <li>Navigate to your CoatVision project</li>
              <li>Click on the &quot;Deployments&quot; tab</li>
              <li>Select the latest deployment</li>
              <li>View the build logs and runtime logs</li>
            </ol>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 font-medium mb-2">Common issues to check:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
                <li>Missing environment variables (check Vercel project settings → Environment Variables)</li>
                <li>Build failures (TypeScript errors, missing dependencies)</li>
                <li>Runtime errors in API routes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="block w-full text-center bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition"
            >
              Refresh Diagnostics
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>For local development, ensure your <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file is configured correctly.</p>
          <p className="mt-1">See <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> for required variables.</p>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ ok }: { ok: boolean }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
      ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {ok ? 'Configured' : 'Missing'}
    </span>
  )
}
