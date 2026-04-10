import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import adoptionData from '../../data/ai_adoption.json';
import type { AIAdoptionData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = adoptionData as AIAdoptionData;

const BRAND = {
  chatgpt: '#10a37f',
  copilot: '#6366f1',
  cursor: '#3b82f6',
  claude: '#d4a853',
};

const CASE_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#3b82f6'];
const FREQ_COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e'];
const SENTIMENT_COLORS = {
  adoption: '#06b6d4',
  trust: '#f59e0b',
  favorable: '#8b5cf6',
};

function SectionDivider() {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-slate-300/30 dark:via-white/[0.06] to-transparent" />
    </div>
  );
}

function formatMonthLabel(value: string) {
  const [year, month] = value.split('-');
  return `${year.slice(2)}.${month}`;
}

function useCountUp(target: number, duration = 2000, enabled = true) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);

  useEffect(() => {
    if (!enabled) return;
    const start = performance.now();
    const from = ref.current;
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      setVal(current);
      ref.current = current;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, enabled]);

  return val;
}

function GrowthTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1.5 tracking-wider">{formatMonthLabel(label)}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="tabular-nums">{p.value}M</span>
        </p>
      ))}
    </div>
  );
}

function SentimentTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1.5 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="tabular-nums">{p.value}%</span>
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

  const latest = data.userGrowth[data.userGrowth.length - 1];
  const totalUsers = latest ? (latest.chatgpt + latest.copilot + latest.cursor + latest.claudeCode) : 0;
  const useCaseTotal = data.useCases.reduce((sum, item) => sum + item.value, 0);
  const latestSentiment = data.sentimentTrend[data.sentimentTrend.length - 1];

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setHeroVisible(true);
    }, { threshold: 0.3 });

    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const animatedTotal = useCountUp(totalUsers, 2000, heroVisible);

  const freqLabel = (key: string) => (a.frequencies as Record<string, string>)[key] ?? key;
  const caseLabel = (key: string) => (a.cases as Record<string, string>)[key] ?? key;
  const frustrationLabel = (key: string) => (a.frustrationLabels as Record<string, string>)[key] ?? key;

  return (
    <div className="space-y-16">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { name: 'ChatGPT', value: latest?.chatgpt ?? 0, color: BRAND.chatgpt },
            { name: 'Copilot', value: latest?.copilot ?? 0, color: BRAND.copilot },
            { name: 'Cursor', value: latest?.cursor ?? 0, color: BRAND.cursor },
            { name: 'Claude', value: latest?.claudeCode ?? 0, color: BRAND.claude },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-2xl px-4 py-3 border"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.7)',
                borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-400 dark:text-white/30">
                  {item.name}
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white/85 tabular-nums">
                {item.value.toFixed(item.value < 0.1 ? 2 : 1)}M
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-6 mb-4 flex-wrap">
          {[
            { name: 'ChatGPT', color: BRAND.chatgpt },
            { name: 'Copilot', color: BRAND.copilot },
            { name: 'Cursor', color: BRAND.cursor },
            { name: 'Claude', color: BRAND.claude },
          ].map((item) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-[10px] text-slate-400 dark:text-white/25 tracking-wide">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.userGrowth}>
              <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<GrowthTooltip />} />
              <Area type="monotone" dataKey="chatgpt" stackId="1" stroke={BRAND.chatgpt} fill={BRAND.chatgpt} fillOpacity={0.2} strokeWidth={1.5} name="ChatGPT" />
              <Area type="monotone" dataKey="copilot" stackId="1" stroke={BRAND.copilot} fill={BRAND.copilot} fillOpacity={0.15} strokeWidth={1.5} name="Copilot" />
              <Area type="monotone" dataKey="cursor" stackId="1" stroke={BRAND.cursor} fill={BRAND.cursor} fillOpacity={0.15} strokeWidth={1.5} name="Cursor" />
              <Area type="monotone" dataKey="claudeCode" stackId="1" stroke={BRAND.claude} fill={BRAND.claude} fillOpacity={0.12} strokeWidth={1.5} name="Claude" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <SectionDivider />

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
              className="rounded-2xl border px-4 py-4"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.78)',
                borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
              }}
            >
              <div className="flex items-baseline justify-between mb-3 gap-3">
                <span className="text-sm text-slate-600 dark:text-white/40 font-medium">{freqLabel(item.frequency)}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white/80 tabular-nums">{item.percentage}%</span>
              </div>
              <div className="h-2 bg-slate-200/60 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: FREQ_COLORS[i % FREQ_COLORS.length], opacity: isDark ? 0.72 : 0.82 }}
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

        <div className="space-y-4">
          {data.useCases.map((item, i) => {
            const pct = Math.round((item.value / useCaseTotal) * 100);
            const color = CASE_COLORS[i] || '#64748b';
            return (
              <motion.div
                key={item.name}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border p-4"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.8)',
                  borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white/80">
                      {caseLabel(item.name)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-slate-400 dark:text-white/22">
                      {a.casesLabel}
                    </span>
                    <span className="text-2xl font-black tabular-nums" style={{ color }}>{pct}%</span>
                  </div>
                </div>

                <div className="relative h-3 rounded-full overflow-hidden bg-slate-200/60 dark:bg-white/[0.03]">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                    }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pct}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.18 + i * 0.07, duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <InsightCallout text={a.insightText} accent="cyan" />

      <SectionDivider />

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
              {a.sentiment}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.45fr] gap-6 items-stretch">
          <div
            className="rounded-3xl border p-5 flex flex-col justify-between"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.82)',
              borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
            }}
          >
            <div className="space-y-4">
              {[
                { label: a.adoptionLabel, value: latestSentiment?.adoption ?? 0, color: SENTIMENT_COLORS.adoption },
                { label: a.trustLabel, value: latestSentiment?.trust ?? 0, color: SENTIMENT_COLORS.trust },
                { label: a.favorableLabel, value: latestSentiment?.favorable ?? 0, color: SENTIMENT_COLORS.favorable },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2 gap-3">
                    <span className="text-sm text-slate-600 dark:text-white/45">{item.label}</span>
                    <span className="text-2xl font-black tabular-nums" style={{ color: item.color }}>{item.value}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-200/60 dark:bg-white/[0.03]">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] uppercase text-slate-400 dark:text-white/20">
              {a.sentimentSource}
            </p>
          </div>

          <div
            className="rounded-3xl border p-4"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.82)',
              borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
            }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data.sentimentTrend}>
                <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
                <Tooltip content={<SentimentTooltip />} />
                <Line type="monotone" dataKey="adoption" stroke={SENTIMENT_COLORS.adoption} strokeWidth={3} dot={{ r: 4 }} name={a.adoptionLabel} />
                <Line type="monotone" dataKey="trust" stroke={SENTIMENT_COLORS.trust} strokeWidth={3} dot={{ r: 4 }} name={a.trustLabel} />
                <Line type="monotone" dataKey="favorable" stroke={SENTIMENT_COLORS.favorable} strokeWidth={3} dot={{ r: 4 }} name={a.favorableLabel} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      <SectionDivider />

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
              {a.frustrations}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.topFrustrations.map((item, i) => {
            const color = CASE_COLORS[(i + 1) % CASE_COLORS.length];
            return (
              <motion.div
                key={item.issue}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border px-5 py-5"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.82)',
                  borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <span className="text-sm sm:text-base font-semibold leading-6 text-slate-800 dark:text-white/78">
                    {frustrationLabel(item.issue)}
                  </span>
                  <span className="text-3xl font-black tabular-nums shrink-0" style={{ color }}>
                    {item.percentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-slate-200/60 dark:bg-white/[0.03]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.percentage}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.18 + i * 0.08, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <SectionDivider />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">06</span>
              {a.beforeAfter}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5"
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
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(100,116,139,0.06)',
                      borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(100,116,139,0.12)',
                      color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(100,116,139,0.7)',
                    }}
                  >
                    {step}
                  </span>
                  {i < (a.steps2021 as string[]).length - 1 && (
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(100,116,139,0.25)' }} className="text-xs">{'->'}</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

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
            <div
              className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5"
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
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: isDark ? 'rgba(6,182,212,0.08)' : 'rgba(6,182,212,0.08)',
                      borderColor: isDark ? 'rgba(6,182,212,0.15)' : 'rgba(6,182,212,0.2)',
                      color: isDark ? 'rgba(6,182,212,0.7)' : 'rgba(6,182,212,0.85)',
                    }}
                  >
                    {step}
                  </span>
                  {i < (a.steps2025 as string[]).length - 1 && (
                    <span style={{ color: isDark ? 'rgba(6,182,212,0.25)' : 'rgba(6,182,212,0.4)' }} className="text-xs">{'->'}</span>
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

