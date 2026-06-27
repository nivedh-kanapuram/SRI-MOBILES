'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Shield, Clock, Smartphone, Laptop, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Container } from '@/components/ui/Container';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { label: 'Devices Repaired', value: 15000, suffix: '+', icon: Smartphone },
  { label: 'Happy Customers', value: 12000, suffix: '+', icon: Star },
  { label: 'Years Experience', value: 12, suffix: '+', icon: Clock },
  { label: 'Brands Supported', value: 15, suffix: '+', icon: Laptop },
];

function StatCard({ label, value, suffix, icon: Icon, delay }: { label: string; value: number; suffix: string; icon: React.ElementType; delay: number }) {
  const { count, start } = useCountUp(value, 2000);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (isInView) start();
  }, [isInView, start]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center text-center p-4"
    >
      <div className="w-12 h-12 rounded-xl bg-electric-500/10 border border-electric-500/20 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-electric-400" />
      </div>
      <div                 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
        {count.toLocaleString()}
        <span className="text-electric-400">{suffix}</span>
      </div>
      <div className="text-dark-400 text-[15px] mt-1.5">{label}</div>
    </motion.div>
  );
}

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-500/5 rounded-full blur-[150px]" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-electric-500/10"
            style={{
              width: 40 + i * 20,
              height: 40 + i * 20,
              top: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -right-10 sm:-right-20 top-1/3 opacity-10 hidden sm:block"
          animate={{ y: [-20, 20, -20], rotate: [-5, 5, -5] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Smartphone className="w-24 h-24 sm:w-40 sm:h-40 text-electric-500" />
        </motion.div>
        <motion.div
          className="absolute -left-6 sm:-left-10 bottom-1/3 opacity-10 hidden sm:block"
          animate={{ y: [20, -20, 20], rotate: [5, -5, 5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Laptop className="w-32 h-32 sm:w-48 sm:h-48 text-electric-500" />
        </motion.div>
      </div>

      <Container className="relative z-10 pt-32 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
            <Badge variant="electric" dot>
              Trusted by 12,000+ Customers
            </Badge>
            <Badge variant="premium">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" />
                4.5
              </span>
            </Badge>
            <Badge variant="outline">
              <span className="flex items-center gap-1">
                109 Reviews
              </span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
          >
            Expert{' '}
            <span className="bg-gradient-to-r from-electric-400 via-electric-500 to-electric-600 bg-clip-text text-transparent">
              Mobile & Laptop
            </span>
            <br />
            Repair Service
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg md:text-xl text-dark-400 max-w-2xl mx-auto leading-relaxed"
          >
            Hyderabad&apos;s premium multi-brand service center. Same-day repairs with genuine parts, 
            certified technicians, and warranty on all services.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" variant="electric" asChild>
              <a href="/booking" className="gap-2.5">
                Book Repair
                <ChevronRight className="w-5 h-5" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://wa.me/919948299426" target="_blank" rel="noopener noreferrer" className="gap-2.5 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2 text-[15px] text-dark-400">
              <Shield className="w-4 h-4 text-electric-400" />
              <span>Warranty on All Repairs</span>
            </div>
            <div className="flex items-center gap-2 text-[15px] text-dark-400">
              <Clock className="w-4 h-4 text-electric-400" />
              <span>Same Day Service</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 border-t border-white/5 pt-6 sm:pt-12"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={0.5 + i * 0.1} />
            ))}
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-6 md:hidden flex flex-col items-center gap-3"
          >
            <p className="text-dark-300 text-sm font-medium mb-1">Device Needs Professional Repair?</p>
            <div className="flex flex-col w-full gap-2.5">
              <Button size="lg" variant="electric" asChild className="w-full justify-center">
                <a href="tel:+919948299426" className="gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Call Now
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full justify-center">
                <a href="https://wa.me/919948299426" target="_blank" rel="noopener noreferrer" className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}