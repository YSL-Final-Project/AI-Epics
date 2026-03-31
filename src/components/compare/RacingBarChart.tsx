import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import CodePeek from '../shared/CodePeek';

const PEEK_CODE = `// Scroll position drives which year is shown.
// Three phases fade in/out: intro → chart → outro.

useMotionValueEvent(scrollYProgress, 'change', (p) => {
  // 0.00–0.10  intro text fades out
  // 0.08–0.12  chart fades in
  // 0.12–0.83  chart plays through all years
  // 0.83–0.88  chart fades, outro fades in

  // Intro opacity
  if (p <= 0.06) setIntroOp(1);
  else if (p <= 0.10) setIntroOp(1 - (p - 0.06) / 0.04);
  else setIntroOp(0);

  // Chart opacity
  if (p <= 0.08) setChartOp(0);
  else if (p <= 0.12) setChartOp((p - 0.08) / 0.04);
  else if (p <= 0.83) setChartOp(1);
  else if (p <= 0.88) setChartOp(1 - (p - 0.83) / 0.05);
  else setChartOp(0);

  // Map scroll range 0.12–0.83 → year index
  if (p >= 0.12 && p <= 0.83) {
    const t = (p - 0.12) / (0.83 - 0.12);
    setYearIndex(Math.round(t * (TOTAL - 1)));
  }
});

// Framer Motion layoutId animates bars between rank positions
<motion.div key={lang.name} layout layoutId={\`lang-row-\${lang.name}\`}
  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
/>
<motion.div animate={{ width: \`\${(lang.score / 100) * 100}%\` }}
  transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
/>`;
import rankingsData from '../../data/language_rankings.json';
import type { LanguageRankingsData } from '../../types';

const data = rankingsData as LanguageRankingsData;
const TOTAL = data.years.length;

// Muted, refined palette
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

