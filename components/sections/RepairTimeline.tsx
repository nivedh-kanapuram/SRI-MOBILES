'use client';

import { Check } from 'lucide-react';

interface RepairTimelineProps {
  status: string;
}

const statusSteps = [
  { key: 'booking_confirmed', label: 'Booking Confirmed' },
  { key: 'device_received', label: 'Device Received' },
  { key: 'diagnosis_complete', label: 'Diagnosis Complete' },
  { key: 'repair_in_progress', label: 'Repair In Progress' },
  { key: 'waiting_for_parts', label: 'Waiting for Parts' },
  { key: 'ready_for_pickup', label: 'Ready for Pickup' },
  { key: 'completed', label: 'Completed' },
];

const oldStatusMap: Record<string, number> = {
  pending: 0, accepted: 1, in_progress: 3, waiting_for_parts: 4, ready_for_pickup: 5,
};

function getStepIndex(status: string): number {
  const idx = statusSteps.findIndex(s => s.key === status);
  if (idx >= 0) return idx;
  return oldStatusMap[status] ?? -1;
}

export default function RepairTimeline({ status }: RepairTimelineProps) {
  const currentStep = getStepIndex(status);

  if (currentStep < 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-card">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-5">Repair Progress</h4>
      <div className="space-y-0">
        {statusSteps.map((step, i) => {
          const isPast = currentStep > i;
          const isActive = currentStep === i;
          return (
            <div key={step.key} className="flex items-start gap-3 pb-4 last:pb-0">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isPast
                    ? 'bg-green-100 text-green-600 border-2 border-green-300'
                    : isActive
                    ? 'bg-sky-100 text-sky-600 border-2 border-sky-400 shadow-sm'
                    : 'bg-gray-50 text-gray-300 border-2 border-gray-200'
                }`}>
                  {isPast ? (
                    <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  ) : (
                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-sky-500' : 'bg-gray-300'}`} />
                  )}
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`w-0.5 h-6 ${isPast ? 'bg-green-300' : isActive ? 'bg-sky-300' : 'bg-gray-200'}`} />
                )}
              </div>
              <div className="pt-1">
                <p className={`text-sm font-medium ${
                  isPast
                    ? 'text-green-700'
                    : isActive
                    ? 'text-sky-700 font-semibold'
                    : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
