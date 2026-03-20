import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Apple-style page transition:
 * - NO y-axis movement (Apple never slides content up/down on nav)
 * - Pure scale + blur — entering page zooms in from slightly larger, blurs clear
 * - Exit: shrinks + blurs out
 * - Easing: Apple's decelerate curve [0.32, 0.72, 0, 1]
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.04, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1,    filter: 'blur(0px)' }}
      exit={{    opacity: 0, scale: 0.97,  filter: 'blur(6px)' }}
      transition={{
        duration: 0.45,
        ease: [0.32, 0.72, 0, 1],
        scale:  { duration: 0.5,  ease: [0.32, 0.72, 0, 1] },
        filter: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
      }}
    >
      {children}
    </motion.div>
  );
}
