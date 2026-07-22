'use client';

import { useEffect, useRef, useState } from 'react';

import { motion, useInView } from 'framer-motion';
import { Star, Shield, Clock, Smartphone, Laptop, ChevronRight, MessageCircle, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { useCountUp } from '@/hooks/useCountUp';

const typingPhrases = [
  '📱 Mobile Repair Experts',
  '💻 Laptop Repair Specialists',
  '🔧 Chip-Level Repair Services',
  '🚚 Doorstep Pickup Available',
  '🛡 Genuine Parts & Warranty',
];

const stats = [
  { label: 'Devices Repaired', value: 5000, suffix: '+', icon: Smartphone },
  { label: 'Happy Customers', value: 3500, suffix: '+', icon: Star },
  { label: 'Years Experience', value: 15, suffix: '+', icon: Clock },
  { label: 'Brands Supported', value: 10, suffix: '+', icon: Laptop },
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
      className="bg-white rounded-xl border border-gray-100 shadow-card p-4 sm:p-6 text-center"
    >
      <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-sky-500" />
      </div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
        {count.toLocaleString()}
        <span className="text-gold">{suffix}</span>
      </div>
      <div className="text-gray-500 text-[15px] mt-1.5">{label}</div>
    </motion.div>
  );
}

function ServiceTyping() {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = typingPhrases[idx];
    let timer: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), 70);
      } else {
        timer = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(text.slice(0, -1)), 35);
      } else {
        setDeleting(false);
        setIdx((prev) => (prev + 1) % typingPhrases.length);
      }
    }
    return () => clearTimeout(timer);
  }, [text, idx, deleting]);

  return (
    <div className="h-8 sm:h-10 flex items-center justify-center mb-6">
      <span className="text-gold text-sm sm:text-base md:text-lg font-medium tracking-wide">
        {text}
        <span className="inline-block w-[2px] h-[1em] bg-gold ml-0.5 animate-pulse align-middle" />
      </span>
    </div>
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
    <section className="relative bg-white border-b border-gray-200 overflow-hidden">

      <div className="md:hidden absolute inset-0 pointer-events-none select-none z-0 overflow-hidden" style={{ opacity: 0.45, filter: 'drop-shadow(0 0 6px rgba(212,175,55,0.15))' }}>
        <svg viewBox="0 0 200 200" className="absolute top-0 right-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" fill="none">
          <g transform="translate(200, 0)">
            <path d="M 0 25 A 25 25 0 0 0 -25 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 55 A 55 55 0 0 0 -55 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 90 A 90 90 0 0 0 -90 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 130 A 130 130 0 0 0 -130 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 25 Q -14 40 -25 55" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 55 Q -24 72 -55 90" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 90 Q -35 110 -90 130" stroke="#D4AF37" strokeWidth="0.3" />
            <circle cx="-14" cy="14" r="1" fill="#D4AF37" />
            <circle cx="-28" cy="28" r="0.7" fill="#D4AF37" />
            <circle cx="-45" cy="18" r="0.7" fill="#D4AF37" />
            <circle cx="-45" cy="45" r="0.7" fill="#D4AF37" />
            <circle cx="-72" cy="38" r="0.7" fill="#D4AF37" />
            <circle cx="-68" cy="68" r="0.7" fill="#D4AF37" />
            <circle cx="-105" cy="52" r="0.7" fill="#D4AF37" />
          </g>
        </svg>
        <svg viewBox="0 0 200 200" className="absolute bottom-0 left-0 w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]" fill="none">
          <g transform="translate(0, 200)">
            <path d="M 0 -25 A 25 25 0 0 0 25 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -55 A 55 55 0 0 0 55 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -90 A 90 90 0 0 0 90 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -130 A 130 130 0 0 0 130 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -25 Q 14 -40 25 -55" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -55 Q 24 -72 55 -90" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -90 Q 35 -110 90 -130" stroke="#D4AF37" strokeWidth="0.3" />
            <circle cx="14" cy="-14" r="1" fill="#D4AF37" />
            <circle cx="28" cy="-28" r="0.7" fill="#D4AF37" />
            <circle cx="45" cy="-18" r="0.7" fill="#D4AF37" />
            <circle cx="45" cy="-45" r="0.7" fill="#D4AF37" />
            <circle cx="72" cy="-38" r="0.7" fill="#D4AF37" />
            <circle cx="68" cy="-68" r="0.7" fill="#D4AF37" />
            <circle cx="105" cy="-52" r="0.7" fill="#D4AF37" />
          </g>
        </svg>
      </div>

      <motion.div
        className="hidden md:block absolute bottom-0 left-0 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" style={{ opacity: 0.3 }}>
          <g transform="translate(0, 500)">
            <path d="M 0 -30 A 30 30 0 0 1 30 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -65 A 65 65 0 0 1 65 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -105 A 105 105 0 0 1 105 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -150 A 150 150 0 0 1 150 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -205 A 205 205 0 0 1 205 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -270 A 270 270 0 0 1 270 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -30 Q -15 -47 -30 -65" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -65 Q -25 -85 -50 -105" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -105 Q -35 -127 -65 -150" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -150 Q -45 -177 -80 -205" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -205 Q -55 -237 -100 -270" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M -10 -15 L -15 -25 L -10 -35 L -5 -25 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M -20 -35 L -28 -55 L -20 -75 L -12 -55 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M -30 -62 L -42 -90 L -30 -118 L -18 -90 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M -40 -95 L -55 -135 L -40 -175 L -25 -135 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M -50 -140 L -70 -190 L -50 -240 L -30 -190 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <circle cx="-10" cy="10" r="1" fill="#D4AF37" />
            <circle cx="-20" cy="20" r="0.8" fill="#D4AF37" />
            <circle cx="-18" cy="45" r="0.8" fill="#D4AF37" />
            <circle cx="-35" cy="30" r="0.8" fill="#D4AF37" />
            <circle cx="-30" cy="75" r="0.8" fill="#D4AF37" />
            <circle cx="-55" cy="50" r="0.8" fill="#D4AF37" />
            <circle cx="-45" cy="115" r="0.8" fill="#D4AF37" />
            <circle cx="-85" cy="65" r="0.8" fill="#D4AF37" />
            <circle cx="-60" cy="155" r="0.8" fill="#D4AF37" />
            <circle cx="-110" cy="90" r="0.8" fill="#D4AF37" />
            <circle cx="-80" cy="205" r="0.8" fill="#D4AF37" />
            <circle cx="-145" cy="120" r="0.7" fill="#D4AF37" />
          </g>
        </svg>
      </motion.div>
      <motion.div
        className="hidden md:block absolute bottom-0 right-0 w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] pointer-events-none select-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      >
        <svg viewBox="0 0 500 500" fill="none" className="w-full h-full" style={{ opacity: 0.3 }}>
          <g transform="translate(500, 500)">
            <path d="M 0 -30 A 30 30 0 0 0 -30 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -65 A 65 65 0 0 0 -65 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -105 A 105 105 0 0 0 -105 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -150 A 150 150 0 0 0 -150 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -205 A 205 205 0 0 0 -205 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -270 A 270 270 0 0 0 -270 0" stroke="#D4AF37" strokeWidth="0.5" />
            <path d="M 0 -30 Q 15 -47 30 -65" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -65 Q 25 -85 50 -105" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -105 Q 35 -127 65 -150" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -150 Q 45 -177 80 -205" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 0 -205 Q 55 -237 100 -270" stroke="#D4AF37" strokeWidth="0.3" />
            <path d="M 10 -15 L 15 -25 L 10 -35 L 5 -25 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M 20 -35 L 28 -55 L 20 -75 L 12 -55 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M 30 -62 L 42 -90 L 30 -118 L 18 -90 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M 40 -95 L 55 -135 L 40 -175 L 25 -135 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <path d="M 50 -140 L 70 -190 L 50 -240 L 30 -190 Z" stroke="#D4AF37" strokeWidth="0.2" />
            <circle cx="10" cy="10" r="1" fill="#D4AF37" />
            <circle cx="20" cy="20" r="0.8" fill="#D4AF37" />
            <circle cx="18" cy="45" r="0.8" fill="#D4AF37" />
            <circle cx="35" cy="30" r="0.8" fill="#D4AF37" />
            <circle cx="30" cy="75" r="0.8" fill="#D4AF37" />
            <circle cx="55" cy="50" r="0.8" fill="#D4AF37" />
            <circle cx="45" cy="115" r="0.8" fill="#D4AF37" />
            <circle cx="85" cy="65" r="0.8" fill="#D4AF37" />
            <circle cx="60" cy="155" r="0.8" fill="#D4AF37" />
            <circle cx="110" cy="90" r="0.8" fill="#D4AF37" />
            <circle cx="80" cy="205" r="0.8" fill="#D4AF37" />
            <circle cx="145" cy="120" r="0.7" fill="#D4AF37" />
          </g>
        </svg>
      </motion.div>
      <Container className="relative z-10 pt-20 sm:pt-28 pb-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-4 sm:mb-6"
          >
            <span className="font-cormorant font-semibold italic text-xl sm:text-2xl md:text-3xl text-gray-900">
              <span className="inline-block wave-hand">👋</span> Welcome to Sri Mobiles
            </span>
          </motion.div>

          <ServiceTyping />

          <motion.p
            variants={itemVariants}
            className="mt-4 sm:mt-6 text-xs md:text-lg lg:text-xl text-gray-500 max-w-xs sm:max-w-md md:max-w-2xl mx-auto leading-relaxed"
          >
            Hyderabad&apos;s premium multi-brand service center. Same-day repairs with genuine parts, 
            certified technicians, and warranty on all services.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4"
          >
            <Button variant="sky" asChild className="w-full sm:w-auto hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
              <a href="/booking" className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-sm font-semibold">
                Book Repair
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </Button>
            <a
              href="https://wa.me/919948299426"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-white font-semibold hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 text-sm w-full sm:w-auto"
              style={{
                background: '#25D366',
                boxShadow: '0 4px 20px rgba(37,211,102,0.25)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,211,102,0.45)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.25)'}
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              WhatsApp Us
            </a>
            <a
              href="https://www.instagram.com/srimobilesfix?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram page"
              className="inline-flex items-center justify-center gap-2 h-12 sm:h-14 px-5 sm:px-6 rounded-xl text-white font-semibold hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300 text-sm w-full sm:w-auto"
              style={{
                fontFamily: "'Billabong', cursive",
                background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 35%, #8134AF 70%, #515BD4 100%)',
                boxShadow: '0 4px 20px rgba(221,42,123,0.25)',
                fontSize: '20px',
                letterSpacing: '0.02em',
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 12px 40px rgba(221,42,123,0.45)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 4px 20px rgba(221,42,123,0.25)'}
            >
              <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              Instagram
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2 text-[15px] text-gray-500">
              <Star className="w-4 h-4 text-gold" />
              <span className="whitespace-nowrap">Trusted by Many Customers</span>
            </div>
            <div className="flex items-center gap-2 text-[15px] text-gray-500">
              <Shield className="w-4 h-4 text-gold" />
              <span className="whitespace-nowrap">Warranty on All Repairs</span>
            </div>
            <div className="flex items-center gap-2 text-[15px] text-gray-500">
              <Clock className="w-4 h-4 text-gold" />
              <span className="whitespace-nowrap">Same Day Service</span>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="hidden md:grid mt-8 sm:mt-12 grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 md:gap-8 pt-6 sm:pt-12"
          >
            {stats.map((stat, i) => (
              <StatCard key={stat.label} {...stat} delay={0.5 + i * 0.1} />
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
