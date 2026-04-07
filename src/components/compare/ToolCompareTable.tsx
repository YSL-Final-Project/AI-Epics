import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'framer-motion';
import toolsData from '../../data/ai_tools_compare.json';
import type { AIToolInfo } from '../../types';
import { useI18n } from '../../i18n';

const tools = toolsData as AIToolInfo[];
const TOOL_COUNT = tools.length;

/* ── color palette ── */
const TOOL_COLORS: Record<string, string> = {
  'GitHub Copilot': '#5a7ec2',
  Cursor: '#a855f7',
  'Claude Code': '#c4a24d',
  Windsurf: '#4db0ba',
  'Cody (Sourcegraph)': '#5f8f64',
};

/* ── radar geometry (5-axis pentagon) ── */
const CX = 200, CY = 200, R = 140;
const N_AXES = 5;
const radarAngles = Array.from({ length: N_AXES }, (_, i) => (Math.PI * 2 * i) / N_AXES - Math.PI / 2);

function radarVertex(i: number, r: number) {
  return { x: CX + r * Math.cos(radarAngles[i]), y: CY + r * Math.sin(radarAngles[i]) };
}

function radarPolygon(values: number[]) {
  return values
    .map((v, i) => {
      const p = radarVertex(i, (v / 100) * R);
      return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
    })
    .join(' ') + ' Z';
}

function radarRing(r: number) {
  return Array.from({ length: N_AXES }, (_, i) => {
    const p = radarVertex(i, r);
    return `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`;
  }).join(' ') + ' Z';
}

/* ── normalize tool data for radar ── */
const CONTEXT_SCORES: Record<string, number> = {
  '8K tokens': 20,
  'Codebase-level': 65,
  'Entire codebase': 70,
  '200K tokens': 90,
};

// ide breadth: count / max * 100
const maxIDE = Math.max(...tools.map(t => t.ideSupport.length));

// pricing value (cheaper = higher)
const PRICING_SCORES: Record<string, number> = {
  'GitHub Copilot': 55,
  Cursor: 45,
  'Claude Code': 40,
  Windsurf: 60,
  'Cody (Sourcegraph)': 90,
};

function getRadarValues(tool: AIToolInfo): number[] {
  return [
    tool.accuracy,                                          // accuracy 0–100
    (tool.languages / 35) * 100,                           // languages normalized
    CONTEXT_SCORES[tool.contextWindow] ?? 50,              // context
    (tool.ideSupport.length / maxIDE) * 100,               // IDE breadth
    PRICING_SCORES[tool.name] ?? 50,                       // value
  ];
}

/* ── stat ring helpers ── */
const RING_R = 80;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;

