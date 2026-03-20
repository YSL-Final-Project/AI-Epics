import { useScroll, useSpring, motion, useReducedMotion } from 'framer-motion';

export default function ScrollProgress() {
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 28,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <>
      {/* Single refined line — white in dark, slate in light */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[1.5px] z-[9998] pointer-events-none"
        style={{
          scaleX,
          transformOrigin: 'left center',
          background: 'rgba(255,255,255,0.55)',
        }}
      />
    </>
  );
}
