import { motion, useReducedMotion } from 'framer-motion';
import {  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import salaryData from '../../data/developer_salary.json';
import type { DeveloperSalaryData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import { useRef, useState } from 'react';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';
import NextChapterCard from './NextChapterCard';
import ChapterDots from '../ChapterDots';

const data = salaryData as DeveloperSalaryData;

const ROLE_LABELS = ['Junior Dev', 'Mid-level Dev', 'Senior Dev', 'Architect', 'Tech Lead'];
const SKILL_COLORS = ['#fb7185', '#8b5cf6', '#06b6d4', '#f59e0b'];

function MinimalTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/90 px-4 py-3 shadow-2xl backdrop-blur-xl dark:bg-white/10">
      {label !== undefined && label !== null && (
        <p className="mb-1 font-mono text-[10px] tracking-wider text-white/40">{label}</p>
      )}
      {payload.map((entry: any, index: number) => (
        <p key={index} className="flex items-center gap-2 text-sm font-bold text-white tabular-nums">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export default function SalaryTab() {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const prefersReduced = useReducedMotion();
  const isDark = theme === 'dark';
  const axisColor = isDark ? 'rgba(255,255,255,0.32)' : 'rgba(15,23,42,0.45)';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)';
  const sal = t.dataExplorer.salary;

  const avgWithAI = data.salaryComparison.reduce((sum, item) => sum + item.withAI, 0) / data.salaryComparison.length;
  const avgWithoutAI = data.salaryComparison.reduce((sum, item) => sum + item.withoutAI, 0) / data.salaryComparison.length;
  const premium = Math.round(((avgWithAI - avgWithoutAI) / avgWithoutAI) * 100);
  const peakJobs = Math.max(...data.jobTrends.map((item) => item.positions));
  const latestJobs = data.jobTrends[data.jobTrends.length - 1]?.positions ?? 0;
  const jobsDecline = Math.round(((peakJobs - latestJobs) / peakJobs) * 100);
  const latestPremium = data.premiumTrend[data.premiumTrend.length - 1]?.premium ?? 0;

  const emerald = isDark ? '#34d399' : '#059669';
  const amber = '#f59e0b';
  const cyan = isDark ? '#22d3ee' : '#0891b2';
  const slateFill = isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1';

  const chapters = [
    { id: 'salary-comparison', label: sal.chapterDots.comparison },
    { id: 'salary-jobs', label: sal.chapterDots.jobs },
    { id: 'salary-premium', label: sal.chapterDots.premium },
    { id: 'salary-correlation', label: sal.chapterDots.correlation },
    { id: 'salary-tier', label: sal.chapterDots.tier },
    { id: 'salary-skills', label: sal.chapterDots.skills },
  ];

  const comparisonRows = data.salaryComparison.map((item, index) => {
    const gap = item.withAI - item.withoutAI;
    const gapPercent = Math.round((gap / item.withoutAI) * 100);
    return {
      ...item,
      label: ROLE_LABELS[index] ?? `Level ${index + 1}`,
      gap,
      gapPercent,
    };
  });

  const ladderStages = [
    data.proficiencyVsSalary[0],
    data.proficiencyVsSalary[3],
    data.proficiencyVsSalary[6],
    data.proficiencyVsSalary[data.proficiencyVsSalary.length - 1],
  ];

  // Cursor crosshair for §1 Comparison — hover a point, see the $ threshold,
  // and how many roles reach it with vs without AI.
  const maxSalary = Math.max(...comparisonRows.map((item) => item.withAI));
  const crosshairRef = useRef<HTMLDivElement>(null);
  const [crosshair, setCrosshair] = useState<{ x: number; pct: number; visible: boolean }>({
    x: 0,
    pct: 0,
    visible: false,
  });
  const onCrosshairMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!crosshairRef.current) return;
    const rect = crosshairRef.current.getBoundingClientRect();
    const paddingX = 16; // card internal p-4 padding, matches inner bar area
    const inner = rect.width - paddingX * 2;
    const x = e.clientX - rect.left;
    const insideX = Math.min(Math.max(x - paddingX, 0), inner);
    const pct = inner > 0 ? insideX / inner : 0;
    setCrosshair({ x, pct, visible: true });
  };
  const hideCrosshair = () => setCrosshair((c) => ({ ...c, visible: false }));
  const thresholdDollars = Math.round(crosshair.pct * maxSalary);
  const reachedWithoutAI = comparisonRows.filter((r) => r.withoutAI >= thresholdDollars).length;
  const reachedWithAI = comparisonRows.filter((r) => r.withAI >= thresholdDollars).length;

  return (
    <div className="space-y-8">
      <ChapterDots chapters={chapters} accentColor="#10b981" />

      <div className="rounded-[2rem] border px-6 py-8 sm:px-8" style={{
        background: isDark
          ? 'linear-gradient(145deg, rgba(5,150,105,0.16), rgba(15,23,42,0.75) 55%, rgba(245,158,11,0.10))'
          : 'linear-gradient(145deg, rgba(16,185,129,0.09), rgba(255,255,255,0.96) 55%, rgba(245,158,11,0.10))',
        borderColor: isDark ? 'rgba(52,211,153,0.18)' : 'rgba(5,150,105,0.12)',
      }}>
        <LineReveal className="mb-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.42em] text-slate-500/70 dark:text-white/20">
            {sal.aiSkillPremium}
          </span>
        </LineReveal>
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <LineReveal delay={0.06}>
              <h2
                className="text-[clamp(3.2rem,10vw,5.8rem)] font-black leading-none tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #ffffff 8%, #34d399 55%, #f59e0b 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #059669 60%, #d97706 100%)',
                }}
              >
                +{premium}%
              </h2>
            </LineReveal>
            <LineReveal delay={0.1} className="mt-5">
              <p className="text-lg md:text-xl font-semibold leading-snug text-slate-800 dark:text-white/82 max-w-2xl">
                {sal.heroTension}
              </p>
            </LineReveal>
            <LineReveal delay={0.16} className="mt-3 max-w-2xl">
              <p className="text-sm leading-6 text-slate-500 dark:text-white/45">
                {sal.higherSalary}
              </p>
            </LineReveal>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border p-4" style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
            }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/28">{sal.jobs}</div>
              <div className="mt-3 text-3xl font-black tabular-nums" style={{ color: amber }}>-{jobsDecline}%</div>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/40">from peak hiring</p>
            </div>
            <div className="rounded-2xl border p-4" style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.72)',
              borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)',
            }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-slate-500 dark:text-white/28">{sal.premiumGrowth}</div>
              <div className="mt-3 text-3xl font-black tabular-nums" style={{ color: emerald }}>+{latestPremium}%</div>
              <p className="mt-1 text-xs text-slate-500 dark:text-white/40">latest measured premium</p>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        id="salary-comparison"
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-[1.75rem] border p-6"
        style={{
          backgroundColor: isDark ? 'rgba(15,23,42,0.66)' : 'rgba(255,255,255,0.88)',
          borderColor: isDark ? 'rgba(52,211,153,0.14)' : 'rgba(5,150,105,0.10)',
        }}
      >
        <div className="mb-6 flex items-baseline gap-3">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
            <span className="mr-2 font-mono text-xs" style={{ color: emerald }}>01</span>
            {sal.comparison}
          </h3>
          <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
        </div>

        <div
          ref={crosshairRef}
          className="relative"
          onPointerMove={onCrosshairMove}
          onPointerLeave={hideCrosshair}
        >
          {crosshair.visible && (
            <>
              <div
                className="pointer-events-none absolute top-[54px] bottom-2 w-px"
                style={{
                  left: crosshair.x,
                  backgroundImage: `linear-gradient(to bottom, ${emerald}88, ${emerald}22)`,
                  boxShadow: `0 0 10px ${emerald}55`,
                }}
              />
              <div
                className="pointer-events-none absolute -top-1 z-10 flex -translate-x-1/2 flex-col items-center gap-1"
                style={{ left: crosshair.x }}
              >
                <div
                  className="rounded-full px-3 py-1 font-mono text-[10px] font-bold tabular-nums tracking-[0.12em]"
                  style={{
                    backgroundColor: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(15,23,42,0.92)',
                    color: emerald,
                    boxShadow: `0 6px 18px -4px rgba(0,0,0,0.4), 0 0 0 1px ${emerald}55`,
                  }}
                >
                  ${thresholdDollars.toLocaleString()}
                </div>
                <div className="rounded-full border border-white/10 bg-black/80 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-white/60">
                  <span className="text-white/40">{lang === 'zh' ? '无AI' : 'No AI'}</span>
                  <span className="ml-1 text-white tabular-nums">{reachedWithoutAI}</span>
                  <span className="mx-1 text-white/25">·</span>
                  <span className="text-white/40">{lang === 'zh' ? '有AI' : 'AI'}</span>
                  <span className="ml-1 tabular-nums" style={{ color: emerald }}>{reachedWithAI}</span>
                </div>
              </div>
            </>
          )}
        <div className="space-y-4">
          {comparisonRows.map((row, index) => {
            const withoutWidth = (row.withoutAI / maxSalary) * 100;
            const withWidth = (row.withAI / maxSalary) * 100;
            return (
              <motion.div
                key={row.label}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.92)',
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white/84">{row.label}</div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-slate-500 dark:text-white/24">salary repricing</div>
                  </div>
                  <div className="rounded-full px-3 py-1 font-mono text-[10px] font-bold" style={{
                    backgroundColor: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.10)',
                    color: emerald,
                  }}>
                    +{row.gapPercent}%
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-white/42">
                      <span>{sal.withoutAI}</span>
                      <span className="font-mono tabular-nums">${row.withoutAI.toLocaleString()}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200/70 dark:bg-white/8">
                      <div className="h-3 rounded-full" style={{ width: `${withoutWidth}%`, backgroundColor: slateFill }} />
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-white/42">
                      <span>{sal.withAI}</span>
                      <span className="font-mono tabular-nums">${row.withAI.toLocaleString()}</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-200/70 dark:bg-white/8">
                      <div className="h-3 rounded-full" style={{ width: `${withWidth}%`, backgroundColor: emerald }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          id="salary-jobs"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-[1.75rem] border p-6"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.62)' : 'rgba(255,255,255,0.88)',
            borderColor: isDark ? 'rgba(245,158,11,0.16)' : 'rgba(245,158,11,0.14)',
          }}
        >
          <div className="mb-5 flex items-baseline gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
              <span className="mr-2 font-mono text-xs" style={{ color: amber }}>02</span>
              {sal.jobs}
            </h3>
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
            <span className="font-mono text-xs tabular-nums" style={{ color: amber }}>${(latestJobs / 1000).toFixed(0)}k</span>
          </div>
          <div className="mb-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl p-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.9)' }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/24">peak</div>
              <div className="mt-2 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{(peakJobs / 1000).toFixed(0)}k</div>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.9)' }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/24">2025</div>
              <div className="mt-2 text-2xl font-black tabular-nums text-slate-900 dark:text-white">{(latestJobs / 1000).toFixed(0)}k</div>
            </div>
            <div className="rounded-2xl p-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.9)' }}>
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/24">drop</div>
              <div className="mt-2 text-2xl font-black tabular-nums" style={{ color: amber }}>-{jobsDecline}%</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white/60 p-3 dark:bg-black/20">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.jobTrends}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={42} tickFormatter={(value: number) => `${Math.round(value / 1000)}k`} />
                <Tooltip content={<MinimalTooltip formatter={(value: number) => value.toLocaleString()} />} />
                <Line type="monotone" dataKey="positions" stroke={amber} strokeWidth={3} dot={{ r: 3, fill: amber }} name="Positions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          id="salary-premium"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-[1.75rem] border p-6"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.62)' : 'rgba(255,255,255,0.88)',
            borderColor: isDark ? 'rgba(52,211,153,0.16)' : 'rgba(5,150,105,0.12)',
          }}
        >
          <div className="mb-5 flex items-baseline gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
              <span className="mr-2 font-mono text-xs" style={{ color: emerald }}>03</span>
              {sal.premiumGrowth}
            </h3>
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
            <span className="font-mono text-xs tabular-nums" style={{ color: emerald }}>+{latestPremium}%</span>
          </div>
          <div className="space-y-4">
            {data.premiumTrend.map((point, index) => {
              const previous = index === 0 ? 0 : data.premiumTrend[index - 1].premium;
              const delta = point.premium - previous;
              return (
                <motion.div
                  key={point.year}
                  initial={prefersReduced ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08, ease: [0.32, 0.72, 0, 1] }}
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.9)',
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/24">{point.year}</div>
                      <div className="mt-2 text-3xl font-black tabular-nums" style={{ color: emerald }}>+{point.premium}%</div>
                    </div>
                    <div className="rounded-full px-3 py-1 font-mono text-[10px] font-bold" style={{
                      backgroundColor: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.10)',
                      color: emerald,
                    }}>
                      {index === 0 ? 'baseline' : `+${delta} pts`}
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-slate-200/70 dark:bg-white/8">
                    <div className="h-2 rounded-full" style={{ width: `${Math.min(point.premium, 100)}%`, backgroundColor: emerald }} />
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className="mt-4 text-center font-mono text-[9px] text-slate-400 dark:text-white/18">{sal.premiumSource}</p>
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          id="salary-correlation"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-[1.75rem] border p-6"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.66)' : 'rgba(255,255,255,0.88)',
            borderColor: isDark ? 'rgba(34,211,238,0.16)' : 'rgba(8,145,178,0.12)',
          }}
        >
          <div className="mb-5 flex items-baseline gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
              <span className="mr-2 font-mono text-xs" style={{ color: cyan }}>04</span>
              {sal.correlation}
            </h3>
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
          </div>
          <div className="rounded-2xl bg-white/60 p-3 dark:bg-black/20">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.proficiencyVsSalary}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis type="number" dataKey="proficiency" domain={[0, 100]} tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(value: number) => `${value}%`} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={44} tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`} />
                <Tooltip content={<MinimalTooltip formatter={(value: number) => `$${value.toLocaleString()}`} />} />
                <Line type="monotone" dataKey="salary" stroke={cyan} strokeWidth={3} dot={{ r: 3, fill: cyan }} name="Salary" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {ladderStages.map((stage, index) => (
              <div
                key={`${stage.proficiency}-${stage.salary}`}
                className="rounded-2xl border p-4"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(248,250,252,0.9)',
                  borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500 dark:text-white/24">stage {index + 1}</div>
                <div className="mt-2 text-2xl font-black tabular-nums text-slate-950 dark:text-white">${Math.round(stage.salary / 1000)}k</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-white/40">{stage.proficiency}% proficiency</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          id="salary-tier"
          initial={prefersReduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-[1.75rem] border p-6"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.66)' : 'rgba(255,255,255,0.88)',
            borderColor: isDark ? 'rgba(100,116,139,0.18)' : 'rgba(100,116,139,0.12)',
          }}
        >
          <div className="mb-6 flex items-baseline gap-3">
            <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
              <span className="mr-2 font-mono text-xs text-slate-500">05</span>
              {sal.tierProgression}
            </h3>
            <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
          </div>
          <div className="space-y-4">
            {(sal.tiers as { label: string; salary: string; premium: string }[]).map((tier, index) => {
              const color = ['#64748b', '#f59e0b', '#06b6d4', '#10b981'][index];
              return (
                <motion.div
                  key={`${tier.label}-${tier.salary}`}
                  initial={prefersReduced ? false : { opacity: 0, x: 18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
                  className="rounded-2xl border p-4"
                  style={{
                    backgroundColor: isDark ? `${color}12` : `${color}08`,
                    borderColor: isDark ? `${color}33` : `${color}26`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color }}>{sal.tier} {index + 1}</div>
                      <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-white/84">{tier.label}</div>
                    </div>
                    {tier.premium && (
                      <div className="rounded-full px-3 py-1 font-mono text-[10px] font-bold" style={{
                        backgroundColor: isDark ? `${color}26` : `${color}18`,
                        color,
                      }}>
                        {tier.premium}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-3xl font-black tabular-nums" style={{ color }}>{tier.salary}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <InsightCallout text={sal.insightText} accent="amber" />

      <motion.div
        id="salary-skills"
        initial={prefersReduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="mb-6 flex items-baseline gap-3">
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white/88">
            <span className="mr-2 font-mono text-xs" style={{ color: emerald }}>06</span>
            {sal.hotSkills}
          </h3>
          <div className="h-px flex-1 bg-slate-200/60 dark:bg-white/[0.05]" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.hotSkills.map((skill, index) => {
            const color = SKILL_COLORS[index % SKILL_COLORS.length];
            const skillName = (sal.skillNames as Record<string, string>)[skill.skill] ?? skill.skill;
            return (
              <motion.div
                key={skill.skill}
                initial={prefersReduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-[1.5rem] border p-5"
                style={{
                  backgroundColor: isDark ? `${color}10` : `${color}08`,
                  borderColor: isDark ? `${color}30` : `${color}22`,
                }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.28em]" style={{ color }}>signal {index + 1}</div>
                <div className="mt-3 text-base font-bold text-slate-900 dark:text-white/88">{skillName}</div>
                <div className="mt-5 space-y-3">
                  {skill.demandGrowth !== undefined && (
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-white/40">{sal.demandGrowth}</div>
                      <div className="text-2xl font-black tabular-nums" style={{ color }}>+{skill.demandGrowth}%</div>
                    </div>
                  )}
                  {skill.avgSalary !== undefined && (
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-white/40">{sal.avgSalaryLabel}</div>
                      <div className="text-2xl font-black tabular-nums" style={{ color }}>${Math.round(skill.avgSalary / 1000)}K</div>
                    </div>
                  )}
                  {skill.premiumRange && (
                    <div>
                      <div className="text-[11px] text-slate-500 dark:text-white/40">{sal.premiumRangeLabel}</div>
                      <div className="text-2xl font-black tabular-nums" style={{ color }}>{skill.premiumRange}</div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <NextChapterCard current="salary" />
    </div>
  );
}
