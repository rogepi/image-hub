export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gallery: {
        Row: {
          category: string | null
          created_at: string | null
          desc: string | null
          id: number
          is_public: boolean | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          desc?: string | null
          id?: number
          is_public?: boolean | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          desc?: string | null
          id?: number
          is_public?: boolean | null
          name?: string | null
          user_id?: string | null
        }
      }
      gallery_image: {
        Row: {
          created_at: string | null
          gallery_id: number
          image_id: number
          image_name: string | null
          is_basic: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          gallery_id: number
          image_id: number
          image_name?: string | null
          is_basic?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          gallery_id?: number
          image_id?: number
          image_name?: string | null
          is_basic?: boolean | null
          user_id?: string | null
        }
      }
      image: {
        Row: {
          author: string | null
          created_at: string | null
          id: number
          path: string | null
          url: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          id?: number
          path?: string | null
          url?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          id?: number
          path?: string | null
          url?: string | null
        }
      }
      profile: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
