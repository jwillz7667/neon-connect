import React from 'react';

export const NavLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="/images/neon-logo.png"
      alt="NeonMeet"
      className={className}
      width={75}
      height={75}
      style={{
        objectFit: 'contain'
      }}
    />
  );
}; 