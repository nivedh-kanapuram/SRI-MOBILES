'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, Clock, AlertCircle, CheckCircle, XCircle, Users, Smartphone, ChevronDown, MessageCircle, ThumbsUp, ThumbsDown, MapPin, Tag, Calendar, Clock3, Store, Upload, X, Save, Copy, Phone, ChevronUp, Maximize2, Trash2, Download, Star, FileText, Filter } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import ProblemDescription from '@/components/ui/ProblemDescription';

interface AdminReview {
  id: string; rating: number; comment: string; approved: boolean;
}

interface AdminBooking {
  id: string; trackingId: string | null; fullName: string; phone: string; email: string | null;
  deviceType: string; brand: string; model: string; problem: string; issueCategory: string | null;
  additionalNotes: string | null;
  status: string; adminNotes: string | null; createdAt: string;
  customerPhoto: string | null;
  beforeImage: string | null; afterImage: string | null; afterImages: string | null; videoUrl: string | null;
  serviceType: string; visitDate: string | null; visitTimeSlot: string | null;
  pickupAddress: string | null; pickupLandmark: string | null;
  pickupLatitude: number | null; pickupLongitude: number | null;
  pickupDate: string | null; pickupTimeSlot: string | null;
  customerRating: number | null;
  invoiceUrl: string | null;
  outstandingAmount: number | null; paymentStatus: string;
  user: { name: string; email: string }; review: AdminReview | null;
}

interface Stats { total: number; pending: number; inProgress: number; completed: number; avgRating: number; totalReviews: number; }

interface DraftChanges {
  status?: string;
  beforeImage?: string;
  afterImage?: string;
  afterImages?: string;
  videoUrl?: string;
  outstandingAmount?: number;
  paymentStatus?: string;
}

