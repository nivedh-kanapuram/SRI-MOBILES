'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
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
    alt: 'Shop Front',
    category: 'shop',
  },
  {
    id: '2',
    src: '/gallery/customer-service-counter.jpeg',
    alt: 'Service Center',
    category: 'service',
  },
  {
    id: '3',
    src: '/gallery/front-desk.jpeg',
    alt: 'Front Desk',
    category: 'service',
  },
  {
    id: '4',
    src: '/gallery/customer-waiting-area.jpeg',
    alt: 'Waiting Area',
    category: 'shop',
  },
  {
    id: '5',
    src: '/gallery/repair-workstation.jpeg',
    alt: 'Repair Workstation',
    category: 'repair',
  },
  {
    id: '6',
    src: '/gallery/parts-inventory.jpeg',
    alt: 'Inventory Area',
    category: 'repair',
  },
];

const SLOTS = [
  {
    offset: -1,
    left: 'calc(-65% + 8%)',
    width: '65%',
    scale: 0.9,
    opacity: 0.55,
    z: 5,
    blur: 'blur(2px)',
  },
  {
    offset: 0,
    left: '12%',
    width: '76%',
    scale: 1,
    opacity: 1,
    z: 10,
    blur: 'blur(0px)',
  },
  {
    offset: 1,
    left: '92%',
    width: '65%',
    scale: 0.9,
    opacity: 0.55,
    z: 5,
    blur: 'blur(2px)',
  },
];

export function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const interactingRef = useRef(false);

  const filtered = galleryImages;

  const openLightbox = useCallback((index: number) => {
    if (!filtered[index]?.src) { console.error('Gallery image src missing at index:', index); return; }
    setLightboxIndex(index);
  }, [filtered]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(() => setLightboxIndex((prev) => prev !== null ? (prev - 1 + filtered.length) % filtered.length : null), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIndex((prev) => prev !== null ? (prev + 1) % filtered.length : null), [filtered.length]);

  const paginate = useCallback((dir: number) => {
    interactingRef.current = true;
    setActiveIndex(prev => (prev + dir + filtered.length) % filtered.length);
    setTimeout(() => { interactingRef.current = false; }, 5000);
  }, [filtered.length]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x < -40) paginate(1);
    else if (info.offset.x > 40) paginate(-1);
    else interactingRef.current = false;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!interactingRef.current) paginate(1);
    }, 4000);
    return () => clearInterval(timer);
  }, [paginate]);

  const slotImageIndex = (offset: number) =>
    (activeIndex + offset + filtered.length) % filtered.length;

  return (
    <section id="gallery" className="py-12 md:py-28 bg-white relative overflow-hidden">
      <Container ref={ref}>
        <SectionTitle
          badge="Gallery"
          title="Our"
          highlight="Workshop"
          description="Take a virtual tour of our state-of-the-art repair facility and modern customer spaces."
          className="mb-4 sm:mb-12 md:mb-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
          className="mb-2 md:mb-10"
        >
          <p className="text-center text-sm text-gray-500">
            Browse our latest workshop photos below.
          </p>
        </motion.div>

        <div className="hidden md:grid grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((image, i) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
                whileTap={{ scale: 0.97 }}
                className="group cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <div className={cn(
                  'relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-card',
                  'transition-all duration-300 ease-out',
                  'sm:hover:border-gold/50 sm:hover:shadow-[0_0_24px_rgba(212,175,55,0.25)] sm:hover:-translate-y-1.5 sm:hover:scale-[1.02]',
                  'active:border-gold/50 active:shadow-[0_0_24px_rgba(212,175,55,0.25)] active:-translate-y-1.5 active:scale-[1.02]'
                )}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-all duration-300 ease-out sm:group-hover:brightness-110 group-active:brightness-110"
                    sizes="33vw"
                    priority={i < 3}
                    loading={i < 3 ? undefined : 'lazy'}
                  />
                </div>
                <div className="mt-3 overflow-hidden rounded-2xl bg-white border border-gray-100 px-3 py-2 text-center transition-all duration-300 sm:group-hover:border-gold/30 sm:group-hover:bg-gold/5">
                  <p className="text-sm font-medium text-gray-700">
                    {image.alt}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="md:hidden -mx-6">
          <div className="relative">
            <div className="relative h-[260px] overflow-hidden">
              {SLOTS.map((slot) => {
                const imgIndex = slotImageIndex(slot.offset);
                const image = filtered[imgIndex];
                return (
                  <div
                    key={`slot-${slot.offset}`}
                    className="absolute cursor-pointer"
                    style={{ left: slot.left, width: slot.width, top: '50%' }}
                    onClick={() => openLightbox(imgIndex)}
                  >
                    <motion.div
                      className="relative"
                      initial={{ y: '-50%' }}
                      animate={{ y: '-50%', scale: slot.scale, opacity: slot.opacity, zIndex: slot.z }}
                      transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.8 }}
                      {...(slot.offset === 0 ? { drag: 'x' as const, dragConstraints: { left: 0, right: 0 }, onDragEnd: handleDragEnd, dragElastic: 0.1 } : {})}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={imgIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-xl"
                          style={{ filter: slot.blur }}
                        >
                          <Image
                            src={image.src}
                            alt={image.alt}
                            fill
                            className="object-cover object-center"
                            sizes="80vw"
                            loading={slot.offset === 0 ? 'eager' : 'lazy'}
                            priority={slot.offset === 0}
                          />
                        </motion.div>
                      </AnimatePresence>
                      {slot.offset === 0 && (
                        <motion.p
                          key={`label-${imgIndex}`}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.15 }}
                          className="text-center text-xs font-medium text-gray-700 mt-2"
                        >
                          {image.alt}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-gold/30 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-3">
            {filtered.map((_, i) => (
              <button
                key={i}
                className={`rounded-full transition-all duration-300 ${i === activeIndex ? 'w-5 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-gray-300'}`}
                onClick={() => { setActiveIndex(i); interactingRef.current = true; setTimeout(() => { interactingRef.current = false; }, 5000); }}
              />
            ))}
          </div>
        </div>
      </Container>

      <AnimatePresence>
        {lightboxIndex !== null && filtered[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-[80] bg-black/85 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <div className="relative z-10 flex items-center justify-center max-w-[90vw] max-h-[85vh]">
              <img
                src={filtered[lightboxIndex].src}
                alt={filtered[lightboxIndex].alt}
                className="max-w-[90vw] max-h-[85vh] w-auto h-auto object-contain rounded-2xl shadow-[0_0_48px_rgba(212,175,55,0.2)]"
                style={{ display: 'block', opacity: 1, visibility: 'visible' }}
              />
            </div>

            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors z-20 backdrop-blur-sm"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors z-20 backdrop-blur-sm"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors z-20 backdrop-blur-sm"
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
