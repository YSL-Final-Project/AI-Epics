import { useState } from 'react';
import { useTransform, useMotionValueEvent, MotionValue } from 'framer-motion';

interface BarItem {
  label: string;
  value: number;
}

interface ScrollLinkedBarsProps {
  progress: MotionValue<number>;
  range?: [number, number];
  data: BarItem[];
  maxValue?: number;
  color?: string;
  suffix?: string;
}

export default function ScrollLinkedBars({
  progress,
  range = [0, 1],
  data,
  maxValue,
  color = '#06b6d4',
  suffix = '%',
}: ScrollLinkedBarsProps) {
  const max = maxValue || Math.max(...data.map(d => d.value));
  const barProgress = useTransform(progress, range, [0, 1]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-3">
      {data.map((item, i) => (
        <BarRow
          key={item.label}
          label={item.label}
          value={item.value}
          max={max}
          progress={barProgress}
          delay={i * 0.08}
          color={color}
          suffix={suffix}
        />
      ))}
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  progress,
  delay,
  color,
  suffix,
}: {
  label: string;
  value: number;
  max: number;
  progress: MotionValue<number>;
  delay: number;
  color: string;
  suffix: string;
}) {
  const [barWidth, setBarWidth] = useState(0);
  const [displayNum, setDisplayNum] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    const adjusted = Math.max(0, (p - delay) / (1 - delay));
    setBarWidth(adjusted * (value / max) * 100);
    setDisplayNum(Math.round(adjusted * value));
  });

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 w-24 text-right shrink-0 font-light">{label}</span>
      <div className="flex-1 h-6 bg-white/[0.03] rounded overflow-hidden relative">
        <div
          className="h-full rounded"
          style={{ width: `${barWidth}%`, backgroundColor: color }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50">
          {displayNum}{suffix}
        </span>
      </div>
    </div>
  );
}
