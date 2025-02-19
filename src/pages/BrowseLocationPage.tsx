import React from 'react';
import USMap from '@/components/map/USMap';

const BrowseLocationPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 neon-text">
            Browse by State
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select a state to discover profiles in your area. Our network spans across all 50 states.
          </p>
        </div>
        <USMap />
      </div>
    </div>
  );
};

export default BrowseLocationPage; 