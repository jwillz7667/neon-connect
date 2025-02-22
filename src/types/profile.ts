import { UseFormReturn } from "react-hook-form";
import { z } from 'zod';
import type { Database } from '@/integrations/supabase/types';

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Profile = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  birthdate: string;
  email: string;
  avatar_url: string;
  role: "user" | "provider" | "admin";
  verification_status: "pending" | "approved" | "rejected" | "expired";
  bio: string;
  city: string;
  contact_info: Json;
  age?: number;
  availability?: string;
  body_type?: string;
  ethnicity?: string;
  username?: string;
  website?: string;
};

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