const statuses = [
  { value: 'booking_confirmed', label: 'Booking Confirmed', icon: <CheckCircle className="w-3 h-3" />, color: 'text-blue-600 bg-blue-50' },
  { value: 'device_received', label: 'Device Received', icon: <Clock className="w-3 h-3" />, color: 'text-purple-600 bg-purple-50' },
  { value: 'diagnosis_complete', label: 'Diagnosis Complete', icon: <AlertCircle className="w-3 h-3" />, color: 'text-orange-600 bg-orange-50' },
  { value: 'repair_in_progress', label: 'Repair In Progress', icon: <AlertCircle className="w-3 h-3" />, color: 'text-yellow-600 bg-yellow-50' },
  { value: 'waiting_for_parts', label: 'Waiting for Parts', icon: <Clock className="w-3 h-3" />, color: 'text-orange-600 bg-orange-50' },
  { value: 'ready_for_pickup', label: 'Ready for Dispatch', icon: <CheckCircle className="w-3 h-3" />, color: 'text-green-600 bg-green-50' },
  { value: 'completed', label: 'Completed', icon: <CheckCircle className="w-3 h-3" />, color: 'text-emerald-600 bg-emerald-50' },
  { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3 h-3" />, color: 'text-red-600 bg-red-50' },
];

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [draftChanges, setDraftChanges] = useState<Record<string, DraftChanges>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [expandedProblems, setExpandedProblems] = useState<Set<string>>(new Set());
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [brandFilter, setBrandFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [notification, setNotification] = useState<{ bookingId: string; trackingId: string | null; fullName: string; deviceType: string; brand: string; model: string; createdAt: string } | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const seenNotifications = useRef(new Set<string>());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const draftChangesRef = useRef(draftChanges);
  useEffect(() => { draftChangesRef.current = draftChanges; }, [draftChanges]);

  const initAudio = useCallback(() => {
    if (audioRef.current) return;
    try {
      const a = new Audio('/sounds/telegram_notification.mp3');
      a.preload = 'auto';
      a.volume = 0.40;
      audioRef.current = a;
    } catch (e) { console.error('Audio init error:', e); }
  }, []);

  const playNotificationSound = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      a.play().catch((e) => { if (e.name !== 'AbortError') console.error('Play sound error:', e); });
    } catch (e) { console.error('Play sound error:', e); }
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const unlock = () => { initAudio(); const a = audioRef.current; if (a) { a.play().then(() => a.pause()).catch(() => {}); } document.removeEventListener('click', unlock); document.removeEventListener('keydown', unlock); };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    return () => { document.removeEventListener('click', unlock); document.removeEventListener('keydown', unlock); };
  }, [status, initAudio]);

  const scrollToBooking = useCallback((bookingId: string) => {
    setNotification(null);
    setHighlightId(bookingId);
    setFilter('all');
    setServiceFilter('all');
    setBrandFilter('');
    setSearchQuery('');
    setDateFrom('');
    setDateTo('');
    let elapsed = 0;
    const interval = 100;
    const maxWait = 3000;
    const tryScroll = () => {
      const el = document.getElementById(`booking-${bookingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      elapsed += interval;
      if (elapsed >= maxWait) {
        setToast({ message: 'This booking no longer exists.', type: 'error' });
        return;
      }
      setTimeout(tryScroll, interval);
    };
    requestAnimationFrame(() => setTimeout(tryScroll, interval));
  }, []);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let es: EventSource | null = null;
    let reconnectTimeout: ReturnType<typeof setTimeout>;
    const connect = () => {
      es = new EventSource('/api/admin/notifications/stream');
      es.addEventListener('new-booking', (e) => {
        if (!e.data) return;
        try {
          const data = JSON.parse(e.data);
          if (seenNotifications.current.has(data.bookingId)) return;
          seenNotifications.current.add(data.bookingId);
          playNotificationSound();
          setNotification(data);
          setBookings(prev => {
            if (prev.some(b => b.id === data.bookingId)) return prev;
            return [{ ...data, id: data.bookingId, status: 'booking_confirmed', phone: '', email: null, problem: '', issueCategory: null, additionalNotes: null, adminNotes: null, serviceType: 'self_visit', customerPhoto: null, beforeImage: null, afterImage: null, afterImages: null, videoUrl: null, customerRating: null, invoiceUrl: null, visitDate: null, visitTimeSlot: null, pickupAddress: null, pickupLandmark: null, pincode: null, pickupLatitude: null, pickupLongitude: null, pickupDate: null, pickupTimeSlot: null, user: { name: '', email: '' }, review: null }, ...prev];
          });
          setStats(prev => prev ? { ...prev, total: prev.total + 1, pending: prev.pending + 1 } : prev);
        } catch (e) { console.error('[SSE] Error processing notification:', e); }
      });
      es.onerror = () => {
        es?.close();
        reconnectTimeout = setTimeout(connect, 5000);
      };
    };
    connect();
    return () => {
      es?.close();
      clearTimeout(reconnectTimeout);
    };
  }, [status, playNotificationSound]);

  // Fallback polling to catch missed SSE events (Vercel serverless timeouts, reconnect gaps)
  useEffect(() => {
    if (status !== 'authenticated') return;
    const id = setInterval(async () => {
      if (Object.keys(draftChangesRef.current).length > 0) return;
      try {
        const [b, s] = await Promise.all([
          fetch('/api/admin/bookings').then(r => r.json()),
          fetch('/api/admin/stats').then(r => r.json()),
        ]);
        setBookings(b);
        setStats(s);
      } catch { /* silent */ }
    }, 5000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 5000);
    return () => clearTimeout(t);
  }, [notification]);

  useEffect(() => {
    if (!highlightId) return;
    const t = setTimeout(() => setHighlightId(null), 3000);
    return () => clearTimeout(t);
  }, [highlightId]);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
    if (status === 'authenticated') {
      Promise.all([
        fetch('/api/admin/bookings').then(r => r.json()),
        fetch('/api/admin/stats').then(r => r.json()),
      ]).then(([b, s]) => { setBookings(b); setStats(s); setLoading(false); });
    }
  }, [status, router]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const toggleProblem = (id: string) => {
    setExpandedProblems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setDraft = useCallback((id: string, changes: Partial<DraftChanges>) => {
    setDraftChanges(prev => ({
      ...prev,
      [id]: { ...prev[id], ...changes },
    }));
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    setDraft(id, { status: newStatus });
  };

  const updatePhoto = (id: string, type: 'beforeImage' | 'afterImage', url: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, [type]: url } : b));
    setDraft(id, { [type === 'beforeImage' ? 'beforeImage' : 'afterImage']: url });
  };

  const saveChanges = async (id: string) => {
    setSaving(id);
    try {
      const draft = draftChanges[id];
      if (!draft) return;

      const promises: Promise<Response>[] = [];

      const patchBody: Record<string, unknown> = {};
      if (draft.status) patchBody.status = draft.status;
      if (draft.outstandingAmount !== undefined) patchBody.outstandingAmount = draft.outstandingAmount;
      if (draft.paymentStatus !== undefined) patchBody.paymentStatus = draft.paymentStatus;

      if (Object.keys(patchBody).length > 0) {
        promises.push(
          fetch(`/api/admin/bookings/${id}`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patchBody),
          })
        );
      }

    if (draft.beforeImage !== undefined || draft.afterImage !== undefined || draft.afterImages !== undefined || draft.videoUrl !== undefined) {
      promises.push(
        fetch('/api/admin/photos', {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: id,
            ...(draft.beforeImage !== undefined && { beforeImage: draft.beforeImage === '' ? null : draft.beforeImage }),
            ...(draft.afterImage !== undefined && { afterImage: draft.afterImage === '' ? null : draft.afterImage }),
            ...(draft.afterImages !== undefined && { afterImages: draft.afterImages }),
            ...(draft.videoUrl !== undefined && { videoUrl: draft.videoUrl === '' ? null : draft.videoUrl }),
          }),
        })
      );
    }

      await Promise.all(promises);
      setDraftChanges(prev => { const { [id]: _, ...rest } = prev; return rest; });
      setToast({ message: 'Booking updated successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to save changes', type: 'error' });
    }
    setSaving(null);
  };

  const approveReview = async (bookingId: string, approved: boolean) => {
    await fetch('/api/admin/reviews', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, approved }),
    });
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, review: b.review ? { ...b.review, approved } : null } : b));
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/admin/bookings/${deleteId}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== deleteId));
      setToast({ message: 'Booking deleted successfully', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete booking', type: 'error' });
    }
    setDeleting(false);
    setDeleteId(null);
  };

  const exportCSV = () => {
    const headers = ['Booking ID', 'Date', 'Customer Name', 'Phone', 'Device Brand', 'Device Model', 'Issue', 'Status', 'Rating'];
    const rows = filtered.map(b => [
      b.trackingId || '',
      new Date(b.createdAt).toLocaleDateString('en-IN'),
      b.fullName,
      b.phone,
      b.brand,
      b.model,
      b.issueCategory || '',
      statuses.find(s => s.value === b.status)?.label || b.status,
      b.customerRating ?? '',
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sri-mobiles-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getWhatsAppLink = (booking: AdminBooking) => {
    const sc = statuses.find(s => s.value === booking.status) || statuses[0];
    const text = `Hi ${booking.fullName},\n\nYour device (${booking.brand} ${booking.model}) repair status has been updated to: ${sc.label}\n\nTracking ID: ${booking.trackingId || 'N/A'}\n\nSri Mobiles\n9948299426\nDilsukh Nagar, Chaitanyapuri, Hyderabad`;
    return `https://wa.me/${booking.phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setToast({ message: 'Booking ID copied', type: 'success' });
  };

  const uniqueBrands = useMemo(() => [...new Set(bookings.map(b => b.brand))].sort(), [bookings]);

  const filtered = useMemo(() => {
    let list = serviceFilter === 'all' ? bookings : bookings.filter(b => b.serviceType === serviceFilter);
    list = list.filter(b => filter === 'all' || b.status === filter);
    if (brandFilter) {
      list = list.filter(b => b.brand === brandFilter);
    }
    if (dateFrom) {
      list = list.filter(b => new Date(b.createdAt) >= new Date(dateFrom));
    }
    if (dateTo) {
      list = list.filter(b => new Date(b.createdAt) <= new Date(dateTo + 'T23:59:59.999Z'));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(b =>
        (b.trackingId && b.trackingId.toLowerCase().includes(q)) ||
        b.fullName.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.model.toLowerCase().includes(q)
      );
    }
    return list;
  }, [bookings, serviceFilter, filter, brandFilter, searchQuery, dateFrom, dateTo]);

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-sky-500 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      {toast && (
        <div className={`fixed top-24 right-4 z-50 px-5 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-200 ${toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}
      {notification && (
        <div className="fixed top-24 right-4 z-50 bg-white border border-sky-200 rounded-xl shadow-xl p-4 max-w-sm w-full animate-in slide-in-from-top transition-all duration-300">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔔</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm">New Booking Received</p>
              <p className="text-gray-500 text-[13px] mt-0.5">
                Customer: {notification.fullName}<br />
                Device: {notification.brand} {notification.model}
              </p>
              <button onClick={() => scrollToBooking(notification.bookingId)} className="mt-2 text-[13px] font-medium text-sky-600 hover:text-sky-700 transition-colors">
                View Booking →
              </button>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
          <div className="relative max-w-3xl max-h-[90vh] w-full" onClick={e => e.stopPropagation()}>
            <img src={previewImage} alt="Preview" className="w-full h-auto max-h-[85vh] object-contain rounded-2xl" />
            <button onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <Breadcrumbs items={[{ label: 'Admin' }]} />

        {/* Mobile Header */}
        <div className="block sm:hidden mb-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-card">
            <div className="text-center">
              <h1 className="text-base font-bold text-gray-900">Welcome Back Sri Mobiles Team</h1>
              <p className="text-gold text-xs font-medium mt-1">Admin Control Center</p>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block mb-8 sm:mb-10">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-card">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Welcome Back Sri Mobiles Team
              </h1>
              <p className="text-gold text-[15px] sm:text-base font-medium mb-1">Admin Control Center</p>
              <p className="text-gray-500 text-sm">Manage service bookings, track repairs, and monitor customer requests</p>
            </div>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: 'Total Bookings', value: stats.total, icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-sky-500' },
              { label: 'Pending', value: stats.pending, icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-yellow-500' },
              { label: 'In Progress', value: stats.inProgress, icon: <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-blue-500' },
              { label: 'Completed', value: stats.completed, icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-green-500' },
              { label: 'Avg Rating', value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '—', icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-amber-500' },
              { label: 'Total Reviews', value: stats.totalReviews, icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, color: 'bg-purple-500' },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-2.5 sm:p-5 shadow-card">
                <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl ${s.color} flex items-center justify-center text-white mb-1.5 sm:mb-3 shadow-sm`}>{s.icon}</div>
                <p className="text-base sm:text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="text-gray-500 text-xs sm:text-[15px]">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + Filter + Export */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by Booking ID, Name, Phone, or Model..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilter(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:border-gray-300 text-sm font-medium transition-all">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={exportCSV}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 text-sm font-medium transition-all">
              <Download className="w-4 h-4" /> Export Bookings
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { value: 'all', label: 'All Bookings' },
              { value: 'self_visit', label: 'Self Visit' },
              { value: 'pickup', label: 'Doorstep Pickup' },
            ].map(f => (
              <button key={f.value} onClick={() => setServiceFilter(f.value)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${serviceFilter === f.value ? 'bg-sky-50 border border-sky-200 text-sky-600' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="w-full sm:w-auto sm:ml-2">
            <div className="relative w-full sm:w-auto">
              <select value={filter} onChange={(e) => setFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 sm:py-2 text-sm font-medium text-gray-600 cursor-pointer focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all">
                <option value="all">All Statuses</option>
                {statuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
                className="appearance-none w-full sm:w-auto bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 sm:py-2 text-sm font-medium text-gray-600 cursor-pointer focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all">
                <option value="">All Brands</option>
                {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filter Drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-50 bg-black/30 sm:bg-black/20" onClick={() => setShowFilter(false)}>
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl p-6 overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
                <button onClick={() => setShowFilter(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-all">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">From Date</label>
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-400" />
                </div>
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">To Date</label>
                  <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-400" />
                </div>
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Brand</label>
                  <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-400 appearance-none">
                    <option value="">All Brands</option>
                    {uniqueBrands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Status</label>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-sky-400 appearance-none">
                    <option value="all">All Statuses</option>
                    {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setDateFrom(''); setDateTo(''); setBrandFilter(''); setFilter('all'); }}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all">Reset</button>
                  <button onClick={() => setShowFilter(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 text-white hover:bg-sky-600 text-sm font-medium transition-all shadow-sm">Apply</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 sm:space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-8 sm:p-12 text-center shadow-card">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">No bookings found</h2>
              <p className="text-gray-500">{filter === 'all' ? 'No bookings yet.' : `No ${filter.replace('_', ' ')} bookings.`}</p>
            </div>
          ) : filtered.map(booking => {
            const sc = statuses.find(s => s.value === booking.status) || statuses[0];
            const hasDraft = !!draftChanges[booking.id];
            const problemExpanded = expandedProblems.has(booking.id);
            return (
              <div key={booking.id} id={`booking-${booking.id}`} className={`bg-white border border-gray-200 rounded-2xl p-3 sm:p-6 shadow-card hover:shadow-card-hover transition-all duration-500 ${highlightId === booking.id ? 'bg-sky-50 border-sky-300 shadow-lg' : ''}`}>
                {/* Mobile Layout */}
                <div className="sm:hidden space-y-2.5">
                  {/* Header: Name + Phone + Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-gray-900 font-semibold text-[15px] leading-tight">{booking.fullName}</h3>
                      <p className="text-gray-500 text-[13px] flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" /> {booking.phone}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${booking.serviceType === 'pickup' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                        {booking.serviceType === 'pickup' ? 'Pickup' : 'Visit'}
                      </span>
                    </div>
                  </div>

                  {/* Booking ID */}
                  {booking.trackingId && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-sky-600 break-all leading-tight">#{booking.trackingId}</span>
                      <button onClick={() => copyToClipboard(booking.trackingId!)}
                        className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* Device Details */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Device Details</p>
                    <div className="text-[13px] text-gray-600 space-y-0.5">
                      <p><span className="text-gray-400">Type:</span> {booking.deviceType === 'mobile' ? 'Mobile' : 'Laptop'}</p>
                      <p><span className="text-gray-400">Brand:</span> {booking.brand}</p>
                      <p><span className="text-gray-400">Model:</span> {booking.model}</p>
                    </div>
                  </div>

                  {/* Issue Details */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Issue Details</p>
                    <div className="text-[13px] text-gray-600 space-y-0.5">
                      {booking.issueCategory && <p><span className="text-gray-400">Selected Issue:</span> {booking.issueCategory}</p>}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {booking.additionalNotes && (
                    <div className="border-t border-gray-100 pt-2">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Additional Information</p>
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-2.5">
                        <p className="text-gray-600 text-[13px] whitespace-pre-wrap break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>
                          {booking.additionalNotes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Booking Date & Time */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Booking Date & Time</p>
                    <div className="text-[13px] text-gray-600 space-y-0.5">
                      <p><span className="text-gray-400">Booked Date:</span> {new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                      <p><span className="text-gray-400">Booked Time:</span> {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  {/* Address Details - Pickup */}
                  {booking.serviceType === 'pickup' && (
                    <div className="border-t border-gray-100 pt-2">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Address Details</p>
                      <div className="text-[13px] text-gray-600 space-y-0.5">
                        {booking.pickupAddress && <p><span className="text-gray-400">Address:</span> {booking.pickupAddress}</p>}
                        {booking.pickupLandmark && <p><span className="text-gray-400">Landmark:</span> {booking.pickupLandmark}</p>}
                        {booking.pickupDate && (
                          <p><span className="text-gray-400">Pickup Date:</span> {new Date(booking.pickupDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} {booking.pickupTimeSlot && `@ ${booking.pickupTimeSlot}`}</p>
                        )}
                        {booking.pickupLatitude && booking.pickupLongitude && (
                          <a href={`https://www.google.com/maps?q=${booking.pickupLatitude},${booking.pickupLongitude}`} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-0.5 text-[12px] text-blue-600 hover:text-blue-800 underline underline-offset-2">
                            Open in Google Maps
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Visit Details - Self Visit */}
                  {booking.serviceType === 'self_visit' && booking.visitDate && (
                    <div className="border-t border-gray-100 pt-2">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Visit Details</p>
                      <div className="text-[13px] text-gray-600 space-y-0.5">
                        <p><span className="text-gray-400">Date:</span> {new Date(booking.visitDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        {booking.visitTimeSlot && <p><span className="text-gray-400">Time:</span> {booking.visitTimeSlot}</p>}
                      </div>
                    </div>
                  )}

                  {/* Customer Photo */}
                  {booking.customerPhoto && (
                    <button onClick={() => setPreviewImage(booking.customerPhoto)} className="group relative w-16 h-16 flex-shrink-0">
                      <img src={booking.customerPhoto} alt="Customer photo" className="w-full h-full rounded-lg object-cover border border-gray-200" />
                      <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                        <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all" />
                      </div>
                    </button>
                  )}

                  {/* Status Management */}
                  <div className="flex items-center justify-between gap-2">
                    {booking.customerRating !== null ? (
                      <div className="flex-1 flex items-center gap-2 px-2.5 py-2 rounded-lg bg-gray-100 border border-gray-200">
                        <span className="text-xs">🔒</span>
                        <span className="text-xs text-gray-500 font-medium">Status Locked — Customer has already submitted a review.</span>
                      </div>
                    ) : (
                      <div className="relative flex-1">
                        <select value={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}
                          className={`appearance-none w-full pl-2.5 pr-7 py-2 rounded-lg text-xs font-medium border cursor-pointer focus:outline-none ${sc.color} border-current/30`}>
                          {statuses.map(s => <option key={s.value} value={s.value} className="bg-white">{s.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                      </div>
                    )}
                    <span className="text-[11px] text-gray-400 flex-shrink-0">{new Date(booking.createdAt).toLocaleDateString('en-IN')}</span>
                  </div>

                  {/* Full Description */}
                  <div>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Full Description</p>
                    <div className={`bg-gray-50 border border-gray-100 rounded-lg p-2.5 ${problemExpanded ? '' : 'line-clamp-2'}`}>
                      <p className="text-gray-600 text-[13px] whitespace-pre-wrap break-words leading-relaxed" style={{ overflowWrap: 'anywhere' }}>
                        {booking.problem}
                      </p>
                    </div>
                    {booking.problem && booking.problem.length > 80 && (
                      <button onClick={() => toggleProblem(booking.id)}
                        className="text-[11px] text-sky-500 hover:text-sky-600 mt-0.5 flex items-center gap-0.5">
                        {problemExpanded ? <><ChevronUp className="w-3 h-3" /> Show Less</> : <><ChevronDown className="w-3 h-3" /> Show More</>}
                      </button>
                    )}
                  </div>

                  {/* Action Buttons Stacked */}
                  <div className="space-y-2 pt-0.5">
                    <button
                      onClick={() => saveChanges(booking.id)}
                      disabled={!hasDraft || saving === booking.id}
                      className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${hasDraft && saving !== booking.id ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      {saving === booking.id ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                      ) : (
                        <><Save className="w-4 h-4" /> {hasDraft ? 'Save Changes' : 'Saved'}</>
                      )}
                    </button>
                    {hasDraft && saving !== booking.id && (
                      <button
                        onClick={() => setDraftChanges(prev => { const { [booking.id]: _, ...rest } = prev; return rest; })}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 border border-gray-200 transition-all"
                      >
                        <X className="w-4 h-4" /> Discard Changes
                      </button>
                    )}
                    <button onClick={() => setDeleteId(booking.id)}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>

                  {/* WhatsApp Button */}
                  <a href={getWhatsAppLink(booking)} target="_blank" rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 transition-all">
                    <MessageCircle className="w-4 h-4" /> Send WhatsApp Update
                  </a>

                  {/* Ready for Dispatch */}
                  {booking.status === 'ready_for_pickup' && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Payment</p>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-[10px] text-gray-500 font-medium mb-0.5">Outstanding Amount</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-medium">₹</span>
                                <input type="number" min="0" value={(draftChanges[booking.id]?.outstandingAmount ?? booking.outstandingAmount ?? '')} onChange={(e) => setDraft(booking.id, { outstandingAmount: e.target.value === '' ? (null as unknown as number) : Number(e.target.value) })}
                                  placeholder="0"
                                  className="w-full pl-7 pr-2.5 py-2 rounded-lg bg-white border border-gray-200 text-gray-900 text-[12px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] text-gray-500 font-medium mb-0.5">Payment Status</label>
                              <div className="flex gap-2">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="radio" name={`payment-${booking.id}`} value="not_paid" checked={(draftChanges[booking.id]?.paymentStatus ?? booking.paymentStatus) === 'not_paid'} onChange={() => setDraft(booking.id, { paymentStatus: 'not_paid' })}
                                    className="w-3.5 h-3.5 text-gray-400 border-gray-300 focus:ring-gray-400" />
                                  <span className="text-[11px] text-gray-600">Not Paid</span>
                                </label>
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                  <input type="radio" name={`payment-${booking.id}`} value="paid" checked={(draftChanges[booking.id]?.paymentStatus ?? booking.paymentStatus) === 'paid'} onChange={() => setDraft(booking.id, { paymentStatus: 'paid' })}
                                    className="w-3.5 h-3.5 text-green-500 border-gray-300 focus:ring-green-400" />
                                  <span className="text-[11px] text-gray-600">Paid</span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Invoice</p>
                          <InvoiceUpload
                            bookingId={booking.id}
                            currentInvoice={booking.invoiceUrl || null}
                            onUpload={(url) => {
                              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, invoiceUrl: url } : b));
                            }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <PhotoUpload
                          bookingId={booking.id}
                          label="Before"
                          type="before"
                          currentImage={booking.beforeImage}
                          onUpload={(url) => updatePhoto(booking.id, 'beforeImage', url)}
                          onPreview={setPreviewImage}
                          compact
                        />
                        <AfterPhotosUpload
                          bookingId={booking.id}
                          currentImages={(() => {
                            try { return JSON.parse(booking.afterImages || '[]'); } catch { return booking.afterImage ? [booking.afterImage] : []; }
                          })()}
                          onUpload={(urls) => {
                            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, afterImages: JSON.stringify(urls), afterImage: urls[0] || null } : b));
                            setDraft(booking.id, { afterImages: JSON.stringify(urls), afterImage: urls[0] || '' });
                          }}
                          onPreview={setPreviewImage}
                          compact
                        />
                        <VideoUpload
                          bookingId={booking.id}
                          currentVideo={booking.videoUrl}
                          onUpload={(url) => {
                            setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, videoUrl: url } : b));
                            setDraft(booking.id, { videoUrl: url });
                          }}
                          compact
                        />
                      </div>
                    </div>
                  )}

                  {/* Review Approval */}
                  {booking.review && !booking.review.approved && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                      <p className="text-gray-800 text-[13px] font-medium leading-snug">{booking.review.comment}</p>
                      <p className="text-amber-600 text-[11px]">{booking.review.rating}/5 Stars</p>
                      <div className="flex gap-2">
                        <button onClick={() => approveReview(booking.id, true)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 text-xs font-medium transition-all">
                          <ThumbsUp className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button onClick={() => approveReview(booking.id, false)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-medium transition-all">
                          <ThumbsDown className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:block">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-gray-900 font-semibold text-[15px] sm:text-base truncate">{booking.fullName}</h3>
                          <span className="text-gray-400 text-[13px] sm:text-[15px] flex-shrink-0">{booking.phone}</span>
                          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${booking.serviceType === 'pickup' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                            {booking.serviceType === 'pickup' ? 'Doorstep Pickup' : 'Self Visit'}
                          </span>
                        </div>
                        {booking.trackingId && (
                          <p className="text-sky-500 text-xs sm:text-[13px] font-mono mt-0.5">
                            #{booking.trackingId}
                            <button onClick={() => copyToClipboard(booking.trackingId!)}
                              className="ml-1 p-0.5 rounded text-gray-400 hover:text-sky-500 hover:bg-sky-50 transition-all align-middle">
                              <Copy className="w-3 h-3 inline-block" />
                            </button>
                          </p>
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
                        {booking.customerRating !== null ? (
                          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-gray-100 border border-gray-200">
                            <span className="text-sm">🔒</span>
                            <span className="text-sm text-gray-500 font-medium">Status Locked — Customer has already submitted a review.</span>
                          </div>
                        ) : (
                          <div className="relative">
                            <select value={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}
                              className={`appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm font-medium border cursor-pointer focus:outline-none ${sc.color} border-current/30 w-full sm:w-auto`}>
                              {statuses.map(s => <option key={s.value} value={s.value} className="bg-white">{s.label}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sections Grid */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600 bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                      {/* Device Details */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Device Details</p>
                        <div className="space-y-0.5">
                          <p><span className="text-gray-400">Type:</span> {booking.deviceType === 'mobile' ? 'Mobile' : 'Laptop'}</p>
                          <p><span className="text-gray-400">Brand:</span> {booking.brand}</p>
                          <p><span className="text-gray-400">Model:</span> {booking.model}</p>
                        </div>
                      </div>

                      {/* Issue Details */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Issue Details</p>
                        <div className="space-y-0.5">
                          {booking.issueCategory && <p><span className="text-gray-400">Selected Issue:</span> {booking.issueCategory}</p>}
                        </div>
                      </div>

                      {/* Booking Date & Time */}
                      <div>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Booking Date & Time</p>
                        <div className="space-y-0.5">
                          <p><span className="text-gray-400">Booked Date:</span> {new Date(booking.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                          <p><span className="text-gray-400">Booked Time:</span> {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      </div>

                      {/* Address or Visit Details */}
                      {booking.serviceType === 'pickup' ? (
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Address Details</p>
                          <div className="space-y-0.5">
                            {booking.pickupAddress && <p><span className="text-gray-400">Address:</span> {booking.pickupAddress}</p>}
                            {booking.pickupLandmark && <p><span className="text-gray-400">Landmark:</span> {booking.pickupLandmark}</p>}
                            {booking.pickupDate && (
                              <p><span className="text-gray-400">Pickup:</span> {new Date(booking.pickupDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })} {booking.pickupTimeSlot && `@ ${booking.pickupTimeSlot}`}</p>
                            )}
                            {booking.pickupLatitude && booking.pickupLongitude && (
                              <a href={`https://www.google.com/maps?q=${booking.pickupLatitude},${booking.pickupLongitude}`} target="_blank" rel="noopener noreferrer"
                                className="text-[13px] text-blue-600 hover:text-blue-800 underline underline-offset-2">
                                Open in Google Maps
                              </a>
                            )}
                          </div>
                        </div>
                      ) : booking.visitDate ? (
                        <div>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">Visit Details</p>
                          <div className="space-y-0.5">
                            <p><span className="text-gray-400">Date:</span> {new Date(booking.visitDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                            {booking.visitTimeSlot && <p><span className="text-gray-400">Time:</span> {booking.visitTimeSlot}</p>}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Ready for Dispatch */}
                    {booking.status === 'ready_for_pickup' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Payment</p>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-[11px] text-gray-500 font-medium mb-1">Outstanding Amount</label>
                                <div className="relative max-w-xs">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">₹</span>
                                  <input type="number" min="0" value={(draftChanges[booking.id]?.outstandingAmount ?? booking.outstandingAmount ?? '')} onChange={(e) => setDraft(booking.id, { outstandingAmount: e.target.value === '' ? (null as unknown as number) : Number(e.target.value) })}
                                    placeholder="0"
                                    className="w-full pl-8 pr-3 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-900 text-[13px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[11px] text-gray-500 font-medium mb-1.5">Payment Status</label>
                                <div className="flex gap-4">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name={`payment-d-${booking.id}`} value="not_paid" checked={(draftChanges[booking.id]?.paymentStatus ?? booking.paymentStatus) === 'not_paid'} onChange={() => setDraft(booking.id, { paymentStatus: 'not_paid' })}
                                      className="w-4 h-4 text-gray-400 border-gray-300 focus:ring-gray-400" />
                                    <span className="text-[13px] text-gray-600">Not Paid</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name={`payment-d-${booking.id}`} value="paid" checked={(draftChanges[booking.id]?.paymentStatus ?? booking.paymentStatus) === 'paid'} onChange={() => setDraft(booking.id, { paymentStatus: 'paid' })}
                                      className="w-4 h-4 text-green-500 border-gray-300 focus:ring-green-400" />
                                    <span className="text-[13px] text-gray-600">Paid</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Invoice</p>
                            <InvoiceUpload
                              bookingId={booking.id}
                              currentInvoice={booking.invoiceUrl || null}
                              onUpload={(url) => {
                                setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, invoiceUrl: url } : b));
                              }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <PhotoUpload
                            bookingId={booking.id}
                            label="Before"
                            type="before"
                            currentImage={booking.beforeImage}
                            onUpload={(url) => updatePhoto(booking.id, 'beforeImage', url)}
                            onPreview={setPreviewImage}
                          />
                          <AfterPhotosUpload
                            bookingId={booking.id}
                            currentImages={(() => {
                              try { return JSON.parse(booking.afterImages || '[]'); } catch { return booking.afterImage ? [booking.afterImage] : []; }
                            })()}
                            onUpload={(urls) => {
                              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, afterImages: JSON.stringify(urls), afterImage: urls[0] || null } : b));
                              setDraft(booking.id, { afterImages: JSON.stringify(urls), afterImage: urls[0] || '' });
                            }}
                            onPreview={setPreviewImage}
                          />
                          <VideoUpload
                            bookingId={booking.id}
                            currentVideo={booking.videoUrl}
                            onUpload={(url) => {
                              setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, videoUrl: url } : b));
                              setDraft(booking.id, { videoUrl: url });
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Additional Information */}
                    {booking.additionalNotes && (
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Additional Information</p>
                        <p className="text-gray-600 text-sm whitespace-pre-wrap break-words leading-relaxed">{booking.additionalNotes}</p>
                      </div>
                    )}

                    {/* Full Description */}
                    <ProblemDescription text={booking.problem} className="mt-0.5" />

                    {/* Customer Photo */}
                    {booking.customerPhoto && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 font-medium">Customer Photo:</span>
                        <button onClick={() => setPreviewImage(booking.customerPhoto)} className="group relative">
                          <img src={booking.customerPhoto} alt="Customer photo" className="w-12 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-all" />
                          <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                            <Maximize2 className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                        </button>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => saveChanges(booking.id)}
                        disabled={!hasDraft || saving === booking.id}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${hasDraft && saving !== booking.id ? 'bg-sky-500 text-white hover:bg-sky-600 shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        {saving === booking.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        {saving === booking.id ? 'Saving...' : hasDraft ? 'Save Changes' : 'Saved'}
                      </button>
                      {hasDraft && saving !== booking.id && (
                        <button
                          onClick={() => setDraftChanges(prev => { const { [booking.id]: _, ...rest } = prev; return rest; })}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all"
                        >
                          <X className="w-4 h-4" /> Discard
                        </button>
                      )}
                      <button onClick={() => setDeleteId(booking.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>

                    {booking.review && !booking.review.approved && (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <div className="min-w-0">
                          <p className="text-gray-800 text-sm font-medium truncate">{booking.review.comment}</p>
                          <p className="text-amber-600 text-xs mt-0.5">{booking.review.rating}/5 Stars</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => approveReview(booking.id, true)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 border border-green-200 text-sm font-medium transition-all">
                            <ThumbsUp className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => approveReview(booking.id, false)}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-sm font-medium transition-all">
                            <ThumbsDown className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure you want to delete this booking?</h3>
              <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-all">Cancel</button>
                <button onClick={() => confirmDelete()} disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 text-sm font-medium transition-all disabled:opacity-50">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoUpload({ bookingId, label, type, currentImage, onUpload, onPreview, compact }: {
  bookingId: string;
  label: string;
  type: 'before' | 'after';
  currentImage: string | null;
  onUpload: (url: string) => void;
  onPreview: (url: string | null) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImage);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      alert('Only JPG, PNG, and WEBP files are allowed.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);
    formData.append('type', type);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setPreview(url);
      onUpload(url);
    } catch {
      alert('Failed to upload image. Please try again.');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImage = () => {
    setPreview(null);
    onUpload('');
  };

  if (compact) {
    return (
      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 h-full">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">{label} Repair</p>
        {preview ? (
          <div className="flex flex-col gap-1.5">
            <button onClick={() => onPreview(preview)} className="group relative">
              <img src={preview} alt={label} className="w-full aspect-square rounded-lg object-cover border border-gray-200" />
              <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                <Maximize2 className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </button>
            <div className="flex gap-1.5">
              <button onClick={removeImage}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all leading-none">
                Remove
              </button>
              <button onClick={() => inputRef.current?.click()}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all leading-none">
                Replace
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-[11px] font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        )}
        <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFile} className="hidden" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">{label} Repair</p>
      {preview ? (
        <div className="flex items-center gap-2">
          <button onClick={() => onPreview(preview)}>
            <img src={preview} alt={label} className="w-12 h-12 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-all" />
          </button>
          <button onClick={removeImage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
            <X className="w-3 h-3" /> Remove
          </button>
          <button onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all">
            <Upload className="w-3 h-3" /> Replace
          </button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>
      )}
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleFile} className="hidden" />
    </div>
  );
}

function InvoiceUpload({ bookingId, currentInvoice, onUpload }: {
  bookingId: string;
  currentInvoice: string | null;
  onUpload: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(currentInvoice);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);
    try {
      const res = await fetch('/api/admin/upload/invoice', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setInvoiceUrl(url);
      onUpload(url);
    } catch {
      alert('Failed to upload invoice.');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeInvoice = async () => {
    setInvoiceUrl(null);
    onUpload('');
  };

  return (
    <div>
      {invoiceUrl ? (
        <div className="flex items-center gap-2">
          <a href={invoiceUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 text-xs font-medium transition-all">
            <FileText className="w-3.5 h-3.5" /> View Invoice
          </a>
          <button onClick={removeInvoice}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
            <X className="w-3 h-3" /> Remove
          </button>
          <button onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
            <Upload className="w-3 h-3" /> Replace
          </button>
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 bg-white border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
          {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
          {uploading ? 'Uploading...' : 'Upload Invoice PDF'}
        </button>
      )}
      <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} className="hidden" />
    </div>
  );
}

function AfterPhotosUpload({ bookingId, currentImages, onUpload, onPreview, compact }: {
  bookingId: string;
  currentImages: string[];
  onUpload: (urls: string[]) => void;
  onPreview: (url: string | null) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>(currentImages);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const totalAfter = images.length + files.length;
    if (totalAfter > 15) {
      alert(`Maximum 15 images allowed. You already have ${images.length}.`);
      return;
    }

    setUploading(true);
    const uploaded: string[] = [];
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    for (const file of Array.from(files)) {
      if (!allowed.includes(file.type)) {
        alert(`Skipping ${file.name}: Only JPG, PNG, and WEBP files are allowed.`);
        continue;
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bookingId', bookingId);
      formData.append('type', 'after');
      try {
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const { url } = await res.json();
        uploaded.push(url);
      } catch {
        alert(`Failed to upload ${file.name}.`);
      }
    }
    setUploading(false);
    const allUrls = [...images, ...uploaded];
    setImages(allUrls);
    onUpload(allUrls);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onUpload(updated);
  };

  if (compact) {
    return (
      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 h-full">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">After Repair Photos</p>
        {images.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap gap-1.5">
              {images.slice(0, 4).map((url, i) => (
                <button key={i} onClick={() => onPreview(url)} className="group relative flex-1 min-w-0">
                  <img src={url} alt={`After ${i + 1}`} className="w-full aspect-square rounded-lg object-cover border border-gray-200" />
                </button>
              ))}
              {images.length > 4 && (
                <div className="flex-1 min-w-0 aspect-square rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-[11px] text-gray-500 font-medium">
                  +{images.length - 4}
                </div>
              )}
            </div>
            <button onClick={() => inputRef.current?.click()}
              className="w-full py-1.5 rounded-lg text-[10px] font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all leading-none">
              {uploading ? 'Uploading...' : images.length > 0 ? 'Add More Photos' : 'Upload Photos'}
            </button>
          </div>
        ) : (
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-[11px] font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
        )}
        <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={handleFiles} className="hidden" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">After Repair Photos</p>
      {images.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group">
              <button onClick={() => onPreview(url)}>
                <img src={url} alt={`After ${i + 1}`} className="w-14 h-14 rounded-lg object-cover border border-gray-200 cursor-pointer hover:opacity-80 transition-all" />
              </button>
              <button onClick={() => removeImage(i)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-sm">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length < 15 && (
            <button onClick={() => inputRef.current?.click()}
              className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:text-sky-500 hover:border-sky-300 transition-all">
              <Upload className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <button onClick={() => inputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Photos'}
        </button>
      )}
      <input ref={inputRef} type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={handleFiles} className="hidden" />
    </div>
  );
}

function VideoUpload({ bookingId, currentVideo, onUpload, compact }: {
  bookingId: string;
  currentVideo: string | null;
  onUpload: (url: string) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(currentVideo);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!allowed.includes(file.type)) {
      alert('Only MP4, MOV, and WEBM files are allowed.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert('Video must be under 100 MB.');
      return;
    }

    const tempUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = tempUrl;
    await new Promise((resolve) => { video.onloadedmetadata = resolve; });
    if (video.duration > 120) {
      URL.revokeObjectURL(tempUrl);
      alert('Video must be 2 minutes or less.');
      return;
    }
    URL.revokeObjectURL(tempUrl);

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bookingId', bookingId);
    try {
      const res = await fetch('/api/admin/upload/video', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      setVideoUrl(url);
      onUpload(url);
    } catch {
      alert('Failed to upload video. Please try again.');
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeVideo = () => {
    setVideoUrl(null);
    onUpload('');
  };

  if (compact) {
    return (
      <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 mt-3">
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">After Repair Completion Video</p>
        {videoUrl ? (
          <div className="flex flex-col gap-1.5">
            <video src={videoUrl} controls className="w-full rounded-lg border border-gray-200" />
            <div className="flex gap-1.5">
              <button onClick={removeVideo}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all leading-none">
                Remove
              </button>
              <button onClick={() => inputRef.current?.click()}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all leading-none">
                Replace
              </button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={() => inputRef.current?.click()} disabled={uploading}
              className="w-full flex items-center justify-center gap-1.5 py-3 rounded-lg text-[11px] font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
              {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : '🎥 Upload Completion Video'}
            </button>
            <div className="mt-2 space-y-0.5">
              <p className="text-[10px] text-gray-400">Supported Formats: MP4 • MOV • WEBM</p>
              <p className="text-[10px] text-gray-400">Maximum Duration: 2 Minutes</p>
            </div>
          </>
        )}
        <input ref={inputRef} type="file" accept=".mp4,.mov,.webm" onChange={handleFile} className="hidden" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">After Repair Completion Video</p>
      {videoUrl ? (
        <div className="flex items-center gap-3">
          <video src={videoUrl} controls className="w-48 h-28 rounded-lg border border-gray-200 object-cover" />
          <div className="flex flex-col gap-1.5">
            <button onClick={removeVideo}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
              <X className="w-3 h-3" /> Remove
            </button>
            <button onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all">
              <Upload className="w-3 h-3" /> Replace
            </button>
          </div>
        </div>
      ) : (
        <>
          <button onClick={() => inputRef.current?.click()} disabled={uploading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 transition-all disabled:opacity-50">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : '🎥 Upload Completion Video'}
          </button>
          <div className="mt-2 space-y-0.5">
            <p className="text-[11px] text-gray-400">Supported Formats: MP4 • MOV • WEBM</p>
            <p className="text-[11px] text-gray-400">Maximum Duration: 2 Minutes</p>
          </div>
        </>
      )}
      <input ref={inputRef} type="file" accept=".mp4,.mov,.webm" onChange={handleFile} className="hidden" />
    </div>
  );
}