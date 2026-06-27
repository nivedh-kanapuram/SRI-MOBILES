'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-dark-500 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
      <Link href="/" className="hover:text-electric-400 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-dark-600 flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-electric-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-dark-300">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
