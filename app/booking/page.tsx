'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Smartphone, Laptop, Send, Loader2, Store, Truck, ChevronLeft, Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const steps = ['Service Type', 'Device Details', 'Issue Details', 'Your Info', 'Summary'];

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '01:00 PM - 03:00 PM',
  '03:00 PM - 05:00 PM',
  '05:00 PM - 07:00 PM',
];

const validPincodes: string[] = [
  '500060', '500005', '500065', '500013', '500020',
  '500023', '500029', '500036', '500044', '500061',
  '500030', '500048', '500049', '500062', '500070',
  '500076', '500084',
];

const brands: Record<string, string[]> = {
  mobile: ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Google', 'Motorola', 'Nothing', 'Other'],
  laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Samsung', 'Other'],
};

export default function BookingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<{ trackingId: string; serviceType: string } | null>(null);

  const [form, setForm] = useState({
    serviceType: '',
    fullName: '', phone: '', email: '',
    deviceType: 'mobile', brand: '', model: '', problem: '',
    visitDate: '', visitTimeSlot: '',
    pickupAddress: '', pickupLandmark: '', pincode: '',
    pickupDate: '', pickupTimeSlot: '',
  });

  const storeCoords = { lat: 17.3676, lng: 78.5245 };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validatePincode = (pin: string) => validPincodes.includes(pin);

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.serviceType;
      case 1: return !!form.deviceType && !!form.brand && !!form.model;
      case 2:
        if (!form.problem) return false;
        if (form.serviceType === 'pickup') {
          return !!form.pickupAddress && !!form.pincode && validatePincode(form.pincode) && !!form.pickupDate && !!form.pickupTimeSlot;
        }
        if (form.serviceType === 'self_visit') {
          return !!form.visitDate && !!form.visitTimeSlot;
        }
        return false;
      case 3: return !!form.fullName && !!form.phone;
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => { if (canProceed()) setStep(s => s + 1); };
  const prevStep = () => { if (step > 0) setStep(s => s - 1); };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        fullName: form.fullName, phone: form.phone, email: form.email || undefined,
        deviceType: form.deviceType, brand: form.brand, model: form.model, problem: form.problem,
        serviceType: form.serviceType,
      };
      if (form.serviceType === 'self_visit') {
        payload.visitDate = form.visitDate;
        payload.visitTimeSlot = form.visitTimeSlot;
      } else {
        payload.pickupAddress = form.pickupAddress;
        payload.pickupLandmark = form.pickupLandmark || undefined;
        payload.pincode = form.pincode;
        payload.pickupDate = form.pickupDate;
        payload.pickupTimeSlot = form.pickupTimeSlot;
      }
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error || 'Failed'); setLoading(false); return; }
      const data = await res.json();
      setBookingResult({ trackingId: data.trackingId, serviceType: form.serviceType });
      setSuccess(true);
    } catch { setError('Something went wrong'); setLoading(false); }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center">
          <img src="/images/logo.png" alt="Sri Mobiles" className="w-[58px] h-[58px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Sign in Required</h1>
          <p className="text-dark-400 mb-6">Please sign in to book a service.</p>
          <button onClick={() => router.push('/auth/signin')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all">Sign In</button>
        </div>
      </div>
    );
  }

  if (success) {
    const isPickup = bookingResult?.serviceType === 'pickup';
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
          {bookingResult?.trackingId && (
            <p className="text-electric-400 text-sm font-mono mb-3">Tracking ID: #{bookingResult.trackingId}</p>
          )}
          <p className="text-dark-400 mb-6">
            {isPickup
              ? 'Your pickup booking has been confirmed. Our team will arrive during your selected time slot.'
              : 'Your repair booking has been confirmed. Please visit Sri Mobiles on your selected date and time.'}
          </p>
          <div className="flex flex-col gap-3">
            <button onClick={() => router.push('/dashboard')} className="px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all">
              View My Bookings
            </button>
            <button onClick={() => { setSuccess(false); setStep(0); setForm(prev => ({ ...prev, serviceType: '', brand: '', model: '', problem: '', visitDate: '', visitTimeSlot: '', pickupAddress: '', pickupLandmark: '', pincode: '', pickupDate: '', pickupTimeSlot: '' })); }} className="text-dark-400 hover:text-white text-sm transition-colors">
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            i === step ? 'bg-electric-500/10 border border-electric-500/30 text-electric-400' :
            i < step ? 'bg-green-500/10 border border-green-500/30 text-green-400' :
            'bg-dark-800/50 border border-dark-700 text-dark-500'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-electric-500 text-white' :
              'bg-dark-700 text-dark-400'
            }`}>{i < step ? <Check className="w-3 h-3" /> : i + 1}</span>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-4 sm:w-6 h-px ${i < step ? 'bg-green-500/50' : 'bg-dark-700'}`} />}
        </div>
      ))}
    </div>
  );

  const renderServiceType = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <button type="button" onClick={() => update('serviceType', 'self_visit')}
        className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all ${
          form.serviceType === 'self_visit'
            ? 'border-electric-500 bg-electric-500/10 shadow-lg shadow-electric-500/10'
            : 'border-dark-700 bg-white/[0.02] hover:border-dark-500'
        }`}>
        {form.serviceType === 'self_visit' && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-electric-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4">
          <Store className="w-6 h-6 text-electric-400" />
        </div>
        <h3 className="text-white font-semibold text-base sm:text-lg mb-2">Self Visit</h3>
        <p className="text-dark-400 text-sm sm:text-[15px] leading-relaxed">Bring your device directly to Sri Mobiles for repair.</p>
      </button>

      <button type="button" onClick={() => update('serviceType', 'pickup')}
        className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all ${
          form.serviceType === 'pickup'
            ? 'border-electric-500 bg-electric-500/10 shadow-lg shadow-electric-500/10'
            : 'border-dark-700 bg-white/[0.02] hover:border-dark-500'
        }`}>
        {form.serviceType === 'pickup' && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-electric-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
          <Truck className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-base sm:text-lg mb-2">Doorstep Pickup</h3>
        <p className="text-dark-400 text-sm sm:text-[15px] leading-relaxed">Our team will collect your device from your location and return it after repair.</p>
      </button>
    </div>
  );

  const renderDeviceDetails = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-3">Device Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => { update('deviceType', 'mobile'); update('brand', ''); }}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${
              form.deviceType === 'mobile' ? 'border-electric-500 bg-electric-500/10 text-electric-400' : 'border-dark-700 bg-dark-800/50 text-dark-400 hover:border-dark-600'
            }`}>
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
          <button type="button" onClick={() => { update('deviceType', 'laptop'); update('brand', ''); }}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${
              form.deviceType === 'laptop' ? 'border-electric-500 bg-electric-500/10 text-electric-400' : 'border-dark-700 bg-dark-800/50 text-dark-400 hover:border-dark-600'
            }`}>
            <Laptop className="w-4 h-4" /> Laptop
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Brand *</label>
          <select required value={form.brand} onChange={(e) => update('brand', e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all appearance-none">
            <option value="" className="bg-dark-900">Select brand</option>
            {brands[form.deviceType]?.map(b => (
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
    </div>
  );

  const renderIssueDetails = () => {
    const isPickup = form.serviceType === 'pickup';
    return (
      <div className="space-y-5">
        <div>
          <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Problem Description *</label>
          <textarea required rows={4} value={form.problem} onChange={(e) => update('problem', e.target.value)} placeholder="Describe the issue you're facing..."
            className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all resize-none" />
        </div>

        {isPickup ? (
          <>
            <div className="border-t border-dark-800 pt-5">
              <h3 className="text-white font-semibold text-base mb-4">Pickup Address</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Full Address *</label>
                  <textarea required rows={2} value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} placeholder="Street, area, building details..."
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Landmark</label>
                    <input type="text" value={form.pickupLandmark} onChange={(e) => update('pickupLandmark', e.target.value)} placeholder="Nearby landmark"
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
                  </div>
                  <div>
                    <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Pincode *</label>
                    <input type="text" required value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="500060"
                      className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
                    {form.pincode && !validatePincode(form.pincode) && (
                      <p className="text-red-400 text-xs mt-1.5">Doorstep Pickup is currently available only within 5 KM of Sri Mobiles, Dilsukh Nagar. Please choose Self Visit or contact us directly.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-dark-800 pt-5">
              <h3 className="text-white font-semibold text-base mb-4">Pickup Date & Time</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Pickup Date *</label>
                  <input type="date" required value={form.pickupDate} onChange={(e) => update('pickupDate', e.target.value)} min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
                </div>
                <div>
                  <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Time Slot *</label>
                  <select required value={form.pickupTimeSlot} onChange={(e) => update('pickupTimeSlot', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all appearance-none">
                    <option value="" className="bg-dark-900">Select slot</option>
                    {timeSlots.map(s => <option key={s} value={s} className="bg-dark-900">{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="border-t border-dark-800 pt-5">
            <h3 className="text-white font-semibold text-base mb-4">Preferred Visit Date & Time</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Visit Date *</label>
                <input type="date" required value={form.visitDate} onChange={(e) => update('visitDate', e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all" />
              </div>
              <div>
                <label className="block text-dark-400 text-[13px] uppercase tracking-wider mb-2">Visit Time *</label>
                <select required value={form.visitTimeSlot} onChange={(e) => update('visitTimeSlot', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-[15px] focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all appearance-none">
                  <option value="" className="bg-dark-900">Select time</option>
                  {timeSlots.map(s => <option key={s} value={s} className="bg-dark-900">{s}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCustomerInfo = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
    </div>
  );

  const renderSummary = () => {
    const isPickup = form.serviceType === 'pickup';
    return (
      <div className="space-y-5">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-white/5">
            {isPickup ? <Truck className="w-5 h-5 text-blue-400" /> : <Store className="w-5 h-5 text-electric-400" />}
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">Service Type</p>
              <p className="text-white font-medium">{isPickup ? 'Doorstep Pickup' : 'Self Visit'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">Device</p>
              <p className="text-white font-medium">{form.brand} {form.model}</p>
            </div>
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">Type</p>
              <p className="text-white font-medium capitalize">{form.deviceType}</p>
            </div>
          </div>

          <div>
            <p className="text-dark-400 text-xs uppercase tracking-wider">Issue</p>
            <p className="text-white text-[15px]">{form.problem}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">{isPickup ? 'Pickup' : 'Visit'} Date</p>
              <p className="text-white font-medium">{isPickup ? form.pickupDate : form.visitDate}</p>
            </div>
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">Time Slot</p>
              <p className="text-white font-medium">{isPickup ? form.pickupTimeSlot : form.visitTimeSlot}</p>
            </div>
          </div>

          {isPickup && (
            <div>
              <p className="text-dark-400 text-xs uppercase tracking-wider">Pickup Address</p>
              <p className="text-white text-[15px]">{form.pickupAddress}</p>
              {form.pickupLandmark && <p className="text-dark-400 text-sm">Landmark: {form.pickupLandmark}</p>}
              <p className="text-dark-400 text-sm">Pincode: {form.pincode}</p>
            </div>
          )}

          <div className="border-t border-white/5 pt-3">
            <p className="text-dark-400 text-xs uppercase tracking-wider">Customer</p>
            <p className="text-white font-medium">{form.fullName}</p>
            <p className="text-dark-400 text-sm">{form.phone}{form.email ? ` | ${form.email}` : ''}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-dark-950 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: 'Book a Service' }]} />
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">Book a Service</h1>
          <p className="text-dark-400 text-[15px] sm:text-base">Tell us about your device and we&apos;ll get it fixed.</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 sm:p-6 md:p-8 backdrop-blur-xl">
          <form onSubmit={(e) => { e.preventDefault(); if (step === steps.length - 1) handleSubmit(); else nextStep(); }} className="space-y-5">
            {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{error}</div>}

            {step === 0 && renderServiceType()}
            {step === 1 && renderDeviceDetails()}
            {step === 2 && renderIssueDetails()}
            {step === 3 && renderCustomerInfo()}
            {step === 4 && renderSummary()}

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                {step > 0 && (
                  <button type="button" onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-dark-700 text-dark-400 hover:text-white hover:border-dark-500 transition-all text-[15px]">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
              </div>
              <button type="submit" disabled={!canProceed() || loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-semibold text-[15px] shadow-electric hover:shadow-electric-hover transition-all disabled:opacity-50">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> :
                  step === steps.length - 1 ? <><Send className="w-4 h-4" /> Confirm Booking</> : <>Continue</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
