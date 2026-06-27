'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Phone, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Registration failed'); setLoading(false); return; }
      router.push('/auth/signin?registered=true');
    } catch { setError('Something went wrong'); setLoading(false); }
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Breadcrumbs items={[{ label: 'Sign Up' }]} />
        <div className="text-center mb-8">
            <img src="/images/logo.png" alt="Sri Mobiles" className="w-[58px] h-[58px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Create Account</h1>
          <p className="text-dark-400 mt-2">Join Sri Mobiles to book and track repairs.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[15px] rounded-xl px-4 py-3">{error}</div>
            )}

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="Phone number (optional)"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type={showPassword ? 'text' : 'password'} required value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Min 6 characters"
                  className="w-full pl-10 pr-12 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
                <input type="password" required value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} placeholder="Confirm password"
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all disabled:opacity-50">
              {loading ? 'Creating account...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400 text-[15px]">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-electric-400 hover:text-electric-300 font-medium">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
