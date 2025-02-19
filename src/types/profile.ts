import { UseFormReturn } from "react-hook-form";
import { z } from 'zod';

export const profilePhotoSchema = z.object({
  id: z.string(),
  url: z.string(),
  created_at: z.string(),
  profile_id: z.string(),
});

export type ProfilePhoto = z.infer<typeof profilePhotoSchema>;
export type ProfileFormData = z.infer<typeof profileFormSchema>;

export const profileFormSchema = z.object({
  username: z.string().min(3).max(50),
  fullName: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().optional(),
  avatarFile: z.any().optional(),
  height: z.string().max(50).optional(),
  bodyType: z.string().max(50).optional(),
  age: z.number().min(18).max(100).optional().nullable(),
  ethnicity: z.string().max(50).optional(),
  hairColor: z.string().max(50).optional(),
  eyeColor: z.string().max(50).optional(),
  measurements: z.string().max(50).optional(),
  languages: z.array(z.string()).default([]),
  availability: z.string().max(500).optional(),
  services: z.array(z.string()).default([]),
  rates: z.record(z.string(), z.number()).optional(),
  contactInfo: z.record(z.string(), z.string()).optional(),
  photos: z.array(profilePhotoSchema).max(10).default([]),
  photoFiles: z.array(z.any()).max(10).optional(),
});

export interface FormSectionProps {
  form: UseFormReturn<ProfileFormData>;
}
