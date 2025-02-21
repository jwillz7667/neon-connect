import { Json } from './base';
import type { Database } from '@/types/supabase';

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
    role: 'user' | 'provider' | 'admin'
    verification_status: 'pending' | 'approved' | 'rejected' | 'expired'
    verification_documents: Json | null
    birthdate: string | null
    verified_at: string | null
    // Provider specific fields
    featured_until: string | null
    featured_priority: number | null
    provider_category_ids: string[] | null
    provider_location_ids: string[] | null
    provider_rating: number | null
    provider_review_count: number | null
    provider_status: 'available' | 'busy' | 'away' | 'offline'
    provider_settings: Json | null
    last_active_at: string | null
    subscription_tier: string | null
    subscription_status: string | null
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
    role?: 'user' | 'provider' | 'admin'
    verification_status?: 'pending' | 'approved' | 'rejected' | 'expired'
    verification_documents?: Json | null
    birthdate?: string | null
    verified_at?: string | null
    // Provider specific fields
    featured_until?: string | null
    featured_priority?: number | null
    provider_category_ids?: string[] | null
    provider_location_ids?: string[] | null
    provider_rating?: number | null
    provider_review_count?: number | null
    provider_status?: 'available' | 'busy' | 'away' | 'offline'
    provider_settings?: Json | null
    last_active_at?: string | null
    subscription_tier?: string | null
    subscription_status?: string | null
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
    role?: 'user' | 'provider' | 'admin'
    verification_status?: 'pending' | 'approved' | 'rejected' | 'expired'
    verification_documents?: Json | null
    birthdate?: string | null
    verified_at?: string | null
    // Provider specific fields
    featured_until?: string | null
    featured_priority?: number | null
    provider_category_ids?: string[] | null
    provider_location_ids?: string[] | null
    provider_rating?: number | null
    provider_review_count?: number | null
    provider_status?: 'available' | 'busy' | 'away' | 'offline'
    provider_settings?: Json | null
    last_active_at?: string | null
    subscription_tier?: string | null
    subscription_status?: string | null
  }
  Relationships: [
    {
      foreignKeyName: "profiles_subscription_tier_fkey"
      columns: ["subscription_tier"]
      referencedRelation: "subscription_tiers"
      referencedColumns: ["id"]
    }
  ]
}

export interface VerificationRequestTable {
  Row: {
    id: string
    user_id: string
    status: string
    documents: Json | null
    submitted_at: string
    reviewed_at: string | null
    reviewer_notes: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    status?: string
    documents?: Json | null
    submitted_at?: string
    reviewed_at?: string | null
    reviewer_notes?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    status?: string
    documents?: Json | null
    submitted_at?: string
    reviewed_at?: string | null
    reviewer_notes?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "verification_requests_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}

export interface SubscriptionTable {
  Row: {
    id: string
    user_id: string
    tier: Database['public']['Enums']['subscription_tier']
    status: Database['public']['Enums']['subscription_status']
    current_period_end: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    user_id: string
    tier: Database['public']['Enums']['subscription_tier']
    status: Database['public']['Enums']['subscription_status']
    current_period_end: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    tier?: Database['public']['Enums']['subscription_tier']
    status?: Database['public']['Enums']['subscription_status']
    current_period_end?: string
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "subscriptions_user_id_fkey"
      columns: ["user_id"]
      referencedRelation: "users"
      referencedColumns: ["id"]
    }
  ]
}
