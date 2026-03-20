import { motion, useReducedMotion } from 'framer-motion';

interface ScaleRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function ScaleReveal({
  children,
  delay = 0,
  className = '',
}: ScaleRevealProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}
