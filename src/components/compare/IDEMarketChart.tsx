import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import ideData from '../../data/ide_market.json';
import { useI18n } from '../../i18n';

const { marketShare, ecosystem } = ideData;
const YEARS = marketShare.map(d => d.year);
const YEAR_COUNT = YEARS.length;

/* ── chart geometry ── */
const W = 700, H = 320, PAD_L = 40, PAD_R = 60, PAD_T = 20, PAD_B = 40;
const chartW = W - PAD_L - PAD_R;
const chartH = H - PAD_T - PAD_B;

function xOf(i: number) { return PAD_L + (i / (YEAR_COUNT - 1)) * chartW; }
function yOf(v: number) { return PAD_T + chartH - (v / 80) * chartH; }

type SeriesKey = 'vscode' | 'cursor' | 'jetbrains' | 'vim';

function linePath(key: SeriesKey) {
  return marketShare
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${xOf(i)},${yOf(d[key])}`)
    .join(' ');
}

const SERIES: { key: SeriesKey; label: string; color: string; ghost?: boolean }[] = [
  { key: 'vscode',  label: 'VS Code', color: '#5a7ec2' },
  { key: 'cursor',  label: 'Cursor',  color: '#a855f7' },
];

/* ── bubble geometry ── */
function bubbleX(aiIntegration: number) { return 10 + ((aiIntegration - 30) / 70) * 80; }
function bubbleY(idx: number) {
  const rows = [30, 55, 75, 35, 60, 45];
  return rows[idx] ?? 50;
}
function bubbleR(marketShareVal: number) { return Math.max(16, Math.sqrt(marketShareVal) * 12); }

const BUBBLE_COLORS: Record<string, string> = {
  'VS Code':    '#5a7ec2',
  JetBrains:    '#a86d3f',
  Cursor:       '#a855f7',
  'Vim/Neovim': '#5f8f64',
  Windsurf:     '#4db0ba',
  Zed:          '#c4a24d',
};

const LINE_ANIM_DURATION = 2200;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function IDEMarketChart() {
  const { t } = useI18n();
  const tc = t.compare.ideMarket;
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll-driven visibility
  const [introOp, setIntroOp] = useState(1);
  const [chartOp, setChartOp] = useState(0);
  const [bubbleOp, setBubbleOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);
  const [holdOp, setHoldOp] = useState(0);
  const [calloutVisible, setCalloutVisible] = useState(false);

  // line animation — plays once when chart fades in
  const [yearProgress, setYearProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const hasPlayed = useRef(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Intro
    if (p <= 0.06) setIntroOp(1);
    else if (p <= 0.10) setIntroOp(1 - (p - 0.06) / 0.04);
    else setIntroOp(0);

    // Chart (line)
    if (p <= 0.08) setChartOp(0);
    else if (p <= 0.12) { setChartOp((p - 0.08) / 0.04); }
    else if (p <= 0.72) setChartOp(1);
    else if (p <= 0.76) setChartOp(1 - (p - 0.72) / 0.04);
    else setChartOp(0);

    // Reset when scrolled back before chart
    if (p <= 0.08 && hasPlayed.current) {
      hasPlayed.current = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      setYearProgress(0);
      setCalloutVisible(false);
    }

    // Trigger line animation once when chart becomes visible
    if (p > 0.08 && !hasPlayed.current) {
      hasPlayed.current = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      setYearProgress(0);
      setCalloutVisible(false);
      let start: number | null = null;
      function animate(ts: number) {
        if (start === null) start = ts;
        const raw = Math.min((ts - start) / LINE_ANIM_DURATION, 1);
        setYearProgress(easeInOutCubic(raw));
        if (raw < 1) {
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setCalloutVisible(true);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    }

    // Hold at 2025 callout: 0.62–0.72
    if (p >= 0.62 && p <= 0.72) setHoldOp(Math.min((p - 0.62) / 0.03, 1));
    else setHoldOp(0);

    // Bubble
    if (p <= 0.74) setBubbleOp(0);
    else if (p <= 0.78) setBubbleOp((p - 0.74) / 0.04);
    else if (p <= 0.86) setBubbleOp(1);
    else if (p <= 0.90) setBubbleOp(1 - (p - 0.86) / 0.04);
    else setBubbleOp(0);

    // Outro
    if (p <= 0.88) setOutroOp(0);
    else if (p <= 0.93) setOutroOp((p - 0.88) / 0.05);
    else setOutroOp(1);
  });

  useEffect(() => {
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Continuous position for smooth clip + playhead
  const floatIdx = yearProgress * (YEAR_COUNT - 1);
  const playheadX = PAD_L + (floatIdx / (YEAR_COUNT - 1)) * chartW;

  // Discrete index only for labels / dots / annotations
  const currentYearIdx = Math.round(floatIdx);
  const currentYear = YEARS[currentYearIdx];
  const cursorAppeared = currentYearIdx >= 4;

  return (
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-6 relative h-full">

          {/* ── Intro ── */}
          <div
            style={{ opacity: introOp, pointerEvents: introOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-xs font-mono tracking-[0.5em] text-slate-400/40 dark:text-white/15 uppercase mb-6">
              {tc.period}
            </p>
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight">
              {tc.heading1}
              <br />
              <span className="text-slate-400 dark:text-white/25">{tc.heading2}</span>
            </h3>
            <p className="mt-6 text-sm text-slate-400 dark:text-white/20 font-light">
              {tc.introSubtitle}
            </p>
          </div>

          {/* ── Line Chart ── */}
          <div
            style={{ opacity: chartOp, pointerEvents: chartOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <span className="absolute text-[140px] sm:text-[200px] font-black leading-none tracking-tighter text-slate-300 dark:text-white/[0.13] select-none pointer-events-none">
              {currentYear}
            </span>

            <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[700px] relative z-10">
              {[0, 20, 40, 60, 80].map(v => (
                <g key={v}>
                  <line x1={PAD_L} y1={yOf(v)} x2={W - PAD_R} y2={yOf(v)}
                    className="stroke-slate-200/20 dark:stroke-white/[0.03]" strokeWidth={0.5} />
                  <text x={PAD_L - 6} y={yOf(v) + 3} textAnchor="end"
                    className="fill-slate-300 dark:fill-white/10" style={{ fontSize: '9px' }}>
                    {v}%
                  </text>
                </g>
              ))}

              {YEARS.map((y, i) => (
                <text key={y} x={xOf(i)} y={H - 8} textAnchor="middle"
                  className="fill-slate-300 dark:fill-white/10" style={{ fontSize: '9px' }}>
                  {y}
                </text>
              ))}

              <defs>
                <clipPath id="lineClip">
                  <rect x={0} y={0} width={playheadX + 2} height={H} />
                </clipPath>
              </defs>

              {SERIES.filter(s => s.ghost).map(s => (
                <path key={s.key} d={linePath(s.key)} fill="none"
                  stroke={s.color} strokeWidth={1} strokeOpacity={0.15}
                  clipPath="url(#lineClip)" />
              ))}

              {SERIES.filter(s => !s.ghost).map(s => (
                <path key={s.key} d={linePath(s.key)} fill="none"
                  stroke={s.color} strokeWidth={2.5} strokeOpacity={0.8}
                  clipPath="url(#lineClip)" />
              ))}

              <line x1={playheadX} y1={PAD_T} x2={playheadX} y2={H - PAD_B}
                className="stroke-slate-300/30 dark:stroke-white/10"
                strokeWidth={1} strokeDasharray="4 4" />

              {SERIES.filter(s => !s.ghost).map(s => {
                const loIdx = Math.floor(floatIdx);
                const hiIdx = Math.min(loIdx + 1, YEAR_COUNT - 1);
                const frac = floatIdx - loIdx;
                const loVal = marketShare[loIdx]?.[s.key] ?? 0;
                const hiVal = marketShare[hiIdx]?.[s.key] ?? 0;
                const val = loVal + (hiVal - loVal) * frac;
                const displayVal = Math.round(val);
                if (s.key === 'cursor' && val < 0.5) return null;
                return (
                  <g key={`dot-${s.key}`}
                    data-cursor-label={s.label}
                    data-cursor-value={`${displayVal}%`}
                    data-cursor-color={s.color}
                    data-cursor-sub={`${currentYear} ${tc.marketShareLabel}`}
                  >
                    <circle cx={playheadX} cy={yOf(val)} r={16} fill="transparent" />
                    <circle cx={playheadX} cy={yOf(val)} r={4} fill={s.color} fillOpacity={0.9} />
                    <text x={playheadX + 8} y={yOf(val) + 4}
                      fill={s.color} style={{ fontSize: '11px', fontWeight: 700 }}>
                      {displayVal}%
                    </text>
                  </g>
                );
              })}

              {/* Annotation 1: VS Code peak — 2023 index=4 */}
              <g style={{ opacity: currentYearIdx >= 4 ? 1 : 0, transition: 'opacity 0.4s' }}>
                <line x1={xOf(4)} y1={PAD_T} x2={xOf(4)} y2={H - PAD_B}
                  stroke="#5a7ec2" strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="4 3" />
                <line x1={xOf(4)} y1={yOf(68) - 5} x2={xOf(4)} y2={yOf(68) - 16}
                  stroke="#5a7ec2" strokeWidth={1} strokeOpacity={0.5} />
                <text x={xOf(4)} y={yOf(68) - 20} textAnchor="middle"
                  fill="#5a7ec2" fillOpacity={0.7} style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                  2023: {tc.annotation1}
                </text>
              </g>

              {/* Annotation 2: Cursor appeared — 2024 index=5 */}
              <g style={{ opacity: currentYearIdx >= 5 ? 1 : 0, transition: 'opacity 0.4s' }}>
                <line x1={xOf(5)} y1={PAD_T} x2={xOf(5)} y2={H - PAD_B}
                  stroke="#a855f7" strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="4 3" />
                <line x1={xOf(5)} y1={yOf(10) + 5} x2={xOf(5)} y2={yOf(10) + 16}
                  stroke="#a855f7" strokeWidth={1} strokeOpacity={0.5} />
                <text x={xOf(5)} y={yOf(10) + 26} textAnchor="middle"
                  fill="#a855f7" fillOpacity={0.7} style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                  2024: {tc.newPlayer}
                </text>
              </g>

              {/* Annotation 3: VS Code decline — 2024 index=5 */}
              <g style={{ opacity: currentYearIdx >= 5 ? 1 : 0, transition: 'opacity 0.4s' }}>
                <line x1={xOf(5) + 5} y1={yOf(62)} x2={xOf(5) + 18} y2={yOf(62)}
                  stroke="#5a7ec2" strokeWidth={1} strokeOpacity={0.5} />
                <text x={xOf(5) + 22} y={yOf(62) + 3} textAnchor="start"
                  fill="#5a7ec2" fillOpacity={0.7} style={{ fontSize: '9px', fontFamily: 'monospace' }}>
                  2024: {tc.annotation2}
                </text>
              </g>

            </svg>

            <div className="flex gap-6 mt-4 relative z-10">
              {SERIES.map(s => (
                <div key={s.key} className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 rounded" style={{ backgroundColor: s.color, opacity: 0.8 }} />
                  <span className="text-[11px] text-slate-500 dark:text-white/30">{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── End-of-line callout — independent from SVG ── */}
            <div
              style={{ opacity: calloutVisible ? 1 : 0, transition: 'opacity 0.6s ease', pointerEvents: 'none', right: '-14px' }}
              className="absolute top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3 text-left"
            >
              <div>
                <p className="text-2xl font-black text-[#5a7ec2]">55%</p>
                <p className="text-[10px] font-mono text-[#5a7ec2]/50">VS Code</p>
              </div>
              <p className="text-[10px] font-mono text-slate-400/30">{tc.comparison}</p>
              <div>
                <p className="text-2xl font-black text-purple-500">18%</p>
                <p className="text-[10px] font-mono text-purple-500/50">Cursor</p>
              </div>
            </div>
          </div>

          {/* ── Bubble Ecosystem ── */}
          <div
            style={{ opacity: bubbleOp, pointerEvents: bubbleOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-sm font-light text-slate-400 dark:text-white/20 mb-8 text-center">
              {tc.bubbleCaption}
            </p>
            <div className="relative w-full max-w-[600px] h-[300px]">
              <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4">
                <span className="text-[9px] text-slate-300 dark:text-white/10">{tc.lowAI}</span>
                <span className="text-[9px] text-slate-300 dark:text-white/10">{tc.highAI}</span>
              </div>
              {ecosystem.map((ide, i) => {
                const left = bubbleX(ide.aiIntegration);
                const top = bubbleY(i);
                const r = bubbleR(ide.marketShare);
                const color = BUBBLE_COLORS[ide.name] || '#888';
                return (
                  <motion.div
                    key={ide.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={bubbleOp > 0.5 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="absolute flex flex-col items-center justify-center rounded-full cursor-default"
                    data-cursor-label={ide.name}
                    data-cursor-value={`${ide.marketShare}%`}
                    data-cursor-color={color}
                    data-cursor-sub={`${tc.aiIntegrationLabel} ${ide.aiIntegration}% · ${ide.plugins.toLocaleString()} ${tc.pluginsLabel}`}
                    style={{
                      left: `${left}%`, top: `${top}%`,
                      width: r * 2, height: r * 2,
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: color,
                      opacity: 0.15,
                      border: `1.5px solid ${color}`,
                    }}
                  >
                    <span className="text-[9px] font-bold text-slate-700 dark:text-white/50 whitespace-nowrap">
                      {ide.name}
                    </span>
                    <span className="text-[8px] text-slate-400 dark:text-white/20">
                      {ide.marketShare}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ── Outro ── */}
          <div
            style={{ opacity: outroOp, pointerEvents: outroOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-5xl sm:text-7xl font-black tracking-tight text-purple-500 mb-2">
              0% → 18%
            </p>
            <p className="text-xl sm:text-2xl font-light text-slate-400 dark:text-white/30 mb-3">
              {tc.outro2}
            </p>
            <p className="text-sm text-slate-300 dark:text-white/15 font-light leading-relaxed max-w-md mx-auto">
              {tc.outro3}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
