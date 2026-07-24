'use client';

import { useState, useRef, useEffect } from 'react';
import { Smartphone, Laptop, Send, Loader2, Store, Truck, ChevronLeft, Check, Upload, X, Camera, MapPin } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import BookingSuccess from '@/components/sections/BookingSuccess';
import SearchableCombobox from '@/components/ui/SearchableCombobox';
import { mobileIssues, laptopIssues } from '@/data/issues';

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
  mobile: [
    'Apple (iPhone)',
    'Samsung',
    'Vivo',
    'Oppo',
    'Realme',
    'Xiaomi / Redmi',
    'OnePlus',
    'Motorola',
    'Nokia',
    'Google Pixel',
    'Nothing',
    'Other'
  ],
  laptop: [
    'HP',
    'Dell',
    'Lenovo',
    'Asus',
    'Acer',
    'Microsoft Surface'
  ],
};

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<{ trackingId: string; serviceType: string } | null>(null);

  const [form, setForm] = useState({
    serviceType: '',
    fullName: '', phone: '', email: '', whatsappNumber: '',
    deviceType: 'mobile', brand: '', model: '', problem: '',
    issueCategory: '', additionalNotes: '', customerPhoto: '',
    visitDate: '', visitTimeSlot: '',
    pickupAddress: '', pickupLandmark: '', pincode: '',
    pickupLatitude: '', pickupLongitude: '',
    pickupDate: '', pickupTimeSlot: '',
  });

  const update = (field: string, value: string | boolean) => setForm(prev => ({ ...prev, [field]: value }));
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [modelError, setModelError] = useState('');
  const isValidPhone = (phone: string) => /^[6-9]\d{9}$/.test(phone);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { alert('Only JPG, PNG, and WEBP files are allowed.'); return; }
    setPhotoUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload/customer-photo', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      update('customerPhoto', url);
    } catch { alert('Failed to upload photo'); }
    setPhotoUploading(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  };

  const validatePincode = (pin: string) => validPincodes.includes(pin);

  const canProceed = () => {
    switch (step) {
      case 0: return !!form.serviceType;
      case 1: return !!form.deviceType && !!form.brand && !!form.model;
      case 2:
        if (!form.issueCategory) return false;
        if (form.issueCategory === 'Other' && !form.problem) return false;
        if (form.serviceType === 'pickup') {
          return !!form.pickupAddress && !!form.pincode && validatePincode(form.pincode) && !!form.pickupDate && !!form.pickupTimeSlot;
        }
        if (form.serviceType === 'self_visit') {
          return !!form.visitDate && !!form.visitTimeSlot;
        }
        return false;
      case 3: return !!form.fullName && !!form.phone && isValidPhone(form.phone);
      case 4: return true;
      default: return false;
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.model) { setModelError('Please enter your device model'); return; }
      else setModelError('');
    }
    if (canProceed()) setStep(s => s + 1);
  };
  const prevStep = () => { if (step > 0) setStep(s => s - 1); };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const problemText = form.issueCategory === 'Other'
        ? form.problem
        : form.issueCategory + (form.additionalNotes ? ` — ${form.additionalNotes}` : '');
      const payload: Record<string, unknown> = {
        fullName: form.fullName, phone: form.phone, email: form.email || undefined,
        deviceType: form.deviceType, brand: form.brand, model: form.model, problem: problemText,
        issueCategory: form.issueCategory,
        additionalNotes: form.additionalNotes || undefined,
        serviceType: form.serviceType,
        customerPhoto: form.customerPhoto || undefined,
      };
      if (form.serviceType === 'self_visit') {
        payload.visitDate = form.visitDate;
        payload.visitTimeSlot = form.visitTimeSlot;
      } else {
        payload.pickupAddress = form.pickupAddress;
        payload.pickupLandmark = form.pickupLandmark || undefined;
        payload.pincode = form.pincode;
        payload.pickupLatitude = form.pickupLatitude ? Number(form.pickupLatitude) : undefined;
        payload.pickupLongitude = form.pickupLongitude ? Number(form.pickupLongitude) : undefined;
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

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser. Please enter address manually.');
      return;
    }
    setLocating(true);
    setLocateError('');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      );
      const { latitude, longitude } = pos.coords;
      update('pickupLatitude', String(latitude));
      update('pickupLongitude', String(longitude));

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (!res.ok) throw new Error('Failed to reverse geocode');
      const data = await res.json();
      const address = data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      update('pickupAddress', address);
    } catch (err: unknown) {
      const msg = err instanceof GeolocationPositionError
        ? err.code === err.PERMISSION_DENIED
          ? 'Location permission denied. Please enter address manually.'
          : err.code === err.TIMEOUT
            ? 'Location request timed out. Please enter address manually.'
            : 'Could not detect location. Please enter address manually.'
        : 'Could not detect location. Please enter address manually.';
      setLocateError(msg);
    }
    setLocating(false);
  };

  if (success && bookingResult) {
    return (
      <BookingSuccess
        trackingId={bookingResult.trackingId}
        serviceType={bookingResult.serviceType}
        onReset={() => {
          setSuccess(false);
          setStep(0);
          setForm(prev => ({ ...prev, serviceType: '', brand: '', model: '', problem: '', issueCategory: '', additionalNotes: '', visitDate: '', visitTimeSlot: '', pickupAddress: '', pickupLandmark: '', pincode: '', pickupDate: '', pickupTimeSlot: '' }));
        }}
      />
    );
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-1 sm:gap-2">
          <div className={`flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
            i === step ? 'bg-sky-50 border border-sky-200 text-sky-600' :
            i < step ? 'bg-green-50 border border-green-200 text-green-600' :
            'bg-gray-50 border border-gray-200 text-gray-400'
          }`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              i < step ? 'bg-green-500 text-white' :
              i === step ? 'bg-sky-500 text-white' :
              'bg-gray-200 text-gray-400'
            }`}>{i < step ? <Check className="w-3 h-3" /> : i + 1}</span>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-4 sm:w-6 h-px ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  const renderServiceType = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      <button type="button" onClick={() => update('serviceType', 'self_visit')}
        className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all ${
          form.serviceType === 'self_visit'
            ? 'border-sky-400 bg-sky-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}>
        {form.serviceType === 'self_visit' && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
          <Store className="w-6 h-6 text-sky-500" />
        </div>
        <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Self Visit</h3>
        <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">Bring your device directly to Sri Mobiles for repair.</p>
      </button>

      <button type="button" onClick={() => update('serviceType', 'pickup')}
        className={`relative p-5 sm:p-6 rounded-2xl border-2 text-left transition-all ${
          form.serviceType === 'pickup'
            ? 'border-sky-400 bg-sky-50 shadow-sm'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}>
        {form.serviceType === 'pickup' && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center">
            <Check className="w-3.5 h-3.5 text-white" />
          </div>
        )}
        <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
          <Truck className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-gray-900 font-semibold text-base sm:text-lg mb-2">Doorstep Pickup</h3>
        <p className="text-gray-500 text-sm sm:text-[15px] leading-relaxed">Our team will collect your device from your location.</p>
      </button>
    </div>
  );

  const renderDeviceDetails = () => (
    <div className="space-y-5">
      <div>
        <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-3">Device Type *</label>
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => { update('deviceType', 'mobile'); update('brand', ''); }}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${
              form.deviceType === 'mobile' ? 'border-sky-400 bg-sky-50 text-sky-600' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}>
            <Smartphone className="w-4 h-4" /> Mobile
          </button>
          <button type="button" onClick={() => { update('deviceType', 'laptop'); update('brand', ''); }}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-xl border text-[15px] font-medium transition-all ${
              form.deviceType === 'laptop' ? 'border-sky-400 bg-sky-50 text-sky-600' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}>
            <Laptop className="w-4 h-4" /> Laptop
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Brand *</label>
          <select required value={form.brand} onChange={(e) => update('brand', e.target.value)}
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all appearance-none">
            <option value="">Select brand</option>
            {brands[form.deviceType]?.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Model *</label>
          <input type="text" required value={form.model} onChange={(e) => { update('model', e.target.value); setModelError(''); }} placeholder="e.g. iPhone 15 Pro"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
          {modelError && <p className="text-red-500 text-xs mt-1.5">{modelError}</p>}
        </div>
      </div>
    </div>
  );

  const renderIssueDetails = () => {
    const isPickup = form.serviceType === 'pickup';
    const issues = form.deviceType === 'mobile' ? mobileIssues : laptopIssues;
    return (
      <div className="space-y-5">
        <SearchableCombobox
          label="What's the Issue?"
          required
          options={issues}
          value={form.issueCategory}
          onChange={(v) => update('issueCategory', v)}
          placeholder="Type to search issues..."
        />

        {form.issueCategory === 'Other' && (
          <div>
            <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Describe Your Issue *</label>
            <textarea required rows={4} value={form.problem} onChange={(e) => update('problem', e.target.value)} placeholder="Please describe the issue you're facing in detail..."
              className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all resize-none" />
          </div>
        )}

        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Additional Notes (optional)</label>
          <textarea rows={2} value={form.additionalNotes} onChange={(e) => update('additionalNotes', e.target.value)} placeholder="Any extra details we should know..."
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all resize-none" />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Upload Photo (optional)</label>
          <p className="text-gray-400 text-xs mb-3">Show us the damage for faster diagnosis</p>
          {form.customerPhoto ? (
            <div className="flex items-center gap-3">
              <img src={form.customerPhoto} alt="Device damage" className="w-24 h-24 rounded-xl object-cover border border-gray-200 shadow-sm" />
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => update('customerPhoto', '')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-all">
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
                <button type="button" onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-all">
                  <Upload className="w-3.5 h-3.5" /> Replace
                </button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => photoInputRef.current?.click()} disabled={photoUploading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-sky-300 hover:text-sky-500 transition-all disabled:opacity-50 text-sm font-medium">
              {photoUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</> : <><Camera className="w-5 h-5" /> Click to Upload Photo</>}
            </button>
          )}
          <input ref={photoInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handlePhotoUpload} className="hidden" />
        </div>

        {isPickup ? (
          <>
                  <div className="border-t border-gray-200 pt-5">
              <h3 className="text-gray-900 font-semibold text-base mb-4">Pickup Address</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-gray-500 text-[13px] uppercase tracking-wider">Full Address *</label>
                    <button type="button" onClick={detectLocation} disabled={locating}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100 transition-all disabled:opacity-50">
                      <MapPin className="w-3.5 h-3.5" />
                      {locating ? 'Detecting...' : 'Detect My Location'}
                    </button>
                  </div>
                  {locateError && (
                    <p className="text-red-500 text-xs mb-2 flex items-center gap-1">
                      <span>⚠</span> {locateError}
                    </p>
                  )}
                  <textarea required rows={2} value={form.pickupAddress} onChange={(e) => update('pickupAddress', e.target.value)} placeholder="Street, area, building details..."
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Landmark</label>
                    <input type="text" value={form.pickupLandmark} onChange={(e) => update('pickupLandmark', e.target.value)} placeholder="Nearby landmark"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Pincode *</label>
                    <input type="text" required value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="500060"
                      className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
                    {form.pincode && !validatePincode(form.pincode) && (
                      <p className="text-red-500 text-xs mt-1.5">Doorstep Pickup is currently available only within 5 KM of Sri Mobiles, Dilsukh Nagar. Please choose Self Visit or contact us directly.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-5">
              <h3 className="text-gray-900 font-semibold text-base mb-4">Pickup Date & Time</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Pickup Date *</label>
                  <input type="date" required value={form.pickupDate} onChange={(e) => update('pickupDate', e.target.value)} min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
                </div>
                <div>
                  <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Time Slot *</label>
                  <select required value={form.pickupTimeSlot} onChange={(e) => update('pickupTimeSlot', e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all appearance-none">
                    <option value="">Select slot</option>
                    {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-gray-900 font-semibold text-base mb-4">Preferred Visit Date & Time</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Visit Date *</label>
                <input type="date" required value={form.visitDate} onChange={(e) => update('visitDate', e.target.value)} min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
              </div>
              <div>
                <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Visit Time *</label>
                <select required value={form.visitTimeSlot} onChange={(e) => update('visitTimeSlot', e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all appearance-none">
                  <option value="">Select time</option>
                  {timeSlots.map(s => <option key={s} value={s}>{s}</option>)}
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
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Full Name *</label>
          <input type="text" required value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="John Doe"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
        </div>
        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Phone *</label>
          <input type="tel" required value={form.phone} onChange={(e) => {
              const val = e.target.value;
              update('phone', val);
              if (val && !isValidPhone(val)) setPhoneError('Please enter a valid 10-digit Indian mobile number');
              else setPhoneError('');
            }} placeholder="9876543210"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
          {phoneError && <p className="text-red-500 text-xs mt-1.5">{phoneError}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">Email (optional)</label>
          <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
        </div>
        <div>
          <label className="block text-gray-500 text-[13px] uppercase tracking-wider mb-2">WhatsApp Number (optional)</label>
          <input type="tel" value={form.whatsappNumber} onChange={(e) => update('whatsappNumber', e.target.value)} placeholder="Same as phone if blank"
            className="w-full px-4 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-[15px] placeholder:text-gray-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-200 transition-all" />
        </div>
      </div>
    </div>
  );

  const renderSummary = () => {
    const isPickup = form.serviceType === 'pickup';
    return (
      <div className="space-y-5">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            {isPickup ? <Truck className="w-5 h-5 text-blue-500" /> : <Store className="w-5 h-5 text-sky-500" />}
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Service Type</p>
              <p className="text-gray-900 font-medium">{isPickup ? 'Doorstep Pickup' : 'Self Visit'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Device</p>
              <p className="text-gray-900 font-medium">{form.brand} {form.model}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Type</p>
              <p className="text-gray-900 font-medium capitalize">{form.deviceType}</p>
            </div>
          </div>

          <div>
            <p className="text-gray-400 text-xs uppercase tracking-wider">Issue</p>
            <p className="text-gray-900 text-[15px]">{form.issueCategory}{form.issueCategory !== 'Other' && form.issueCategory ? ' / ' : ''}{form.issueCategory === 'Other' ? form.problem : ''}</p>
            {form.additionalNotes && <p className="text-gray-400 text-sm mt-1">Notes: {form.additionalNotes}</p>}
          {form.customerPhoto && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Uploaded Photo</p>
              <img src={form.customerPhoto} alt="Device damage" className="w-32 h-32 rounded-xl object-cover border border-gray-200 shadow-sm" />
            </div>
          )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">{isPickup ? 'Pickup' : 'Visit'} Date</p>
              <p className="text-gray-900 font-medium">{isPickup ? form.pickupDate : form.visitDate}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Time Slot</p>
              <p className="text-gray-900 font-medium">{isPickup ? form.pickupTimeSlot : form.visitTimeSlot}</p>
            </div>
          </div>

          {isPickup && (
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Pickup Address</p>
              <p className="text-gray-900 text-[15px]">{form.pickupAddress}</p>
              {form.pickupLandmark && <p className="text-gray-400 text-sm">Landmark: {form.pickupLandmark}</p>}
              <p className="text-gray-400 text-sm">Pincode: {form.pincode}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-3">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Customer</p>
            <p className="text-gray-900 font-medium">{form.fullName}</p>
            <p className="text-gray-400 text-sm">{form.phone}{form.email ? ` | ${form.email}` : ''}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 sm:pt-24 pb-12 sm:pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={[{ label: 'Book a Service' }]} />
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Book a Service</h1>
          <p className="text-gray-500 text-[15px] sm:text-base">Tell us about your device and we&apos;ll get it fixed.</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 md:p-8 shadow-card">
          <form onSubmit={(e) => { e.preventDefault(); if (step === steps.length - 1) handleSubmit(); else nextStep(); }} className="space-y-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

            {step === 0 && renderServiceType()}
            {step === 1 && renderDeviceDetails()}
            {step === 2 && renderIssueDetails()}
            {step === 3 && renderCustomerInfo()}
            {step === 4 && renderSummary()}

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                {step > 0 && (
                  <button type="button" onClick={prevStep}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all text-[15px]">
                    <ChevronLeft className="w-4 h-4" /> Back
                  </button>
                )}
              </div>
              <button type="submit" disabled={!canProceed() || loading}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sky-500 text-white font-semibold text-[15px] hover:bg-sky-600 transition-all disabled:opacity-50 shadow-sm">
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
