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
        objectFit: 'contain',
        filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.6))'
      }}
    />
  );
};

export const LogoImage = '/images/neon-logo.png'; 