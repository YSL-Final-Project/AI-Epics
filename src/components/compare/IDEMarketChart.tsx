import { useRef, useState, useEffect } from 'react';
import ideData from '../../data/ide_market.json';
import { useI18n } from '../../i18n';

const { marketShare } = ideData;
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

const LINE_ANIM_DURATION = 2200;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function IDEMarketChart() {
  const { t } = useI18n();
  const tc = t.compare.ideMarket;

  const [yearProgress, setYearProgress] = useState(0);
  const [calloutVisible, setCalloutVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const hasPlayed = useRef(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true;
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
        } else if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
          // chart is below viewport — user scrolled back up, reset
          hasPlayed.current = false;
          if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
          setYearProgress(0);
          setCalloutVisible(false);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  const floatIdx = yearProgress * (YEAR_COUNT - 1);
  const playheadX = PAD_L + (floatIdx / (YEAR_COUNT - 1)) * chartW;
  const currentYearIdx = Math.round(floatIdx);
  const currentYear = YEARS[currentYearIdx];

  return (
    <div>

      {/* ── Intro ── */}
      <div className="h-screen flex flex-col items-center justify-center px-4">
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
      <div ref={chartRef} className="h-screen flex flex-col items-center justify-center relative px-4 overflow-hidden">
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
              <g key={`dot-${s.key}`}>
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

        {/* ── End-of-line callout ── */}
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

      {/* ── Outro ── */}
      <div className="flex flex-col items-center text-center py-20 px-4">
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
  );
}
