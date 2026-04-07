import { useState, useRef, useCallback, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring, AnimatePresence } from 'framer-motion';
import CodePeek from '../shared/CodePeek';
import { useI18n } from '../../i18n';

const PEEK_CODE = `// useSpring smooths discrete Windows scroll into continuous motion.
const smoothProgress = useSpring(scrollYProgress, {
  stiffness: 120, damping: 25, restDelta: 0.0005,
});

// Continuous float t → interpolated scores between years.
const score = scores[lo] + (scores[hi] - scores[lo]) * frac;

// #1 bar gets a colored glow; all bars have glass highlight.
boxShadow: rank === 0 ? \`0 0 20px \${color}40, 0 0 40px \${color}20\` : 'none'

// Rank changes tracked: rising → green flash + ▲ indicator.
// Score numbers use CSS translateY transition for rolling effect.
// Background radial gradient follows #1 language color.`;

import rankingsData from '../../data/language_rankings.json';
import type { LanguageRankingsData } from '../../types';

const data = rankingsData as LanguageRankingsData;
const TOTAL = data.years.length;
const ROW_H = 34;

const COLORS: Record<string, string> = {
  Python: '#5a7ec2',
  JavaScript: '#c4a24d',
  Java: '#a86d3f',
  'C++': '#5a7f9e',
  TypeScript: '#5186cc',
  'C#': '#5f8f64',
  Go: '#4db0ba',
  Rust: '#b8604f',
  PHP: '#7e7aa8',
  Swift: '#c4804e',
};

interface BarItem {
  name: string;
  score: number;
  color: string;
}

interface FrameState {
  displayYear: number;
  sorted: BarItem[];
  progress: number;
}

function interpolateFrame(t: number): FrameState {
  const clamped = Math.max(0, Math.min(t, TOTAL - 1));
  const lo = Math.floor(clamped);
  const hi = Math.min(lo + 1, TOTAL - 1);
  const frac = clamped - lo;

  const sorted = data.languages
    .map(lang => ({
      name: lang.name,
      score: lang.scores[lo] + (lang.scores[hi] - lang.scores[lo]) * frac,
      color: COLORS[lang.name] || lang.color,
    }))
    .sort((a, b) => b.score - a.score);

  return {
    displayYear: data.years[Math.round(clamped)],
    sorted,
    progress: clamped / (TOTAL - 1),
  };
}

const INITIAL = interpolateFrame(0);

