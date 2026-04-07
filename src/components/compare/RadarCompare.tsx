import { useRef, useState, useMemo, useEffect } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import { useI18n } from '../../i18n';

/* ── data ── */
const languages = [
  { name: 'Python',     color: '#5a7ec2', metrics: [98, 85, 95, 90, 92] },
  { name: 'Rust',       color: '#b8604f', metrics: [55, 95, 60, 35, 70] },
  { name: 'TypeScript', color: '#5186cc', metrics: [82, 88, 90, 65, 80] },
  { name: 'JavaScript', color: '#c4a24d', metrics: [88, 78, 85, 75, 95] },
  { name: 'Go',         color: '#4db0ba', metrics: [60, 92, 70, 72, 65] },
  { name: 'Java',       color: '#a86d3f', metrics: [65, 82, 80, 55, 85] },
];

const N = 5;
const LANG_COUNT = languages.length;
const ALL_IDX = LANG_COUNT; // tab index for "All"
const ANIM_DURATION = 700; // ms

/* ── geometry helpers ── */
const CX = 200, CY = 200, R = 150;
const angles = Array.from({ length: N }, (_, i) => (Math.PI * 2 * i) / N - Math.PI / 2);

function vertex(i: number, r: number) {
  return { x: CX + r * Math.cos(angles[i]), y: CY + r * Math.sin(angles[i]) };
}

function polygonPath(metrics: number[], scale = 1) {
  return metrics
    .map((v, i) => {
      const p = vertex(i, (v / 100) * R * scale);
      return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    })
    .join(' ') + ' Z';
}

function ringPath(r: number) {
  return Array.from({ length: N }, (_, i) => {
    const p = vertex(i, r);
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
  }).join(' ') + ' Z';
}

