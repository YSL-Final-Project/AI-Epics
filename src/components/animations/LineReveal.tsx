import { motion, useReducedMotion } from 'framer-motion';

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
  margin = '-30px',
}: LineRevealProps) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? false : { y: '105%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true, margin }}
        transition={{ delay, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
