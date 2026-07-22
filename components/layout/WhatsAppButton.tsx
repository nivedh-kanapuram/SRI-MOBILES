'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">

      <motion.a
        href="tel:+919948299426"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-gold text-white shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Call Sri Mobiles"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
      </motion.a>

      <motion.a
        href="https://wa.me/919948299426?text=Hi%20Sri%20Mobiles%2C%20I%20need%20help%20with%20my%20device%20repair."
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 relative z-10" />
      </motion.a>
    </div>
  );
}
