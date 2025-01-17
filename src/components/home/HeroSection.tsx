import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold mb-4 neon-text">Discover Amazing Profiles</h2>
      <p className="text-gray-300 mb-6">Browse our curated selection of profiles</p>
      <Link to="/membership">
        <Button variant="default" className="neon-text">
          Become a Provider
        </Button>
      </Link>
    </div>
  );
};

export default HeroSection;