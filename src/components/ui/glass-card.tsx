import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'light' | 'auth';
  neonBorder?: boolean;
  hoverable?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  neonBorder = true,
  hoverable = false,
  ...props
}: GlassCardProps) {
  const variants = {
    default: 'bg-black text-white',
    dark: 'bg-black text-white',
    light: 'bg-black/90 text-white',
    auth: 'bg-black auth-form'
  };

  const getBorderStyles = (variant: string) => {
    if (variant === 'auth') {
      return 'border-2 border-[#FF00FF]';
    }
    return neonBorder ? 'border-2 border-[#FF00FF]/50' : '';
  };

  const getGlowStyles = (variant: string) => {
    if (variant === 'auth') {
      return '';  // Glow is handled by auth-form class
    }
    return neonBorder ? 'shadow-xl shadow-[#FF00FF]/30' : 'shadow-xl';
  };

  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg backdrop-blur-[12px]',
        // Variant styles
        variants[variant],
        // Border and glow effects
        getBorderStyles(variant),
        getGlowStyles(variant),
        // Hover effects
        hoverable && variant !== 'auth' && 'transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF00FF]/50 hover:border-[#FF00FF]/70',
        // Additional effects for depth
        'backdrop-saturate-200',
        // Custom classes
        className
      )}
      style={{
        boxShadow: variant === 'auth' ? '0 4px 30px rgba(255, 0, 255, 0.3)' : undefined
      }}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      {variant !== 'auth' && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      )}
    </div>
  );
} 