import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/db-helpers';
import { ProfileGrid } from '@/components/profile/ProfileGrid';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

const FeaturedPage = () => {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ['featured-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'provider' as const)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data as Profile[];
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 neon-text">Featured Profiles</h1>
      <div className="max-w-6xl mx-auto">
        <ProfileGrid 
          profiles={profiles || []} 
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default FeaturedPage;