export default function RacingBarChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [yearIndex, setYearIndex] = useState(0);
  // phase: 0 = intro, 1 = chart visible, 2 = outro
  const [introOp, setIntroOp] = useState(1);
  const [chartOp, setChartOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // 0.00–0.08: intro text visible
    // 0.06–0.10: intro fades, chart fades in
    // 0.10–0.85: chart plays through years
    // 0.85–0.92: chart fades, outro fades in
    // 0.92–1.00: outro visible

    // Intro
    if (p <= 0.06) setIntroOp(1);
    else if (p <= 0.10) setIntroOp(1 - (p - 0.06) / 0.04);
    else setIntroOp(0);

    // Chart
    if (p <= 0.08) setChartOp(0);
    else if (p <= 0.12) setChartOp((p - 0.08) / 0.04);
    else if (p <= 0.83) setChartOp(1);
    else if (p <= 0.88) setChartOp(1 - (p - 0.83) / 0.05);
    else setChartOp(0);

    // Year index: map 0.12–0.83 to years
    if (p >= 0.12 && p <= 0.83) {
      const t = (p - 0.12) / (0.83 - 0.12);
      setYearIndex(Math.round(t * (TOTAL - 1)));
    }

    // Outro
    if (p <= 0.86) setOutroOp(0);
    else if (p <= 0.92) setOutroOp((p - 0.86) / 0.06);
    else setOutroOp(1);
  });

  const currentYear = data.years[yearIndex];
  const maxScore = 100;

  const sortedLanguages = [...data.languages]
    .map(lang => ({
      ...lang,
      score: lang.scores[yearIndex],
      color: COLORS[lang.name] || lang.color,
    }))
    .sort((a, b) => b.score - a.score);

  const topLang = sortedLanguages[0];
  const progress = yearIndex / (TOTAL - 1);

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      <CodePeek
        code={PEEK_CODE}
        title="Racing Bar Chart"
        fileName="RacingBarChart.tsx"
        className="absolute top-5 right-5 z-10"
      />
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10 relative">

          {/* ── Phase 1: Intro ── */}
          <div
            style={{ opacity: introOp, pointerEvents: introOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-xs font-mono tracking-[0.5em] text-slate-400/40 dark:text-white/15 uppercase mb-6">
              2015 — 2025
            </p>
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight">
              十年。
              <br />
              <span className="text-slate-400 dark:text-white/25">王座换了三次。</span>
            </h3>
            <p className="mt-6 text-sm text-slate-400 dark:text-white/20 font-light">
              向下滚动，见证每一次逆转。
            </p>
          </div>

          {/* ── Phase 2: Chart ── */}
          <div
            style={{ opacity: chartOp, pointerEvents: chartOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col justify-center"
          >
            {/* Year — Apple-style hero number */}
            <div className="relative mb-4">
              <span className="text-[140px] sm:text-[200px] md:text-[240px] font-black leading-none tracking-tighter text-slate-300 dark:text-white/[0.04] select-none block text-center">
                {currentYear}
              </span>
              {/* #1 language badge overlaid on year */}
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

            {/* Bars — compact, refined */}
            <div className="space-y-1.5 -mt-8 relative max-w-2xl mx-auto w-full">
              <AnimatePresence>
                {sortedLanguages.map((lang, rank) => (
                  <motion.div
                    key={lang.name}
                    layout
                    layoutId={`lang-row-${lang.name}`}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center gap-3"
                    data-cursor-label={lang.name}
                    data-cursor-value={`${lang.score} 分`}
                    data-cursor-color={lang.color}
                    data-cursor-sub={`#${rank + 1} · ${currentYear}`}
                  >
                    {/* Rank */}
                    <span className="w-4 text-right text-[10px] font-mono text-slate-300 dark:text-white/10 tabular-nums shrink-0">
                      {rank + 1}
                    </span>
                    {/* Name */}
                    <span className="w-[88px] text-right text-[13px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 tracking-tight">
                      {lang.name}
                    </span>
                    {/* Bar */}
                    <div className="flex-1 h-7 bg-slate-100/80 dark:bg-white/[0.02] rounded overflow-hidden">
                      <motion.div
                        className="h-full rounded relative overflow-hidden"
                        style={{ backgroundColor: lang.color }}
                        animate={{ width: `${(lang.score / maxScore) * 100}%` }}
                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.08] to-white/0" />
                      </motion.div>
                    </div>
                    {/* Score */}
                    <span className="w-8 text-right text-xs font-bold tabular-nums text-slate-400 dark:text-white/25">
                      {lang.score}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Minimal progress line */}
            <div className="mt-8 max-w-2xl mx-auto w-full">
              <div className="relative h-px">
                <div className="absolute inset-0 bg-slate-200/50 dark:bg-white/[0.04]" />
                <div
                  className="absolute top-0 left-0 h-full bg-slate-400 dark:bg-white/20 transition-all duration-500 ease-out"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-[9px] font-mono text-slate-300 dark:text-white/[0.08]">{data.years[0]}</span>
                <span className="text-[9px] font-mono text-slate-300 dark:text-white/[0.08]">{data.years[TOTAL - 1]}</span>
              </div>

              {/* Annotations */}
              {yearIndex >= 5 && yearIndex <= 7 && (
                <div className="flex items-center gap-1.5 mt-3 justify-center transition-opacity duration-300">
                  <div className="w-4 h-px bg-cyan-400/50" />
                  <span className="text-[10px] text-cyan-500/60 font-mono">Python 首次登顶</span>
                </div>
              )}
              {yearIndex >= 8 && (
                <div className="flex items-center gap-1.5 mt-3 justify-center transition-opacity duration-300">
                  <div className="w-4 h-px bg-cyan-400/50" />
                  <span className="text-[10px] text-cyan-500/60 font-mono">AI 浪潮推动 Python 一骑绝尘</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Phase 3: Outro ── */}
          <div
            style={{ opacity: outroOp, pointerEvents: outroOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Python.
            </p>
            <p className="text-xl sm:text-2xl font-light text-slate-400 dark:text-white/30">
              从第七，到唯一。
            </p>
            <p className="text-sm text-slate-300 dark:text-white/15 mt-3 font-light leading-relaxed">
              不是它变强了。是世界选择了它。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
