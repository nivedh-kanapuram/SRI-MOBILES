'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, MessageCircle, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Device Needs{' '}
            <span className="text-gradient-gold">
              Professional Repair?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto"
          >
            Get a free diagnosis and transparent quote today. Same-day service available for most repairs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="tel:+919948299426"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 shadow-sm transition-all w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              Call Now
              <ChevronRight className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/919948299426"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl border-2 border-[#25D366] text-[#25D366] font-semibold hover:bg-[#25D366]/10 transition-all w-full sm:w-auto"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp Us
            </a>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
