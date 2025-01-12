import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Stats {
  height: string;
  bodyType: string;
  exercise: string;
}

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  location: string;
  city: string;
  state: string;
  created_at: string;
}

const fetchProfile = async (username: string): Promise<Profile> => {
  console.log('Fetching profile for username:', username);
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  if (!data) {
    throw new Error('Profile not found');
  }

  console.log('Fetched profile:', data);
  return data;
};

const ProfilePage = () => {
  const { id } = useParams();
  const decodedUsername = id ? decodeURIComponent(id) : '';

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

  // Default images if none are provided
  const images = [
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1518770660439-4636190af475"
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Image Carousel */}
      <div className="max-w-2xl mx-auto mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[3/4] relative">
                  <img
                    src={profile.avatar_url || image}
                    alt={`${profile.full_name || profile.username} photo ${index + 1}`}
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

      {/* Profile Info */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 neon-text">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-gray-400">
            {profile.city && profile.state 
              ? `${profile.city}, ${profile.state}`
              : profile.location || 'Location not specified'}
          </p>
        </div>

        {/* Stats */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 neon-text">Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Member Since</p>
              <p className="font-medium">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Profile Views</p>
              <p className="font-medium">0</p>
            </div>
            <div>
              <p className="text-gray-400">Status</p>
              <p className="font-medium">Active</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 neon-text">About Me</h2>
          <p className="text-gray-300 leading-relaxed">
            {profile.bio || 'No bio provided yet.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;