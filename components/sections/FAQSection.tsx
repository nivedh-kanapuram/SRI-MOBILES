'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/data/faq';
import { cn } from '@/lib/utils';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 md:py-28 bg-dark-900/50 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Frequently Asked <span className="text-electric-400">Questions</span>
          </h2>
          <p className="text-dark-400">Everything you need to know about our repair services.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.id}
                className={cn(
                  'rounded-2xl border transition-all duration-300',
                  isOpen
                    ? 'bg-white/[0.03] border-electric-500/30 shadow-lg shadow-electric-500/5'
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex items-center justify-between gap-3 sm:gap-4 w-full p-4 sm:p-5 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors',
                      isOpen ? 'bg-electric-500/20 text-electric-400' : 'bg-dark-800 text-dark-500'
                    )}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className={cn(
                      'font-medium text-[15px] md:text-base transition-colors',
                      isOpen ? 'text-white' : 'text-dark-300'
                    )}>
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex-shrink-0 transition-all duration-200',
                      isOpen ? 'rotate-180 text-electric-400' : 'text-dark-500'
                    )}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-12 sm:pl-16 md:pl-[4.5rem]">
                    <p className="text-dark-400 text-[15px] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
