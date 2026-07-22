'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/Container';

export function MapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 md:py-28 bg-gray-50">
      <Container ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Visit Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Find Us on{' '}
              <span className="text-gradient-gold">
                the Map
              </span>
            </h2>
          </div>

          <div className="relative rounded-[20px] overflow-hidden border border-gold/30 shadow-md">
            {/* Clickable map overlay */}
            <a
              href="https://maps.app.goo.gl/qjdLNBPno4Nn8E1cA"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 z-10 cursor-pointer"
              aria-label="Open Sri Mobiles on Google Maps"
            />

            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/90 border border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                <Navigation className="w-4 h-4 text-sky-500" />
                <span>Dilsukh Nagar, Chaitanyapuri, Hyderabad</span>
              </div>
            </div>

            <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.3667!2d78.5304853!3d17.368097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99afc6f35505%3A0xac66d7f3f723377c!2sSri%20Mobiles!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Mobiles Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex flex-col sm:flex-row gap-2">
              <a
                href="https://maps.app.goo.gl/qjdLNBPno4Nn8E1cA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm text-sm font-medium transition-all whitespace-nowrap"
              >
                Open in Google Maps
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Sri+Mobiles,+Metro+Pillar+No.1563,+Chaitanyapuri,+Hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gold text-white hover:bg-amber-500 shadow-sm text-sm font-medium transition-all whitespace-nowrap"
              >
                Get Directions
                <Navigation className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