export default function ToolCompareTable() {
  const { t } = useI18n();
  const tc = t.compare.toolTable;
  const containerRef = useRef<HTMLDivElement>(null);

  const [introOp, setIntroOp] = useState(1);
  const [cardOp, setCardOp] = useState(0);
  const [activeToolIdx, setActiveToolIdx] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);
  const [radarOp, setRadarOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    // Intro: 0–0.08
    if (p <= 0.05) setIntroOp(1);
    else if (p <= 0.09) setIntroOp(1 - (p - 0.05) / 0.04);
    else setIntroOp(0);

    // Tool cards: 0.08–0.62
    if (p <= 0.07) setCardOp(0);
    else if (p <= 0.11) setCardOp((p - 0.07) / 0.04);
    else if (p <= 0.62) setCardOp(1);
    else if (p <= 0.66) setCardOp(1 - (p - 0.62) / 0.04);
    else setCardOp(0);

    // Active tool index + ring progress
    if (p >= 0.12 && p <= 0.60) {
      const t = (p - 0.12) / (0.60 - 0.12);
      const segLen = 1 / TOOL_COUNT;
      const idx = Math.min(Math.floor(t / segLen), TOOL_COUNT - 1);
      const within = (t - idx * segLen) / segLen;
      setActiveToolIdx(idx);
      setRingProgress(Math.min(within * 2, 1)); // draw fast, hold at 1
    }

    // Radar: 0.64–0.86
    if (p <= 0.63) setRadarOp(0);
    else if (p <= 0.67) setRadarOp((p - 0.63) / 0.04);
    else if (p <= 0.84) setRadarOp(1);
    else if (p <= 0.88) setRadarOp(1 - (p - 0.84) / 0.04);
    else setRadarOp(0);

    // Outro: 0.86–1.0
    if (p <= 0.86) setOutroOp(0);
    else if (p <= 0.92) setOutroOp((p - 0.86) / 0.06);
    else setOutroOp(1);
  });

  const activeTool = tools[activeToolIdx];
  const activeColor = TOOL_COLORS[activeTool.name] || '#888';

  return (
    <div ref={containerRef} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-4xl mx-auto px-6 relative h-full">

          {/* ── Intro ── */}
          <div
            style={{ opacity: introOp, pointerEvents: introOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-xs font-mono tracking-[0.5em] text-slate-400/50 dark:text-white/20 uppercase mb-6">
              {tc.badge}
            </p>
            <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight text-center leading-tight">
              {tc.title}
            </h3>
            <p className="mt-6 text-sm text-slate-400 dark:text-white/30 font-light">
              {tc.subtitle}
            </p>
          </div>

          {/* ── Tool Spotlight Cards ── */}
          <div
            style={{ opacity: cardOp, pointerEvents: cardOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            {/* Watermark */}
            <span
              className="absolute text-[70px] sm:text-[120px] font-black leading-none tracking-tighter select-none pointer-events-none transition-all duration-500"
              style={{ color: activeColor, opacity: 0.06 }}
            >
              {activeTool.name.replace(' (Sourcegraph)', '')}
            </span>

            {/* Subtle radial glow */}
            <div
              className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-700"
              style={{
                background: `radial-gradient(circle, ${activeColor}12 0%, transparent 70%)`,
              }}
            />

            {/* Stat Ring */}
            <div className="relative z-10 flex flex-col items-center">
              <svg width="200" height="200" viewBox="0 0 200 200" className="sm:w-[260px] sm:h-[260px]">
                {/* Background ring */}
                <circle
                  cx="100" cy="100" r={RING_R}
                  fill="none"
                  className="stroke-slate-200/20 dark:stroke-white/[0.06]"
                  strokeWidth={6}
                />
                {/* Progress ring */}
                <circle
                  cx="100" cy="100" r={RING_R}
                  fill="none"
                  stroke={activeColor}
                  strokeWidth={6}
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - (activeTool.accuracy / 100) * ringProgress)}
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-500"
                  style={{ opacity: 0.85 }}
                />
                {/* Center text */}
                <text
                  x="100" y="92"
                  textAnchor="middle"
                  className="fill-slate-900 dark:fill-white"
                  style={{ fontSize: '36px', fontWeight: 900, opacity: ringProgress > 0.3 ? 1 : 0, transition: 'opacity 0.3s' }}
                >
                  {Math.round(activeTool.accuracy * ringProgress)}%
                </text>
                <text
                  x="100" y="115"
                  textAnchor="middle"
                  className="fill-slate-400 dark:fill-white/30"
                  style={{ fontSize: '11px', opacity: ringProgress > 0.5 ? 1 : 0, transition: 'opacity 0.3s' }}
                >
                  {tc.accuracyLabel}
                </text>
              </svg>

              {/* Tool name + highlight */}
              <div className="mt-4 text-center transition-all duration-500">
                <h4 className="text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-500" style={{ color: activeColor }}>
                  {activeTool.name}
                </h4>
                <p className="text-sm text-slate-500 dark:text-white/35 mt-1 font-light max-w-xs">
                  {tc.toolHighlights[activeTool.name] || ''}
                </p>
              </div>

              {/* Stat pills */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <StatPill label={tc.languagesLabel} value={`${activeTool.languages}`} color={activeColor} />
                <StatPill label={tc.contextLabel} value={tc.toolContext[activeTool.name] || ''} color={activeColor} />
                <StatPill label={tc.pricingLabel} value={tc.toolPricing[activeTool.name] || ''} color={activeColor} />
              </div>

              {/* IDE badges */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {(tc.toolIDE[activeTool.name] || '').split(' · ').map(ide => (
                  <span
                    key={ide}
                    className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all duration-500"
                    style={{
                      borderColor: `${activeColor}30`,
                      color: activeColor,
                      backgroundColor: `${activeColor}08`,
                      opacity: ringProgress > 0.6 ? 1 : 0,
                    }}
                  >
                    {ide}
                  </span>
                ))}
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 mt-8">
                {tools.map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: i === activeToolIdx ? activeColor : 'transparent',
                      border: `1.5px solid ${i === activeToolIdx ? activeColor : 'rgba(255,255,255,0.15)'}`,
                      opacity: i <= activeToolIdx ? 1 : 0.3,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ── Radar Comparison ── */}
          <div
            style={{ opacity: radarOp, pointerEvents: radarOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <p className="text-xs font-mono tracking-[0.5em] text-slate-400/50 dark:text-white/20 uppercase mb-6">
              {tc.radarTitle}
            </p>

            <svg viewBox="0 0 400 400" className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px]">
              {/* Grid rings */}
              {[0.25, 0.5, 0.75, 1].map(s => (
                <path
                  key={s}
                  d={radarRing(R * s)}
                  fill="none"
                  className="stroke-slate-200/30 dark:stroke-white/[0.06]"
                  strokeWidth={0.5}
                />
              ))}

              {/* Axis lines + labels */}
              {tc.radarAxes.map((label: string, i: number) => {
                const p = radarVertex(i, R + 22);
                const end = radarVertex(i, R);
                return (
                  <g key={label}>
                    <line
                      x1={CX} y1={CY} x2={end.x} y2={end.y}
                      className="stroke-slate-200/20 dark:stroke-white/[0.04]"
                      strokeWidth={0.5}
                    />
                    <text
                      x={p.x} y={p.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-slate-400 dark:fill-white/30 text-[10px] sm:text-[11px]"
                      style={{ fontSize: '11px' }}
                    >
                      {label}
                    </text>
                  </g>
                );
              })}

              {/* Tool polygons */}
              {tools.map((tool) => {
                const color = TOOL_COLORS[tool.name] || '#888';
                const values = getRadarValues(tool);
                return (
                  <path
                    key={tool.name}
                    d={radarPolygon(values)}
                    fill={color}
                    fillOpacity={0.08}
                    stroke={color}
                    strokeWidth={1.5}
                    strokeOpacity={0.5}
                    data-cursor-label={tool.name}
                    data-cursor-color={color}
                    data-cursor-value={`${tool.accuracy}%`}
                    data-cursor-sub={tc.accuracyLabel}
                  />
                );
              })}

              {/* Vertex dots for all tools */}
              {tools.map((tool) => {
                const color = TOOL_COLORS[tool.name] || '#888';
                const values = getRadarValues(tool);
                return values.map((v, i) => {
                  const pt = radarVertex(i, (v / 100) * R);
                  return (
                    <circle
                      key={`${tool.name}-${i}`}
                      cx={pt.x} cy={pt.y} r={2.5}
                      fill={color}
                      fillOpacity={0.7}
                    />
                  );
                });
              })}
            </svg>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {tools.map(tool => {
                const color = TOOL_COLORS[tool.name] || '#888';
                return (
                  <div key={tool.name} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded" style={{ backgroundColor: color, opacity: 0.8 }} />
                    <span className="text-[11px] text-slate-500 dark:text-white/35">
                      {tool.name.replace(' (Sourcegraph)', '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Outro ── */}
          <div
            style={{ opacity: outroOp, pointerEvents: outroOp < 0.1 ? 'none' : 'auto' }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center"
          >
            <p className="text-6xl sm:text-8xl font-black tracking-tight mb-4" style={{ color: TOOL_COLORS['Claude Code'] }}>
              {tc.verdictHeading}
            </p>
            <p className="text-xl sm:text-2xl font-light text-slate-400 dark:text-white/35">
              {tc.verdictSub}
            </p>
            <p className="text-sm text-slate-300 dark:text-white/20 mt-3 font-light leading-relaxed max-w-md">
              {tc.verdictDetail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Stat Pill sub-component ── */
function StatPill({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-500"
      style={{ borderColor: `${color}20`, backgroundColor: `${color}06` }}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-white/25">
        {label}
      </span>
      <span className="text-[12px] font-bold text-slate-700 dark:text-white/70">
        {value}
      </span>
    </div>
  );
}
