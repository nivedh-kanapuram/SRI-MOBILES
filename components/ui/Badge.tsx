'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'electric' | 'success' | 'warning' | 'premium' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors';

    const variants = {
      default: 'bg-dark-700 text-dark-300',
      electric: 'bg-electric-500/20 text-electric-400 border border-electric-500/30',
      success: 'bg-green-500/20 text-green-400 border border-green-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      premium: 'bg-gradient-to-r from-electric-500 to-electric-600 text-white shadow-electric',
      outline: 'bg-transparent text-dark-300 border border-dark-600 hover:border-electric-500/50',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full',
              variant === 'electric' && 'bg-electric-500',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-amber-500',
              variant === 'premium' && 'bg-white',
              variant === 'default' && 'bg-dark-500',
              variant === 'outline' && 'bg-dark-500'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';