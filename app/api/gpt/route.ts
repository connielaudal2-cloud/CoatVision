import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getUser, ensureProfile } from '@/lib/auth/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'
import { getEnvConfig } from '@/lib/env'

export const runtime = 'nodejs'

// CoatVision GPT System Prompt
const SYSTEM_PROMPT = `You are CoatVision GPT, an expert assistant specialized in coating and detailing.

Your expertise includes:
- Automotive coatings, ceramic coatings, paint protection films
- Coating application techniques and best practices
- Surface preparation and inspection
- Coating curing conditions and timelines
- Defect identification and troubleshooting
- Professional detailing workflows

Guidelines:
- Keep responses concise and precise (2-3 short paragraphs max)
- Ask clarifying questions when needed (max 3 questions)
- Stay focused on coating and detailing topics
- If asked about unrelated topics, politely redirect to coating/detailing
- Use professional but friendly tone
- Provide actionable advice when possible`

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables first (fail-fast)
    let env
    try {
      env = getEnvConfig(true)
    } catch (envError) {
      const errorMessage = envError instanceof Error ? envError.message : 'Environment validation failed'
      console.error('Environment validation failed:', errorMessage)
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 500 }
      )
    }

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

    // Initialize OpenAI client with validated config
    const openai = new OpenAI({
      apiKey: env.openaiApiKey!
    })

    // Ensure user profile exists
    await ensureProfile(user.id, user.email)

    // Use service role key for database operations
    const supabase = createClient<Database>(env.supabaseUrl, env.supabaseServiceRoleKey!)

    let currentChatId = chatId

    // Create new chat if needed
    if (!currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50)
        })
        .select()
        .single()

      if (chatError) {
        console.error('Chat creation error:', chatError)
        return NextResponse.json(
          { ok: false, error: 'Failed to create chat' },
          { status: 500 }
        )
      }

      currentChatId = newChat.id
    }

    // Save user message
    const { error: userMessageError } = await supabase
      .from('messages')
      .insert({
        chat_id: currentChatId,
        role: 'user',
        content: message
      })

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

    // Prepare messages for OpenAI with system prompt
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: env.openaiModel!,
        messages: openaiMessages,
        temperature: 0.7,
        max_tokens: 500
      })

      const assistantMessage = completion.choices[0]?.message?.content || 'No response'

      // Save assistant message
      const { error: assistantMessageError } = await supabase
        .from('messages')
        .insert({
          chat_id: currentChatId,
          role: 'assistant',
          content: assistantMessage
        })

      if (assistantMessageError) {
        console.error('Assistant message save error:', assistantMessageError)
        return NextResponse.json(
          { ok: false, error: 'Failed to save assistant message' },
          { status: 500 }
        )
      }

      // Update chat title if it's the first user message
      if (messages.length === 1) {
        await supabase
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

    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      
      const error = openaiError as { code?: string; message?: string }
      let errorMessage = 'Failed to get response from AI'
      
      if (error.code === 'insufficient_quota') {
        errorMessage = 'OpenAI API quota exceeded. Please contact support.'
      } else if (error.code === 'invalid_api_key') {
        errorMessage = 'OpenAI API key is invalid. Please contact support.'
      } else if (error.message) {
        errorMessage = `AI service error: ${error.message}`
      }
      
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('GPT API error:', error)
    const err = error as Error
    return NextResponse.json(
      { ok: false, error: 'Internal server error', details: err.message },
      { status: 500 }
    )
  }
}
