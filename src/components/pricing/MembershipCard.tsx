import React from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface MembershipFeature {
  text: string;
}

interface MembershipCardProps {
  title: string;
  price: number;
  features: MembershipFeature[];
  tier: 'standard' | 'priority';
  isPriority?: boolean;
  onSubscribe: (tier: 'standard' | 'priority') => void;
}

const MembershipCard: React.FC<MembershipCardProps> = ({
  title,
  price,
  features,
  tier,
  isPriority = false,
  onSubscribe,
}) => {
  const handleClick = () => {
    console.log('MembershipCard: handleClick called for tier:', tier);
    onSubscribe(tier);
  };

  return (
    <Card className={`p-6 flex flex-col ${isPriority ? 'border-2 border-primary' : ''}`}>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <p className="text-3xl font-bold mb-4">${price}<span className="text-lg font-normal">/week</span></p>
      <ul className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2">✓</span>
            {feature.text}
          </li>
        ))}
      </ul>
      <Button 
        className="w-full mt-auto"
        onClick={handleClick}
      >
        Subscribe Now
      </Button>
    </Card>
  );
};

export default MembershipCard;