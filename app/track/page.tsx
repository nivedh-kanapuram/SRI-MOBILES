'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Clock, CheckCircle, AlertCircle, XCircle, Loader2, Smartphone, Laptop } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const statusSteps = ['pending', 'accepted', 'in_progress', 'ready_for_pickup', 'completed'];

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-yellow-400', icon: <Clock className="w-4 h-4" /> },
  accepted: { label: 'Accepted', color: 'text-blue-400', icon: <CheckCircle className="w-4 h-4" /> },
  in_progress: { label: 'In Progress', color: 'text-electric-400', icon: <AlertCircle className="w-4 h-4" /> },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'text-purple-400', icon: <CheckCircle className="w-4 h-4" /> },
  completed: { label: 'Completed', color: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
};

interface TrackBooking {
  trackingId: string; fullName: string; phone: string; email: string | null;
  deviceType: string; brand: string; model: string; problem: string;
  status: string; adminNotes: string | null;
  beforeImage: string | null; afterImage: string | null;
  createdAt: string; updatedAt: string;
}

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState('');
  const [booking, setBooking] = useState<TrackBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true);
    setError('');
    setBooking(null);
    try {
      const res = await fetch(`/api/bookings/track/${encodeURIComponent(trackingId.trim())}`);
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Not found'); }
      const data = await res.json();
      setBooking(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to find booking');
    } finally {
      setLoading(false);
    }
  };

  const sc = booking ? statusConfig[booking.status as string] || statusConfig.pending : null;
  const currentStep = booking ? statusSteps.indexOf(booking.status as string) : -1;

  return (
    <div className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: 'Track Repair' }]} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Track Your Repair</h1>
            <p className="text-dark-400 text-[15px] sm:text-base">Enter your tracking ID to check the status of your repair.</p>
          </div>

          <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
            <div className="flex gap-3">
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. SM2026-0001"
                className="flex-1 bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3.5 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !trackingId.trim()}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Track
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[15px] rounded-xl px-4 py-3 mb-6 text-center">{error}</div>
          )}

          {booking && sc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                <div>
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider">Tracking ID</p>
                  <p className="text-white font-bold text-lg">{booking.trackingId}</p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[15px] font-medium border ${sc.color.replace('text-', 'border-').replace('400', '400/30')} ${sc.color} bg-${sc.color.replace('text-', '')}/10`}>
                  {sc.icon} {sc.label}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-white font-medium">{booking.fullName}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-1">Device</p>
                  <p className="text-white font-medium">{booking.brand} {booking.model}</p>
                </div>
                <div>
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-1">Device Type</p>
                  <p className="text-white font-medium flex items-center gap-1.5">
                    {booking.deviceType === 'mobile' ? <Smartphone className="w-4 h-4 text-electric-400" /> : <Laptop className="w-4 h-4 text-electric-400" />}
                    {booking.deviceType.charAt(0).toUpperCase() + booking.deviceType.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-1">Problem</p>
                  <p className="text-dark-300 text-[15px]">{booking.problem}</p>
                </div>
              </div>

              {booking.adminNotes && (
                <div className="mb-6 p-3 rounded-xl bg-electric-500/5 border border-electric-500/10">
                  <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-1">Admin Notes</p>
                  <p className="text-dark-300 text-[15px]">{booking.adminNotes}</p>
                </div>
              )}

              <div className="border-t border-white/5 pt-6">
                <p className="text-dark-500 text-[13px] uppercase tracking-wider mb-4">Status Timeline</p>
                <div className="space-y-0">
                  {statusSteps.map((step, i) => {
                    const cfg = statusConfig[step];
                    const isActive = currentStep >= i;
                    const isPast = currentStep > i;
                    return (
                      <div key={step} className="flex items-start gap-3 pb-3 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isPast ? 'bg-green-500/20 text-green-400' :
                            isActive ? 'bg-electric-500/20 text-electric-400' :
                            'bg-dark-800 text-dark-600'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${isPast ? 'bg-green-400' : isActive ? 'bg-electric-400' : 'bg-dark-600'}`} />
                          </div>
                          {i < statusSteps.length - 1 && (
                            <div className={`w-0.5 h-6 ${isPast ? 'bg-green-500/30' : isActive ? 'bg-electric-500/20' : 'bg-dark-800'}`} />
                          )}
                        </div>
                        <div className="pt-1">
                          <p className={`text-[15px] font-medium ${isActive ? 'text-white' : 'text-dark-500'}`}>
                            {cfg.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
