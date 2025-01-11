import React from 'react';
import { Heart } from 'lucide-react';

interface ProfileCardProps {
  name: string;
  age: number;
  location: string;
  imageUrl: string;
  distance: string;
}

const ProfileCard = ({ name, age, location, imageUrl, distance }: ProfileCardProps) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 group">
      <div className="relative aspect-[3/4]">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-xl font-semibold neon-text">{name}, {age}</h3>
          <p className="text-sm text-gray-300">{location}</p>
          <p className="text-xs text-gray-400">{distance} away</p>
        </div>
        <button className="absolute top-4 right-4 p-2 rounded-full glass-card opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:animate-glow">
          <Heart className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;