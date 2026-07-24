'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Copy, Search, RotateCcw, Smartphone, Camera, Home } from 'lucide-react';
import CopyButton from '@/components/ui/CopyButton';

interface BookingSuccessProps {
  trackingId: string;
  serviceType: string;
  onReset: () => void;
}

const CONFETTI_COLORS = ['#D4AF37', '#FBBF24', '#FDE68A', '#FFFFFF', '#F8FAFC', '#E8C84A'];

export default function BookingSuccess({ trackingId, serviceType, onReset }: BookingSuccessProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    delay: `${Math.random() * 0.4}s`,
    duration: `${1.8 + Math.random() * 1.2}s`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: `${4 + Math.random() * 6}px`,
    rotation: `${Math.random() * 360}deg`,
    shape: Math.random() > 0.5 ? 'circle' : 'square',
  }));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 relative overflow-hidden">
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute animate-confetti"
              style={{
                left: p.left,
                top: '-10px',
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === 'circle' ? '50%' : '1px',
                transform: `rotate(${p.rotation})`,
                animationDelay: p.delay,
                animationDuration: p.duration,
                opacity: 0.9,
              }}
            />
          ))}
        </div>
      )}

      <div className="text-center max-w-md relative z-10">
        <div className={`${visible ? 'animate-check-bounce' : 'scale-0 opacity-0'} mb-6`}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 flex items-center justify-center mx-auto shadow-lg">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-inner">
              <Check className="w-8 h-8 text-white" strokeWidth={3} />
            </div>
          </div>
        </div>

        <div className={`transition-all duration-700 delay-300 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎉 Booking Submitted Successfully</h1>
          <p className="text-gray-500">Thank you for choosing Sri Mobiles.</p>

          {trackingId && (
            <div className="mt-5 mb-4">
              <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Your Booking ID</p>
              <p className="text-sky-600 font-mono font-bold text-2xl flex items-center justify-center gap-2">
                {trackingId}
                <CopyButton text={trackingId} className="text-sky-400 hover:text-sky-600" />
              </p>
            </div>
          )}

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-left text-sm space-y-2">
            <p className="text-amber-800 font-medium flex items-start gap-2">
              <span className="text-base leading-none mt-0.5">⚠</span>
              <span>Please save this Booking ID for future reference.</span>
            </p>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-left text-sm space-y-2">
            <p className="text-blue-800 font-medium mb-2">You can track your repair using:</p>
            <div className="space-y-1.5 text-blue-700">
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">•</span>
                Booking ID
              </p>
              <p className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">•</span>
                Mobile Number entered during booking
              </p>
            </div>
          </div>

          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
              <Camera className="w-4 h-4 text-gray-400" />
              We recommend taking a screenshot of this page.
            </p>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row gap-3 justify-center mt-8 transition-all duration-700 delay-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-sky-200 text-sky-600 font-semibold text-[15px] hover:bg-sky-50 transition-all active:scale-[0.97]"
          >
            <Copy className="w-4 h-4" /> {copied ? 'Copied!' : 'Copy Booking ID'}
          </button>
          <button
            onClick={() => router.push(`/track?bookingId=${trackingId}`)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold text-[15px] hover:bg-sky-600 transition-all shadow-sm active:scale-[0.97]"
          >
            <Search className="w-4 h-4" /> Track Repair Now
          </button>
        </div>

        <div className={`transition-all duration-700 delay-600 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            onClick={() => router.push('/')}
            className="mt-4 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 text-sm font-medium transition-all w-full sm:w-auto"
          >
            <Home className="w-4 h-4" /> Back to Home
          </button>
        </div>

        <div className={`transition-all duration-700 delay-700 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <button
            onClick={onReset}
            className="mt-6 inline-flex items-center gap-1.5 text-gray-400 hover:text-gray-600 text-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Book Another Repair
          </button>
        </div>
      </div>
    </div>
  );
}
