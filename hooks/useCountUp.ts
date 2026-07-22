'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const rafRef = useRef<number | null>(null);

  const start = useCallback(() => setHasStarted(true), []);

  useEffect(() => {
    if (!hasStarted) return;

    let startTime: number | null = null;
    let lastUpdate = 0;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const elapsed = timestamp - lastUpdate;

      if (elapsed >= 40 || progress >= 1) {
        lastUpdate = timestamp;
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(eased * end));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [hasStarted, end, duration]);

  return { count, start };
}