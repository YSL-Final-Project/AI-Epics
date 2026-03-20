import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function CursorFollower() {
  const prefersReduced = useReducedMotion();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Raw mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Outer ring — slow, springy follow
  const ringX = useSpring(mouseX, { stiffness: 90, damping: 20, mass: 0.4 });
  const ringY = useSpring(mouseY, { stiffness: 90, damping: 20, mass: 0.4 });

  // Inner dot — snappy, near-instant
  const dotX = useSpring(mouseX, { stiffness: 1200, damping: 50 });
  const dotY = useSpring(mouseY, { stiffness: 1200, damping: 50 });

  useEffect(() => {
    // Don't run on touch-only devices
    if (prefersReduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as Element;
      setIsHovering(!!el.closest('a, button, [role="button"], input, textarea, select, label, [data-magnetic]'));
    };

    const onDown = () => setIsClicking(true);
    const onUp   = () => setIsClicking(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    window.addEventListener('mousedown', onDown, { passive: true });
    window.addEventListener('mouseup',   onUp,   { passive: true });

    document.body.classList.add('custom-cursor');

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      document.body.classList.remove('custom-cursor');
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  if (prefersReduced || !isVisible) return null;

  return (
    <>
      {/* Outer ring — laggy follow, morphs on hover */}
      <motion.div
        data-cursor-ring
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border will-change-transform mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width:  isHovering ? 52 : isClicking ? 20 : 30,
          height: isHovering ? 52 : isClicking ? 20 : 30,
          borderColor: isHovering
            ? 'rgba(139, 92, 246, 0.7)'
            : 'rgba(6, 182, 212, 0.45)',
          backgroundColor: isHovering
            ? 'rgba(139, 92, 246, 0.06)'
            : 'transparent',
          scale: isClicking ? 0.85 : 1,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
      />

      {/* Inner dot — instant follow */}
      <motion.div
        data-cursor-dot
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          backgroundColor: isHovering ? '#a78bfa' : '#22d3ee',
          boxShadow: isHovering
            ? '0 0 10px rgba(167, 139, 250, 0.8)'
            : '0 0 10px rgba(34, 211, 238, 0.8)',
        }}
        animate={{
          width:  isHovering ? 7 : isClicking ? 12 : 5,
          height: isHovering ? 7 : isClicking ? 12 : 5,
          scale:  isClicking ? 0.6 : 1,
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />
    </>
  );
}
