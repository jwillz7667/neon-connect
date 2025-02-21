import { z } from 'zod';

export const profileFormSchema = z.object({
  username: z.string().min(3).max(50),
  full_name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatar_url: z.string().optional(),
  avatarFile: z.instanceof(File).optional(),
  height: z.string().max(20).optional(),
  body_type: z.string().max(50).optional(),
  age: z.number().min(18).max(100).optional(),
  ethnicity: z.string().max(50).optional(),
  hair_color: z.string().max(50).optional(),
  eye_color: z.string().max(50).optional(),
  measurements: z.string().max(50).optional(),
  languages: z.array(z.string()).default([]),
  availability: z.string().max(500).optional(),
  services: z.array(z.string()).default([]),
  rates: z.record(z.string(), z.number()).optional().default({}),
  contact_info: z.record(z.string(), z.string()).optional().default({}),
}); 