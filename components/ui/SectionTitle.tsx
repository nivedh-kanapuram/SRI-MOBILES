'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  highlight?: string;
  description?: string;
  align?: 'left' | 'center';
}

export const SectionTitle = forwardRef<HTMLDivElement, SectionTitleProps>(
  ({ className, badge, title, highlight, description, align = 'center', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-8 sm:mb-12 md:mb-16',
          align === 'center' && 'text-center max-w-3xl mx-auto',
          align === 'left' && 'text-left max-w-2xl',
          className
        )}
        {...props}
      >
        {badge && (
          <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-electric-500 animate-pulse" />
            {badge}
          </span>
        )}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          {title}{' '}
          {highlight && (
            <span className="bg-gradient-to-r from-electric-400 to-electric-600 bg-clip-text text-transparent">
              {highlight}
            </span>
          )}
        </h2>
        {description && (
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-dark-400 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }
);

SectionTitle.displayName = 'SectionTitle';