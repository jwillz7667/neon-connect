import { Json } from './base';

export interface CategoryTable {
  Row: {
    id: string
    name: string
    slug: string
    description: string | null
    icon_url: string | null
    parent_id: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    name: string
    slug: string
    description?: string | null
    icon_url?: string | null
    parent_id?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    name?: string
    slug?: string
    description?: string | null
    icon_url?: string | null
    parent_id?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "categories_parent_id_fkey"
      columns: ["parent_id"]
      referencedRelation: "categories"
      referencedColumns: ["id"]
    }
  ]
}

export interface LocationTable {
  Row: {
    id: string
    name: string
    type: 'city' | 'state' | 'country'
    parent_id: string | null
    latitude: number
    longitude: number
    timezone: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    name: string
    type: 'city' | 'state' | 'country'
    parent_id?: string | null
    latitude: number
    longitude: number
    timezone: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    name?: string
    type?: 'city' | 'state' | 'country'
    parent_id?: string | null
    latitude?: number
    longitude?: number
    timezone?: string
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "locations_parent_id_fkey"
      columns: ["parent_id"]
      referencedRelation: "locations"
      referencedColumns: ["id"]
    }
  ]
}

export interface SafetyReportTable {
  Row: {
    id: string
    reporter_id: string
    reported_user_id: string
    reason: string
    description: string
    evidence: Json | null
    status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
    admin_notes: string | null
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    reporter_id: string
    reported_user_id: string
    reason: string
    description: string
    evidence?: Json | null
    status?: 'pending' | 'investigating' | 'resolved' | 'dismissed'
    admin_notes?: string | null
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    reporter_id?: string
    reported_user_id?: string
    reason?: string
    description?: string
    evidence?: Json | null
    status?: 'pending' | 'investigating' | 'resolved' | 'dismissed'
    admin_notes?: string | null
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "safety_reports_reporter_id_fkey"
      columns: ["reporter_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "safety_reports_reported_user_id_fkey"
      columns: ["reported_user_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface ProviderServiceTable {
  Row: {
    id: string
    provider_id: string
    category_id: string
    name: string
    description: string
    duration: number
    price: number
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    provider_id: string
    category_id: string
    name: string
    description: string
    duration: number
    price: number
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    provider_id?: string
    category_id?: string
    name?: string
    description?: string
    duration?: number
    price?: number
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "provider_services_provider_id_fkey"
      columns: ["provider_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "provider_services_category_id_fkey"
      columns: ["category_id"]
      referencedRelation: "categories" 
      referencedColumns: ["id"]
    }
  ]
}

export interface ProviderAvailabilityTable {
  Row: {
    id: string
    provider_id: string
    day_of_week: number
    start_time: string
    end_time: string
    status: 'available' | 'busy' | 'away' | 'offline'
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    provider_id: string
    day_of_week: number
    start_time: string
    end_time: string
    status?: 'available' | 'busy' | 'away' | 'offline'
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    provider_id?: string
    day_of_week?: number
    start_time?: string
    end_time?: string
    status?: 'available' | 'busy' | 'away' | 'offline'
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "provider_availability_provider_id_fkey"
      columns: ["provider_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface ProviderReviewTable {
  Row: {
    id: string
    provider_id: string
    reviewer_id: string
    rating: number
    comment: string
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    provider_id: string
    reviewer_id: string
    rating: number
    comment: string
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    provider_id?: string
    reviewer_id?: string
    rating?: number
    comment?: string
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "provider_reviews_provider_id_fkey"
      columns: ["provider_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    },
    {
      foreignKeyName: "provider_reviews_reviewer_id_fkey"
      columns: ["reviewer_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
}

export interface FeaturedProfileTable {
  Row: {
    id: string
    profile_id: string
    start_date: string
    end_date: string
    priority: number
    created_at: string
    updated_at: string
  }
  Insert: {
    id?: string
    profile_id: string
    start_date: string
    end_date: string
    priority?: number
    created_at?: string
    updated_at?: string
  }
  Update: {
    id?: string
    profile_id?: string
    start_date?: string
    end_date?: string
    priority?: number
    created_at?: string
    updated_at?: string
  }
  Relationships: [
    {
      foreignKeyName: "featured_profiles_profile_id_fkey"
      columns: ["profile_id"]
      referencedRelation: "profiles"
      referencedColumns: ["id"]
    }
  ]
} 