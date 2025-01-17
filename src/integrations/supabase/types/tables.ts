import { Json } from './base';

export interface CommentTable {
  Row: {
    content: string
    created_at: string
    id: string
    post_id: string | null
    updated_at: string
    user_id: string | null
  }
  Insert: {
    content: string
    created_at?: string
    id?: string
    post_id?: string | null
    updated_at?: string
    user_id?: string | null
  }
  Update: {
    content?: string
    created_at?: string
    id?: string
    post_id?: string | null
    updated_at?: string
    user_id?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "comments_post_id_fkey"
      columns: ["post_id"]
      referencedRelation: "posts"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "comments_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface ProfileTable {
  Row: {
    id: string
    username: string | null
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    email: string | null
    city: string | null
    state: string | null
    website: string | null
    provider_since: string | null
    created_at: string
    updated_at: string
    role: string | null
  }
  Insert: {
    id: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    email?: string | null
    city?: string | null
    state?: string | null
    website?: string | null
    provider_since?: string | null
    created_at?: string
    updated_at?: string
    role?: string | null
  }
  Update: {
    id?: string
    username?: string | null
    full_name?: string | null
    avatar_url?: string | null
    bio?: string | null
    email?: string | null
    city?: string | null
    state?: string | null
    website?: string | null
    provider_since?: string | null
    created_at?: string
    updated_at?: string
    role?: string | null
  }
  Relationships: []
}

export interface SubscriptionTable {
  Row: {
    id: string
    user_id: string | null
    tier: string
    status: string
    current_period_end: string | null
    created_at: string | null
    updated_at: string | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    tier: string
    status: string
    current_period_end?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Update: {
    id?: string
    user_id?: string | null
    tier?: string
    status?: string
    current_period_end?: string | null
    created_at?: string | null
    updated_at?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "subscriptions_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}