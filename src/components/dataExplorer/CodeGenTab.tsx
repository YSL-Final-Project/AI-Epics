import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import codeGenData from '../../data/code_generation.json';
import type { CodeGenData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = codeGenData as CodeGenData;

const INDUSTRY_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];
const LANG_COLORS = ['#f59e0b', '#3b82f6', '#06b6d4', '#f43f5e', '#64748b', '#d4a853'];

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300/30 dark:via-white/[0.06] to-transparent" />
    </div>
  );
}

function MinimalTooltip({ active, payload, label, suffix = '' }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white tabular-nums">{p.value}{suffix}</p>
      ))}
    </div>
  );
}

export default function CodeGenTab() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const isDark = theme === 'dark';
  const c = t.dataExplorer.codegen;
  const funnelLabel = (key: string) => (c.funnelSteps as Record<string, string>)[key] ?? key;
  const industryLabel = (key: string) => (c.industries as Record<string, string>)[key] ?? key;

  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimated(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const r = 56;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated ? data.overallPercentage / 100 : 0) * circumference;

  return (
    <div className="space-y-16" ref={ref}>
      {/* Hero — Giant ring + number */}
      <div className="flex flex-col items-center py-8">
        <LineReveal className="mb-6">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            {c.aiCodeOnGithub}
          </span>
        </LineReveal>

        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor"
              className="text-slate-200/50 dark:text-white/[0.04]" strokeWidth="3" />
            <circle cx="64" cy="64" r={r} fill="none"
              stroke={isDark ? '#8b5cf6' : '#7c3aed'}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.32, 0.72, 0, 1)' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-black tabular-nums leading-none bg-clip-text text-transparent"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(135deg, #fff 30%, #8b5cf6 100%)'
                  : 'linear-gradient(135deg, #0f172a 30%, #7c3aed 100%)',
              }}
            >
              {animated ? data.overallPercentage : 0}%
            </span>
            <span className="font-mono text-[8px] text-slate-400/40 dark:text-white/10 tracking-wider uppercase mt-1">
              {c.ofNewCode}
            </span>
          </div>
        </div>
      </div>

      {/* Industry Comparison — colored bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">01</span>
              {c.byIndustry}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="space-y-5">
          {data.industryComparison.map((item, i) => (
            <motion.div
              key={item.industry}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-white/30">{industryLabel(item.industry)}</span>
                <span className="text-xl font-black tabular-nums" style={{ color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length] }}>
                  {item.percentage}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length], opacity: isDark ? 0.5 : 0.6 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.percentage / 60) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <SectionDivider />

      {/* Acceptance Rate Line */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">02</span>
              {c.acceptanceRate}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.acceptanceRate}>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} domain={[15, 50]} />
              <Tooltip content={<MinimalTooltip suffix="%" />} />
              <Line type="monotone" dataKey="rate" stroke={isDark ? '#8b5cf6' : '#7c3aed'} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: isDark ? '#8b5cf6' : '#7c3aed' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Insight Callout */}
      <InsightCallout text={c.insightText} accent="violet" />

      {/* Acceptance Funnel — colored bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">03</span>
              {c.acceptanceFunnel}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="space-y-4">
          {[
            { label: 'Suggestions Generated', pct: 100 },
            { label: 'Developer Reviewed', pct: 72 },
            { label: 'Accepted', pct: 46 },
            { label: 'Shipped to Production', pct: 38 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-white/30">{funnelLabel(item.label)}</span>
                <span className="text-xl font-black tabular-nums" style={{ color: FUNNEL_COLORS[i] }}>
                  {item.pct}%
                </span>
              </div>
              <div className="h-2 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: FUNNEL_COLORS[i], opacity: isDark ? 0.45 : 0.55 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <SectionDivider />

      {/* ═══ Productivity Impact — stat cards ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border-l-2"
        style={{
          backgroundColor: isDark ? 'rgba(16,185,129,0.06)' : 'rgba(16,185,129,0.03)',
          borderLeftColor: '#10b981',
        }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: '#10b981' }} className="font-mono text-xs mr-2">04</span>
            {c.productivity}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { value: `${data.productivityImpact.taskSpeedup}%`, label: c.taskSpeedup, color: '#10b981' },
            { value: `${data.productivityImpact.feltProductive}%`, label: c.feltProductive, color: '#06b6d4' },
            { value: `${data.productivityImpact.stayInFlow}%`, label: c.stayInFlow, color: '#8b5cf6' },
            { value: `${data.productivityImpact.preserveMentalEffort}%`, label: c.preserveMentalEffort, color: '#f59e0b' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="text-center rounded-xl p-4 bg-white/50 dark:bg-black/20"
            >
              <div className="text-2xl font-black tabular-nums mb-2" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-white/25 leading-tight">{stat.label}</div>
            </motion.div>
          ))}
        </div>
        <p className="font-mono text-[9px] text-slate-400/30 dark:text-white/8 mt-4 text-center">{c.productivitySource}</p>
      </motion.div>

      <SectionDivider />

      {/* By Language — colored bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">05</span>
              {c.byLanguage}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="space-y-5">
          {[
            { lang: 'JavaScript', pct: 55 },
            { lang: 'Python', pct: 51 },
            { lang: 'TypeScript', pct: 48 },
            { lang: 'Java', pct: 35 },
            { lang: 'C++', pct: 22 },
            { lang: 'Rust', pct: 18 },
          ].map((item, i) => (
            <motion.div
              key={item.lang}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-white/30 font-mono">{item.lang}</span>
                <span className="text-xl font-black tabular-nums" style={{ color: LANG_COLORS[i] }}>
                  {item.pct}%
                </span>
              </div>
              <div className="h-1.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: LANG_COLORS[i], opacity: isDark ? 0.5 : 0.6 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.pct / 60) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
