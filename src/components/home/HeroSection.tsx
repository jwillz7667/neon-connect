import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/assets/images/logo';

const HeroSection = () => {
  return (
    <div className="text-center py-16 mb-8">
      <div className="max-w-[800px] mx-auto mb-8">
        <Logo className="w-full h-auto hover:opacity-90 transition-opacity" />
      </div>
      <Link to="/membership">
        <Button variant="default" className="neon-text">
          Become a Provider
        </Button>
      </Link>
    </div>
  );
};

export default HeroSection;