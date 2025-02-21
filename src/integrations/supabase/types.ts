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
          full_name: string | null
          birthdate: string | null
          email: string | null
          avatar_url: string | null
          role: 'user' | 'provider' | 'admin'
          verification_status: 'pending' | 'approved' | 'rejected' | 'expired'
          bio: string | null
          city: string | null
          contact_info: Record<string, string> | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          birthdate?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'provider' | 'admin'
          verification_status?: 'pending' | 'approved' | 'rejected' | 'expired'
          bio?: string | null
          city?: string | null
          contact_info?: Record<string, string> | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string | null
          birthdate?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: 'user' | 'provider' | 'admin'
          verification_status?: 'pending' | 'approved' | 'rejected' | 'expired'
          bio?: string | null
          city?: string | null
          contact_info?: Record<string, string> | null
        }
      }
      profile_photos: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          profile_id: string
          url: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id: string
          url: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          profile_id?: string
          url?: string
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
