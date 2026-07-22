'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ProblemDescriptionProps {
  text: string;
  maxChars?: number;
  className?: string;
}

export default function ProblemDescription({ text, maxChars = 120, className = '' }: ProblemDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > maxChars;

  const displayText = shouldTruncate && !expanded ? text.slice(0, maxChars).trimEnd() + '...' : text;

  return (
    <div className={`bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4 ${className}`}>
      <p
        className="text-gray-600 text-[13px] sm:text-[15px] whitespace-pre-wrap break-words leading-relaxed"
        style={{ overflowWrap: 'anywhere' }}
      >
        {displayText}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-gold hover:text-amber-500 transition-colors"
        >
          {expanded ? (
            <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Read More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      )}
    </div>
  );
}
