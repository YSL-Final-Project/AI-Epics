import { useState } from 'react';
import { useMotionValueEvent, MotionValue } from 'framer-motion';

interface ChapterTitleProps {
  progress: MotionValue<number>;
  range?: [number, number];
  chapter: string;
  title: string;
  subtitle?: string;
}

function lerp4(p: number, keys: number[], values: number[]): number {
  if (p <= keys[0]) return values[0];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i]) {
      const t = (p - keys[i - 1]) / (keys[i] - keys[i - 1]);
      return values[i - 1] + t * (values[i] - values[i - 1]);
    }
  }
  return values[values.length - 1];
}

export default function ChapterTitle({
  progress,
  range = [0, 1],
  chapter,
  title,
  subtitle,
}: ChapterTitleProps) {
  const [start, end] = range;
  const span = end - start;
  const keys = [start, start + span * 0.15, start + span * 0.7, end];

  const [style, setStyle] = useState({ opacity: 0, y: 60, scale: 0.95 });

  useMotionValueEvent(progress, 'change', (p) => {
    setStyle({
      opacity: lerp4(p, keys, [0, 1, 1, 0]),
      y: lerp4(p, keys, [60, 0, 0, -40]),
      scale: lerp4(p, keys, [0.95, 1, 1, 0.97]),
    });
  });

  return (
    <div
      style={{ opacity: style.opacity, transform: `translateY(${style.y}px) scale(${style.scale})` }}
      className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
    >
      <span className="font-mono text-xs tracking-[0.3em] uppercase text-cyan-500/60 mb-4">
        {chapter}
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-6 text-lg sm:text-xl text-white/40 font-light max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
