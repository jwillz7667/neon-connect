
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
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading profiles...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-2">Error loading profiles</p>
        <p className="text-gray-400">Please try refreshing the page</p>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No profiles found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          name={profile.full_name || 'Anonymous'}
          age={profile.age || undefined}
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
