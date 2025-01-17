import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/home/HeroSection';
import ProfileTabs from '@/components/home/ProfileTabs';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Index = () => {
  const [selectedState, setSelectedState] = useState('all');

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['profiles', selectedState],
    queryFn: async () => {
      try {
        console.log('Fetching profiles for state:', selectedState);
        let query = supabase
          .from('profiles')
          .select('*');
        
        if (selectedState !== 'all') {
          query = query.eq('state', selectedState);
        }
        
        const { data, error } = await query.limit(20);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        console.log('Successfully fetched profiles:', data);
        return data as Profile[];
      } catch (err) {
        console.error('Error in query function:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000,
  });

  return (
    <div className="container mx-auto px-4">
      <section className="mb-16">
        <HeroSection />
        <ProfileTabs
          profiles={profiles}
          isLoading={isLoading}
          error={error}
          selectedState={selectedState}
          onStateChange={setSelectedState}
        />
      </section>
    </div>
  );
};

export default Index;