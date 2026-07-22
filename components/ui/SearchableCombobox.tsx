'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';

interface SearchableComboboxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  required?: boolean;
}

export default function SearchableCombobox({ options, value, onChange, placeholder, label, required }: SearchableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() =>
    options.filter(o => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  const selectOption = useCallback((option: string) => {
    onChange(option);
    setSearch(option);
    setOpen(false);
    setHighlightedIndex(-1);
  }, [onChange]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node) &&
          listRef.current && !listRef.current.contains(e.target as Node)) {
        setOpen(false);
        if (!value) setSearch('');
        else setSearch(value);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, value]);

  useEffect(() => {
    if (!value) setSearch('');
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      e.preventDefault();
      selectOption(filtered[highlightedIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      if (!value) setSearch('');
      else setSearch(value);
    }
  };

  return (
    <div className="relative">
      <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          required={required}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); setHighlightedIndex(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || 'Search issues...'}
          className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all pr-10"
          autoComplete="off"
        />
        <ChevronDown className={`absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && filtered.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {filtered.map((option, i) => (
            <button
              key={option}
              type="button"
              onClick={() => selectOption(option)}
              onMouseEnter={() => setHighlightedIndex(i)}
              className={`w-full text-left px-4 py-2.5 text-[15px] transition-colors ${
                i === highlightedIndex ? 'bg-sky-50 text-sky-700' : 'text-gray-700 hover:bg-gray-50'
              } ${option === value && option !== 'Other' ? 'font-medium text-sky-600' : ''}`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
      {open && filtered.length === 0 && search && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-sm text-gray-400">
          No matching issues found
        </div>
      )}
    </div>
  );
}
