'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  useEffect(() => {
    fetch('/api/reviews/approved')
      .then(r => r.json())
      .then(d => setReviews(d))
      .catch(() => {});
  }, []);

  if (reviews.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-electric-500/5 rounded-full blur-[200px]" />
      </div>

      <Container ref={ref}>
        <SectionTitle
          badge="Testimonials"
          title="What Our"
          highlight="Customers Say"
          description="Real reviews from real customers who trust us with their devices."
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          {reviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-electric-500/30 transition-all duration-300"
            >
              <Quote className="w-8 h-8 text-electric-500/20 absolute top-4 right-4" />
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-dark-600'}`} />
                ))}
              </div>
              <p className="text-dark-300 text-[15px] leading-relaxed mb-4 line-clamp-4">
                &ldquo;{review.comment}&rdquo;
              </p>
              <div className="pt-3 border-t border-white/5">
                <p className="text-white font-medium text-[15px]">{review.user.name}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
