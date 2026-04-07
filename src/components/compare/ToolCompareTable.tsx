import { useState, useEffect, useRef } from 'react';
import toolsData from '../../data/ai_tools_compare.json';
import type { AIToolInfo } from '../../types';
import { useI18n } from '../../i18n';

const tools = toolsData as AIToolInfo[];

/* ── color palette ── */
const TOOL_COLORS: Record<string, string> = {
  'GitHub Copilot': '#5a7ec2',
  Cursor: '#a855f7',
  'Claude Code': '#c4a24d',
  Windsurf: '#4db0ba',
  'Cody (Sourcegraph)': '#5f8f64',
};


/* ── ring ── */
const RING_R = 80;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_R;
const ANIM_DURATION = 700;

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }

export default function ToolCompareTable() {
  const { t } = useI18n();
  const tc = t.compare.toolTable;

  const [tabIdx, setTabIdx] = useState(0);
  const [ringProgress, setRingProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  /* play-once ring animation on tab change */
  useEffect(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setRingProgress(0);
    let start: number | null = null;
    function animate(ts: number) {
      if (start === null) start = ts;
      const raw = Math.min((ts - start) / ANIM_DURATION, 1);
      setRingProgress(easeOutCubic(raw));
      if (raw < 1) rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [tabIdx]);

  const activeTool = tools[tabIdx];
  const activeColor = TOOL_COLORS[activeTool.name] || '#888';

  return (
    <div className="relative py-20 px-4">
      <div className="w-full max-w-4xl mx-auto">

        {/* ── Intro ── */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className="text-xs font-mono tracking-[0.5em] text-slate-400/50 dark:text-white/20 uppercase mb-6">
            {tc.badge}
          </p>
          <h3 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {tc.title}
          </h3>
          <p className="mt-6 text-sm text-slate-400 dark:text-white/30 font-light">
            {tc.subtitle}
          </p>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex justify-center mb-10">
          <div className="flex flex-wrap justify-center gap-1 p-1 rounded-xl bg-slate-100/80 dark:bg-white/[0.04] border border-slate-200/60 dark:border-white/[0.06]">
            {tools.map((tool, idx) => {
              const isActive = tabIdx === idx;
              const color = TOOL_COLORS[tool.name] || '#888';
              return (
                <button
                  key={tool.name}
                  onClick={() => setTabIdx(idx)}
                  className="relative px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={{
                    color: isActive ? color : undefined,
                    background: isActive ? `${color}22` : undefined,
                  }}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg" style={{ boxShadow: `0 0 0 1px ${color}55` }} />
                  )}
                  <span className={`relative z-10 ${isActive ? '' : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/50'}`}>
                    {tool.name.replace(' (Sourcegraph)', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Tool Spotlight ── */}
        <div className="flex flex-col items-center relative">
          {/* Watermark */}
          <span
            className="absolute text-[70px] sm:text-[120px] font-black leading-none tracking-tighter select-none pointer-events-none transition-all duration-500"
            style={{ color: activeColor, opacity: 0.06 }}
          >
            {activeTool.name.replace(' (Sourcegraph)', '')}
          </span>

          {/* Glow */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full pointer-events-none transition-all duration-700"
            style={{ background: `radial-gradient(circle, ${activeColor}12 0%, transparent 70%)` }}
          />

          {/* Ring */}
          <div className="relative z-10 flex flex-col items-center">
            <svg width="200" height="200" viewBox="0 0 200 200" className="sm:w-[260px] sm:h-[260px]">
              <circle cx="100" cy="100" r={RING_R} fill="none"
                className="stroke-slate-200/20 dark:stroke-white/[0.06]" strokeWidth={6} />
              <circle
                cx="100" cy="100" r={RING_R} fill="none"
                stroke={activeColor} strokeWidth={6} strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE * (1 - (activeTool.accuracy / 100) * ringProgress)}
                transform="rotate(-90 100 100)"
                style={{ opacity: 0.85 }}
              />
              <text x="100" y="92" textAnchor="middle"
                className="fill-slate-900 dark:fill-white"
                style={{ fontSize: '36px', fontWeight: 900, opacity: ringProgress > 0.3 ? 1 : 0, transition: 'opacity 0.3s' }}>
                {Math.round(activeTool.accuracy * ringProgress)}%
              </text>
              <text x="100" y="115" textAnchor="middle"
                className="fill-slate-400 dark:fill-white/30"
                style={{ fontSize: '11px', opacity: ringProgress > 0.5 ? 1 : 0, transition: 'opacity 0.3s' }}>
                {tc.accuracyLabel}
              </text>
            </svg>

            {/* Tool name */}
            <div className="mt-4 text-center transition-all duration-500">
              <h4 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: activeColor }}>
                {activeTool.name}
              </h4>
              <p className="text-sm text-slate-500 dark:text-white/35 mt-1 font-light max-w-xs">
                {tc.toolHighlights[activeTool.name] || ''}
              </p>
            </div>

            {/* Stat pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <StatPill label={tc.languagesLabel} value={`${activeTool.languages}`} color={activeColor} progress={ringProgress} />
              <StatPill label={tc.contextLabel} value={tc.toolContext[activeTool.name] || ''} color={activeColor} progress={ringProgress} />
              <StatPill label={tc.pricingLabel} value={tc.toolPricing[activeTool.name] || ''} color={activeColor} progress={ringProgress} />
            </div>

            {/* IDE badges */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {(tc.toolIDE[activeTool.name] || '').split(' · ').map(ide => (
                <span key={ide}
                  className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all duration-500"
                  style={{
                    borderColor: `${activeColor}30`, color: activeColor,
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
                <div key={i}
                  className="w-2 h-2 rounded-full transition-all duration-300 cursor-pointer"
                  onClick={() => setTabIdx(i)}
                  style={{
                    backgroundColor: i === tabIdx ? TOOL_COLORS[tools[i].name] : 'transparent',
                    border: `1.5px solid ${i === tabIdx ? TOOL_COLORS[tools[i].name] : 'rgba(255,255,255,0.15)'}`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Outro ── */}
        <div className="flex flex-col items-center text-center mt-20">
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
  );
}

function StatPill({ label, value, color, progress }: { label: string; value: string; color: string; progress: number }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-500"
      style={{ borderColor: `${color}20`, backgroundColor: `${color}06`, opacity: progress > 0.4 ? 1 : 0 }}
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-white/25">{label}</span>
      <span className="text-[12px] font-bold text-slate-700 dark:text-white/70">{value}</span>
    </div>
  );
}