/* ── easing ── */
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* ── component ── */
export default function RadarCompare() {
  const { t } = useI18n();
  const tc = t.compare.radar;
  const dims = tc.dims;
  const containerRef = useRef<HTMLDivElement>(null);

  // scroll-driven visibility
  const [introOp, setIntroOp] = useState(1);
  const [chartOp, setChartOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);

  // tab + animation state
  const [tabIdx, setTabIdx] = useState(0);
  const [pathProgress, setPathProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const showAll = tabIdx === ALL_IDX;
  const activeIdx = showAll ? 0 : tabIdx;
  const activeLang = languages[activeIdx];

  /* play-once animation whenever tab changes */
  useEffect(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setPathProgress(0);
    let start: number | null = null;

    function animate(ts: number) {
      if (start === null) start = ts;
      const raw = Math.min((ts - start) / ANIM_DURATION, 1);
      setPathProgress(easeOutCubic(raw));
      if (raw < 1) rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [tabIdx]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
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

    // Outro
    if (p <= 0.86) setOutroOp(0);
    else if (p <= 0.92) setOutroOp((p - 0.86) / 0.06);
    else setOutroOp(1);
  });

  const avgScores = useMemo(() =>
    languages.map(l => ({
      name: l.name,
      avg: l.metrics.reduce((a, b) => a + b, 0) / N,
    })).sort((a, b) => b.avg - a.avg),
  []);

  const tabs = [...languages.map((l, i) => ({ label: l.name, idx: i })), { label: tc.allLabel, idx: ALL_IDX }];

  return (
    <div ref={containerRef} className="relative mt-16 mb-4" style={{ height: '250vh' }}>
      <div className="sticky top-16 h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-3xl mx-auto px-6 relative h-full">

          {/* ── Intro ── */}
          <div
            style={{ opacity: introOp, pointerEvents: introOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-xs font-mono tracking-[0.5em] text-slate-400/40 dark:text-white/15 uppercase mb-6">
              {tc.dimensionLabel}
            </p>
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight">
              {tc.heading1}
              <br />
              <span className="text-slate-400 dark:text-white/25">{tc.heading2}</span>
            </h3>
            <p className="mt-6 text-sm text-slate-400 dark:text-white/20 font-light">
              {tc.dimensionsList}
            </p>
          </div>

          {/* ── Chart ── */}
          <div
            style={{ opacity: chartOp, pointerEvents: chartOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* ── Tab bar ── */}
            <div className="flex items-center gap-1 mb-6 p-1 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06]">
              {tabs.map(({ label, idx }) => {
                const isActive = tabIdx === idx;
                const color = idx < LANG_COUNT ? languages[idx].color : '#eab308';
                return (
                  <button
                    key={label}
                    onClick={() => setTabIdx(idx)}
                    className="relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{
                      color: isActive ? (color ?? '#fff') : undefined,
                      background: isActive ? (color ? `${color}22` : 'rgba(255,255,255,0.08)') : undefined,
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-lg"
                        style={{
                          boxShadow: color ? `0 0 0 1px ${color}55` : '0 0 0 1px rgba(255,255,255,0.15)',
                        }}
                      />
                    )}
                    <span className={`relative z-10 ${isActive ? '' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Watermark language name */}
            <span className="absolute text-[100px] sm:text-[160px] font-black leading-none tracking-tighter text-slate-300 dark:text-white/[0.13] select-none pointer-events-none transition-all duration-500">
              {showAll ? tc.allLabel : activeLang.name}
            </span>

            {/* SVG Radar */}
            <svg viewBox="0 0 400 400" className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] relative z-10">
              {/* Grid rings */}
              {[0.25, 0.5, 0.75, 1].map(s => (
                <path
                  key={s}
                  d={ringPath(R * s)}
                  fill="none"
                  className="stroke-slate-200/40 dark:stroke-white/[0.04]"
                  strokeWidth={0.5}
                />
              ))}

              {/* Axis lines + labels */}
              {dims.map((label, i) => {
                const p = vertex(i, R + 20);
                const end = vertex(i, R);
                return (
                  <g key={label}>
                    <line
                      x1={CX} y1={CY} x2={end.x} y2={end.y}
                      className="stroke-slate-200/30 dark:stroke-white/[0.03]"
                      strokeWidth={0.5}
                    />
                    <text
                      x={p.x} y={p.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-400 dark:fill-white/20 text-[10px] sm:text-[11px]"
                      style={{ fontSize: '11px' }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Ghost shapes (previous languages, single-lang mode) */}
              {!showAll && languages.slice(0, activeIdx).map((lang) => (
                <path
                  key={`ghost-${lang.name}`}
                  d={polygonPath(lang.metrics)}
                  fill={lang.color}
                  fillOpacity={0.03}
                  stroke={lang.color}
                  strokeWidth={1}
                  strokeOpacity={0.12}
                />
              ))}

              {/* All overlay */}
              {showAll && languages.map((lang) => {
                const isPython = lang.name === 'Python';
                return (
                  <path
                    key={`all-${lang.name}`}
                    d={polygonPath(lang.metrics, pathProgress)}
                    fill={lang.color}
                    fillOpacity={0}
                    stroke={lang.color}
                    strokeWidth={isPython ? 3 : 1.2}
                    strokeOpacity={pathProgress > 0.1 ? (isPython ? 0.9 : 0.35) : 0}
                    className="transition-none"
                  />
                );
              })}

              {/* Active language shape — scale reveal */}
              {!showAll && (
                <>
                  <path
                    d={polygonPath(activeLang.metrics, pathProgress)}
                    fill={activeLang.color}
                    fillOpacity={0.12}
                    stroke={activeLang.color}
                    strokeWidth={2}
                    strokeOpacity={pathProgress > 0.1 ? 0.8 : 0}
                    className="transition-none"
                  />
                  {/* Vertex dots */}
                  {activeLang.metrics.map((v, i) => {
                    const pt = vertex(i, (v / 100) * R * pathProgress);
                    return (
                      <g key={i}
                        data-cursor-label={activeLang.name}
                        data-cursor-value={`${v}`}
                        data-cursor-color={activeLang.color}
                        data-cursor-sub={dims[i]}
                      >
                        <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={3}
                          fill={activeLang.color}
                          style={{ opacity: pathProgress > 0.3 ? 0.8 : 0 }}
                          className="transition-opacity duration-300"
                        />
                      </g>
                    );
                  })}
                </>
              )}
            </svg>

            {/* All — legend */}
            {showAll && (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 mb-2 relative z-10">
                {languages.map((lang) => {
                  const isPython = lang.name === 'Python';
                  return (
                    <div key={lang.name} className="flex items-center gap-1.5">
                      <span
                        className="inline-block rounded-sm"
                        style={{
                          width: isPython ? 16 : 12,
                          height: isPython ? 4 : 3,
                          background: lang.color,
                          opacity: isPython ? 1 : 0.6,
                        }}
                      />
                      <span
                        className="font-mono"
                        style={{
                          fontSize: isPython ? 13 : 11,
                          fontWeight: isPython ? 800 : 500,
                          color: isPython ? lang.color : undefined,
                          opacity: isPython ? 1 : 0.55,
                        }}
                      >
                        {lang.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Active language callout */}
            <div className="mt-4 text-center relative z-10 h-12">
              {!showAll ? (
                <div key={activeLang.name} className="transition-all duration-300">
                  <span
                    className="text-lg font-bold transition-colors duration-300"
                    style={{ color: activeLang.color }}
                  >
                    {activeLang.name}
                  </span>
                  <span className="text-sm text-slate-400 dark:text-white/20 ml-3">
                    {tc.highlights[activeLang.name] || ''}
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {tc.overallRank}
                  </span>
                  <span className="text-sm ml-3" style={{ color: languages[0].color }}>
                    Python — {tc.avgLabel} {avgScores[0].avg.toFixed(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Outro ── */}
          <div
            style={{ opacity: outroOp, pointerEvents: outroOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-6xl sm:text-8xl font-black tracking-tight text-slate-900 dark:text-white mb-4">
              Python.
            </p>
            <p className="text-xl sm:text-2xl font-light text-slate-400 dark:text-white/30">
              {tc.outro2}
            </p>
            <p className="text-sm text-slate-300 dark:text-white/15 mt-3 font-light leading-relaxed">
              {tc.outro3}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
