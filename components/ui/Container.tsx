'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'md', children, ...props }, ref) => {
    const sizes = {
      sm: 'max-w-3xl',
      md: 'max-w-5xl',
      lg: 'max-w-7xl',
      xl: 'max-w-[1400px]',
      full: 'max-w-full',
    };

    const paddings = {
      none: '',
      sm: 'px-4',
      md: 'px-6 md:px-8',
      lg: 'px-6 md:px-12 lg:px-16',
    };

    return (
      <div
        ref={ref}
        className={cn('mx-auto w-full', sizes[size], paddings[padding], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';