'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Award, Users, Shield, Heart } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

const values = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'No hidden charges, upfront pricing on every repair.' },
  { icon: Award, title: 'Excellence', desc: 'Certified technicians delivering OEM-quality results.' },
  { icon: Users, title: 'Customer First', desc: '12,000+ happy customers and counting.' },
  { icon: Heart, title: 'Passion', desc: 'Genuine care for every device we repair.' },
];

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-electric-500/5 rounded-full blur-[150px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="About Us"
          title="Your Trusted"
          highlight="Repair Partner"
          description="Over a decade of experience restoring devices to their peak performance with precision, care, and genuine parts."
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <div className="space-y-4 text-dark-400 leading-relaxed">
              <p>
                Our <span className="text-white font-semibold">Sri Mobiles</span> has grown into 
                Hyderabad&apos;s most trusted multi-brand repair service center. What started as a small repair shop 
                and has evolved into a state-of-the-art facility serving thousands of satisfied customers.
              </p>
              <p>
                We specialize in <span className="text-electric-400">mobile and laptop repairs</span> for all major 
                brands including Apple, Samsung, OnePlus, Dell, HP, Lenovo, and more. Our certified technicians 
                use genuine parts and advanced microsoldering equipment to deliver results that meet or exceed 
                manufacturer standards.
              </p>
              <p>
                From simple screen replacements to complex motherboard-level repairs, we handle it all with 
                the same level of professionalism and attention to detail that has earned us a{' '}
                <span className="text-white font-semibold">4.5-star rating from 111+ verified reviews</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-4">
              {values.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-electric-500/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-electric-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{item.title}</h4>
                    <p className="text-dark-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-900 border border-white/5 p-6 sm:p-8 md:p-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-electric-500/10 rounded-full blur-[80px]" />

              <div className="relative space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-500 to-electric-600 flex items-center justify-center">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Our Mission</h3>
                    <p className="text-electric-400 text-sm">Making expert repair accessible to everyone</p>
                  </div>
                </div>

                <blockquote className="border-l-2 border-electric-500 pl-4 py-2">
                  <p className="text-dark-300 italic leading-relaxed">
                    &ldquo;To provide fast, reliable, and affordable repair services using genuine parts and 
                    certified expertise — making every customer feel confident that their device is in the 
                    best hands.&rdquo;
                  </p>
                </blockquote>

                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/5">
                  {[
                    { num: '12+', label: 'Years in Business' },
                    { num: '15K+', label: 'Devices Repaired' },
                    { num: '4.5★', label: 'Google Rating' },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-lg sm:text-2xl font-bold text-white">{stat.num}</div>
                      <div className="text-dark-500 text-[10px] sm:text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border border-electric-500/10 -z-10" />
            <div className="absolute -bottom-8 -right-8 w-full h-full rounded-3xl border border-electric-500/5 -z-20" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}