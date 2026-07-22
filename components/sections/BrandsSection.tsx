'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { brands } from '@/data/brands';

export function BrandsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="brands" className="py-14 md:py-28 bg-white">
      <Container ref={ref}>
        <SectionTitle
          badge="Supported Brands"
          title="We Repair"
          highlight="All Major Brands"
          description="From Apple to MSI, we service devices from 15+ world-leading brands with genuine parts and manufacturer-grade precision."
        />

        {/* Mobile: compact brand pills */}
        <div className="grid grid-cols-3 gap-2 md:hidden">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center justify-center px-3 py-2.5 rounded-full bg-white border border-gold/15 active:bg-gold/5 active:border-gold/30 transition-all"
            >
              <span className="text-[14px] font-medium text-gray-700 truncate">{brand.name}</span>
            </motion.div>
          ))}
        </div>

        {/* Tablet/Desktop: card grid with logos */}
        <div className="hidden md:grid md:grid-cols-5 gap-4">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:border-gray-200 transition-all duration-300 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-gray-300 transition-all duration-300 overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={56}
                  height={56}
                  className={`w-14 h-14 object-contain transition-opacity duration-300 ${
                    brand.id === 'apple'
                      ? 'opacity-100 group-hover:opacity-100 brightness-0'
                      : 'opacity-70 group-hover:opacity-100'
                  }`}
                />
              </div>
              <div className="text-center">
                <span className="text-base font-medium text-gray-700 group-hover:text-sky-500 transition-colors">
                  {brand.name}
                </span>
                <span className="block text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">
                  {brand.category}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
