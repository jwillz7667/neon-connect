import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <img
      src="/images/neon-logo.png"
      alt="NeonMeet"
      className={className}
      width={640}
      height={200}
      style={{
        objectFit: 'contain'
      }}
    />
  );
};

export const LogoImage = '/images/neon-logo.png'; 