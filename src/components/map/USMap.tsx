import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { states } from '@/lib/states';

const USMap = () => {
  const navigate = useNavigate();
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const handleStateClick = (stateCode: string) => {
    navigate(`/category?state=${stateCode}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(states).map(([code, name]) => (
          <button
            key={code}
            onClick={() => handleStateClick(code)}
            onMouseEnter={() => setHoveredState(code)}
            onMouseLeave={() => setHoveredState(null)}
            className={cn(
              "p-4 rounded-lg transition-all duration-200 glass-card",
              "hover:bg-primary/20 hover:text-primary hover:scale-105",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              hoveredState === code && "bg-primary/20 text-primary scale-105"
            )}
          >
            <div className="flex flex-col items-start">
              <span className="text-lg font-semibold">{name}</span>
              <span className="text-sm text-gray-400">{code}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default USMap; 