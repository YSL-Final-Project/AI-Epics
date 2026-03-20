import { useState } from 'react';
import { useMotionValueEvent, MotionValue } from 'framer-motion';
import ScrollLinkedCounter from './ScrollLinkedCounter';

interface HeroStatProps {
  progress: MotionValue<number>;
  range?: [number, number];
  from: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  sublabel?: string;
}

export default function HeroStat({
  progress,
  range = [0, 1],
  from,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  label,
  sublabel,
}: HeroStatProps) {
  const [start, end] = range;
  const span = end - start;

  const [style, setStyle] = useState({ opacity: 0, scale: 0.9 });

  useMotionValueEvent(progress, 'change', (p) => {
    let opacity = 0;
    const fadeIn = start + span * 0.1;
    const fadeOut = start + span * 0.8;
    if (p <= start) opacity = 0;
    else if (p <= fadeIn) opacity = (p - start) / (span * 0.1);
    else if (p <= fadeOut) opacity = 1;
    else if (p <= end) opacity = 1 - (p - fadeOut) / (end - fadeOut);
    else opacity = 0;

    let scale = 0.9;
    if (p <= start) scale = 0.9;
    else if (p <= fadeIn) scale = 0.9 + (p - start) / (span * 0.1) * 0.1;
    else if (p <= fadeOut) scale = 1;
    else if (p <= end) scale = 1 - (p - fadeOut) / (end - fadeOut) * 0.05;
    else scale = 0.95;

    setStyle({ opacity, scale });
  });

  return (
    <div
      style={{ opacity: style.opacity, transform: `scale(${style.scale})` }}
      className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
    >
      <ScrollLinkedCounter
        progress={progress}
        from={from}
        to={to}
        range={[start + span * 0.05, start + span * 0.6]}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        className="text-6xl sm:text-8xl md:text-9xl font-black text-white tabular-nums tracking-tight"
      />
      <p className="mt-6 text-lg sm:text-xl text-white/50 font-light max-w-lg">
        {label}
      </p>
      {sublabel && (
        <p className="mt-2 text-sm text-white/25 font-mono">
          {sublabel}
        </p>
      )}
    </div>
  );
}
