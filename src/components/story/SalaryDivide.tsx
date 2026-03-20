import { useState } from 'react';
import { useMotionValueEvent, MotionValue } from 'framer-motion';
import ScrollLinkedCounter from './ScrollLinkedCounter';

interface SalaryDivideProps {
  progress: MotionValue<number>;
  range?: [number, number];
}

export default function SalaryDivide({ progress, range = [0, 1] }: SalaryDivideProps) {
  const [start, end] = range;
  const span = end - start;

  const [opacity, setOpacity] = useState(0);
  const [divX, setDivX] = useState(100);
  const [multiplierOp, setMultiplierOp] = useState(0);

  useMotionValueEvent(progress, 'change', (p) => {
    // opacity: fade in 0.1, stay, fade out 0.85
    if (p <= start) setOpacity(0);
    else if (p <= start + span * 0.1) setOpacity((p - start) / (span * 0.1));
    else if (p <= start + span * 0.85) setOpacity(1);
    else if (p <= end) setOpacity(1 - (p - start - span * 0.85) / (span * 0.15));
    else setOpacity(0);

    // divider: 100% → 50%
    const divStart = start + span * 0.1;
    const divEnd = start + span * 0.5;
    if (p <= divStart) setDivX(100);
    else if (p >= divEnd) setDivX(50);
    else setDivX(100 - (p - divStart) / (divEnd - divStart) * 50);

    // multiplier: fade in at 0.5-0.65
    const mStart = start + span * 0.5;
    const mEnd = start + span * 0.65;
    if (p <= mStart) setMultiplierOp(0);
    else if (p >= mEnd) setMultiplierOp(1);
    else setMultiplierOp((p - mStart) / (mEnd - mStart));
  });

  return (
    <div
      style={{ opacity }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-full h-full max-w-4xl mx-auto">
        {/* Left side — low salary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pr-[50%]">
          <span className="text-xs font-mono tracking-[0.2em] text-red-400/50 uppercase mb-4">
            不使用 AI
          </span>
          <ScrollLinkedCounter
            progress={progress}
            from={0}
            to={62}
            range={[start + span * 0.15, start + span * 0.55]}
            prefix="$"
            suffix="K"
            className="text-5xl sm:text-7xl font-black text-red-400/80 tabular-nums"
          />
          <p className="mt-4 text-sm text-white/30 font-light">完全不了解 AI</p>
        </div>

        {/* Right side — high salary */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pl-[50%]">
          <span className="text-xs font-mono tracking-[0.2em] text-cyan-400/50 uppercase mb-4">
            精通 AI 工具
          </span>
          <ScrollLinkedCounter
            progress={progress}
            from={0}
            to={185}
            range={[start + span * 0.15, start + span * 0.55]}
            prefix="$"
            suffix="K"
            className="text-5xl sm:text-7xl font-black text-cyan-400 tabular-nums"
          />
          <p className="mt-4 text-sm text-white/30 font-light">AI 基础设施工程师</p>
        </div>

        {/* Animated divider */}
        <div
          className="absolute top-[15%] bottom-[15%] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"
          style={{ left: `${divX}%` }}
        />

        {/* 3x multiplier */}
        <div
          className="absolute bottom-[18%] left-1/2 -translate-x-1/2"
          style={{ opacity: multiplierOp }}
        >
          <span className="text-2xl font-black text-white/60">3×</span>
          <p className="text-xs text-white/25 mt-1">薪资差距</p>
        </div>
      </div>
    </div>
  );
}
