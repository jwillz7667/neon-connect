import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import type { ProfileTable } from '@/integrations/supabase/types/tables';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Profile = ProfileTable['Row'];
export type ProfileUpdate = ProfileTable['Update'];
export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'expired';
export type UserRole = 'user' | 'provider' | 'admin';
export type ProviderStatus = 'available' | 'busy' | 'away' | 'offline';

// Profile Helpers
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function searchProfiles(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .order('provider_rating', { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function getProfilesByLocation(state: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('state', state)
    .eq('role', 'provider')
    .order('provider_rating', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getFeaturedProfiles() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'provider')
    .gt('featured_until', now)
    .order('featured_priority', { ascending: false })
    .limit(10);

  if (error) throw error;
  return data;
}

// Verification Helpers
export async function submitVerification(
  userId: string,
  documents: Record<string, any>
) {
  const { data, error } = await supabase
    .from('verification_requests')
    .insert({
      user_id: userId,
      status: 'pending',
      documents,
      submitted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getVerificationStatus(userId: string) {
  const { data, error } = await supabase
    .from('verification_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

// Subscription Helpers
export async function getSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) throw error;
  return data;
}

// Storage Helpers
export function getAvatarUrl(path: string | null): string {
  if (!path) return '/default-avatar.jpg';
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);
    
  return data.publicUrl;
}

export async function uploadAvatar(
  userId: string,
  file: File
): Promise<{ path: string; url: string }> {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  await updateProfile(userId, { avatar_url: filePath });

  return {
    path: filePath,
    url: data.publicUrl
  };
}

// Real-time Subscription Helpers
export function subscribeToProfileChanges(
  userId: string,
  callback: (profile: Profile) => void
) {
  return supabase
    .channel('profile_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      },
      (payload) => callback(payload.new as Profile)
    )
    .subscribe();
}

export function subscribeToProviderStatus(
  providerId: string,
  callback: (status: ProviderStatus) => void
) {
  return supabase
    .channel('provider_status')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${providerId}`
      },
      (payload) => {
        const profile = payload.new as Profile;
        if (profile.provider_status) {
          callback(profile.provider_status as ProviderStatus);
        }
      }
    )
    .subscribe();
}
