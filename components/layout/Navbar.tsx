'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, ChevronRight, LogOut, LayoutDashboard, CalendarCheck, Search, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { navLinks } from '@/data/contact';
import { scrollToSection } from '@/lib/utils';
import { Container } from '@/components/ui/Container';

export function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const activeRef = useRef('');

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);

          const sections = navLinks.map((l) => l.href.replace('/#', ''));
          for (let i = sections.length - 1; i >= 0; i--) {
            const el = document.getElementById(sections[i]);
            if (el && el.getBoundingClientRect().top <= 120) {
              const id = sections[i];
              if (activeRef.current !== id) {
                activeRef.current = id;
                setActiveSection(id);
              }
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
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
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200'
            : 'bg-transparent'
        )}
      >
        <Container className="px-4 md:px-8">
          <nav className="flex items-center justify-between h-14 lg:h-20 overflow-hidden">
            <Link href="/" className="flex items-center gap-2 lg:gap-3 group">
              <div className="flex flex-col">
                <span className="block text-gray-900 font-cinzel font-bold text-sm lg:text-base leading-tight tracking-tight truncate">Sri Mobiles</span>
                <span className="block text-gold text-[9px] lg:text-[10px] uppercase tracking-widest leading-tight truncate">Mobile & Laptop Service Center</span>
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
                        ? 'text-sky-500 bg-sky-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all text-sm flex-shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </Link>
              {!isAdmin && (
                <Link
                  href="/booking"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-all text-sm font-medium flex-shrink-0"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Book</span>
                </Link>
              )}
              {!isAdmin && (
                <a
                  href="tel:+919948299426"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all text-sm flex-shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              )}
              {session && isAdmin ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all text-sm flex-shrink-0"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard</span>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all text-sm flex-shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-all text-xs flex-shrink-0"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Login</span>
                </Link>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-3 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors -mr-1"
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
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
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
            className="fixed top-0 right-0 bottom-0 z-50 w-[300px] bg-white border-l border-gray-200 lg:hidden overflow-y-auto"
          >
              <div className="p-6">
                <div className="flex items-center justify-end mb-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all group"
                  >
                    <span className="font-medium">{link.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
                <Link
                  href="/track"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                >
                  <Search className="w-4 h-4" />
                  Track Repair
                </Link>
                {!isAdmin && (
                  <Link
                    href="/booking"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-600"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    Book a Service
                  </Link>
                )}
                {session && isAdmin ? (
                  <>
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 transition-all w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 transition-all text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </Link>
                )}
                {!isAdmin && (
                  <a
                    href="tel:+919948299426"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Call Now</span>
                  </a>
                )}
                <a
                  href="https://wa.me/919948299426"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white font-medium"
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
