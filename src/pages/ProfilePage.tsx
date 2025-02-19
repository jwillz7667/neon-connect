import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Pencil } from 'lucide-react';
import type { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfilePhotoRow = Database['public']['Tables']['profile_photos']['Row'];

interface ProfileWithPhotos extends Profile {
  profile_photos: ProfilePhotoRow[];
}

const fetchProfile = async (username: string): Promise<ProfileWithPhotos | null> => {
  console.log('Fetching profile for username:', username);
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_photos (*)
    `)
    .ilike('username', username)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data;
};

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const decodedUsername = username ? decodeURIComponent(username) : '';

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      return data;
    },
  });

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', decodedUsername],
    queryFn: () => fetchProfile(decodedUsername),
    enabled: !!decodedUsername,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center text-red-500">Error loading profile. Please try again later.</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center">Profile not found</div>
      </div>
    );
  }

  const getImageUrl = (avatarUrl: string | null) => {
    if (!avatarUrl) return '/default-avatar.jpg';
    if (avatarUrl.startsWith('http')) return avatarUrl;
    return supabase.storage
      .from('avatars')
      .getPublicUrl(avatarUrl)
      .data.publicUrl;
  };

  const isOwnProfile = currentUser?.username === profile.username;

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-2xl mx-auto mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {profile.avatar_url ? (
              <CarouselItem>
                <div className="aspect-[3/4] relative">
                  <img
                    src={getImageUrl(profile.avatar_url)}
                    alt={`${profile.full_name || profile.username}'s profile`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ) : null}
            {profile.profile_photos?.map((photo) => (
              <CarouselItem key={photo.id}>
                <div className="aspect-[3/4] relative">
                  <img
                    src={photo.url}
                    alt={`${profile.full_name || profile.username}'s gallery photo`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2 neon-text">
              {profile.full_name || profile.username}
            </h1>
            <p className="text-gray-400">
              {profile.city && profile.state 
                ? `${profile.city}, ${profile.state}`
                : 'Location not specified'}
            </p>
            {profile.age && (
              <p className="text-gray-400">Age: {profile.age}</p>
            )}
          </div>
          {isOwnProfile && (
            <Button
              onClick={() => navigate(`/profile/edit`)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 neon-border"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="glass-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 neon-text">Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Height</p>
              <p className="font-medium">{profile.height || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Body Type</p>
              <p className="font-medium">{profile.body_type || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Ethnicity</p>
              <p className="font-medium">{profile.ethnicity || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Hair Color</p>
              <p className="font-medium">{profile.hair_color || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Eye Color</p>
              <p className="font-medium">{profile.eye_color || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Measurements</p>
              <p className="font-medium">{profile.measurements || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 neon-text">Languages & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Languages</h3>
              {profile.languages && profile.languages.length > 0 ? (
                <ul className="list-disc list-inside">
                  {profile.languages.map((lang, index) => (
                    <li key={index} className="text-gray-300">{lang}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No languages specified</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Services</h3>
              {profile.services && profile.services.length > 0 ? (
                <ul className="list-disc list-inside">
                  {profile.services.map((service, index) => (
                    <li key={index} className="text-gray-300">{service}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No services specified</p>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 neon-text">Rates & Availability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.rates && Object.keys(profile.rates).length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Rates</h3>
                <div className="space-y-2">
                  {Object.entries(profile.rates).map(([duration, rate]) => (
                    <p key={duration} className="text-gray-300">
                      {duration.charAt(0).toUpperCase() + duration.slice(1)}: ${rate}
                    </p>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium mb-2">Availability</h3>
              <p className="text-gray-300">{profile.availability || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
