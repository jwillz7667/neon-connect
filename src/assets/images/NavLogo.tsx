import React from 'react';

export const NavLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="/images/neon-logo.png"
      alt="NeonMeet"
      className={className}
      width={50}
      height={50}
      style={{
        objectFit: 'contain'
      }}
    />
  );
}; 