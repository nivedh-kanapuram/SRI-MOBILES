'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, Loader2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

export function TrackRepairSection() {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(false);

  const [hasIntersected, setHasIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const getAnimatedClass = () => {
    return cn(
      'transition-all duration-[600ms] ease-out transform md:opacity-100 md:translate-y-0',
      hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]'
    );
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const val = searchValue.trim();
    if (!val) return;
    setLoading(true);
    const isBookingId = /^SM\d{4}-\d{4}$/i.test(val);
    if (isBookingId) {
      router.push(`/track?bookingId=${encodeURIComponent(val)}`);
    } else {
      router.push(`/track?phone=${encodeURIComponent(val)}`);
    }
  };

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-gray-50 overflow-hidden">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <p 
            className={cn(
              "text-gold text-xs sm:text-sm uppercase tracking-[0.15em] font-medium mb-3",
              getAnimatedClass()
            )}
            style={{ transitionDelay: '0ms' }}
          >
            Track Your Repair
          </p>
          <h2 
            className={cn(
              "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3",
              getAnimatedClass()
            )}
            style={{ transitionDelay: '100ms' }}
          >
            Track Your Repair
          </h2>
          <p 
            className={cn(
              "text-gray-500 text-[15px] sm:text-base mb-6",
              getAnimatedClass()
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Enter your Booking ID or the Phone Number used during booking to check the latest repair status.
          </p>

          <form onSubmit={handleTrack} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div 
                className={cn("flex-1", getAnimatedClass())}
                style={{ transitionDelay: '300ms' }}
              >
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter Booking ID or Phone Number"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchValue.trim()}
                className={cn(
                  "flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gold text-white font-semibold text-[15px] hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-gold/20",
                  getAnimatedClass()
                )}
                style={{ transitionDelay: '400ms' }}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Track Repair
              </button>
            </div>
          </form>

          <div 
            className={getAnimatedClass()}
            style={{ transitionDelay: '500ms' }}
          >
            <p className="mt-3 text-xs text-gray-400">
              Track using Booking ID or Phone Number.
            </p>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
                Real-time status
              </span>
              <span className="flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5 text-gold" />
                Instant updates
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>e.g. SM2026-0045</span>
              <span className="text-gray-300">|</span>
              <span>9876543210</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
