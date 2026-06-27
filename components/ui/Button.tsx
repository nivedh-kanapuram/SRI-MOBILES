'use client';

import { forwardRef, ButtonHTMLAttributes, ReactElement, cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'electric' | 'glass';
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
      primary: 'bg-electric-500 text-white hover:bg-electric-600 shadow-electric hover:shadow-electric-hover',
      secondary: 'bg-dark-800 text-white hover:bg-dark-700 border border-dark-700',
      outline: 'border-2 border-electric-500 text-electric-500 hover:bg-electric-500/10',
      ghost: 'text-dark-300 hover:text-white hover:bg-dark-800',
      electric: 'bg-gradient-to-r from-electric-500 to-electric-600 text-white shadow-electric hover:shadow-electric-hover',
      glass: 'bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10',
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
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-electric-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-950',
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