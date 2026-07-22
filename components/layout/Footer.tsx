'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { contactInfo, socialLinks, navLinks, footerSections } from '@/data/contact';

const socialIcons: Record<string, React.ReactNode> = {
  'message-circle': <MessageCircle className="w-5 h-5" />,
  facebook: <Facebook className="w-5 h-5" />,
  instagram: <Instagram className="w-5 h-5" />,
  'map-pin': <MapPin className="w-5 h-5" />,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <Container>
        <div className="py-12 md:py-16">
          <div className="grid gap-10 grid-cols-1 md:grid-cols-4 xl:grid-cols-[2fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-start gap-3 mb-5">
                <div className="flex flex-col">
                  <span className="text-gray-900 font-cinzel font-bold text-lg leading-tight">Sri Mobiles</span>
                  <span className="text-gold text-[10px] uppercase tracking-widest">Mobile & Laptop Service Center</span>
                </div>
              </Link>
              <p className="text-gray-500 text-[15px] leading-relaxed mb-6 max-w-md">
                Hyderabad&apos;s trusted multi-brand mobile & laptop repair service center. Genuine parts, certified technicians, and same-day service with warranty.
              </p>
              <div className="space-y-3 text-gray-500 text-[15px]">
                <a href={`tel:${contactInfo.phone[0]}`} className="flex items-center gap-3 hover:text-sky-500 transition-colors duration-300">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{contactInfo.phone[0]}</span>
                </a>
                <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 hover:text-sky-500 transition-colors duration-300">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>{contactInfo.email}</span>
                </a>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Chaitanyapuri, Hyderabad</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 flex-shrink-0" />
                  <span>{contactInfo.hours}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block">
              <h3 className="text-gray-700 font-semibold text-xs uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <div className="h-0.5 w-12 bg-gold rounded-full mb-6" />
              <ul className="space-y-3 text-gray-500 text-[15px]">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-sky-500 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="text-gray-700 font-semibold text-xs uppercase tracking-wider mb-4">
                Services
              </h3>
              <div className="h-0.5 w-12 bg-gold rounded-full mb-6" />
              <ul className="space-y-3 text-gray-500 text-[15px]">
                {footerSections.find((section) => section.title === 'Services')?.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-sky-500 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="hidden md:block">
              <h3 className="text-gray-700 font-semibold text-xs uppercase tracking-wider mb-4">
                Brands
              </h3>
              <div className="h-0.5 w-12 bg-gold rounded-full mb-6" />
              <ul className="space-y-3 text-gray-500 text-[15px]">
                {footerSections.find((section) => section.title === 'Brands')?.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="hover:text-sky-500 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-lg text-gray-400 hover:text-gold hover:bg-gray-100 transition-all"
                  aria-label={social.name}
                >
                  {socialIcons[social.icon]}
                </a>
              ))}
            </div>

            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              &copy; {currentYear} Sri Mobiles. All rights reserved.
              <Link href="/auth/signin" className="ml-3 text-gray-300 hover:text-gray-500 transition-colors">Admin</Link>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
