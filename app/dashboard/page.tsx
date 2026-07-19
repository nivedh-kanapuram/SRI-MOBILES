'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Loader2, Smartphone, Laptop, Calendar, Clock, CheckCircle,
  XCircle, AlertCircle, Star, Send, Search,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface Review {
  id: string; rating: number; comment: string; createdAt: string; approved: boolean;
}

interface Booking {
  id: string; trackingId: string | null; fullName: string; phone: string; email: string | null;
  deviceType: string; brand: string; model: string; problem: string;
  status: string; createdAt: string; review: Review | null;
  serviceType: string; visitDate: string | null; visitTimeSlot: string | null;
  pickupDate: string | null; pickupTimeSlot: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: <Clock className="w-3 h-3" /> },
  in_progress: { label: 'In Progress', color: 'text-blue-400 bg-blue-400/10 border-blue-400/30', icon: <AlertCircle className="w-3 h-3" /> },
  completed: { label: 'Completed', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: <XCircle className="w-3 h-3" /> },
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}
          className="transition-all hover:scale-110 cursor-pointer">
          <Star className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-dark-600'}`} />
        </button>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<Booking | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchBookings = () => {
    fetch('/api/bookings').then(r => r.json()).then(d => { setBookings(d); setLoading(false); });
  };

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    if (status === 'authenticated') fetchBookings();
  }, [status, router]);

  const submitReview = async () => {
    if (!reviewModal) return;
    if (rating === 0) { setReviewError('Please select a rating'); return; }
    if (!comment.trim()) { setReviewError('Please write a review'); return; }
    setSubmitting(true);
    setReviewError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: reviewModal.id, rating, comment: comment.trim() }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      setReviewModal(null);
      setRating(0);
      setComment('');
      fetchBookings();
    } catch (e: unknown) {
      setReviewError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-electric-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <Breadcrumbs items={[{ label: 'Dashboard' }]} />

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">My Bookings</h1>
          <p className="text-dark-400">Welcome back, {session?.user?.name}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center backdrop-blur-xl">
            <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">No bookings yet</h2>
            <p className="text-dark-400 text-[15px] sm:text-base mb-4 sm:mb-6">Book your first repair service to get started.</p>
            <button onClick={() => router.push('/booking')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all">
              Book a Service
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const sc = statusConfig[booking.status] || statusConfig.pending;
              return (
                <div key={booking.id} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 backdrop-blur-xl hover:border-white/[0.15] transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-dark-800/50 flex items-center justify-center flex-shrink-0">
                        {booking.deviceType === 'mobile' ? <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-electric-400" /> : <Laptop className="w-4 h-4 sm:w-5 sm:h-5 text-electric-400" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-white font-semibold text-[15px] sm:text-base truncate">{booking.brand} {booking.model}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${booking.serviceType === 'pickup' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                            {booking.serviceType === 'pickup' ? 'Pickup' : 'Visit'}
                          </span>
                        </div>
                        <p className="text-dark-400 text-[13px] sm:text-[15px] mt-0.5 line-clamp-1">{booking.problem}</p>
                        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 text-xs sm:text-[13px] text-dark-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
                          {booking.trackingId && (
                            <span className="flex items-center gap-1 text-electric-400 font-mono"><Search className="w-3 h-3" /> {booking.trackingId}</span>
                          )}
                          {(booking.visitDate || booking.pickupDate) && (
                            <span className="flex items-center gap-1 text-dark-400">
                              <Clock className="w-3 h-3" /> {booking.visitDate || booking.pickupDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border ${sc.color}`}>
                        {sc.icon} {sc.label}
                      </div>
                      {booking.status === 'completed' && !booking.review && (
                        <button onClick={() => { setReviewModal(booking); setRating(0); setComment(''); setReviewError(''); }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium border border-electric-500/30 text-electric-400 hover:bg-electric-500/10 transition-all">
                          <Star className="w-4 h-4" /> Review
                        </button>
                      )}
                      {booking.review && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-yellow-400">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          {booking.review.rating}/5
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Review Modal */}
        {reviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setReviewModal(null)}>
            <div className="bg-dark-900 border border-white/[0.08] rounded-2xl p-6 sm:p-8 max-w-md w-full backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Review Your Service</h3>
                <button onClick={() => setReviewModal(null)} className="p-1 rounded-lg text-dark-500 hover:text-white hover:bg-white/5 transition-all">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-5">
                <p className="text-dark-400 text-[15px] mb-2">How was your experience with</p>
                <p className="text-white font-medium">{reviewModal.brand} {reviewModal.model}</p>
              </div>
              <div className="mb-5">
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-3">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div className="mb-5">
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Review</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience..." rows={4}
                  className="w-full bg-dark-800/50 border border-white/10 rounded-xl px-4 py-3 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all resize-none" />
              </div>
              {reviewError && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-[15px] rounded-xl px-4 py-3">{reviewError}</div>}
              <button onClick={submitReview} disabled={submitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
