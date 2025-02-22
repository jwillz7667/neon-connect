import { cn } from '@/lib/utils';
import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'dark' | 'light';
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
    default: 'bg-neon-purple/95 text-white',
    dark: 'bg-neon-purple text-white',
    light: 'bg-neon-purple/90 text-white',
  };

  return (
    <div
      className={cn(
        // Base styles
        'rounded-lg backdrop-blur-[12px]',
        // Variant styles
        variants[variant],
        // Border styles
        neonBorder && 'border border-white/30',
        // Shadow and glow effects
        'shadow-xl shadow-black/10',
        neonBorder && 'glow-md glow-neon-purple/30',
        // Hover effects
        hoverable && 'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-neon-purple/40 hover:border-white/40',
        // Additional effects for depth
        'backdrop-saturate-200',
        // Custom classes
        className
      )}
      {...props}
    >
      <div className="relative z-10">
        {children}
      </div>
      {/* Additional subtle gradient overlay for depth */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </div>
  );
} 