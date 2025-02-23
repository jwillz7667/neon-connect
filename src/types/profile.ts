import { UseFormReturn } from "react-hook-form";
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type UserRole = 'user' | 'provider' | 'admin';
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type BodyType = 'petite' | 'athletic' | 'curvy' | 'busty' | 'bbw';
export type Ethnicity = 'asian' | 'black' | 'caucasian' | 'hispanic' | 'indian' | 'middle-eastern' | 'mixed' | 'other';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  website: string | null;
  role: UserRole;
  verification_status: VerificationStatus;
  
  // Category-related fields
  is_vip: boolean;
  is_xxx_star: boolean;
  is_visiting: boolean;
  is_available: boolean;
  body_type: BodyType | null;
  has_video: boolean;
  ethnicity: Ethnicity | null;
  age: number | null;
  provider_rating: number | null;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

type DbProfile = Database['public']['Tables']['profiles']['Row'];
type DbProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const profilePhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  created_at: z.string(),
  profile_id: z.string(),
});

export type ProfilePhoto = z.infer<typeof profilePhotoSchema>;

export const profileFormSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  birthdate: z.string().optional(),
  email: z.string().email().optional(),
  avatar_url: z.string().url().optional(),
  role: z.enum(['user', 'provider', 'admin']).default('user'),
  verification_status: z.enum(['pending', 'approved', 'rejected', 'expired']).default('pending'),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  contact_info: z.record(z.string(), z.string()).optional(),
});

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface FormSectionProps {
  form: UseFormReturn<ProfileFormData>;
}
