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
          username: string
          full_name: string
          bio: string
          city: string
          state: string
          website: string
          avatar_url: string
          height: string
          body_type: string
          age: number
          ethnicity: string
          hair_color: string
          eye_color: string
          measurements: string
          languages: string[]
          availability: string
          services: string[]
          rates: Record<string, number>
          contact_info: Record<string, string>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          full_name?: string
          bio?: string
          city?: string
          state?: string
          website?: string
          avatar_url?: string
          height?: string
          body_type?: string
          age?: number
          ethnicity?: string
          hair_color?: string
          eye_color?: string
          measurements?: string
          languages?: string[]
          availability?: string
          services?: string[]
          rates?: Record<string, number>
          contact_info?: Record<string, string>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string
          bio?: string
          city?: string
          state?: string
          website?: string
          avatar_url?: string
          height?: string
          body_type?: string
          age?: number
          ethnicity?: string
          hair_color?: string
          eye_color?: string
          measurements?: string
          languages?: string[]
          availability?: string
          services?: string[]
          rates?: Record<string, number>
          contact_info?: Record<string, string>
          created_at?: string
          updated_at?: string
        }
      }
      profile_photos: {
        Row: {
          id: string
          profile_id: string
          url: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          url: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          url?: string
          created_at?: string
          updated_at?: string
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
  }
} 