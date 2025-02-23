import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to check if we're in development mode using local Supabase
export const isLocalDev = () => {
  return import.meta.env.DEV && import.meta.env.SUPABASE_LOCAL_URL;
};

// Get the appropriate Supabase URL based on environment
export const getSupabaseUrl = () => {
  return isLocalDev() ? import.meta.env.SUPABASE_LOCAL_URL : import.meta.env.VITE_SUPABASE_URL;
};

// Get the appropriate Supabase anon key based on environment
export const getSupabaseAnonKey = () => {
  return isLocalDev() ? import.meta.env.SUPABASE_LOCAL_ANON_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY;
}; 