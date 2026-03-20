import { useState, useEffect } from 'react';
import { useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';

interface ScrollLinkedCounterProps {
  progress: MotionValue<number>;
  from: number;
  to: number;
  range?: [number, number];
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export default function ScrollLinkedCounter({
  progress,
  from,
  to,
  range = [0, 1],
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: ScrollLinkedCounterProps) {
  const value = useTransform(progress, range, [from, to]);
  const [display, setDisplay] = useState(formatNumber(from, decimals));

  useMotionValueEvent(value, 'change', (v) => {
    setDisplay(formatNumber(v, decimals));
  });

  return (
    <span className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}

function formatNumber(v: number, decimals: number): string {
  if (decimals > 0) return v.toFixed(decimals);
  return Math.round(v).toLocaleString();
}
