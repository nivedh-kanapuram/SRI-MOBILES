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
    <section id="brands" className="py-20 md:py-28 bg-dark-900/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-electric-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-electric-600/5 rounded-full blur-[150px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="Supported Brands"
          title="We Repair"
          highlight="All Major Brands"
          description="From Apple to MSI, we service devices from 15+ world-leading brands with genuine parts and manufacturer-grade precision."
        />

        {/* Mobile: compact 2-column text list */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 active:bg-electric-500/10 active:border-electric-500/30 transition-all"
            >
              <span className="text-[15px] font-medium text-dark-300">{brand.name}</span>
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
              className="group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-electric-500/30 hover:bg-electric-500/5 transition-all duration-300 cursor-pointer"
            >
              <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center group-hover:border-electric-500/30 transition-all duration-300 overflow-hidden">
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={56}
                  height={56}
                  unoptimized
                  className={`w-14 h-14 object-contain transition-opacity duration-300 ${
                    brand.id === 'apple'
                      ? 'opacity-100 group-hover:opacity-100 invert'
                      : 'opacity-70 group-hover:opacity-100'
                  }`}
                />
              </div>
              <div className="text-center">
                <span className="text-base font-medium text-dark-300 group-hover:text-electric-400 transition-colors">
                  {brand.name}
                </span>
                <span className="block text-[11px] text-dark-500 uppercase tracking-wider mt-0.5">
                  {brand.category}
                </span>
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-electric-500/0 to-electric-500/0 group-hover:from-electric-500/5 group-hover:to-electric-600/5 transition-all duration-300" />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
