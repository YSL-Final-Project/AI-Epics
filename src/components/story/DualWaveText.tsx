import { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

function WavePhrase({
  text, index, scrollYProgress, direction,
}: {
  text: string;
  index: number;
  scrollYProgress: MotionValue<number>;
  direction: 1 | -1;
}) {
  const x = useTransform(scrollYProgress, (v) => {
    const phase = index * 0.9 + v * Math.PI * 2 - Math.PI / 2;
    return Math.sin(phase) * 28 * direction;
  });
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.1, 0.7, 0.7, 0.1]);

  // Must use state for style (known project pattern)
  // But useTransform → style works for x transform on motion elements
  return (
    <motion.p
      style={{ x, opacity }}
      className="text-xl md:text-2xl font-light text-white/70 tracking-wide my-2.5"
    >
      {text}
    </motion.p>
  );
}

const leftPhrases = ['速度', '规模', '自动化', '无限', '压缩'];
const rightPhrases = ['判断', '意义', '创造力', '直觉', '情感'];

export default function DualWaveText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={ref} className="h-[50vh] flex items-center overflow-hidden px-8 sm:px-16">
      {/* AI side */}
      <div className="flex-1 text-right space-y-1">
        <p className="text-[10px] font-mono tracking-[0.4em] text-cyan-400/30 uppercase mb-4">AI</p>
        {leftPhrases.map((p, i) => (
          <WavePhrase key={p} text={p} index={i} scrollYProgress={scrollYProgress} direction={1} />
        ))}
      </div>

      {/* Divider */}
      <div className="w-px h-40 bg-gradient-to-b from-transparent via-white/15 to-transparent mx-6 sm:mx-10 shrink-0" />

      {/* Human side */}
      <div className="flex-1 text-left space-y-1">
        <p className="text-[10px] font-mono tracking-[0.4em] text-white/20 uppercase mb-4">Human</p>
        {rightPhrases.map((p, i) => (
          <WavePhrase key={p} text={p} index={i} scrollYProgress={scrollYProgress} direction={-1} />
        ))}
      </div>
    </div>
  );
}