/* ── Rolling number digit ── */
function RollingScore({ value }: { value: number }) {
  const display = Math.round(value);
  return (
    <span className="w-8 text-right text-xs font-bold tabular-nums text-slate-400 dark:text-white/25 inline-flex justify-end overflow-hidden">
      <span className="relative h-[1.2em] inline-flex items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={display}
            initial={{ y: 8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -8, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="inline-block"
          >
            {display}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}

/* ── Intro particle burst ── */
function IntroParticles({ active }: { active: boolean }) {
  const particles = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      angle: (Math.PI * 2 * i) / 12,
      distance: 80 + Math.random() * 120,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 0.2,
    })),
  []);

  return (
    <AnimatePresence>
      {active && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white/20 dark:bg-white/10"
              style={{ width: p.size, height: p.size }}
              initial={{ x: 0, y: 0, opacity: 0.6, scale: 1 }}
              animate={{
                x: Math.cos(p.angle) * p.distance,
                y: Math.sin(p.angle) * p.distance,
                opacity: 0,
                scale: 0.3,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export default function RacingBarChart() {
  const { t } = useI18n();
  const tc = t.compare.racingBar;
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState<FrameState>(INITIAL);
  const rafRef = useRef(0);
  const prevRanksRef = useRef<Record<string, number>>({});
  const [rankChanges, setRankChanges] = useState<Record<string, number>>({});
  const [showParticles, setShowParticles] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.0005,
  });

  // --- Phase opacities ---
  const introOp = useTransform(smoothProgress, [0, 0.06, 0.10], [1, 1, 0]);
  const chartOp = useTransform(smoothProgress, [0.08, 0.12, 0.83, 0.88], [0, 1, 1, 0]);
  const outroOp = useTransform(smoothProgress, [0.86, 0.92], [0, 1]);

  const introPointer = useTransform(introOp, v => (v < 0.1 ? 'none' : 'auto'));
  const chartPointer = useTransform(chartOp, v => (v < 0.1 ? 'none' : 'auto'));
  const outroPointer = useTransform(outroOp, v => (v < 0.1 ? 'none' : 'auto'));

  // Particle trigger: fires when intro fades and chart appears
  const prevIntroVisible = useRef(true);
  useMotionValueEvent(introOp, 'change', (v) => {
    if (prevIntroVisible.current && v < 0.1) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1000);
    }
    prevIntroVisible.current = v >= 0.1;
  });

  const progressWidth = useTransform(smoothProgress, [0.12, 0.83], ['0%', '100%']);

  // --- Frame update with rank tracking ---
  const updateFrame = useCallback((p: number) => {
    if (p >= 0.12 && p <= 0.83) {
      const t = ((p - 0.12) / (0.83 - 0.12)) * (TOTAL - 1);
      const newFrame = interpolateFrame(t);

      // Track rank changes
      const newRanks: Record<string, number> = {};
      const changes: Record<string, number> = {};
      newFrame.sorted.forEach((lang, rank) => {
        newRanks[lang.name] = rank;
        const prevRank = prevRanksRef.current[lang.name];
        if (prevRank !== undefined) {
          changes[lang.name] = prevRank - rank; // positive = rose
        }
      });
      prevRanksRef.current = newRanks;
      setRankChanges(changes);

      setFrame(newFrame);
    }
  }, []);

  useMotionValueEvent(smoothProgress, 'change', (p) => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => updateFrame(p));
  });

  const topLang = frame.sorted[0];

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <CodePeek
        code={PEEK_CODE}
        title="Racing Bar Chart"
        fileName="RacingBarChart.tsx"
        className="absolute top-5 right-5 z-10"
      />
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* 7A: Radial gradient background following #1 language */}
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 45%, ${topLang.color}08 0%, transparent 70%)`,
          }}
        />

        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 relative">

          {/* -- Phase 1: Intro with stagger reveal -- */}
          <motion.div
            style={{ opacity: introOp, pointerEvents: introPointer }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <IntroParticles active={showParticles} />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-xs font-mono tracking-[0.5em] text-slate-400/40 dark:text-white/15 uppercase mb-6"
            >
              {tc.period}
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight"
            >
              {tc.heading1}
              <br />
              <span className="text-slate-400 dark:text-white/25">{tc.heading2}</span>
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="mt-6 text-sm text-slate-400 dark:text-white/20 font-light"
            >
              {tc.scrollHint}
            </motion.p>
          </motion.div>

          {/* -- Phase 2: Chart -- */}
          <motion.div
            style={{ opacity: chartOp, pointerEvents: chartPointer }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            {/* Year */}
            <div className="relative mb-4">
              <span className="text-[140px] sm:text-[200px] md:text-[240px] font-black leading-none tracking-tighter text-slate-300 dark:text-white/[0.13] select-none block text-center">
                {frame.displayYear}
              </span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-xs font-mono tracking-widest text-slate-400/50 dark:text-white/15 uppercase">#1</span>
                  <p
                    className="text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500"
                    style={{ color: topLang.color }}
                  >
                    {topLang.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Bars */}
            <div
              className="relative -mt-8 max-w-2xl mx-auto w-full"
              style={{ height: frame.sorted.length * ROW_H }}
            >
              {frame.sorted.map((lang, rank) => {
                const isTop = rank === 0;
                const change = rankChanges[lang.name] || 0;
                const isRising = change > 0;

                return (
                  <div
                    key={lang.name}
                    className="absolute left-0 right-0 flex items-center gap-3"
                    style={{
                      height: 28,
                      transform: `translateY(${rank * ROW_H}px)`,
                      transition: 'transform 0.35s cubic-bezier(0.23, 1, 0.32, 1)',
                    }}
                    data-cursor-label={lang.name}
                    data-cursor-value={`${lang.score.toFixed(1)} ${tc.scoreUnit}`}
                    data-cursor-color={lang.color}
                    data-cursor-sub={`#${rank + 1} · ${frame.displayYear}`}
                  >
                    {/* Rank with change indicator */}
                    <span className="w-4 text-right text-[10px] font-mono tabular-nums shrink-0 relative">
                      <span className={isRising ? 'text-emerald-400/80' : 'text-slate-300 dark:text-white/10'}>
                        {rank + 1}
                      </span>
                      {isRising && (
                        <span className="absolute -right-1.5 -top-0.5 text-[7px] text-emerald-400/70">
                          ▲
                        </span>
                      )}
                    </span>
                    {/* Name */}
                    <span className={`w-[88px] text-right text-[13px] font-semibold shrink-0 tracking-tight transition-colors duration-300 ${
                      isTop ? 'text-slate-700 dark:text-white/70' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {lang.name}
                    </span>
                    {/* Bar with glow + glass effects */}
                    <div className="flex-1 h-7 bg-slate-100/80 dark:bg-white/[0.02] rounded overflow-hidden">
                      <div
                        className="h-full rounded relative overflow-hidden transition-shadow duration-500"
                        style={{
                          backgroundColor: lang.color,
                          width: `${(lang.score / 100) * 100}%`,
                          boxShadow: isTop
                            ? `0 0 16px ${lang.color}40, 0 0 32px ${lang.color}20, inset 0 1px 0 rgba(255,255,255,0.15)`
                            : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                        }}
                      >
                        {/* Glass highlight */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.18] via-transparent to-black/[0.05]" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.1] to-white/0" />
                        {/* Rising flash */}
                        {isRising && (
                          <motion.div
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute inset-0 bg-white/20"
                          />
                        )}
                      </div>
                    </div>
                    {/* Rolling score */}
                    <RollingScore value={lang.score} />
                  </div>
                );
              })}
            </div>

            {/* Progress line */}
            <div className="mt-8 max-w-2xl mx-auto w-full">
              <div className="relative h-px">
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-white/[0.04]" />
                <motion.div
                  className="absolute top-0 left-0 h-full bg-slate-400 dark:bg-white/20"
                  style={{ width: progressWidth }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] font-mono text-slate-300 dark:text-white/[0.13]">{data.years[0]}</span>
                <span className="text-[9px] font-mono text-slate-300 dark:text-white/[0.13]">{data.years[TOTAL - 1]}</span>
              </div>

              {frame.displayYear >= 2020 && frame.displayYear <= 2022 && (
                <div className="flex items-center gap-1.5 mt-3 justify-center transition-opacity duration-300">
                  <div className="w-4 h-px bg-cyan-400/50" />
                  <span className="text-[10px] text-cyan-500/60 font-mono">{tc.annotation1}</span>
                </div>
              )}
              {frame.displayYear >= 2023 && (
                <div className="flex items-center gap-1.5 mt-3 justify-center transition-opacity duration-300">
                  <div className="w-4 h-px bg-cyan-400/50" />
                  <span className="text-[10px] text-cyan-500/60 font-mono">{tc.annotation2}</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* -- Phase 3: Outro with scale-blur entrance -- */}
          <motion.div
            style={{ opacity: outroOp, pointerEvents: outroPointer }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <motion.p
              initial={{ scale: 0.85, opacity: 0, filter: 'blur(8px)' }}
              whileInView={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-4"
            >
              Python.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-xl sm:text-2xl font-light text-slate-400 dark:text-white/30"
            >
              {tc.outro2}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-slate-300 dark:text-white/15 mt-3 font-light leading-relaxed"
            >
              {tc.outro3}
            </motion.p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
