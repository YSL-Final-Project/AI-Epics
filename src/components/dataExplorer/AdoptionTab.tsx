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
import NextChapterCard from './NextChapterCard';
import ChapterDots from '../ChapterDots';
import WorkflowCompareSlider from './WorkflowCompareSlider';

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
  const { t, lang } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';
  const isDark = theme === 'dark';
  const a = t.dataExplorer.adoption;

  const latest = data.userGrowth[data.userGrowth.length - 1];
  const totalUsers = latest ? (latest.chatgpt + latest.copilot + latest.cursor + latest.claudeCode) : 0;
  const useCaseTotal = data.useCases.reduce((sum, item) => sum + item.value, 0);
  const latestSentiment = data.sentimentTrend[data.sentimentTrend.length - 1];
  const dailyUsage = data.usageFrequency[0]?.percentage ?? 0;
  const topCase = [...data.useCases].sort((p, q) => q.value - p.value)[0];
  const topCasePct = topCase ? Math.round((topCase.value / useCaseTotal) * 100) : 0;

  const heroCopy = lang === 'zh'
    ? '2025 年，AI 编程工具已不再是尝鲜品，而是每天都在用的生产工具。四大平台合计用户超过千万级别，使用场景横跨生成、调试、解释、审查。'
    : 'By 2025, AI coding tools are no longer experimental — they are daily production tools. Four platforms now account for over 17 million monthly users across generation, debugging, explanation and review.';

  const chapters = [
    { id: 'adoption-growth', label: a.chapterDots.growth },
    { id: 'adoption-frequency', label: a.chapterDots.frequency },
    { id: 'adoption-cases', label: a.chapterDots.useCases },
    { id: 'adoption-sentiment', label: a.chapterDots.sentiment },
    { id: 'adoption-frustrations', label: a.chapterDots.frustrations },
    { id: 'adoption-beforeafter', label: a.chapterDots.beforeAfter },
  ];

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
      <ChapterDots chapters={chapters} accentColor="#06b6d4" />

      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-[2rem] border p-8 md:p-12"
        style={{
          background: isDark
            ? 'linear-gradient(140deg, rgba(6,182,212,0.14) 0%, rgba(8,145,178,0.05) 40%, rgba(15,23,42,0) 100%)'
            : 'linear-gradient(140deg, rgba(6,182,212,0.10) 0%, rgba(6,182,212,0.03) 45%, rgba(255,255,255,0.6) 100%)',
          borderColor: isDark ? 'rgba(6,182,212,0.16)' : 'rgba(6,182,212,0.10)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <LineReveal className="mb-3">
              <span className="font-mono text-[10px] tracking-[0.45em] text-slate-400/55 dark:text-white/18 uppercase">
                {a.totalUsers}
              </span>
            </LineReveal>
            <LineReveal delay={0.08}>
              <div
                className="text-[clamp(4rem,12vw,7rem)] font-black tracking-tight leading-none tabular-nums bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #ffffff 8%, #22d3ee 55%, #0891b2 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #0e7490 100%)',
                }}
              >
                {animatedTotal.toFixed(1)}M
              </div>
            </LineReveal>
            <LineReveal delay={0.14} className="mt-3">
              <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/50 dark:text-white/20 uppercase">
                {a.platforms}
              </span>
            </LineReveal>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-white/40">
              {heroCopy}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: lang === 'zh' ? '每日多次' : 'Daily Active',
                value: `${dailyUsage}%`,
                sub: lang === 'zh' ? '活跃开发者' : 'of developers',
              },
              {
                label: lang === 'zh' ? '采用率' : 'Adoption',
                value: `${latestSentiment?.adoption ?? 0}%`,
                sub: lang === 'zh' ? '正式或试用' : 'using or trialing',
              },
              {
                label: lang === 'zh' ? '主要场景' : 'Top Use Case',
                value: `${topCasePct}%`,
                sub: topCase ? (a.cases as Record<string, string>)[topCase.name] ?? topCase.name : '',
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.14 + index * 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border px-5 py-5"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.72)',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-slate-400 dark:text-white/22 mb-3">
                  {item.label}
                </div>
                <div className="text-3xl font-black tabular-nums text-slate-900 dark:text-white/85">
                  {item.value}
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-white/28 leading-5">
                  {item.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        id="adoption-growth"
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
        id="adoption-frequency"
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
        id="adoption-cases"
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

      <SectionDivider />

      <motion.div
        id="adoption-sentiment"
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
        id="adoption-frustrations"
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

      <InsightCallout text={a.insightText} accent="cyan" />

      <motion.div
        id="adoption-beforeafter"
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

        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <WorkflowCompareSlider
            label2021={a.workflow2021}
            label2025={a.workflow2025}
            steps2021={a.steps2021 as string[]}
            steps2025={a.steps2025 as string[]}
            dragHint={a.dragHint}
            isDark={isDark}
          />
        </motion.div>
      </motion.div>

      <NextChapterCard current="adoption" />
    </div>
  );
}

