import { z } from 'zod';

export const profileFormSchema = z.object({
  username: z.string().min(3).max(50),
  fullName: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().optional(),
  avatarFile: z.instanceof(File).optional(),
  height: z.string().max(20).optional(),
  bodyType: z.string().max(50).optional(),
  age: z.number().min(18).max(100).optional(),
  ethnicity: z.string().max(50).optional(),
  hairColor: z.string().max(50).optional(),
  eyeColor: z.string().max(50).optional(),
  measurements: z.string().max(50).optional(),
  languages: z.array(z.string()).default([]),
  availability: z.string().max(500).optional(),
  services: z.array(z.string()).default([]),
  rates: z.object({
    hourly: z.number().optional(),
    daily: z.number().optional(),
  }).optional().default({}),
  contactInfo: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    preferred: z.string().optional(),
  }).optional().default({}),
}); 