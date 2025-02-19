import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  distance: string;
  username?: string;
}

const ProfileCard = ({ name, age, location, imageUrl, distance, username }: ProfileCardProps) => {
  const profilePath = username ? `/profile/${encodeURIComponent(username)}` : `/profile/${encodeURIComponent(name.toLowerCase())}`;
  
  const getImageUrl = (url: string) => {
    if (!url) return '/default-avatar.jpg';
    if (url.startsWith('http')) return url;
    return supabase.storage
      .from('avatars')
      .getPublicUrl(url)
      .data.publicUrl;
  };

  return (
    <Link to={profilePath} className="block">
      <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 group w-full max-w-[200px] mx-auto">
        <div className="relative aspect-[3/4]">
          <img
            src={getImageUrl(imageUrl)}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.jpg';
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <h3 className="text-base font-semibold neon-text">{name}{age ? `, ${age}` : ''}</h3>
            <p className="text-xs text-gray-300">{location}</p>
            <p className="text-xs text-gray-400">{distance} away</p>
          </div>
          <button 
            className="absolute top-2 right-2 p-1.5 rounded-full glass-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:animate-glow"
            onClick={(e) => {
              e.preventDefault();
              console.log('Liked profile:', name);
            }}
          >
            <Heart className="w-4 h-4 text-primary" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProfileCard;