import React from 'react';
import MembershipCard from './MembershipCard';

interface PricingSectionProps {
  onSubscribe: (tier: 'standard' | 'priority') => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onSubscribe }) => {
  const standardFeatures = [
    { text: 'Verified Profile' },
    { text: 'Age Verification' },
    { text: 'KYC Verification' },
  ];

  const priorityFeatures = [
    { text: 'All Standard Features' },
    { text: 'Priority Profile Visibility' },
    { text: 'Enhanced Search Results' },
    { text: 'Featured Profile Status' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Choose Your Membership Plan
      </h1>
      
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <MembershipCard
          title="Standard Membership"
          price={100}
          features={standardFeatures}
          tier="standard"
          onSubscribe={onSubscribe}
        />
        
        <MembershipCard
          title="Priority Membership"
          price={200}
          features={priorityFeatures}
          tier="priority"
          isPriority
          onSubscribe={onSubscribe}
        />
      </div>
    </div>
  );
};

export default PricingSection;