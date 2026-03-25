import { useRef, useEffect, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StorySlideProps {
  children: ReactNode | ((active: boolean) => ReactNode);
  /** Callback when this slide becomes the active (most visible) one */
  onActive?: () => void;
  /** Optional className on the outer section */
  className?: string;
  /** If true, skip the enter animation (for interactive slides) */
  noAnimation?: boolean;
}

/**
 * StorySlide — a full-viewport snap-scroll section.
 *
 * Uses IntersectionObserver (threshold 0.5) to detect when
 * this slide is the "current" one. Children receive an
 * `active` boolean via render-prop or just render normally.
 */
export default function StorySlide({
  children,
  onActive,
  className = '',
  noAnimation = false,
}: StorySlideProps) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(false);
  const [hasBeenActive, setHasBeenActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        setActive(isVisible);
        if (isVisible) {
          setHasBeenActive(true);
          onActive?.();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [onActive]);

  const content = typeof children === 'function' ? children(active) : children;

  return (
    <section
      ref={ref}
      className={`h-screen w-full flex-shrink-0 scroll-snap-align-start relative flex items-center justify-center ${className}`}
      style={{ scrollSnapAlign: 'start' }}
    >
      {noAnimation ? (
        content
      ) : (
        <motion.div
          className="w-full h-full flex items-center justify-center"
          initial={false}
          animate={{
            opacity: active ? 1 : hasBeenActive ? 0.3 : 0,
            scale: active ? 1 : 0.96,
            filter: active ? 'blur(0px)' : 'blur(4px)',
          }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          {content}
        </motion.div>
      )}
    </section>
  );
}
