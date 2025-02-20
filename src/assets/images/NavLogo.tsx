import React from 'react';

export const NavLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="/images/neon-logo.png"
      alt="NeonMeet"
      className={className}
      width={100}
      height={100}
      style={{
        objectFit: 'contain'
      }}
    />
  );
}; 