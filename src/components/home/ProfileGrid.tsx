import React from 'react';
import ProfileCard from '../ProfileCard';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileGridProps {
  profiles: Profile[];
  isLoading: boolean;
  error: Error | null;
}

const ProfileGrid = ({ profiles, isLoading, error }: ProfileGridProps) => {
  if (isLoading) {
    return <div className="text-center">Loading profiles...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading profiles. Please try again later.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          name={profile.full_name || 'Anonymous'}
          age={28}
          location={`${profile.city || ''}, ${profile.state || ''}`}
          imageUrl={profile.avatar_url || '/placeholder.svg'}
          distance="2 miles"
          username={profile.username}
        />
      ))}
    </div>
  );
};

export default ProfileGrid;