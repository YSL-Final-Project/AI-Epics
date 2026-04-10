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

const INDUSTRY_COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#3b82f6', '#f43f5e', '#64748b'];
const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981'];
const QUALITY_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981'];

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

function RateTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{formatMonthLabel(label)}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white tabular-nums">{p.value}%</p>
      ))}
    </div>
  );
}

export default function CodeGenTab() {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const isDark = theme === 'dark';
  const c = t.dataExplorer.codegen;
  const funnelLabel = (key: string) => (c.funnelSteps as Record<string, string>)[key] ?? key;
  const industryLabel = (key: string) => (c.industries as Record<string, string>)[key] ?? key;
  const qualityLabel = (key: string) => (c.qualityMetrics as Record<string, string>)[key] ?? key;

  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const sortedIndustries = [...data.industryComparison].sort((a, b) => b.percentage - a.percentage);
  const topIndustry = sortedIndustries[0];
  const bottomIndustry = sortedIndustries[sortedIndustries.length - 1];
  const latestAcceptance = data.acceptanceRate[data.acceptanceRate.length - 1]?.rate ?? 0;
  const firstAcceptance = data.acceptanceRate[0]?.rate ?? 0;
  const shippedRate = 38;

  const qualityMap = Object.fromEntries(data.codeQuality.map((item) => [item.metric, item]));
  const issueMultiplier = qualityMap['AI vs Human issues']?.value ?? 0;
  const churnMultiplier = qualityMap['Code churn since 2021']?.value ?? 0;
  const refactoring2024 = qualityMap['Refactoring share 2024']?.value ?? 0;
  const refactoring2021 = qualityMap['Refactoring share 2021']?.value ?? 0;

  const r = 56;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (animated ? data.overallPercentage / 100 : 0) * circumference;

  const spreadCopy = lang === 'zh'
    ? 'AI 代码生成已经从新奇功能变成常态能力，但它最先吞掉的是最模板化、最容易预测的开发环节。'
    : 'AI code generation is no longer a novelty feature. It is a baseline capability, and it is spreading first through the most templatable work.';
  const acceptanceCopy = lang === 'zh'
    ? '真正决定价值的不是生成量，而是从建议、审阅、采纳到上线之间到底流失了多少。'
    : 'The real value is not how much gets generated. It is how much survives review, acceptance, and production.';
  const qualityCopy = lang === 'zh'
    ? '速度收益是真实的，但质量税同样真实。生成越多，返工、缺陷和维护压力也越高。'
    : 'The productivity dividend is real, but so is the quality tax. More generation also means more churn, more defects, and more maintenance pressure.';

  return (
    <div className="space-y-16" ref={ref}>
      <div className="rounded-[2rem] border p-8 md:p-10"
        style={{
          background: isDark
            ? 'linear-gradient(140deg, rgba(139,92,246,0.14) 0%, rgba(79,70,229,0.05) 45%, rgba(15,23,42,0) 100%)'
            : 'linear-gradient(140deg, rgba(124,58,237,0.10) 0%, rgba(124,58,237,0.03) 45%, rgba(255,255,255,0.72) 100%)',
          borderColor: isDark ? 'rgba(139,92,246,0.14)' : 'rgba(124,58,237,0.10)',
        }}
      >
        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="flex flex-col items-center xl:items-start">
            <LineReveal className="mb-6">
              <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
                {c.aiCodeOnGithub}
              </span>
            </LineReveal>

            <div className="relative w-44 h-44 mb-6">
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

            <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-white/40 text-center xl:text-left">
              {spreadCopy}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: lang === 'zh' ? '扩张最快' : 'Fastest Spread',
                value: `${topIndustry.percentage}%`,
                sub: industryLabel(topIndustry.industry),
              },
              {
                label: lang === 'zh' ? '当前采纳率' : 'Accepted',
                value: `${latestAcceptance}%`,
                sub: funnelLabel('Accepted'),
              },
              {
                label: lang === 'zh' ? '真正上线' : 'Shipped',
                value: `${shippedRate}%`,
                sub: funnelLabel('Shipped to Production'),
              },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 + index * 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border px-5 py-5"
                style={{
                  backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.74)',
                  borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-slate-400 dark:text-white/22 mb-3">
                  {item.label}
                </div>
                <div className="text-3xl font-black tabular-nums text-slate-900 dark:text-white/85">
                  {item.value}
                </div>
                <div className="mt-2 text-sm text-slate-500 dark:text-white/28 leading-5">
                  {item.sub}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

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

        <div className="grid grid-cols-1 xl:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
          <div className="rounded-[2rem] border p-6"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
          >
            <div className="space-y-5">
              {sortedIndustries.map((item, i) => (
                <motion.div
                  key={item.industry}
                  initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="flex items-baseline justify-between mb-2 gap-3">
                    <span className="text-sm text-slate-600 dark:text-white/38">{industryLabel(item.industry)}</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length] }}>
                      {item.percentage}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length], opacity: isDark ? 0.56 : 0.68 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.percentage / 60) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.18 + i * 0.08, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {[
              {
                kicker: lang === 'zh' ? '最先沦陷' : 'First To Fall',
                title: industryLabel(topIndustry.industry),
                body: lang === 'zh'
                  ? '越是界面密集、模式稳定、模板丰富的工作，越容易被生成模型快速吃掉。'
                  : 'The more visual, repeatable, and template-rich the work is, the easier it is for generation models to take over quickly.',
                value: `${topIndustry.percentage}%`,
              },
              {
                kicker: lang === 'zh' ? '最难攻克' : 'Hardest To Automate',
                title: industryLabel(bottomIndustry.industry),
                body: lang === 'zh'
                  ? '硬件、约束和上下文复杂度越高，AI 代码生成的渗透速度就越慢。'
                  : 'The more hardware constraints and contextual complexity involved, the slower AI code generation spreads.',
                value: `${bottomIndustry.percentage}%`,
              },
            ].map((card, index) => (
              <div key={card.kicker} className="rounded-3xl border px-5 py-5"
                style={{ backgroundColor: index === 0 ? (isDark ? 'rgba(139,92,246,0.08)' : 'rgba(124,58,237,0.05)') : isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: index === 0 ? (isDark ? 'rgba(139,92,246,0.18)' : 'rgba(124,58,237,0.12)') : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
              >
                <div className="font-mono text-[10px] tracking-[0.26em] uppercase text-slate-400 dark:text-white/22 mb-2">{card.kicker}</div>
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <div className="text-base font-semibold text-slate-800 dark:text-white/82">{card.title}</div>
                  <div className="text-2xl font-black tabular-nums text-violet-600 dark:text-violet-300">{card.value}</div>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/38">{card.body}</p>
              </div>
            ))}
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
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">02</span>
              {c.acceptanceFunnel}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-white/40">{acceptanceCopy}</p>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 items-start">
          <div className="rounded-[2rem] border p-6"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
          >
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
                  <div className="flex items-baseline justify-between mb-2 gap-3">
                    <span className="text-sm text-slate-600 dark:text-white/38">{funnelLabel(item.label)}</span>
                    <span className="text-xl font-black tabular-nums" style={{ color: FUNNEL_COLORS[i] }}>
                      {item.pct}%
                    </span>
                  </div>
                  <div className="h-2.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: FUNNEL_COLORS[i], opacity: isDark ? 0.52 : 0.62 }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.85, ease: [0.32, 0.72, 0, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border p-5"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
            >
              <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-2">
                {lang === 'zh' ? '接受率趋势' : 'Acceptance Trend'}
              </div>
              <div className="text-3xl font-black tabular-nums text-violet-600 dark:text-violet-300 mb-2">
                +{latestAcceptance - firstAcceptance}%
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-white/38">
                {lang === 'zh'
                  ? '团队正在更愿意接受 AI 建议，但“愿意接受”并不等于“可以放心上线”。'
                  : 'Teams are growing more willing to accept AI suggestions, but acceptance is still not the same as trustable production output.'}
              </p>
            </div>

            <div className="rounded-3xl border p-4"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
            >
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data.acceptanceRate}>
                  <XAxis dataKey="month" tickFormatter={formatMonthLabel} tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
                  <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} domain={[15, 50]} />
                  <Tooltip content={<RateTooltip />} />
                  <Line type="monotone" dataKey="rate" stroke={isDark ? '#8b5cf6' : '#7c3aed'} strokeWidth={2.4} dot={false} activeDot={{ r: 4, fill: isDark ? '#8b5cf6' : '#7c3aed' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>

      <InsightCallout text={c.insightText} accent="violet" />

      <SectionDivider />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-[2rem] border p-6 md:p-7"
        style={{
          backgroundColor: isDark ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)',
          borderColor: isDark ? 'rgba(16,185,129,0.14)' : 'rgba(16,185,129,0.10)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: '#10b981' }} className="font-mono text-xs mr-2">03</span>
            {c.productivity}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { value: `${Math.round(data.productivityImpact.taskSpeedup)}%`, label: c.taskSpeedup, color: '#10b981' },
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
              className="rounded-2xl border p-4"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
            >
              <div className="text-3xl font-black tabular-nums mb-2" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] leading-tight text-slate-500 dark:text-white/28">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-white/38 mb-4">
          {lang === 'zh'
            ? '收益很明确：更快完成任务、更容易进入心流、更少消耗在重复劳动上。'
            : 'The upside is obvious: faster task completion, stronger flow, and less mental energy burned on repetitive work.'}
        </p>
        <p className="font-mono text-[9px] text-slate-400/30 dark:text-white/10">{c.productivitySource}</p>
      </motion.div>

      <SectionDivider />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span className="text-slate-400 dark:text-white/20 font-mono text-xs mr-2">04</span>
              {c.codeQuality}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-white/40">{qualityCopy}</p>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'AI vs Human issues', value: `${issueMultiplier}x`, label: qualityLabel('AI vs Human issues'), color: QUALITY_COLORS[0] },
              { key: 'Code churn since 2021', value: `${churnMultiplier}x`, label: qualityLabel('Code churn since 2021'), color: QUALITY_COLORS[1] },
              { key: 'Refactoring share 2024', value: `${refactoring2024}%`, label: qualityLabel('Refactoring share 2024'), color: QUALITY_COLORS[2] },
              { key: 'Refactoring share 2021', value: `${refactoring2021}%`, label: qualityLabel('Refactoring share 2021'), color: QUALITY_COLORS[3] },
            ].map((item, index) => (
              <motion.div
                key={item.key}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-3xl border px-5 py-5"
                style={{ backgroundColor: isDark ? `${item.color}10` : `${item.color}08`, borderColor: isDark ? `${item.color}20` : `${item.color}16` }}
              >
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-3">
                  Metric
                </div>
                <div className="text-3xl font-black tabular-nums mb-2" style={{ color: item.color }}>{item.value}</div>
                <div className="text-sm leading-6 text-slate-600 dark:text-white/38">{item.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-[2rem] border p-6"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}
          >
            <div className="space-y-5">
              {[
                {
                  kicker: lang === 'zh' ? '缺陷率' : 'Defects',
                  text: lang === 'zh'
                    ? 'AI 代码的缺陷率仍高于人类代码，这意味着生成速度并没有消除后续修复成本。'
                    : 'AI-generated code still carries a higher issue rate, which means generation speed does not erase downstream repair cost.',
                },
                {
                  kicker: lang === 'zh' ? '返工' : 'Churn',
                  text: lang === 'zh'
                    ? '代码 churn 翻倍说明很多内容并没有一次写对，而是在上线前反复调整。'
                    : 'A doubling in churn suggests a lot of generated output is not right the first time and gets revised repeatedly before production.',
                },
                {
                  kicker: lang === 'zh' ? '重构减少' : 'Refactoring Loss',
                  text: lang === 'zh'
                    ? '重构占比从 25% 掉到 10%，意味着团队把更多精力花在修补，而不是改善设计。'
                    : 'Refactoring share falling from 25% to 10% suggests teams are spending more time patching than improving design quality.',
                },
              ].map((item) => (
                <div key={item.kicker} className="rounded-3xl border px-5 py-5" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.012)' : 'rgba(248,250,252,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-2">{item.kicker}</div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-white/38">{item.text}</p>
                </div>
              ))}
            </div>
            <p className="font-mono text-[9px] text-slate-400/30 dark:text-white/10 mt-5">{c.codeQualitySource}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
