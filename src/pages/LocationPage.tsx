import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProfileGrid from '@/components/home/ProfileGrid';
import { states } from '@/lib/states';

const LocationPage = () => {
  const { stateCode } = useParams<{ stateCode: string }>();
  const stateName = states[stateCode?.toUpperCase() as keyof typeof states] || '';

  const { data: profiles, isLoading, error } = useQuery({
    queryKey: ['profiles', stateCode],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('state', stateCode?.toUpperCase())
        .eq('role', 'provider')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8 neon-text">
        Profiles in {stateName}
      </h1>
      <div className="max-w-6xl mx-auto">
        <ProfileGrid 
          profiles={profiles || []} 
          isLoading={isLoading} 
          error={error as Error | null} 
        />
      </div>
    </div>
  );
};

export default LocationPage; 