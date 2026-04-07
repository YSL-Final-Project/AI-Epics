import { useRef, useState, useMemo } from 'react';
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

/* ── component ── */
export default function RadarCompare() {
  const { t } = useI18n();
  const tc = t.compare.radar;
  const dims = tc.dims;
  const containerRef = useRef<HTMLDivElement>(null);
  const [introOp, setIntroOp] = useState(1);
  const [chartOp, setChartOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [pathProgress, setPathProgress] = useState(0);
  const [showAll, setShowAll] = useState(false);

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

    // Languages: 0.14–0.72 → cycle through 6 languages
    if (p >= 0.14 && p <= 0.72) {
      const t = (p - 0.14) / (0.72 - 0.14);
      const segLen = 1 / LANG_COUNT;
      const idx = Math.min(Math.floor(t / segLen), LANG_COUNT - 1);
      const within = (t - idx * segLen) / segLen;
      setActiveIdx(idx);
      setPathProgress(Math.min(within * 1.5, 1)); // draw faster, hold at 1
      setShowAll(false);
    }

    // Show all overlay: 0.72–0.83
    if (p > 0.72 && p <= 0.83) {
      setShowAll(true);
      setPathProgress(1);
    }

    // Outro
    if (p <= 0.86) setOutroOp(0);
    else if (p <= 0.92) setOutroOp((p - 0.86) / 0.06);
    else setOutroOp(1);
  });

  const activeLang = languages[activeIdx];

  // compute average score for outro
  const avgScores = useMemo(() =>
    languages.map(l => ({
      name: l.name,
      avg: l.metrics.reduce((a, b) => a + b, 0) / N,
    })).sort((a, b) => b.avg - a.avg),
  []);

  return (
    <div ref={containerRef} className="relative" style={{ height: '250vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
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
            {/* Watermark language name */}
            <span
              className="absolute text-[100px] sm:text-[160px] font-black leading-none tracking-tighter text-slate-300 dark:text-white/[0.13] select-none pointer-events-none transition-all duration-500"
              style={{ color: showAll ? undefined : undefined }}
            >
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

              {/* Ghost shapes (previous languages) */}
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
              {showAll && languages.map((lang) => (
                <path
                  key={`all-${lang.name}`}
                  d={polygonPath(lang.metrics)}
                  fill={lang.color}
                  fillOpacity={0.08}
                  stroke={lang.color}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                />
              ))}

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
                    className="transition-all duration-300"
                  />
                  {/* Vertex dots — enlarged hit area */}
                  {activeLang.metrics.map((v, i) => {
                    const pt = vertex(i, (v / 100) * R * pathProgress);
                    return (
                      <g key={i}
                        data-cursor-label={activeLang.name}
                        data-cursor-value={`${v}`}
                        data-cursor-color={activeLang.color}
                        data-cursor-sub={dims[i]}
                      >
                        {/* Invisible hit area */}
                        <circle cx={pt.x} cy={pt.y} r={14} fill="transparent" />
                        {/* Visible dot */}
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
