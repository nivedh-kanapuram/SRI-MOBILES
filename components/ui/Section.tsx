'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'alt' | 'dark' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padding = 'xl', id, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white',
      alt: 'bg-gray-50',
      dark: 'bg-gray-900',
      gradient: 'bg-gradient-to-b from-white via-gray-50 to-white',
    };

    const paddings = {
      none: '',
      sm: 'py-8 md:py-12',
      md: 'py-12 md:py-16',
      lg: 'py-16 md:py-24',
      xl: 'py-20 md:py-32 lg:py-40',
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn('w-full', variants[variant], paddings[padding], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';
