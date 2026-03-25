import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useSpring, useReducedMotion } from 'framer-motion';

interface StatCardProps {
  value: string;
  numericValue: number;
  suffix: string;
  label: string;
  gradient: string;
  glowColor: string;
  icon: ReactNode;
}

export default function StatCard({ value, numericValue, suffix, label, gradient, glowColor, icon }: StatCardProps) {
  const prefersReduced = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Spring-based counter
  const springValue = useSpring(0, {
    stiffness: 60,
    damping: 18,
    mass: 1,
    restDelta: 0.5,
  });

  useEffect(() => {
    const unsubscribe = springValue.on('change', v => {
      setDisplayValue(Math.round(v));
      if (Math.round(v) >= numericValue) {
        setIsDone(true);
        unsubscribe();
      }
    });
    return unsubscribe;
  }, [springValue, numericValue]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayValue(numericValue);
      setHasAnimated(true);
      setIsDone(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          springValue.set(numericValue);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue, hasAnimated, springValue, prefersReduced]);

  const formattedValue = value.includes('.')
    ? (displayValue / 10).toFixed(1)
    : displayValue.toString();

  return (
    <motion.div
      ref={ref}
      whileHover={prefersReduced ? {} : { y: -8, scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className="hover-shine relative group h-full"
    >
      <div className="relative overflow-hidden rounded-2xl p-6 glass-subtle h-full">
        {/* Gradient top line */}
        <div className={`absolute top-0 left-0 w-full h-[2px] ${gradient}`} />

        {/* Glow pulse when done counting */}
        <motion.div
          className={`absolute -top-24 -right-24 w-48 h-48 ${gradient} rounded-full blur-3xl pointer-events-none`}
          animate={isDone && !prefersReduced
            ? { opacity: [0.06, 0.18, 0.06] }
            : { opacity: 0 }
          }
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Hover background glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 rounded-full pointer-events-none"
          style={{ background: glowColor.replace('0.4', '0.12') }}
        />

        <div className="relative z-10">
          {/* Icon with bounce */}
          <motion.span
            className="text-2xl mb-3 block"
            animate={isDone && !prefersReduced ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {icon}
          </motion.span>

          {/* Counter */}
          <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1.5 tracking-tight tabular-nums">
            {hasAnimated ? (
              <>
                <motion.span
                  style={isDone ? {
                    textShadow: `0 0 20px ${glowColor}`,
                    transition: 'text-shadow 0.5s ease',
                  } : {}}
                >
                  {formattedValue}
                </motion.span>
                <span className="gradient-text-animated">{suffix}</span>
              </>
            ) : (
              <span className="opacity-0">{value}</span>
            )}
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400 leading-snug">{label}</div>
        </div>

        {/* Bottom sparkle markers */}
        <span className="absolute bottom-2 left-3 text-[8px] text-cyan-500/20 select-none">+</span>
        <span className="absolute top-2 right-3 text-[8px] text-violet-500/20 select-none">+</span>
      </div>
    </motion.div>
  );
}
