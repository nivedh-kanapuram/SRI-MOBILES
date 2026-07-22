'use client';

import { forwardRef, ButtonHTMLAttributes, ReactElement, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sky' | 'gold' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  loading?: boolean;
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    asChild = false,
    disabled,
    children,
    ...props
  }, ref) => {
    const variants = {
      primary: 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200',
      outline: 'border-2 border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
      ghost: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
      sky: 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm',
      gold: 'bg-gradient-to-r from-gold to-gold-light text-white shadow-sm hover:shadow-md hover:brightness-105',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#1DA851] shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm gap-1.5',
      md: 'px-5 py-2.5 text-base gap-2',
      lg: 'px-7 py-3.5 text-lg gap-2.5',
      xl: 'px-10 py-4.5 text-xl gap-3',
      icon: 'p-2.5',
    };

    const classes = cn(
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
      'active:scale-[0.98]',
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      className
    );

    if (asChild && isValidElement(children)) {
      return cloneElement(children as ReactElement<Record<string, unknown>>, {
        className: cn(classes, (children.props as { className?: string }).className),
        ref,
        disabled: disabled || loading,
        ...props,
      });
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
        {!loading && children}
        <span className={cn(loading && 'sr-only')}>{loading ? 'Loading...' : ''}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
