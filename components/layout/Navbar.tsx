'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronRight, User, LogOut, LayoutDashboard, CalendarCheck, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/data/contact';
import { scrollToSection } from '@/lib/utils';
import { Container } from '@/components/ui/Container';

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = navLinks.map((l) => l.href.replace('/#', ''));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      scrollToSection(id);
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-dark-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10'
            : 'bg-transparent'
        )}
      >
        <Container>
          <nav className="flex items-center justify-between h-20 overflow-hidden">
            <Link href="/" className="flex items-center gap-3 group">
              <img src="/images/logo.png" alt="Sri Mobiles" className="w-[43px] h-[43px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg leading-tight tracking-tight">Sri Mobiles</span>
                <span className="text-electric-400 text-[10px] uppercase tracking-widest">Multi-Branded Service Partner</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const sectionId = link.href.replace('/#', '');
                const isActive = activeSection === sectionId;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                      isActive
                        ? 'text-electric-400 bg-electric-500/10'
                        : 'text-dark-300 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Link
                href="/track"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </Link>
              <Link
                href="/booking"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-electric-500/10 border border-electric-500/30 text-electric-400 hover:bg-electric-500/20 transition-all text-sm font-medium flex-shrink-0"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Book</span>
              </Link>
              <a
                href="tel:+919948299426"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm flex-shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call</span>
              </a>
              {session ? (
                <div className="flex items-center gap-1">
                  <Link
                    href={session.user?.role === 'admin' ? '/admin' : '/dashboard'}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm flex-shrink-0"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all text-sm flex-shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-electric-500 to-electric-600 text-white font-medium text-sm hover:shadow-electric-hover transition-all flex-shrink-0"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-lg text-dark-400 hover:text-white hover:bg-white/5 transition-colors -mr-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-dark-950 border-l border-white/5 lg:hidden overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setIsMobileMenuOpen(false)}>
                  <img src="/images/logo.png" alt="Sri Mobiles" className="w-[36px] h-[36px] rounded-full border border-white/20 object-cover" />
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm leading-tight">Sri Mobiles</span>
                    <span className="text-electric-400 text-[8px] uppercase tracking-widest">Multi-Branded Service Partner</span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-dark-400 hover:text-white hover:bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-dark-300 hover:text-white hover:bg-white/5 transition-all group"
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-dark-800 space-y-3">
                <Link
                  href="/track"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-dark-700 text-dark-300 hover:text-white transition-all"
                >
                  <Search className="w-4 h-4" />
                  Track Repair
                </Link>
                <Link
                  href="/booking"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-electric-500 to-electric-600 text-white font-medium"
                >
                  <CalendarCheck className="w-4 h-4" />
                  Book a Service
                </Link>
                {session ? (
                  <>
                    <Link
                      href={session.user?.role === 'admin' ? '/admin' : '/dashboard'}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all font-medium"
                  >
                    <User className="w-5 h-5" />
                    Sign In
                  </Link>
                )}
                <a
                  href="tel:+919948299426"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dark-700 text-dark-300 hover:text-white hover:border-dark-500 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </a>
                <a
                  href="https://wa.me/919948299426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-medium"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
