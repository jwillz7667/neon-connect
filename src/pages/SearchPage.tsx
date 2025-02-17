
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles', searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .neq('role', 'admin');

      if (searchQuery) {
        query = query.or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Search by name, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button>
            <Search className="mr-2" />
            Search
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profiles?.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.full_name || profile.username}
                age={profile.age || 0}
                location={`${profile.city || ''}, ${profile.state || ''}`}
                imageUrl={profile.avatar_url || "https://images.unsplash.com/photo-1649972904349-6e44c42644a7"}
                distance="2.5 miles"
                username={profile.username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
