'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck, GraduationCap, Clock, BadgeCheck, Tag, Zap,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { whyChooseUs } from '@/data/why-choose-us';

const iconMap: Record<string, React.ElementType> = {
  'shield-check': ShieldCheck,
  'graduation-cap': GraduationCap,
  clock: Clock,
  'badge-check': BadgeCheck,
  tag: Tag,
  zap: Zap,
};

export function WhyChooseUsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="why-choose-us" className="py-20 md:py-28 bg-dark-900/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-electric-500/5 rounded-full blur-[150px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="Why Us"
          title="Why Choose"
          highlight="Sri Mobiles"
          description="We go beyond repairs — we deliver peace of mind with genuine parts, certified expertise, and transparent service."
        />

        {/* Mobile: compact 2-column icon + title grid */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 active:bg-electric-500/10 active:border-electric-500/30 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-electric-500/10 border border-electric-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-electric-400" />
                </div>
                <span className="text-[15px] font-semibold text-white leading-tight">{item.title}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Desktop: full card layout with descriptions */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyChooseUs.map((item, i) => {
            const Icon = iconMap[item.icon] || ShieldCheck;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div className="relative h-full p-5 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-electric-500/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-electric-500/0 group-hover:bg-electric-500/5 rounded-full blur-[60px] transition-all duration-500" />

                  <div className="relative flex items-start gap-3 sm:gap-4">
                    <motion.div
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-electric-500/20 group-hover:shadow-electric transition-all duration-300"
                    >
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-electric-400" />
                    </motion.div>

                    <div>
                      <h3 className="text-white font-semibold text-lg sm:text-xl mb-1.5 sm:mb-2 group-hover:text-electric-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-dark-400 text-sm sm:text-[15px] leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
