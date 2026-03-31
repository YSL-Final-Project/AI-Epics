import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import TimelineContainer from '../components/timeline/TimelineContainer';
import { useI18n } from '../i18n';

export default function TimelinePage() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Parallax + fade for hero content
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
  const heroBlurVal = useTransform(scrollYProgress, [0.3, 0.8], [0, 12]);
  const heroFilter = useTransform(heroBlurVal, v => `blur(${v}px)`);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // The big year range text — slides up slowly
  const yearY = useTransform(scrollYProgress, [0, 0.6], [0, -40]);
  const yearOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-[#0a0a0f]">

        {/* ── Hero Section ── */}
        <div ref={heroRef} className="relative h-[85vh] overflow-hidden">
          <motion.div
            style={prefersReduced ? {} : {
              opacity: heroOpacity,
              scale: heroScale,
              filter: heroFilter,
              y: heroY,
            }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6"
          >
            {/* Mono label */}
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-[10px] tracking-[0.6em] text-slate-400/50 dark:text-white/20 uppercase mb-8"
            >
              Chronicle
            </motion.p>

            {/* Main title — asymmetric, staggered */}
            <div className="text-center" style={{ perspective: '800px' }}>
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 30, rotateX: -8 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
                className="overflow-hidden"
              >
                <span className="block text-[clamp(3.5rem,10vw,7rem)] font-black text-slate-900 dark:text-white tracking-[-0.04em] leading-[0.9]">
                  {t.timeline.title}
                </span>
              </motion.div>

              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="mt-3"
              >
                <span className="text-[clamp(1rem,2.5vw,1.4rem)] font-light text-slate-400 dark:text-white/30 tracking-[0.15em]">
                  {t.timeline.subtitle}
                </span>
              </motion.div>
            </div>

            {/* Year range — giant, watermark-like */}
            <motion.div
              style={prefersReduced ? {} : { y: yearY, opacity: yearOpacity }}
              className="mt-12 flex items-center gap-6"
            >
              <motion.span
                initial={prefersReduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="text-[clamp(2.5rem,7vw,4.5rem)] font-black text-slate-900/[0.12] dark:text-white/[0.12] tracking-tight tabular-nums"
              >
                2018
              </motion.span>
              <motion.div
                initial={prefersReduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.9, duration: 1, ease: [0.32, 0.72, 0, 1] }}
                className="w-16 h-px bg-slate-300 dark:bg-white/10"
              />
              <motion.span
                initial={prefersReduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="text-[clamp(2.5rem,7vw,4.5rem)] font-black text-slate-900/[0.12] dark:text-white/[0.12] tracking-tight tabular-nums"
              >
                2025
              </motion.span>
            </motion.div>

            {/* Stats — minimal, monochrome */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
              className="mt-10 flex items-center gap-10"
            >
              {[
                { value: '25', label: 'Events' },
                { value: '7', label: 'Years' },
                { value: '4', label: 'Categories' },
              ].map((stat, i) => (
                <div key={stat.label} className="text-center">
                  <span className="block text-2xl font-black text-slate-800 dark:text-white/80 tabular-nums">
                    {stat.value}
                  </span>
                  <span className="font-mono text-[9px] tracking-[0.3em] text-slate-400/60 dark:text-white/15 uppercase">
                    {stat.label}
                  </span>
                  {/* Thin underline */}
                  {i < 2 && (
                    <span className="hidden" />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.6 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
              <span className="font-mono text-[9px] tracking-[0.4em] text-slate-400/40 dark:text-white/15 uppercase">
                Scroll
              </span>
              <motion.div
                className="w-px bg-slate-300 dark:bg-white/20"
                animate={{ height: ['0px', '24px', '0px'] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ── Timeline Content ── */}
        <div className="relative">
          <TimelineContainer />
        </div>
      </div>
    </PageTransition>
  );
}
