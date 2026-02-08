import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getUser, ensureProfile } from '@/lib/auth/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Authentication required. Please log in.' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { chatId, message } = body

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { ok: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check OpenAI API key - strict validation, no fallback
    const openaiKey = process.env.OPENAI_API_KEY
    if (!openaiKey) {
      console.error('OPENAI_API_KEY environment variable is not set')
      return NextResponse.json(
        { ok: false, error: 'OpenAI API key is not configured. Please contact support.' },
        { status: 500 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: openaiKey
    })

    // Get model from env or use modern default
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    // Ensure user profile exists
    await ensureProfile(user.id, user.email)

    // Validate Supabase environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing Supabase environment variables')
      return NextResponse.json(
        { ok: false, error: 'Database configuration error' },
        { status: 500 }
      )
    }

    // Use service role key for database operations
    const supabase = createClient<Database>(supabaseUrl, serviceRoleKey)

    let currentChatId = chatId

    // Create new chat if needed
    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50)
        } as any)
        .select()
        .single()

      if (chatError) {
        console.error('Chat creation error:', chatError)
        return NextResponse.json(
          { ok: false, error: 'Failed to create chat' },
          { status: 500 }
        )
      }

      currentChatId = (newChat as any)?.id
    }

    // Save user message
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        chat_id: currentChatId,
        role: 'user',
        content: message
      } as any)

    if (userMessageError) {
      console.error('User message save error:', userMessageError)
      return NextResponse.json(
        { ok: false, error: 'Failed to save user message' },
        { status: 500 }
      )
    }

    // Get chat history
    const { data: messages, error: messagesError } = await supabase
      .from('messages')
      .select('role, content')
      .eq('chat_id', currentChatId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Messages fetch error:', messagesError)
      return NextResponse.json(
        { ok: false, error: 'Failed to fetch chat history' },
        { status: 500 }
      )
    }

    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: (messages as any[]).map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        }))
      })

      const assistantMessage = completion.choices[0]?.message?.content || 'No response'

      // Save assistant message
      const { error: assistantMessageError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChatId,
          role: 'assistant',
          content: assistantMessage
        } as any)

      if (assistantMessageError) {
        console.error('Assistant message save error:', assistantMessageError)
        return NextResponse.json(
          { ok: false, error: 'Failed to save assistant message' },
          { status: 500 }
        )
      }

      // Update chat title if it's the first message
      if (messages.length === 1) {
        await (supabase as any)
          .from('chats')
          .update({ title: message.substring(0, 50) })
          .eq('id', currentChatId)
      }

      return NextResponse.json({
        ok: true,
        chatId: currentChatId,
        assistant: {
          role: 'assistant',
          content: assistantMessage
        }
      })

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError)
      
      let errorMessage = 'Failed to get response from AI'
      if (openaiError.code === 'insufficient_quota') {
        errorMessage = 'OpenAI API quota exceeded. Please contact support.'
      } else if (openaiError.code === 'invalid_api_key') {
        errorMessage = 'OpenAI API key is invalid. Please contact support.'
      } else if (openaiError.message) {
        errorMessage = `AI service error: ${openaiError.message}`
      }
      
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('GPT API error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
