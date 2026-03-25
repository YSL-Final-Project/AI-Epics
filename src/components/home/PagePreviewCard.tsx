import { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import type { PagePreview } from '../../types';
import ScrambleText from '../ScrambleText';

interface PagePreviewCardProps {
  preview: PagePreview;
  index: number;
}

export default function PagePreviewCard({ preview, index }: PagePreviewCardProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // JS-driven mouse-tracking 3D tilt (no React re-renders — direct DOM)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
    const tiltX = dy * -7;   // rotateX
    const tiltY = dx *  9;   // rotateY

    cardRef.current.style.transform =
      `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.035,1.035,1.035)`;
    cardRef.current.style.transition = 'transform 0.08s ease-out';

    // Move glow with cursor
    if (glowRef.current) {
      const px = ((e.clientX - rect.left) / rect.width)  * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      glowRef.current.style.background =
        `radial-gradient(circle at ${px}% ${py}%, var(--card-glow) 0%, transparent 70%)`;
      glowRef.current.style.opacity = '1';
    }
  }, [prefersReduced]);

  const handleMouseLeave = useCallback(() => {
    if (!cardRef.current) return;
    cardRef.current.style.transform =
      'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
    cardRef.current.style.transition = 'transform 0.55s cubic-bezier(0.23,1,0.32,1)';
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  // Map color class → CSS glow variable value
  const glowColorMap: Record<string, string> = {
    'bg-cyan-500':    'rgba(6,182,212,0.15)',
    'bg-violet-500':  'rgba(139,92,246,0.15)',
    'bg-amber-500':   'rgba(245,158,11,0.15)',
    'bg-emerald-500': 'rgba(16,185,129,0.15)',
    'bg-rose-500':    'rgba(244,63,94,0.15)',
  };

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, margin: '-40px' }}
    >
      <Link to={preview.path} className="block group">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="tilt-card holo-card relative overflow-hidden rounded-2xl p-6 glass-subtle"
          style={{ '--card-glow': glowColorMap[preview.color] ?? 'rgba(6,182,212,0.15)' } as React.CSSProperties}
        >
          {/* Cursor-tracked glow */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-0"
            style={{ borderRadius: 'inherit' }}
          />

          {/* Animated bottom fill */}
          <div
            className={`absolute bottom-0 left-0 h-[2px] ${preview.color} w-0 group-hover:w-full transition-all duration-500 ease-out`}
          />

          {/* Corner crosshatch */}
          <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-80 transition-opacity duration-500"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 3px,rgba(6,182,212,0.07) 3px,rgba(6,182,212,0.07) 4px)',
            }}
          />

          <div className="relative z-10">
            {/* Icon */}
            <motion.div
              className="text-3xl mb-4 inline-block"
              whileHover={prefersReduced ? {} : { scale: 1.25, rotate: -8 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            >
              {preview.icon}
            </motion.div>

            <ScrambleText
              text={preview.title}
              as="h3"
              className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300"
              revealSpeed={30}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {preview.description}
            </p>

            {/* Arrow */}
            <div className="mt-4 flex items-center gap-1 text-sm font-medium text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-all duration-300">
              <span>探索</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
