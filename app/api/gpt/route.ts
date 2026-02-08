import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { chatId, message, userId, isNewChat } = body

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'placeholder-key'
    })

    // Ensure user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId } as any)

      if (insertError) {
        console.error('Profile creation error:', insertError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    let currentChatId = chatId

    // Create new chat if needed
    if (isNewChat || !currentChatId) {
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({
          user_id: userId,
          title: message.substring(0, 50)
        } as any)
        .select()
        .single()

      if (chatError) {
        console.error('Chat creation error:', chatError)
        return NextResponse.json(
          { error: 'Failed to create chat' },
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
        { error: 'Failed to save user message' },
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
        { error: 'Failed to fetch chat history' },
        { status: 500 }
      )
    }

    // Call OpenAI API
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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
          { error: 'Failed to save assistant message' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        chatId: currentChatId,
        message: assistantMessage,
        success: true
      })

    } catch (openaiError: any) {
      console.error('OpenAI API error:', openaiError)
      return NextResponse.json(
        { 
          error: 'OpenAI API error', 
          details: openaiError.message || 'Unknown error'
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('GPT API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
