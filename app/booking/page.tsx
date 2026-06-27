'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Smartphone, Laptop, Send, Loader2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', deviceType: 'mobile',
    brand: '', model: '', problem: '',
  });

  const brands = {
    mobile: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Google', 'Motorola', 'Nothing', 'Other'],
    laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Other'],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); setLoading(false); return; }
      setSuccess(true);
    } catch { setError('Something went wrong'); setLoading(false); }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center">
            <img src="/images/logo.png" alt="Sri Mobiles" className="w-[58px] h-[58px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign in Required</h1>
          <p className="text-dark-400 mb-6">Please sign in to book a service.</p>
          <button onClick={() => router.push('/auth/signin')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
          <p className="text-dark-400 mb-6">Your service request has been submitted. We&apos;ll contact you shortly.</p>
          <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all">
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: 'Book a Service' }]} />
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">Book a Service</h1>
          <p className="text-dark-400 text-[15px] sm:text-base">Tell us about your device and we&apos;ll get it fixed.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Full Name *</label>
                <input type="text" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="John Doe"
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Phone *</label>
                <input type="tel" required value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="9876543210"
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Email (optional)</label>
              <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-3">Device Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => { update('deviceType', 'mobile'); update('brand', ''); }}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${form.deviceType === 'mobile' ? 'border-electric-500 bg-electric-500/10 text-electric-400' : 'border-dark-700 bg-dark-800/50 text-dark-400 hover:border-dark-600'}`}>
                  <Smartphone className="w-4 h-4" /> Mobile
                </button>
                <button type="button" onClick={() => { update('deviceType', 'laptop'); update('brand', ''); }}
                  className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${form.deviceType === 'laptop' ? 'border-electric-500 bg-electric-500/10 text-electric-400' : 'border-dark-700 bg-dark-800/50 text-dark-400 hover:border-dark-600'}`}>
                  <Laptop className="w-4 h-4" /> Laptop
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Brand *</label>
                <select required value={form.brand} onChange={(e) => update('brand', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all appearance-none">
                  <option value="" className="bg-dark-900">Select brand</option>
                  {brands[form.deviceType as 'mobile' | 'laptop'].map(b => (
                    <option key={b} value={b} className="bg-dark-900">{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Model *</label>
                <input type="text" required value={form.model} onChange={(e) => update('model', e.target.value)} placeholder="e.g. iPhone 15 Pro"
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Problem Description *</label>
              <textarea required rows={4} value={form.problem} onChange={(e) => update('problem', e.target.value)} placeholder="Describe the issue you're facing..."
                className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all resize-none" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all disabled:opacity-50">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Booking</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
