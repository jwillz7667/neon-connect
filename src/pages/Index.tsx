import React from 'react';
import ProfileCard from '../components/ProfileCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  // Sample data for profile cards
  const profiles = [
    {
      name: "Sarah",
      age: 28,
      location: "New York",
      imageUrl: "/placeholder.svg",
      distance: "2 miles"
    },
    {
      name: "Michael",
      age: 32,
      location: "Los Angeles",
      imageUrl: "/placeholder.svg",
      distance: "5 miles"
    },
    {
      name: "Emma",
      age: 26,
      location: "Chicago",
      imageUrl: "/placeholder.svg",
      distance: "3 miles"
    },
    {
      name: "James",
      age: 30,
      location: "Miami",
      imageUrl: "/placeholder.svg",
      distance: "1 mile"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8 neon-text">Discover New Connections</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((profile, index) => (
            <ProfileCard
              key={index}
              name={profile.name}
              age={profile.age}
              location={profile.location}
              imageUrl={profile.imageUrl}
              distance={profile.distance}
            />
          ))}
        </div>
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