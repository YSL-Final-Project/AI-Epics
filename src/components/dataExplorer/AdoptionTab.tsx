import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import adoptionData from '../../data/ai_adoption.json';
import type { AIAdoptionData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = adoptionData as AIAdoptionData;

/* ── Brand colors for products ── */
const BRAND = {
  chatgpt: '#10a37f',
  copilot: '#6366f1',
  cursor:  '#3b82f6',
  claude:  '#d4a853',
};

/* ── Use-case theme colors ── */
const CASE_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];

/* ── Frequency bar colors — each row gets its own hue ── */
const FREQ_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];

/* ── Subtle section divider ── */
function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300/30 dark:via-white/[0.06] to-transparent" />
    </div>
  );
}

/* ── Animated counter hook ── */
function useCountUp(target: number, duration = 2000, enabled = true) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    const from = ref.current;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = from + (target - from) * eased;
      setVal(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);
  return val;
}

/* ── Custom tooltip ── */
function MinimalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1.5 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="tabular-nums">{p.value}M</span>
        </p>
      ))}
    </div>
  );
}

export default function AdoptionTab() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';
  const isDark = theme === 'dark';
  const a = t.dataExplorer.adoption;

  // Latest data point for hero numbers
  const latest = data.userGrowth[data.userGrowth.length - 1];
  const totalUsers = latest ? (latest.chatgpt + latest.copilot + latest.cursor + latest.claudeCode) : 0;

  // Animated hero counter
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeroVisible(true); }, { threshold: 0.3 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);
  const animatedTotal = useCountUp(totalUsers, 2000, heroVisible);

  // i18n lookup helpers
  const freqLabel = (key: string) => (a.frequencies as Record<string, string>)[key] ?? key;
  const caseLabel = (key: string) => (a.cases as Record<string, string>)[key] ?? key;

  return (
    <div className="space-y-16">
      {/* ═══ Hero Stats — count-up + gradient ═══ */}
      <div className="text-center py-8" ref={heroRef}>
        <LineReveal className="mb-2">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            {a.totalUsers}
          </span>
        </LineReveal>
        <LineReveal delay={0.1}>
          <span
            className="text-[clamp(3.5rem,10vw,6rem)] font-black tracking-tight tabular-nums leading-none bg-clip-text text-transparent"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #fff 30%, #06b6d4 100%)'
                : 'linear-gradient(135deg, #0f172a 30%, #0891b2 100%)',
            }}
          >
            {animatedTotal.toFixed(1)}M
          </span>
        </LineReveal>
        <LineReveal delay={0.2} className="mt-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
            {a.platforms}
          </span>
        </LineReveal>
      </div>

      {/* ═══ Area Chart: User Growth — brand colors ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">01</span>
              {a.growth}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          {[
            { name: 'ChatGPT', color: BRAND.chatgpt },
            { name: 'Copilot', color: BRAND.copilot },
            { name: 'Cursor', color: BRAND.cursor },
            { name: 'Claude', color: BRAND.claude },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-[10px] text-slate-400 dark:text-white/25 tracking-wide">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.userGrowth}>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<MinimalTooltip />} />
              <Area type="monotone" dataKey="chatgpt" stackId="1" stroke={BRAND.chatgpt} fill={BRAND.chatgpt} fillOpacity={0.2} strokeWidth={1.5} name="ChatGPT" />
              <Area type="monotone" dataKey="copilot" stackId="1" stroke={BRAND.copilot} fill={BRAND.copilot} fillOpacity={0.15} strokeWidth={1.5} name="Copilot" />
              <Area type="monotone" dataKey="cursor" stackId="1" stroke={BRAND.cursor} fill={BRAND.cursor} fillOpacity={0.15} strokeWidth={1.5} name="Cursor" />
              <Area type="monotone" dataKey="claudeCode" stackId="1" stroke={BRAND.claude} fill={BRAND.claude} fillOpacity={0.12} strokeWidth={1.5} name="Claude" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <SectionDivider />

      {/* ═══ Usage Frequency — colorful bars ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">02</span>
              {a.frequency}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
          {data.usageFrequency.map((item, i) => (
            <motion.div
              key={item.frequency}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-600 dark:text-white/40 font-medium">{freqLabel(item.frequency)}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white/80 tabular-nums">{item.percentage}%</span>
              </div>
              <div className="h-1.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: FREQ_COLORS[i % FREQ_COLORS.length], opacity: isDark ? 0.55 : 0.65 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.percentage / 30) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <SectionDivider />

      {/* ═══ Use Cases — colored donut + color-coded list ═══ */}
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
              {a.useCases}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10">
          {/* SVG Donut — colored arcs */}
          <div className="relative w-44 h-44 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {(() => {
                const total = data.useCases.reduce((a, b) => a + b.value, 0);
                const r = 38;
                const circumference = 2 * Math.PI * r;
                let offset = 0;
                return data.useCases.map((item, i) => {
                  const pct = item.value / total;
                  const dash = pct * circumference;
                  const gap = circumference - dash;
                  const currentOffset = offset;
                  offset += dash;
                  const color = CASE_COLORS[i] || '#64748b';
                  return (
                    <circle
                      key={item.name}
                      cx="50" cy="50" r={r}
                      fill="none"
                      stroke={color}
                      strokeOpacity={isDark ? 0.6 : 0.7}
                      strokeWidth="8"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-currentOffset}
                      strokeLinecap="round"
                    />
                  );
                });
              })()}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[9px] text-slate-400/50 dark:text-white/20 tracking-wider uppercase">{a.casesLabel}</span>
            </div>
          </div>

          {/* List — with color dots */}
          <div className="flex-1 space-y-3">
            {data.useCases.map((item, i) => {
              const total = data.useCases.reduce((a, b) => a + b.value, 0);
              const pct = Math.round((item.value / total) * 100);
              const color = CASE_COLORS[i] || '#64748b';
              return (
                <motion.div
                  key={item.name}
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600 dark:text-white/40 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    {caseLabel(item.name)}
                  </span>
                  <span className="text-sm font-bold tabular-nums" style={{ color }}>{pct}%</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Insight Callout */}
      <InsightCallout
        text={a.insightText}
        accent="cyan"
      />

      <SectionDivider />

      {/* ═══ Before / After — emotional contrast ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">04</span>
              {a.beforeAfter}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2021 Card — muted, cold */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.01)' : 'rgba(100,116,139,0.04)',
              borderColor: isDark ? 'rgba(244,63,94,0.12)' : 'rgba(100,116,139,0.15)',
            }}
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5"
              style={{ color: isDark ? 'rgba(244,63,94,0.4)' : 'rgba(100,116,139,0.5)' }}
            >
              {a.workflow2021}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(a.steps2021 as string[]).map((step: string, i: number) => (
                <motion.div
                  key={step}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(100,116,139,0.06)',
                      borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(100,116,139,0.12)',
                      color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(100,116,139,0.7)',
                    }}
                  >
                    {step}
                  </span>
                  {i < (a.steps2021 as string[]).length - 1 && (
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(100,116,139,0.25)' }} className="text-xs">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 2025 Card — vibrant, warm glow */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: isDark ? 'rgba(6,182,212,0.03)' : 'rgba(6,182,212,0.03)',
              borderColor: isDark ? 'rgba(6,182,212,0.2)' : 'rgba(6,182,212,0.25)',
              boxShadow: isDark ? '0 0 30px rgba(6,182,212,0.06)' : '0 0 30px rgba(6,182,212,0.05)',
            }}
          >
            <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5"
              style={{ color: isDark ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.7)' }}
            >
              {a.workflow2025}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(a.steps2025 as string[]).map((step: string, i: number) => (
                <motion.div
                  key={step}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.08)',
                      borderColor: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.2)',
                      color: isDark ? 'rgba(6,182,212,0.7)' : 'rgba(6,182,212,0.85)',
                    }}
                  >
                    {step}
                  </span>
                  {i < (a.steps2025 as string[]).length - 1 && (
                    <span style={{ color: isDark ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.4)' }} className="text-xs">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
