import React from 'react';

export const NavLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="/images/neon-logo-horizontal.png"
      alt="NeonMeet"
      className={className}
      width={240}
      height={40}
      style={{
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.6))'
      }}
    />
  );
}; 