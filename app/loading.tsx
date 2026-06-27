'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="/images/logo.png" alt="Sri Mobiles" className="w-[46px] h-[46px] rounded-full border border-white object-cover shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
        </motion.div>
        <motion.div
          className="absolute -inset-4 rounded-2xl border-2 border-electric-500/20"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}