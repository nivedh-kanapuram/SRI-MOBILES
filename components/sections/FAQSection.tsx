'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/data/faq';
import { cn } from '@/lib/utils';

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="hidden md:block py-20 md:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
            FAQ
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked <span className="text-gradient-gold">Questions</span>
          </h2>
          <p className="text-gray-500">Everything you need to know about our repair services.</p>
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
                    ? 'bg-gray-50 border-gold/30 shadow-sm'
                    : 'bg-white border-gray-100 hover:border-gray-200'
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
                      isOpen ? 'bg-gold/20 text-gold' : 'bg-gray-100 text-gray-400'
                    )}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <span className={cn(
                      'font-medium text-[15px] md:text-base transition-colors',
                      isOpen ? 'text-gray-900' : 'text-gray-600'
                    )}>
                      {faq.question}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'flex-shrink-0 transition-all duration-200',
                      isOpen ? 'rotate-180 text-gold' : 'text-gray-400'
                    )}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pl-12 sm:pl-16 md:pl-[4.5rem]">
                    <p className="text-gray-500 text-[15px] leading-relaxed">
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
