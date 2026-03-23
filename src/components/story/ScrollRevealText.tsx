import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  /** useScroll offset tuple, defaults to entering viewport → centered */
  scrollOffset?: [string, string];
}

// Each character (or word for English) is its own component to safely call useTransform
function RevealChunk({
  chunk,
  progress,
  start,
  end,
}: {
  chunk: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.08, 1]);
  return <motion.span style={{ opacity }}>{chunk}</motion.span>;
}

export default function ScrollRevealText({
  text,
  className = '',
  scrollOffset = ['start 0.88', 'center 0.52'],
}: ScrollRevealTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: scrollOffset,
  });

  // Chinese text → split by character; otherwise split by word (add space back)
  const hasChinese = /[\u4e00-\u9fff]/.test(text);
  const chunks: string[] = hasChinese
    ? text.split('')
    : text.split(' ').map((w, i, arr) => (i < arr.length - 1 ? w + '\u00a0' : w));

  const count = chunks.length;

  return (
    <p ref={ref} className={className} aria-label={text}>
      {chunks.map((chunk, i) => {
        const start = i / count;
        // Each chunk reveals over a 1.8-chunk-wide window for a smooth cascade
        const end = Math.min((i + 1.8) / count, 1);
        return (
          <RevealChunk
            key={i}
            chunk={chunk}
            progress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
}
