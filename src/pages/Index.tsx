import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from '@/components/home/HeroSection';
import ProfileTabs from '@/components/home/ProfileTabs';
import { Database } from '@/integrations/supabase/types';
import { useToast } from '@/components/ui/use-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Index = () => {
  const [selectedState, setSelectedState] = useState('all');
  const { toast } = useToast();

  const { data: profiles = [], isLoading, error } = useQuery({
    queryKey: ['profiles', selectedState],
    queryFn: async () => {
      try {
        console.log('Fetching profiles for state:', selectedState);
        console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        
        let query = supabase
          .from('profiles')
          .select('*');
        
        if (selectedState !== 'all') {
          query = query.eq('state', selectedState);
        }
        
        const { data, error } = await query.limit(20);
        
        if (error) {
          console.error('Supabase error:', error);
          console.error('Error details:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          toast({
            title: "Error loading profiles",
            description: error.message || "Please try again later.",
            variant: "destructive",
          });
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log('No profiles found');
          return [];
        }
        
        console.log(`Successfully fetched ${data.length} profiles`);
        return data as Profile[];
      } catch (err) {
        console.error('Error in query function:', err);
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        toast({
          title: "Error loading profiles",
          description: errorMessage,
          variant: "destructive",
        });
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
