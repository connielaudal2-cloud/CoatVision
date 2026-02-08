'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [userId] = useState(() => {
    // Generate a simple user ID for demo purposes
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('userId')
      if (!id) {
        id = `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
        localStorage.setItem('userId', id)
      }
      return id
    }
    return 'anonymous'
  })
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleNewChat = () => {
    setMessages([])
    setChatId(null)
    setError(null)
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput('')
    setError(null)
    
    // Add user message to UI immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          userId: userId,
          chatId: chatId,
          isNewChat: !chatId
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      // Update chat ID if new chat
      if (data.chatId && !chatId) {
        setChatId(data.chatId)
      }

      // Add assistant response
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message 
      }])
    } catch (err: any) {
      console.error('Chat error:', err)
      setError(err.message || 'Failed to send message. Please try again.')
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">GPT Chat</h2>
        <button
          onClick={handleNewChat}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Ny chat
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">
            Start a new conversation by typing a message below.
          </p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-100 ml-auto max-w-[80%]'
                  : 'bg-white mr-auto max-w-[80%] border border-gray-200'
              }`}
            >
              <p className="font-semibold text-sm mb-1">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </p>
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          ))
        )}
        {loading && (
          <div className="bg-white p-3 rounded-lg mr-auto max-w-[80%] border border-gray-200">
            <p className="font-semibold text-sm mb-1">Assistant</p>
            <p className="text-gray-500">Typing...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send)"
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}
