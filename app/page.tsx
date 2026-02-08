'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/auth/client'
import ChatInterface from './components/ChatInterface'
import AnalysisInterface from './components/AnalysisInterface'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze'>('chat')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }
      setUser(user)
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/auth/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-center flex-1">CoatVision</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            GPT Chat
          </button>
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'analyze'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Image Analysis
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'chat' ? <ChatInterface /> : <AnalysisInterface />}
        </div>
      </div>
    </main>
  )
}
