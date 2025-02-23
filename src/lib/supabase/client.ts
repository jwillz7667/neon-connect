import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/environment';
import type { 
  Database,
  DatabaseResponse,
  AuthResponse,
  StorageResponse,
  RealtimePayload,
  SupabaseErrorType,
  ErrorDetails
} from './types';

// Configuration constants
const RETRY_COUNT = 3;
const RETRY_DELAY = 1000; // 1 second
const CONNECTION_TIMEOUT = 30000; // 30 seconds

// Error types
export class SupabaseError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown,
    public hint?: string,
    public originalError?: SupabaseErrorType
  ) {
    super(message);
    this.name = 'SupabaseError';
  }

  toJSON(): ErrorDetails {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      hint: this.hint
    };
  }
}

// Retry logic
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const withRetry = async <T>(
  operation: () => Promise<T>,
  retries = RETRY_COUNT,
  delay = RETRY_DELAY
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      if (error instanceof Error) {
        throw new SupabaseError(
          error.message,
          'RETRY_EXHAUSTED',
          { attempts: RETRY_COUNT },
          'Maximum retry attempts reached',
          error as SupabaseErrorType
        );
      }
      throw error;
    }
    await wait(delay);
    return withRetry(operation, retries - 1, delay * 2);
  }
};

// Validate environment variables
if (!env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY) {
  throw new SupabaseError(
    'Missing Supabase environment variables',
    'CONFIG_ERROR',
    { requiredVars: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] },
    'Please check your environment configuration'
  );
}

// Create Supabase client with configuration
export const supabase = createClient<Database>(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
    },
    global: {
      headers: { 'x-application-name': 'neon-connect' },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Wrapped client with retry logic and error handling
export const supabaseClient = {
  // Auth operations
  auth: {
    signIn: async (email: string, password: string): Promise<AuthResponse> => 
      withRetry(async () => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        return { data: data || null, error };
      }),
    signUp: async (email: string, password: string): Promise<AuthResponse> =>
      withRetry(async () => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        return { data: data || null, error };
      }),
    signOut: async (): Promise<AuthResponse<void>> => 
      withRetry(async () => {
        const { error } = await supabase.auth.signOut();
        return { data: null, error };
      }),
    getSession: async (): Promise<AuthResponse> =>
      withRetry(async () => {
        const { data, error } = await supabase.auth.getSession();
        return { data: data || null, error };
      }),
  },

  // Database operations
  from: <T extends keyof Database['public']['Tables']>(table: T) => ({
    select: async (columns = '*'): Promise<DatabaseResponse<Database['public']['Tables'][T]['Row'][]>> =>
      withRetry(async () => {
        const { data, error } = await supabase
          .from(table)
          .select(columns);
        if (error) {
          throw new SupabaseError(
            error.message,
            'DATABASE_ERROR',
            { table, columns },
            'Error executing select query',
            error
          );
        }
        return { data: (data as unknown) as Database['public']['Tables'][T]['Row'][], error: null };
      }),
    insert: async (data: Database['public']['Tables'][T]['Insert']): Promise<DatabaseResponse<Database['public']['Tables'][T]['Row'][]>> =>
      withRetry(async () => {
        const { data: result, error } = await supabase
          .from(table)
          .insert((data as unknown) as any);
        if (error) {
          throw new SupabaseError(
            error.message,
            'DATABASE_ERROR',
            { table, operation: 'insert' },
            'Error executing insert operation',
            error
          );
        }
        return { data: (result as unknown) as Database['public']['Tables'][T]['Row'][], error: null };
      }),
    update: async (data: Database['public']['Tables'][T]['Update']): Promise<DatabaseResponse<Database['public']['Tables'][T]['Row'][]>> =>
      withRetry(async () => {
        const { data: result, error } = await supabase
          .from(table)
          .update((data as unknown) as any);
        if (error) {
          throw new SupabaseError(
            error.message,
            'DATABASE_ERROR',
            { table, operation: 'update' },
            'Error executing update operation',
            error
          );
        }
        return { data: (result as unknown) as Database['public']['Tables'][T]['Row'][], error: null };
      }),
    delete: async (): Promise<DatabaseResponse<Database['public']['Tables'][T]['Row'][]>> =>
      withRetry(async () => {
        const { data: result, error } = await supabase
          .from(table)
          .delete();
        if (error) {
          throw new SupabaseError(
            error.message,
            'DATABASE_ERROR',
            { table, operation: 'delete' },
            'Error executing delete operation',
            error
          );
        }
        return { data: result as Database['public']['Tables'][T]['Row'][], error: null };
      }),
  }),

  // Storage operations
  storage: {
    upload: async (bucket: string, path: string, file: File): Promise<StorageResponse> =>
      withRetry(async () => {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file);
        if (error) {
          throw new SupabaseError(
            error.message,
            'STORAGE_ERROR',
            { bucket, path },
            'Error uploading file',
            error
          );
        }
        return { data, error: null };
      }),
    download: async (bucket: string, path: string): Promise<StorageResponse<Blob>> =>
      withRetry(async () => {
        const { data, error } = await supabase.storage.from(bucket).download(path);
        if (error) {
          throw new SupabaseError(
            error.message,
            'STORAGE_ERROR',
            { bucket, path },
            'Error downloading file',
            error
          );
        }
        return { data, error: null };
      }),
    delete: async (bucket: string, paths: string[]): Promise<StorageResponse> =>
      withRetry(async () => {
        const { data, error } = await supabase.storage.from(bucket).remove(paths);
        if (error) {
          throw new SupabaseError(
            error.message,
            'STORAGE_ERROR',
            { bucket, paths },
            'Error deleting files',
            error
          );
        }
        return { data, error: null };
      }),
  },

  // Realtime subscriptions
  realtime: {
    subscribe: <T extends keyof Database['public']['Tables']>(
      table: T,
      callback: (payload: RealtimePayload<Database['public']['Tables'][T]['Row']>) => void
    ) => {
      const channel = supabase.channel(`${String(table)}_channel`);
      return channel
        .on(
          'postgres_changes' as const,
          { event: '*', schema: 'public', table },
          callback as any
        )
        .subscribe();
    },
  },
};

// Export singleton instance getter
export const getSupabase = () => supabaseClient; 