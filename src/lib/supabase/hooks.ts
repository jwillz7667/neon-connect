import { useState, useEffect } from 'react';
import { supabaseClient, type Tables } from './client';
import type { Database } from '@/types/supabase';

// Generic hook for data fetching
export function useQuery<T extends keyof Database['public']['Tables']>(
  table: T,
  columns = '*',
  options?: {
    filter?: Record<string, any>;
    orderBy?: string;
    limit?: number;
  }
) {
  const [data, setData] = useState<Tables<T>[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let query = supabaseClient.from(table).select(columns);

        if (options?.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        if (options?.orderBy) {
          query = query.order(options.orderBy);
        }

        if (options?.limit) {
          query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [table, columns, JSON.stringify(options)]);

  return { data, error, loading };
}

// Hook for real-time subscriptions
export function useSubscription<T extends keyof Database['public']['Tables']>(
  table: T,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabaseClient.realtime.subscribe(table, callback);
    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback]);
}

// Hook for authentication state
export function useAuth() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    // Get initial session
    supabaseClient.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('An error occurred'));
        setLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    loading,
    error,
    signIn: supabaseClient.auth.signIn,
    signUp: supabaseClient.auth.signUp,
    signOut: supabaseClient.auth.signOut,
  };
}

// Hook for managing profile data
export function useProfile() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session?.user?.id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [session?.user?.id]);

  return { profile, loading, error };
}

// Hook for file uploads
export function useStorage(bucket: string) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const upload = async (path: string, file: File) => {
    try {
      setUploading(true);
      const result = await supabaseClient.storage.upload(bucket, path, file);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed'));
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const download = async (path: string) => {
    try {
      return await supabaseClient.storage.download(bucket, path);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Download failed'));
      throw err;
    }
  };

  const remove = async (paths: string[]) => {
    try {
      return await supabaseClient.storage.delete(bucket, paths);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Delete failed'));
      throw err;
    }
  };

  return {
    upload,
    download,
    remove,
    uploading,
    error,
  };
} 