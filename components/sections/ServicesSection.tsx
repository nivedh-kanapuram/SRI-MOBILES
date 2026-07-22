'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Smartphone, Battery, Usb, Cpu, Monitor, HardDrive, Droplet, MemoryStick,
  ChevronRight, Clock,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { services } from '@/data/services';

const iconMap: Record<string, React.ElementType> = {
  smartphone: Smartphone,
  battery: Battery,
  usb: Usb,
  cpu: Cpu,
  monitor: Monitor,
  'hard-drive': HardDrive,
  droplet: Droplet,
  'memory-stick': MemoryStick,
};

export function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="services" className="py-20 md:py-28 bg-gray-50 relative overflow-hidden">
      <div className="border-t border-gray-200" />

      <Container ref={ref}>
        <SectionTitle
          badge="Our Services"
          title="Professional"
          highlight="Repair Solutions"
          description="Comprehensive repair services for all mobile and laptop issues with genuine parts and certified expertise."
        />

        {/* Mobile: compact 2-column icon+name grid */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Smartphone;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 active:bg-amber-50 active:border-amber-200 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-sky-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-sky-500" />
                </div>
                <span className="text-[15px] font-medium text-gray-900 leading-tight">{service.title}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Tablet/Desktop: full card grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] || Smartphone;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <div className="relative h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover hover:border-gray-200 transition-all duration-300 -translate-y-0 hover:-translate-y-1">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-gray-100 flex items-center justify-center mb-5 group-hover:bg-sky-100 transition-all duration-300">
                      <Icon className="w-7 h-7 text-sky-500" />
                    </div>

                    <h3 className="text-gray-900 font-semibold text-xl mb-1.5 group-hover:text-amber-500 transition-colors">
                      {service.title}
                    </h3>

                    {service.estimate && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-500 text-sm font-medium">{service.estimate}</span>
                      </div>
                    )}

                    <p className="text-gray-500 text-[15px] leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="space-y-1.5 mb-5">
                      {service.features.slice(0, 3).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="w-1 h-1 rounded-full bg-amber-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#contact"
                      className="inline-flex items-center gap-1.5 text-[15px] font-medium text-amber-500 hover:text-amber-600 transition-colors group/link"
                    >
                      Get Quote
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </a>
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
