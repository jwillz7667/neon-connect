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

  const handleSubscribe = (tier: 'standard' | 'priority') => {
    console.log('PricingSection: handleSubscribe called with tier:', tier);
    onSubscribe(tier);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 mt-8">
        <MembershipCard
          title="Standard Membership"
          price={100}
          features={standardFeatures}
          tier="standard"
          onSubscribe={() => handleSubscribe('standard')}
        />
        
        <MembershipCard
          title="Priority Membership"
          price={200}
          features={priorityFeatures}
          tier="priority"
          isPriority
          onSubscribe={() => handleSubscribe('priority')}
        />
      </div>
    </div>
  );
};

export default PricingSection;