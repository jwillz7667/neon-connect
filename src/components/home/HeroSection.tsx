import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Logo } from '@/assets/images/logo';
import { MapPin } from 'lucide-react';

interface HeroSectionProps {
  verifiedCount?: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ verifiedCount = 0 }) => {
  return (
    <div className="text-center py-16 mb-8">
      <div className="max-w-[800px] mx-auto mb-8">
        <Logo className="w-full h-auto hover:opacity-90 transition-opacity" />
      </div>
      {verifiedCount > 0 && (
        <p className="text-lg mb-6 neon-text">
          Join our community of {verifiedCount} verified providers
        </p>
      )}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/locations">
          <Button variant="default" size="lg" className="neon-text">
            <MapPin className="mr-2 h-5 w-5" />
            Browse by Location
          </Button>
        </Link>
        <Link to="/membership">
          <Button variant="outline" size="lg" className="neon-text">
            Become a Provider
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;