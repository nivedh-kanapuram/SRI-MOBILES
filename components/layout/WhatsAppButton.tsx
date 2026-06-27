'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

export function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="relative bg-white text-dark-900 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl shadow-premium max-w-[200px] sm:max-w-[240px]"
          >
            <button
              onClick={() => setIsTooltipVisible(false)}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-dark-200 text-dark-600 hover:bg-dark-300 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs sm:text-sm font-medium leading-snug">
              Need help? Chat with us on WhatsApp!
            </p>
            <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-3 h-3 bg-white" />
          </motion.div>
        )}
      </AnimatePresence>

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