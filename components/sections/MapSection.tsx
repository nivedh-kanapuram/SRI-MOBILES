'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function MapSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />

      <Container ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric-500/10 border border-electric-500/20 text-electric-400 text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" />
              Visit Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Find Us on{' '}
              <span className="bg-gradient-to-r from-electric-400 to-electric-600 bg-clip-text text-transparent">
                the Map
              </span>
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-premium">
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-dark-900/80 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm">
                <Navigation className="w-4 h-4 text-electric-400" />
                <span>Dilsukh Nagar, Chaitanyapuri, Hyderabad</span>
              </div>
            </div>

            <div className="aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3808.3667!2d78.5300985!3d17.368097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae4d24f016af7d65!2sSri%20Mobiles-Multi%20Brand%20Mobile%20%26%20Laptop%20Service%20Center!5e0!3m2!1sen!2sin!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.95)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sri Mobiles Location"
                className="absolute inset-0 w-full h-full"
              />
            </div>

            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 z-10">
              <Button
                variant="glass"
                size="sm"
                asChild
              >
                <a
                  href="https://maps.google.com/?q=Sri+Mobiles+Multi+Brand+Mobile+Laptop+Service+Center+Chaitanyapuri+Hyderabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Open in Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}