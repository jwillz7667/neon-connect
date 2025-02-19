import { UseFormReturn } from "react-hook-form";
import { z } from 'zod';
import { profileFormSchema } from '@/lib/validations/profile';

export type ProfileFormData = z.infer<typeof profileFormSchema>;

export interface FormSectionProps {
  form: UseFormReturn<ProfileFormData>;
}
