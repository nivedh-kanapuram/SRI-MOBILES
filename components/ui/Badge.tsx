'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'success' | 'warning' | 'sky' | 'outline' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 font-medium rounded-full transition-colors';

    const variants: Record<string, string> = {
      default: 'bg-gray-100 text-gray-600',
      gold: 'bg-gold/10 text-gold border border-gold/20',
      success: 'bg-green-50 text-green-600 border border-green-200',
      warning: 'bg-amber-50 text-amber-600 border border-amber-200',
      sky: 'bg-sky-50 text-sky-600 border border-sky-200',
      outline: 'bg-transparent text-gray-500 border border-gray-200 hover:border-gray-300',
      premium: 'bg-gradient-to-r from-gold to-gold-light text-white',
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
              variant === 'gold' && 'bg-gold',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-amber-500',
              variant === 'sky' && 'bg-sky-500',
              variant === 'premium' && 'bg-white',
              variant === 'default' && 'bg-gray-400',
              variant === 'outline' && 'bg-gray-400'
            )}
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
