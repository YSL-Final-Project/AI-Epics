import { useRef } from 'react';
import { useScroll, MotionValue } from 'framer-motion';

interface StickyChapterProps {
  heightVh?: number;
  children: (progress: MotionValue<number>) => React.ReactNode;
  className?: string;
}

/**
 * Core scroll-driven container: tall outer div + sticky inner viewport.
 * Children receive scrollYProgress (0→1) as the user scrolls through.
 */
export default function StickyChapter({ heightVh = 300, children, className = '' }: StickyChapterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={ref} className={`relative ${className}`} style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        {children(scrollYProgress)}
      </div>
    </div>
  );
}
