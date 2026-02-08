export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string | null
          full_name?: string | null
        }
      }
      chats: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
        }
        Insert: {
          id?: string
          created_at?: string
          chat_id: string
          role: 'user' | 'assistant' | 'system'
          content: string
        }
        Update: {
          id?: string
          created_at?: string
          chat_id?: string
          role?: 'user' | 'assistant' | 'system'
          content?: string
        }
      }
      analyses: {
        Row: {
          id: string
          created_at: string
          user_id: string
          image_url: string
          overlay_url: string | null
          stats: Json
          status: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          image_url: string
          overlay_url?: string | null
          stats?: Json
          status?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          image_url?: string
          overlay_url?: string | null
          stats?: Json
          status?: string
        }
      }
    }
  }
}
