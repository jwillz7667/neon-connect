// Environment configuration
export const env = {
  NODE_ENV: import.meta.env.MODE || 'development',
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  VITE_STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL || 'http://localhost:3000',
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
  
  // Helper function to get environment variables
  get: (key: keyof typeof env) => env[key],
  
  // Helper function to check if we're in a specific environment
  is: (environment: 'development' | 'production' | 'test') => env.NODE_ENV === environment,
}; 