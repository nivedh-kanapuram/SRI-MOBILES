'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Search, Clock, CheckCircle, AlertCircle, XCircle, Loader2, Smartphone, Laptop, Phone, Hash, Copy, Star } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import CopyButton from '@/components/ui/CopyButton';
import ProblemDescription from '@/components/ui/ProblemDescription';

const statusSteps = ['booking_confirmed', 'device_received', 'diagnosis_complete', 'repair_in_progress', 'waiting_for_parts', 'ready_for_pickup', 'completed'];

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  booking_confirmed: { label: 'Booking Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <CheckCircle className="w-4 h-4" /> },
  device_received: { label: 'Device Received', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', icon: <Clock className="w-4 h-4" /> },
  diagnosis_complete: { label: 'Diagnosis Complete', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: <AlertCircle className="w-4 h-4" /> },
  repair_in_progress: { label: 'Repair In Progress', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <AlertCircle className="w-4 h-4" /> },
  waiting_for_parts: { label: 'Waiting for Parts', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', icon: <Clock className="w-4 h-4" /> },
  ready_for_pickup: { label: 'Ready for Pickup', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', icon: <CheckCircle className="w-4 h-4" /> },
  completed: { label: 'Completed', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: <XCircle className="w-4 h-4" /> },
  pending: { label: 'Booking Confirmed', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', icon: <CheckCircle className="w-4 h-4" /> },
  in_progress: { label: 'Repair In Progress', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: <AlertCircle className="w-4 h-4" /> },
};

interface TrackBooking {
  trackingId: string; fullName: string; phone: string; email: string | null;
  deviceType: string; brand: string; model: string; problem: string; issueCategory: string | null;
  status: string; adminNotes: string | null; serviceType: string;
  beforeImage: string | null; afterImage: string | null;
  visitDate: string | null; visitTimeSlot: string | null;
  pickupAddress: string | null; pickupLandmark: string | null; pincode: string | null; invoiceUrl: string | null;
  pickupDate: string | null; pickupTimeSlot: string | null;
  customerRating: number | null;
  createdAt: string; updatedAt: string;
}

type SearchMode = 'bookingId' | 'phone';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const [searchMode, setSearchMode] = useState<SearchMode>('bookingId');
  const [searchValue, setSearchValue] = useState('');
  const [booking, setBooking] = useState<TrackBooking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);
  const [toast, setToast] = useState('');
  const [deletedBooking, setDeletedBooking] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const doSearch = async (mode: SearchMode, value: string) => {
    setLoading(true);
    setError('');
    setDeletedBooking(false);
    setBooking(null);
    try {
      const res = await fetch('/api/bookings/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'bookingId' ? { bookingId: value } : { phone: value }),
      });
      if (!res.ok) { const d = await res.json(); if (d.phone) setDeletedBooking(true); throw new Error(d.error || 'Not found'); }
      const data = await res.json();
      setBooking(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No booking found. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const bookingId = searchParams.get('bookingId');
    const phone = searchParams.get('phone');
    if (bookingId) {
      setSearchMode('bookingId');
      setSearchValue(bookingId);
      doSearch('bookingId', bookingId);
    } else if (phone) {
      setSearchMode('phone');
      setSearchValue(phone);
      doSearch('phone', phone);
    }
    setSearched(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    doSearch(searchMode, searchValue.trim());
  };

  const submitRating = async () => {
    if (!booking || selectedRating === 0) return;
    setSubmittingRating(true);
    try {
      const res = await fetch('/api/bookings/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingId: booking.trackingId, rating: selectedRating }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed to submit rating'); }
      setBooking({ ...booking, customerRating: selectedRating });
      setRatingSubmitted(true);
      setToast('Thank you for your feedback!');
    } catch (err: unknown) {
      setToast(err instanceof Error ? err.message : 'Failed to submit rating');
    } finally {
      setSubmittingRating(false);
    }
  };

  const oldStatusMap: Record<string, number> = {
    pending: 0, accepted: 1, in_progress: 3, waiting_for_parts: 4, ready_for_pickup: 5,
  };
  const getStepIndex = (s: string) => {
    const idx = statusSteps.indexOf(s);
    return idx >= 0 ? idx : (oldStatusMap[s] ?? -1);
  };
  const sc = booking ? statusConfig[booking.status as string] || statusConfig.pending : null;
  const currentStep = booking ? getStepIndex(booking.status as string) : -1;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {toast && (
          <div className="fixed top-24 right-4 z-50 px-4 py-2.5 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700 text-sm font-medium transition-all duration-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {toast}
          </div>
        )}
        <Breadcrumbs items={[{ label: 'Track Repair' }]} />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {!searchParams.get('bookingId') && !searchParams.get('phone') && (
            <>
              <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Track Your Repair</h1>
                <p className="text-gray-500 text-[15px] sm:text-base">Enter your Booking ID or Phone Number to check the status.</p>
              </div>

              <form onSubmit={handleTrack} className="max-w-md mx-auto mb-10">
                <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white mb-3">
                  <button type="button" onClick={() => { setSearchMode('bookingId'); setSearchValue(''); setBooking(null); setError(''); setDeletedBooking(false); }}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${searchMode === 'bookingId' ? 'bg-sky-50 text-sky-600 border-r border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Hash className="w-3.5 h-3.5 inline mr-1" /> Booking ID
                  </button>
                  <button type="button" onClick={() => { setSearchMode('phone'); setSearchValue(''); setBooking(null); setError(''); setDeletedBooking(false); }}
                    className={`flex-1 py-3 text-sm font-medium transition-all ${searchMode === 'phone' ? 'bg-sky-50 text-sky-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Phone className="w-3.5 h-3.5 inline mr-1" /> Phone Number
                  </button>
                </div>
                <div className="flex gap-3">
                  <input
                    type={searchMode === 'phone' ? 'tel' : 'text'}
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e.target.value); setDeletedBooking(false); }}
                    placeholder={searchMode === 'bookingId' ? 'e.g. SM2026-0001' : 'e.g. 9876543210'}
                    className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={loading || !searchValue.trim()}
                    className="px-5 py-3 rounded-xl bg-sky-500 text-white font-semibold text-[15px] hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Track
                  </button>
                </div>
              </form>
            </>
          )}

          {loading && !booking && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            </div>
          )}

{deletedBooking && (
  <div className="bg-red-50 border border-red-200 text-red-700 text-[15px] rounded-xl px-5 py-4 mb-6 text-center">
    <p className="mb-3">This booking has been removed. Please call us for assistance.</p>
    <a href="tel:9948299426" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium transition-all shadow-sm">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
      Call Sri Mobiles
    </a>
  </div>
)}
{!deletedBooking && error && (
  <div className="bg-red-50 border border-red-200 text-red-600 text-[15px] rounded-xl px-4 py-3 mb-6 text-center">{error}</div>
)}

          {booking && sc && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-card"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-3 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider">Booking ID</p>
                  <p className="text-gray-900 font-bold text-lg flex items-center gap-2 flex-wrap">
                    <span className="break-all">{booking.trackingId}</span>
                    <CopyButton text={booking.trackingId || ''} className="text-gray-400 hover:text-sky-500 flex-shrink-0" onCopy={() => setToast('Copied successfully')} />
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] sm:text-[15px] font-medium border ${sc.border} ${sc.color} ${sc.bg} w-fit whitespace-nowrap`}>
                  {sc.icon} {sc.label}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Customer</p>
                  <p className="text-gray-900 font-medium">{booking.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Device</p>
                  <p className="text-gray-900 font-medium">{booking.brand} {booking.model}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Device Type</p>
                  <p className="text-gray-900 font-medium flex items-center gap-1.5">
                    {booking.deviceType === 'mobile' ? <Smartphone className="w-4 h-4 text-sky-500" /> : <Laptop className="w-4 h-4 text-sky-500" />}
                    {booking.deviceType.charAt(0).toUpperCase() + booking.deviceType.slice(1)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Issue Category</p>
                  <p className="text-gray-900 font-medium">{booking.issueCategory || '—'}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Problem</p>
                  <ProblemDescription text={booking.problem} />
                </div>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">
                  {booking.status === 'completed' ? 'Completed On' :
                   booking.status === 'ready_for_pickup' ? 'Ready Since' :
                   'Estimated Completion'}
                </p>
                <p className="text-amber-700 font-semibold text-[15px]">
                  {booking.status === 'completed' && new Date(booking.updatedAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                  {booking.status === 'ready_for_pickup' && `${new Date(booking.updatedAt).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })} — Visit our store to collect`}
                  {!['completed', 'ready_for_pickup', 'cancelled'].includes(booking.status) && (
                    new Date().getHours() < 14
                      ? `Today by 6:00 PM`
                      : `Tomorrow by 6:00 PM`
                  )}
                  {booking.status === 'cancelled' && 'This booking has been cancelled'}
                </p>
              </div>

              {booking.adminNotes && (
                <div className="mb-6 p-3 rounded-xl bg-sky-50 border border-sky-200">
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-1">Admin Notes</p>
                  <p className="text-gray-700 text-[15px]">{booking.adminNotes}</p>
                </div>
              )}

              {(booking.beforeImage || booking.afterImage) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {booking.beforeImage && (
                    <div>
                      <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-2">Before Repair</p>
                      <img src={booking.beforeImage} alt="Before repair" className="w-full rounded-xl border border-gray-200" />
                    </div>
                  )}
                  {booking.afterImage && (
                    <div>
                      <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-2">After Repair</p>
                      <img src={booking.afterImage} alt="After repair" className="w-full rounded-xl border border-gray-200" />
                    </div>
                  )}
                </div>
              )}

              {booking.status === 'ready_for_pickup' && booking.invoiceUrl && (
                <div className="mb-6">
                  <a href={booking.invoiceUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 text-sm font-medium transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    📄 Download Invoice
                  </a>
                </div>
              )}

              {booking.status === 'completed' && (
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-3">Rate Your Experience</p>
                  {booking.customerRating !== null || ratingSubmitted ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                      <p className="text-gray-800 font-medium mb-2">Thank you for your valuable feedback.</p>
                      <div className="flex items-center justify-center gap-1">
                        {[1,2,3,4,5].map(star => (
                          <Star key={star} className={`w-5 h-5 ${star <= (booking.customerRating ?? selectedRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1 mb-3">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} onClick={() => setSelectedRating(star)}
                            className={`p-1 transition-all hover:scale-110 ${selectedRating >= star ? 'text-amber-400' : 'text-gray-300'}`}>
                            <Star className={`w-6 h-6 ${selectedRating >= star ? 'fill-amber-400' : ''}`} />
                          </button>
                        ))}
                      </div>
                      <button onClick={submitRating} disabled={selectedRating === 0 || submittingRating}
                        className="px-5 py-2 rounded-xl bg-amber-500 text-white font-medium text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                        {submittingRating ? <Loader2 className="w-4 h-4 animate-spin inline" /> : 'Submit'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="border-t border-gray-100 pt-6">
                <p className="text-gray-400 text-[13px] uppercase tracking-wider mb-5">Status Timeline</p>
                <div className="relative">
                  {statusSteps.map((step, i) => {
                    const cfg = statusConfig[step];
                    const isPast = currentStep > i;
                    const isCurrent = currentStep === i;
                    const isFuture = currentStep < i;
                    return (
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.07 }}
                        className="relative flex items-start gap-4 pb-7 last:pb-0"
                      >
                        {/* Connector Line */}
                        {i < statusSteps.length - 1 && (
                          <div className={`absolute left-[15px] top-7 w-0.5 h-[calc(100%-4px)] rounded-full transition-colors duration-500 ${
                            isPast ? 'bg-emerald-400' : isCurrent ? 'bg-amber-300' : 'bg-gray-200'
                          }`} />
                        )}

                        {/* Icon */}
                        <div className="relative z-10 flex-shrink-0">
                          {isPast ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 15, delay: i * 0.07 + 0.1 }}
                              className="w-[30px] h-[30px] rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center shadow-sm"
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                            </motion.div>
                          ) : isCurrent ? (
                            <motion.div
                              animate={{ scale: [1, 1.12, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                              className="w-[30px] h-[30px] rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_10px_rgba(251,191,36,0.35)]"
                            >
                              <div className="w-3 h-3 rounded-full bg-amber-400" />
                            </motion.div>
                          ) : (
                            <div className="w-[30px] h-[30px] rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Label */}
                        <div className="pt-1.5">
                          <p className={`text-[15px] font-medium transition-colors duration-300 ${
                            isPast ? 'text-emerald-700' : isCurrent ? 'text-amber-700' : 'text-gray-400'
                          }`}>
                            {cfg.label}
                          </p>
                          {isCurrent && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-0.5"
                            >
                              {step === 'repair_in_progress' && (
                                <p className="text-[12px] text-amber-500 font-medium">🔧 Currently in Progress — Our technicians are actively working on your device.</p>
                              )}
                              {step === 'waiting_for_parts' && (
                                <p className="text-[12px] text-amber-500 font-medium">📦 Waiting for Parts — Required parts are being arranged.</p>
                              )}
                              {step === 'ready_for_pickup' && (
                                <p className="text-[12px] text-emerald-500 font-medium">📱 Ready for Pickup — Your device is ready for collection.</p>
                              )}
                              {step === 'completed' && (
                                <p className="text-[12px] text-emerald-500 font-medium">✅ Repair Completed Successfully — Thank you for choosing Sri Mobiles.</p>
                              )}
                              {!['repair_in_progress', 'waiting_for_parts', 'ready_for_pickup', 'completed'].includes(step) && (
                                <p className="text-[12px] text-amber-500 font-medium">Currently in progress</p>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
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
