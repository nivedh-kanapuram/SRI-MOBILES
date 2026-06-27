'use client';

import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { cn } from '@/lib/utils';

const galleryImages = [
  {
    id: '1',
    src: '/gallery/sri-mobiles-service-center-front.jpeg',
    alt: 'Sri Mobiles Service Center Front',
    category: 'shop',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    id: '2',
    src: '/gallery/repair-workstation.jpeg',
    alt: 'Repair Workstation',
    category: 'repair',
    color: 'from-emerald-500/20 to-teal-500/20',
  },
  {
    id: '3',
    src: '/gallery/customer-waiting-area.jpeg',
    alt: 'Customer Waiting Area',
    category: 'shop',
    color: 'from-orange-500/20 to-red-500/20',
  },
  {
    id: '4',
    src: '/gallery/front-desk.jpeg',
    alt: 'Front Desk',
    category: 'repair',
    color: 'from-violet-500/20 to-indigo-500/20',
  },
  {
    id: '5',
    src: '/gallery/customer-service-counter.jpeg',
    alt: 'Customer Service Counter',
    category: 'service',
    color: 'from-cyan-500/20 to-blue-500/20',
  },
  {
    id: '6',
    src: '/gallery/parts-inventory.jpeg',
    alt: 'Parts Inventory',
    category: 'service',
    color: 'from-green-500/20 to-emerald-500/20',
  },
];

export function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [touchActive, setTouchActive] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered = galleryImages;

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((prev) => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null);
  const nextImage = () => setLightboxIndex((prev) => prev !== null ? (prev + 1) % filtered.length : null);

  return (
    <section id="gallery" className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-electric-500/5 rounded-full blur-[200px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="Gallery"
          title="Our"
          highlight="Workshop"
          description="Take a virtual tour of our state-of-the-art repair facility and modern customer spaces."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
          className="mb-6 sm:mb-10"
        >
          <p className="text-center text-sm text-dark-300">
            Browse our latest workshop photos below.
          </p>
        </motion.div>

        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((image, i) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1], delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.97 }}
                className="group"
              >
                <div
                  className={cn(
                    'relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-black/20 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-2 hover:shadow-[0_24px_80px_rgba(34,211,238,0.16)] hover:ring-1 hover:ring-cyan-400/30',
                    touchActive === image.id && 'translate-y-[-4px] shadow-[0_24px_80px_rgba(34,211,238,0.35)] ring-1 ring-cyan-400/35'
                  )}
                  onClick={() => openLightbox(i)}
                  onTouchStart={() => setTouchActive(image.id)}
                  onTouchEnd={() => setTouchActive(null)}
                  onTouchCancel={() => setTouchActive(null)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    onLoadingComplete={() => handleImageLoad(image.id)}
                    className="object-cover transition-transform duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:scale-[1.08]"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                    unoptimized
                  />
                  <div className={cn(
                    'absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:opacity-100',
                    touchActive === image.id && 'opacity-100'
                  )} />

                  {!loadedImages[image.id] && (
                    <div className="absolute inset-0 bg-slate-950/80">
                      <div className="absolute inset-0 animate-[shimmer_1.6s_linear_infinite] bg-[linear-gradient(90deg,rgba(15,23,42,0.95)_0%,rgba(148,163,184,0.14)_50%,rgba(15,23,42,0.95)_100%)] bg-[length:200%_100%]" />
                    </div>
                  )}
                </div>

                <div className="hidden sm:block mt-3 overflow-hidden rounded-2xl bg-slate-950/90 px-3 py-2 text-center transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:bg-cyan-500/10">
                  <p className="text-sm font-medium text-white opacity-0 translate-y-3 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] group-hover:opacity-100 group-hover:translate-y-0">
                    {image.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <div className="w-full max-w-4xl aspect-[4/3] mx-2 sm:mx-4 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className={cn('w-full h-full bg-gradient-to-br flex items-center justify-center', filtered[lightboxIndex]?.color)}>
                <div className="text-center px-4">
                  <p className="text-white/60 text-base sm:text-lg font-medium">{filtered[lightboxIndex]?.alt}</p>
                  <p className="text-white/30 text-xs sm:text-sm mt-1 capitalize">{filtered[lightboxIndex]?.category}</p>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
