'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Clock, AlertCircle, CheckCircle, XCircle, Users, Smartphone, ChevronDown, MessageCircle, Image, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface AdminReview {
  id: string; rating: number; comment: string; approved: boolean;
}

interface AdminBooking {
  id: string; trackingId: string | null; fullName: string; phone: string; email: string | null;
  deviceType: string; brand: string; model: string; problem: string;
  status: string; adminNotes: string | null; createdAt: string;
  beforeImage: string | null; afterImage: string | null;
  user: { name: string; email: string }; review: AdminReview | null;
}

interface Stats { total: number; pending: number; inProgress: number; completed: number; cancelled: number; totalUsers: number; }

const statuses = [
  { value: 'pending', label: 'Pending', icon: <Clock className="w-3 h-3" />, color: 'text-yellow-400 bg-yellow-400/10' },
  { value: 'in_progress', label: 'In Progress', icon: <AlertCircle className="w-3 h-3" />, color: 'text-blue-400 bg-blue-400/10' },
  { value: 'completed', label: 'Completed', icon: <CheckCircle className="w-3 h-3" />, color: 'text-green-400 bg-green-400/10' },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3 h-3" />, color: 'text-red-400 bg-red-400/10' },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/admin/bookings').then(r => r.json()),
        fetch('/api/admin/stats').then(r => r.json()),
      ]).then(([b, s]) => { setBookings(b); setStats(s); setLoading(false); });
    }
  }, [status, router]);

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/admin/bookings/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const updatePhotos = async (id: string, beforeImage: string, afterImage: string) => {
    await fetch('/api/admin/photos', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: id, beforeImage: beforeImage || undefined, afterImage: afterImage || undefined }),
    });
    setBookings(prev => prev.map(b => b.id === id ? { ...b, beforeImage, afterImage } : b));
  };

  const approveReview = async (bookingId: string, approved: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, approved }),
    });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, review: b.review ? { ...b.review, approved } : null } : b));
  };

  const getWhatsAppLink = (booking: AdminBooking) => {
    const text = `Hi ${booking.fullName},\n\nYour device (${booking.brand} ${booking.model}) repair status has been updated to: ${statuses.find(s => s.value === booking.status)?.label || booking.status}\n\nTracking ID: ${booking.trackingId || 'N/A'}\n\nSri Mobiles\n9948299426\nDilsukh Nagar, Chaitanyapuri, Hyderabad`;
    return `https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-dark-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-electric-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Admin' }]} />

        <div className="mb-8 sm:mb-10">
          <div className="bg-gradient-to-r from-electric-500/10 via-electric-500/5 to-transparent border border-electric-500/20 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="flex items-start gap-4 sm:gap-6">
              <img src="/images/logo.png" alt="Sri Mobiles" className="w-[42px] h-[42px] sm:w-[58px] sm:h-[58px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)] flex-shrink-0" />
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Welcome to Sri Mobiles</h1>
                <p className="text-electric-200/80 text-[15px] sm:text-base font-medium mb-1">Admin Control Center</p>
                <p className="text-dark-400 text-sm">Manage service bookings, track repairs, and monitor customer requests</p>
              </div>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {[
              { label: 'Total Bookings', value: stats.total, icon: <Smartphone className="w-5 h-5" />, color: 'from-electric-500 to-electric-600' },
              { label: 'Pending', value: stats.pending, icon: <Clock className="w-5 h-5" />, color: 'from-yellow-500 to-orange-500' },
              { label: 'In Progress', value: stats.inProgress, icon: <AlertCircle className="w-5 h-5" />, color: 'from-blue-500 to-blue-600' },
              { label: 'Completed', value: stats.completed, icon: <CheckCircle className="w-5 h-5" />, color: 'from-green-500 to-emerald-500' },
            ].map(s => (
              <div key={s.label} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-3 sm:p-5 backdrop-blur-xl">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white mb-2 sm:mb-3`}>{s.icon}</div>
                <p className="text-xl sm:text-2xl font-bold text-white">{s.value}</p>
                <p className="text-dark-400 text-[15px]">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${filter === f ? 'bg-electric-500/10 border border-electric-500/30 text-electric-400' : 'bg-dark-800/50 border border-dark-700 text-dark-400 hover:border-dark-600'}`}>
              {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 sm:p-12 text-center backdrop-blur-xl">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-dark-600 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">No bookings found</h2>
              <p className="text-dark-400">{filter === 'all' ? 'No bookings yet.' : `No ${filter.replace('_', ' ')} bookings.`}</p>
            </div>
          ) : filtered.map(booking => {
            const sc = statuses.find(s => s.value === booking.status) || statuses[0];
            return (
              <div key={booking.id} className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-4 sm:p-6 backdrop-blur-xl hover:border-white/[0.15] transition-all">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-[15px] sm:text-base truncate">{booking.fullName}</h3>
                        <span className="text-dark-500 text-[13px] sm:text-[15px] flex-shrink-0">{booking.phone}</span>
                      </div>
                      <p className="text-dark-400 text-[13px] sm:text-[15px] truncate">{booking.brand} {booking.model} ({booking.deviceType})</p>
                      {booking.trackingId && (
                        <p className="text-electric-400 text-xs sm:text-[13px] font-mono mt-0.5">#{booking.trackingId}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={getWhatsAppLink(booking)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all"
                        title="Send WhatsApp Update"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <div className="relative">
                        <select value={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium border cursor-pointer focus:outline-none ${sc.color} border-current/30 w-full sm:w-auto`}>
                          {statuses.map(s => <option key={s.value} value={s.value} className="bg-dark-900">{s.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-dark-500">
                    <span>{new Date(booking.createdAt).toLocaleString('en-IN')}</span>
                    <span className="text-dark-700">|</span>
                    <span className="truncate">{booking.problem}</span>
                  </div>

                  {/* Before/After Photos */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="text"
                      placeholder="Before photo URL"
                      defaultValue={booking.beforeImage || ''}
                      onBlur={(e) => {
                        const after = (e.target.closest('.booking-card')?.querySelector('[data-after]') as HTMLInputElement)?.value || '';
                        updatePhotos(booking.id, e.target.value, after);
                      }}
                      className="flex-1 min-w-[140px] bg-dark-800/50 border border-white/5 rounded-lg px-3 py-1.5 text-sm text-dark-300 placeholder:text-dark-600 focus:outline-none focus:border-electric-500/30"
                    />
                    <input
                      type="text"
                      data-after
                      placeholder="After photo URL"
                      defaultValue={booking.afterImage || ''}
                      onBlur={(e) => {
                        const before = (e.target.closest('.booking-card')?.querySelector('[data-before]') as HTMLInputElement)?.value || '';
                        updatePhotos(booking.id, before, e.target.value);
                      }}
                      className="flex-1 min-w-[140px] bg-dark-800/50 border border-white/5 rounded-lg px-3 py-1.5 text-sm text-dark-300 placeholder:text-dark-600 focus:outline-none focus:border-electric-500/30"
                    />
                    <div className="flex items-center gap-1.5 text-sm text-dark-500">
                      <Image className="w-3.5 h-3.5" />
                      <span>Photos</span>
                    </div>
                  </div>

                  {/* Review Approval */}
                  {booking.review && !booking.review.approved && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-electric-500/5 border border-electric-500/10">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{booking.review.comment}</p>
                        <p className="text-yellow-400 text-xs mt-0.5">{booking.review.rating}/5 Stars</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={() => approveReview(booking.id, true)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 text-sm font-medium transition-all">
                          <ThumbsUp className="w-4 h-4" /> Approve
                        </button>
                        <button onClick={() => approveReview(booking.id, false)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 text-sm font-medium transition-all">
                          <ThumbsDown className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
