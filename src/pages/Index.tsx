import React, { useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LocationSelector from '../components/LocationSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
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
          .select('id, full_name, city, state, avatar_url');
        
        if (selectedState !== 'all') {
          query = query.eq('state', selectedState);
        }
        
        const { data, error } = await query.limit(20);
        
        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }
        
        if (!data) {
          console.log('No profiles found');
          return [];
        }
        
        console.log('Successfully fetched profiles:', data);
        return data as Profile[];
      } catch (err) {
        console.error('Error in query function:', err);
        throw err;
      }
    },
    retry: 1,
    staleTime: 30000, // Cache data for 30 seconds
  });

  if (error) {
    console.error('Query error:', error);
  }

  return (
    <div className="container mx-auto px-4">
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 neon-text">Discover New Connections</h2>
        
        <Tabs defaultValue="location" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="all">All Profiles</TabsTrigger>
            <TabsTrigger value="location">By Location</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center">Loading profiles...</div>
            ) : error ? (
              <div className="text-center text-red-500">Error loading profiles. Please try again later.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    name={profile.full_name || 'Anonymous'}
                    age={28}
                    location={`${profile.city || ''}, ${profile.state || ''}`}
                    imageUrl={profile.avatar_url || '/placeholder.svg'}
                    distance="2 miles"
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="location">
            <LocationSelector
              selectedState={selectedState}
              onStateChange={setSelectedState}
            />
            {isLoading ? (
              <div className="text-center">Loading profiles...</div>
            ) : error ? (
              <div className="text-center text-red-500">Error loading profiles. Please try again later.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    name={profile.full_name || 'Anonymous'}
                    age={28}
                    location={`${profile.city || ''}, ${profile.state || ''}`}
                    imageUrl={profile.avatar_url || '/placeholder.svg'}
                    distance="2 miles"
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <Link to="/membership">
            <Button className="neon-text">View Membership Plans</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;