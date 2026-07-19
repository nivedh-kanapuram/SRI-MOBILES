'use client';

import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { contactInfo } from '@/data/contact';

export function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', device: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waMessage = `Hi Sri Mobiles! I need repair help.%0A%0AName: ${formData.name}%0APhone: ${formData.phone}%0ADevice: ${formData.device}%0AIssue: ${formData.message}`;
    window.open(`https://wa.me/919948299426?text=${waMessage}`, '_blank');
    setSubmitted(true);
    setFormData({ name: '', phone: '', device: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactCards = [
    { icon: Phone, label: 'Phone', value: contactInfo.phone[0], href: `tel:+91${contactInfo.phone[0]}` },
    { icon: MessageCircle, label: 'WhatsApp', value: contactInfo.phone[0], href: `https://wa.me/91${contactInfo.phone[0]}` },
    { icon: Mail, label: 'Email', value: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: Clock, label: 'Hours', value: contactInfo.hours, href: undefined },
    { icon: MapPin, label: 'Address', value: 'Chaitanyapuri, Hyderabad', href: 'https://maps.google.com/?q=Metro+Pillar+No.1563+Rajnigandha+Complex+Dilsukh+Nagar+Main+Road+Chaitanyapuri+Hyderabad' },
  ];

  return (
    <section id="contact" className="hidden md:block py-20 md:py-28 bg-dark-900/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/20 to-transparent" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-electric-500/5 rounded-full blur-[200px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="Contact Us"
          title="Get In"
          highlight="Touch"
          description="Ready to get your device repaired? Reach out to us or visit our center for a free diagnosis."
        />

        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-3 sm:space-y-4"
          >
            <div className="flex flex-col items-center lg:items-start mb-6">
              <img src="/images/logo.png" alt="Sri Mobiles" className="w-[70px] h-[70px] rounded-full border border-white/20 object-cover shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-3" />
              <p className="text-electric-400 text-[11px] uppercase tracking-[0.15em] font-medium text-center lg:text-left">Multi-Branded Mobile & Laptop Repair Service Partner</p>
            </div>
            {contactCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {card.href ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5 hover:border-electric-500/30 hover:bg-electric-500/5 transition-all group"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-electric-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-electric-500/20 transition-colors">
                      <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-electric-400" />
                    </div>
                    <div>
                      <div className="text-dark-500 text-[10px] sm:text-xs uppercase tracking-wider">{card.label}</div>
                      <div className="text-white text-xs sm:text-sm font-medium">{card.value}</div>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/5">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-electric-500/10 flex items-center justify-center flex-shrink-0">
                      <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-electric-400" />
                    </div>
                    <div>
                      <div className="text-dark-500 text-[10px] sm:text-xs uppercase tracking-wider">{card.label}</div>
                      <div className="text-white text-xs sm:text-sm font-medium">{card.value}</div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="p-5 sm:p-6 md:p-8 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08]">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-4 sm:mb-6">Request a Free Quote</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark-400 text-xs uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-dark-400 text-xs uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Your phone number"
                      className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-dark-400 text-xs uppercase tracking-wider mb-2">Device & Issue</label>
                  <input
                    type="text"
                    required
                    value={formData.device}
                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                    placeholder="e.g., iPhone 14 Pro - Cracked screen"
                    className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-dark-400 text-xs uppercase tracking-wider mb-2">Describe the Issue</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about the problem..."
                    className="w-full px-4 py-3 rounded-xl bg-dark-800/50 border border-dark-700 text-white text-sm placeholder:text-dark-500 focus:outline-none focus:border-electric-500/50 focus:ring-1 focus:ring-electric-500/20 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" variant="electric" className="w-full sm:flex-1">
                    {submitted ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Sent!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Send via WhatsApp
                      </span>
                    )}
                  </Button>
                  <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                    <a href={`tel:+91${contactInfo.phone[0]}`}>
                      <Phone className="w-4 h-4 mr-1" />
                      Call Now
                    </a>
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}