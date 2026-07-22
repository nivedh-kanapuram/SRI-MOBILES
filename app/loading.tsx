'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <img src="/images/logo.png" alt="Sri Mobiles" className="w-[56px] h-[56px] rounded-full border border-gray-200 shadow-sm" />
        </motion.div>
        <motion.div
          className="absolute -inset-4 rounded-2xl border-2 border-sky-200"
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
