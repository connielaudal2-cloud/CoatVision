'use client'

import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import AnalysisInterface from './components/AnalysisInterface'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'chat' | 'analyze'>('chat')

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">CoatVision</h1>
        
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
