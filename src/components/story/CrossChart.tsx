import { useState } from 'react';
import { useTransform, useMotionValueEvent, motion, MotionValue } from 'framer-motion';

interface CrossChartProps {
  progress: MotionValue<number>;
  range?: [number, number];
}

export default function CrossChart({ progress, range = [0, 1] }: CrossChartProps) {
  const pathLength = useTransform(progress, range, [0, 1]);
  const midpoint = range[0] + (range[1] - range[0]) * 0.5;
  const endpoint = range[0] + (range[1] - range[0]) * 0.7;

  const [dotOp, setDotOp] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= midpoint) setDotOp(0);
    else if (p >= endpoint) setDotOp(1);
    else setDotOp((p - midpoint) / (endpoint - midpoint));
  });

  const soPath = 'M 40 60 C 160 65, 280 80, 400 200 S 520 260, 560 270';
  const aiPath = 'M 40 260 C 120 255, 200 240, 300 180 S 460 60, 560 50';

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex justify-between mb-2 px-4">
        <span className="text-xs font-mono text-white/30">2022</span>
        <span className="text-xs font-mono text-white/30">2025</span>
      </div>

      <svg viewBox="0 0 600 320" className="w-full" fill="none">
        {[80, 160, 240].map(y => (
          <line key={y} x1="40" y1={y} x2="560" y2={y} stroke="white" strokeOpacity="0.04" />
        ))}
        <path d={soPath} stroke="white" strokeWidth="2" opacity={0.06} />
        <path d={aiPath} stroke="white" strokeWidth="2" opacity={0.06} />
        <motion.path d={soPath} stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength }} />
        <motion.path d={aiPath} stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" style={{ pathLength }} />
        <circle cx="340" cy="160" r="4" fill="white" opacity={dotOp} />
      </svg>

      <div className="flex justify-center gap-8 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-red-500 rounded" />
          <span className="text-xs text-white/40">Stack Overflow 流量</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-cyan-500 rounded" />
          <span className="text-xs text-white/40">AI 工具采用率</span>
        </div>
      </div>
    </div>
  );
}
