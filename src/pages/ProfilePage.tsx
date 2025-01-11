import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Stats {
  height: string;
  bodyType: string;
  exercise: string;
}

interface Profile {
  name: string;
  age: number;
  location: string;
  images: string[];
  stats: Stats;
  bio: string;
}

// This would typically come from an API, using static data for demo
const getProfileData = (id: string): Profile => {
  return {
    name: "Alex",
    age: 28,
    location: "New York, NY",
    images: [
      "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      "https://images.unsplash.com/photo-1518770660439-4636190af475"
    ],
    stats: {
      height: "5'10\"",
      bodyType: "Athletic",
      exercise: "5+ times a week"
    },
    bio: "Hey there! I'm passionate about fitness, technology, and exploring new places. Looking for someone who shares my enthusiasm for life and adventure. Let's grab a coffee and see where things go!"
  };
};

const ProfilePage = () => {
  const { id } = useParams();
  const profile = getProfileData(id || "");

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Image Carousel */}
      <div className="max-w-2xl mx-auto mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {profile.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[3/4] relative">
                  <img
                    src={image}
                    alt={`${profile.name} photo ${index + 1}`}
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
            {profile.name}, {profile.age}
          </h1>
          <p className="text-gray-400">{profile.location}</p>
        </div>

        {/* Stats */}
        <div className="glass-card p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4 neon-text">Stats</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400">Height</p>
              <p className="font-medium">{profile.stats.height}</p>
            </div>
            <div>
              <p className="text-gray-400">Body Type</p>
              <p className="font-medium">{profile.stats.bodyType}</p>
            </div>
            <div>
              <p className="text-gray-400">Exercise</p>
              <p className="font-medium">{profile.stats.exercise}</p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="glass-card p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 neon-text">About Me</h2>
          <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;