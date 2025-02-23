/**
 * Generated Types for Supabase Database Schema
 * These types represent the structure of our database tables and their relationships
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type Jsonb = Json;

// Audit fields interface
export interface AuditFields {
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          birthdate: string | null;
          email: string | null;
          avatar_url: string | null;
          role: UserRole;
          verification_status: VerificationStatus;
          bio: string | null;
          city: string | null;
          state: string | null;
          contact_info: Jsonb | null;
          provider_since: string | null;
          services: string[] | null;
          rates: Jsonb | null;
          availability: string | null;
          languages: string[] | null;
        } & AuditFields;
        Insert: Omit<Tables['profiles']['Row'], 'id' | keyof AuditFields> & {
          id?: string;
        };
        Update: Partial<Omit<Tables['profiles']['Insert'], 'id'>>;
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "profiles_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_urls: string[] | null;
        } & AuditFields;
        Insert: Omit<Tables['posts']['Row'], 'id' | keyof AuditFields> & {
          id?: string;
        };
        Update: Partial<Omit<Tables['posts']['Insert'], 'id'>>;
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "posts_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: SubscriptionTier;
          status: SubscriptionStatus;
          current_period_start: string;
          current_period_end: string;
          cancel_at: string | null;
          canceled_at: string | null;
        } & AuditFields;
        Insert: Omit<Tables['subscriptions']['Row'], 'id' | keyof AuditFields> & {
          id?: string;
        };
        Update: Partial<Omit<Tables['subscriptions']['Insert'], 'id'>>;
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "subscriptions_updated_by_fkey";
            columns: ["updated_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      verification_status: VerificationStatus;
      subscription_tier: SubscriptionTier;
      subscription_status: SubscriptionStatus;
    };
  };
}

// Strongly typed enums
export type UserRole = 'user' | 'provider' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'professional';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'incomplete' | 'incomplete_expired';

// Helper type to access table types
export type Tables = Database['public']['Tables'];

// Helper types for table operations
export type TableRow<T extends keyof Tables> = Tables[T]['Row'];
export type TableInsert<T extends keyof Tables> = Tables[T]['Insert'];
export type TableUpdate<T extends keyof Tables> = Tables[T]['Update'];
export type TableRelationships<T extends keyof Tables> = Tables[T]['Relationships'];

// Helper type for database response
export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Type guard for checking if a value is a valid JSON object
export const isJsonObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// Type guard for checking if a value matches a specific table row type
export function isTableRow<T extends keyof Tables>(
  table: T,
  value: unknown
): value is TableRow<T> {
  if (!isJsonObject(value)) return false;
  
  const requiredFields: (keyof AuditFields)[] = [
    'created_at',
    'updated_at',
    'created_by',
    'updated_by'
  ];
  
  return requiredFields.every(field => field in value);
} 