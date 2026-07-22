'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 overflow-x-auto whitespace-nowrap pb-1">
      <Link href="/" className="hover:text-sky-500 transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Home</span>
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-sky-500 transition-colors text-gray-500">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-600">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
