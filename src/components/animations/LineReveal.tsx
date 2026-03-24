import { useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';

interface LineRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  margin?: string;
}

export default function LineReveal({
  children,
  delay = 0,
  className = '',
  margin = '0px',
}: LineRevealProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin } as Parameters<typeof useInView>[1]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? false : { y: '105%' }}
        animate={(inView || prefersReduced) ? { y: '0%' } : { y: '105%' }}
        transition={{ delay, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
