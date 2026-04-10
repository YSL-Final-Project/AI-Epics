import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import trafficData from '../../data/stackoverflow_traffic.json';
import surveyData from '../../data/stackoverflow_survey.json';
import type { SOTrafficPoint, SOSurveyData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const traffic = trafficData as SOTrafficPoint[];
const survey = surveyData as SOSurveyData;

const LANG_COLORS = ['#f59e0b', '#3b82f6', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#6366f1'];
const DEST_ITEMS = [
  { name: 'ChatGPT', pct: 35, icon: 'GPT', color: '#10a37f' },
  { name: 'GitHub Copilot Chat', pct: 22, icon: 'GH', color: '#6366f1' },
  { name: 'Cursor / AI IDE', pct: 15, icon: 'IDE', color: '#3b82f6' },
  { name: 'Phind', pct: 10, icon: 'PH', color: '#8b5cf6' },
  { name: 'Perplexity', pct: 8, icon: 'PX', color: '#06b6d4' },
  { name: 'Documentation sites', pct: 6, icon: 'DOC', color: '#f59e0b' },
  { name: 'Other', pct: 4, icon: 'ETC', color: '#94a3b8' },
];

function useCountUp(target: number, duration = 1800, enabled = true) {
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

function formatMonth(value: string) {
  const [year, month] = value.split('-');
  return `${year.slice(2)}.${month}`;
}

function TrafficTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{formatMonth(label)}</p>
      <p className="text-sm font-bold text-white tabular-nums">{payload[0].value}M</p>
    </div>
  );
}

function QuestionsTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{label}</p>
      <p className="text-sm font-bold text-white tabular-nums">{(payload[0].value / 1000000).toFixed(1)}M</p>
    </div>
  );
}

export default function StackOverflowTab() {
  const { theme } = useTheme();
  const { t, lang } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const isDark = theme === 'dark';
  const s = t.dataExplorer.stackoverflow;
  const destLabel = (key: string) => (s.trafficDests as Record<string, string>)[key] ?? key;

  const peakPoint = traffic.reduce((best, point) => (point.visits > best.visits ? point : best), traffic[0]);
  const currentPoint = traffic[traffic.length - 1];
  const launchPoint = traffic.find((point) => point.month === '2022-12') ?? traffic[traffic.length - 1];
  const postLaunchDecline = Math.round(((launchPoint.visits - currentPoint.visits) / launchPoint.visits) * 100);
  const decline = Math.round(((peakPoint.visits - currentPoint.visits) / peakPoint.visits) * 100);

  const questionsFirst = survey.annualQuestions[0];
  const questionsLast = survey.annualQuestions[survey.annualQuestions.length - 1];
  const questionsDecline = Math.round(((questionsFirst.questions - questionsLast.questions) / questionsFirst.questions) * 100);

  const languageStats = survey.languageActivity.map((entry, index) => {
    const peak = Math.max(...entry.years.map((item) => item.activity));
    const current = entry.years[entry.years.length - 1].activity;
    const drop = Math.round(((peak - current) / peak) * 100);
    return {
      ...entry,
      color: LANG_COLORS[index],
      peak,
      current,
      drop,
    };
  });

  const hardestHit = languageStats.reduce((worst, item) => (item.drop > worst.drop ? item : worst), languageStats[0]);
  const avgLanguageDrop = Math.round(languageStats.reduce((sum, item) => sum + item.drop, 0) / languageStats.length);

  const ROSE = isDark ? '#fb7185' : '#e11d48';
  const ROSE_SOFT = isDark ? 'rgba(251,113,133,0.18)' : 'rgba(225,29,72,0.10)';
  const INDIGO = isDark ? '#818cf8' : '#6366f1';

  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setHeroVisible(true);
    }, { threshold: 0.3 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const animatedDecline = useCountUp(decline, 2000, heroVisible);

  const collapseCopy = lang === 'zh'
    ? '不是缓慢下滑，而是在 ChatGPT 出现后迅速失去默认入口地位。'
    : 'This was not a slow decline. Stack Overflow lost its default-entry status almost immediately after ChatGPT.';
  const hollowingCopy = lang === 'zh'
    ? '流量减少只是表面，提问量和语言社区活跃度也在被持续抽空。'
    : 'Traffic was only the surface symptom. Questions and language communities hollowed out too.';
  const responseCopy = lang === 'zh'
    ? '平台并非没有反应，但回应发生在迁移已经形成之后。'
    : 'The platform did respond, but the response arrived after user behavior had already shifted.';

  return (
    <div className="space-y-10">
      <div
        ref={heroRef}
        className="relative overflow-hidden rounded-[2rem] border p-8 md:p-12"
        style={{
          background: isDark
            ? 'linear-gradient(140deg, rgba(251,113,133,0.14) 0%, rgba(225,29,72,0.06) 40%, rgba(15,23,42,0.0) 100%)'
            : 'linear-gradient(140deg, rgba(225,29,72,0.10) 0%, rgba(225,29,72,0.03) 45%, rgba(255,255,255,0.6) 100%)',
          borderColor: isDark ? 'rgba(251,113,133,0.16)' : 'rgba(225,29,72,0.10)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <LineReveal className="mb-3">
              <span className="font-mono text-[10px] tracking-[0.45em] text-slate-400/55 dark:text-white/18 uppercase">
                {s.trafficDecline}
              </span>
            </LineReveal>
            <LineReveal delay={0.08}>
              <div
                className="text-[clamp(4rem,12vw,7rem)] font-black tracking-tight leading-none tabular-nums bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #ffffff 8%, #fb7185 45%, #e11d48 100%)'
                    : 'linear-gradient(135deg, #0f172a 0%, #be123c 100%)',
                }}
              >
                -{Math.round(animatedDecline)}%
              </div>
            </LineReveal>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-white/40">
              {collapseCopy}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: lang === 'zh' ? '历史峰值' : 'Peak',
                value: `${peakPoint.visits}M`,
                sub: formatMonth(peakPoint.month),
              },
              {
                label: lang === 'zh' ? '发布后降幅' : 'Post-Launch Drop',
                value: `-${postLaunchDecline}%`,
                sub: '2022.12 -> 2025.03',
              },
              {
                label: lang === 'zh' ? '当前月访问' : 'Current',
                value: `${currentPoint.visits}M`,
                sub: formatMonth(currentPoint.month),
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
                <div className="text-3xl font-black tabular-nums" style={{ color: index === 1 ? ROSE : undefined }}>
                  {item.value}
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-white/28 font-mono">
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
        className="rounded-[2rem] border p-6 md:p-7"
        style={{
          backgroundColor: isDark ? 'rgba(251,113,133,0.05)' : 'rgba(225,29,72,0.03)',
          borderColor: isDark ? 'rgba(251,113,133,0.10)' : 'rgba(225,29,72,0.08)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">01</span>
            {s.traffic}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          <span className="font-mono text-xs tabular-nums" style={{ color: ROSE }}>
            {peakPoint.visits}M {'->'} {currentPoint.visits}M
          </span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.65fr] gap-6 items-start">
          <div className="rounded-3xl border p-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={traffic}>
                <defs>
                  <linearGradient id="so-collapse" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={ROSE} stopOpacity={isDark ? 0.38 : 0.25} />
                    <stop offset="100%" stopColor={ROSE} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={34} tickFormatter={(v: number) => `${v}M`} />
                <Tooltip content={<TrafficTooltip />} />
                <ReferenceLine
                  x="2022-12"
                  stroke={ROSE}
                  strokeOpacity={0.45}
                  strokeDasharray="4 4"
                  label={{ value: 'ChatGPT', fill: ROSE, fontSize: 10, fontWeight: 700, position: 'top' }}
                />
                <ReferenceLine
                  x="2023-03"
                  stroke={INDIGO}
                  strokeOpacity={0.32}
                  strokeDasharray="4 4"
                  label={{ value: 'GPT-4', fill: INDIGO, fontSize: 10, fontWeight: 700, position: 'top' }}
                />
                <Area type="monotone" dataKey="visits" stroke={ROSE} strokeWidth={2.5} fill="url(#so-collapse)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {[
              {
                kicker: lang === 'zh' ? '峰值' : 'Peak',
                title: lang === 'zh' ? '2022 年春天达到历史最高' : 'Reached its all-time high in spring 2022',
                body: lang === 'zh' ? '这不是一个原本就在衰退的平台，它是在最强势时突然失速。' : 'This was not a platform already fading out. It lost momentum while still at its strongest.',
              },
              {
                kicker: lang === 'zh' ? '拐点' : 'Breakpoint',
                title: lang === 'zh' ? 'ChatGPT 发布后曲线开始断裂' : 'The curve breaks immediately after ChatGPT launches',
                body: lang === 'zh' ? '从默认问答社区到可替代入口，用户迁移几乎没有缓冲期。' : 'The transition from default Q&A hub to replaceable source happened with almost no buffer period.',
              },
              {
                kicker: lang === 'zh' ? '现状' : 'Now',
                title: lang === 'zh' ? '访问量已跌回峰值的一半以下' : 'Monthly traffic now sits below half of the peak',
                body: lang === 'zh' ? '这不是一次回调，而是开发者习惯的重新分配。' : 'This is not a correction. It is a redistribution of developer attention.',
              },
            ].map((item, index) => (
              <div
                key={item.kicker}
                className="rounded-3xl border px-5 py-5"
                style={{
                  backgroundColor: index === 1 ? ROSE_SOFT : isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)',
                  borderColor: index === 1 ? (isDark ? 'rgba(251,113,133,0.16)' : 'rgba(225,29,72,0.12)') : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)',
                }}
              >
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase mb-2" style={{ color: index === 1 ? ROSE : undefined }}>
                  {item.kicker}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-white/82 leading-6 mb-2">
                  {item.title}
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/38">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">02</span>
            {lang === 'zh' ? 'The Hollowing Out' : 'The Hollowing Out'}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-white/40">
          {hollowingCopy}
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
          <div className="rounded-[2rem] border p-6" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <div className="flex items-baseline gap-3 mb-5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white/80 tracking-tight">{s.questions}</h4>
              <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
              <span className="font-mono text-xs font-bold tabular-nums" style={{ color: ROSE }}>-{questionsDecline}%</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: lang === 'zh' ? '2018' : '2018', value: `${(questionsFirst.questions / 1000000).toFixed(1)}M` },
                { label: lang === 'zh' ? '2024' : '2024', value: `${(questionsLast.questions / 1000000).toFixed(1)}M` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border px-4 py-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(248,250,252,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-2">{item.label}</div>
                  <div className="text-3xl font-black tabular-nums">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-white/40 dark:bg-black/20 p-3">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={survey.annualQuestions}>
                  <defs>
                    {survey.annualQuestions.map((_entry, index) => {
                      const palette = ['#f59e0b', '#f97316', '#fb7185', '#e11d48', '#be123c', '#9f1239', '#64748b'];
                      const color = palette[index] || palette[palette.length - 1];
                      return (
                        <linearGradient key={index} id={`so-q-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.82 : 0.72} />
                          <stop offset="100%" stopColor={color} stopOpacity={isDark ? 0.35 : 0.22} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={34} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
                  <Tooltip content={<QuestionsTooltip />} />
                  <Bar dataKey="questions" radius={[6, 6, 0, 0]}>
                    {survey.annualQuestions.map((_entry, index) => (
                      <Cell key={index} fill={`url(#so-q-${index})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[2rem] border p-6" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <div className="flex items-baseline gap-3 mb-5">
              <h4 className="text-base font-bold text-slate-900 dark:text-white/80 tracking-tight">{s.activity}</h4>
              <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
              <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-white/22">avg {avgLanguageDrop}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(248,250,252,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-2">{lang === 'zh' ? '跌幅最大' : 'Hardest Hit'}</div>
                <div className="text-xl font-black" style={{ color: hardestHit.color }}>{hardestHit.language}</div>
                <div className="mt-1 text-sm font-mono tabular-nums text-slate-500 dark:text-white/30">-{hardestHit.drop}%</div>
              </div>
              <div className="rounded-2xl border px-4 py-4" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(248,250,252,0.9)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
                <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22 mb-2">{lang === 'zh' ? '仍最稳定' : 'Most Resilient'}</div>
                <div className="text-xl font-black" style={{ color: languageStats[5].color }}>{languageStats[5].language}</div>
                <div className="mt-1 text-sm font-mono tabular-nums text-slate-500 dark:text-white/30">-{languageStats[5].drop}%</div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {languageStats.map((entry, index) => (
                <motion.div
                  key={entry.language}
                  initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                  className="rounded-2xl border p-4"
                  style={{ backgroundColor: isDark ? `${entry.color}08` : `${entry.color}06`, borderColor: isDark ? `${entry.color}18` : `${entry.color}12` }}
                >
                  <div className="flex items-baseline justify-between mb-1 gap-2">
                    <span className="text-xs font-bold" style={{ color: isDark ? `${entry.color}cc` : entry.color }}>{entry.language}</span>
                    <span className="font-mono text-[10px] font-bold tabular-nums" style={{ color: ROSE }}>-{entry.drop}%</span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-400/50 dark:text-white/15 mb-2">{entry.peak} {'->'} {entry.current}</div>
                  <ResponsiveContainer width="100%" height={64}>
                    <AreaChart data={entry.years} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
                      <defs>
                        <linearGradient id={`so-lang-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={entry.color} stopOpacity={isDark ? 0.45 : 0.32} />
                          <stop offset="100%" stopColor={entry.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <YAxis hide domain={[0, 100]} />
                      <Area type="monotone" dataKey="activity" stroke={entry.color} strokeWidth={2} fill={`url(#so-lang-${index})`} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-[2rem] border p-6 md:p-7"
        style={{
          backgroundColor: isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.03)',
          borderColor: isDark ? 'rgba(99,102,241,0.14)' : 'rgba(99,102,241,0.10)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: INDIGO }} className="font-mono text-xs mr-2">03</span>
            {s.overflowAI}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 dark:text-white/40">
          {responseCopy}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
          <div className="rounded-3xl border p-5" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `${INDIGO}99` }} />
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22">Launch</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white/82">{s.overflowAIAnnounced}</div>
                </div>
              </div>
              <div className="ml-[5px] h-12 w-px bg-indigo-500/20" />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: INDIGO }} />
                <div>
                  <div className="font-mono text-[10px] tracking-[0.24em] uppercase text-slate-400 dark:text-white/22">GA</div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white/82">{s.overflowAIGA}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border p-5" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.76)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/40 mb-5">{s.overflowAIDesc}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: lang === 'zh' ? '宣布时月访问' : 'Traffic At Launch', value: `${launchPoint.visits}M` },
                { label: lang === 'zh' ? '当前月访问' : 'Traffic Now', value: `${currentPoint.visits}M` },
                { label: lang === 'zh' ? '之后继续下滑' : 'Further Decline', value: `-${postLaunchDecline}%` },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border px-4 py-4" style={{ backgroundColor: isDark ? 'rgba(99,102,241,0.06)' : 'rgba(99,102,241,0.04)', borderColor: isDark ? 'rgba(99,102,241,0.14)' : 'rgba(99,102,241,0.10)' }}>
                  <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-400 dark:text-white/22 mb-2">{item.label}</div>
                  <div className="text-2xl font-black tabular-nums" style={{ color: INDIGO }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <InsightCallout text={s.insightText} accent="rose" />

      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">04</span>
            {s.whereDidTrafficGo}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-6 items-start">
          <div className="rounded-[2rem] border p-6" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
            <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-slate-400 dark:text-white/22 mb-5">
              {lang === 'zh' ? '迁移目的地' : 'Destinations'}
            </div>
            <div className="space-y-4">
              {DEST_ITEMS.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-sm text-slate-600 dark:text-white/38 flex items-center gap-3">
                      <span className="w-9 h-9 rounded-full border flex items-center justify-center font-mono text-[11px] font-bold" style={{ color: item.color, borderColor: `${item.color}40`, backgroundColor: `${item.color}12` }}>
                        {item.icon}
                      </span>
                      {destLabel(item.name)}
                    </span>
                    <span className="text-lg font-black tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-slate-200/60 dark:bg-white/[0.03]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: item.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(item.pct / 40) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.16 + index * 0.07, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {DEST_ITEMS.slice(0, 3).map((item, index) => (
              <motion.div
                key={item.name}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-[1.75rem] border p-6 text-center"
                style={{ backgroundColor: isDark ? `${item.color}0c` : `${item.color}08`, borderColor: isDark ? `${item.color}24` : `${item.color}18` }}
              >
                <div className="w-12 h-12 rounded-full border mx-auto mb-4 flex items-center justify-center font-mono text-sm font-bold" style={{ color: item.color, borderColor: `${item.color}40`, backgroundColor: `${item.color}10` }}>
                  {item.icon}
                </div>
                <div className="text-3xl font-black tabular-nums mb-2" style={{ color: item.color }}>{item.pct}%</div>
                <div className="text-xs leading-5 text-slate-500 dark:text-white/30">{destLabel(item.name)}</div>
              </motion.div>
            ))}
            <div className="sm:col-span-3 rounded-[1.75rem] border p-5" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.72)', borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.06)' }}>
              <div className="font-mono text-[10px] tracking-[0.22em] uppercase text-slate-400 dark:text-white/22 mb-2">
                {lang === 'zh' ? '结论' : 'Takeaway'}
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-white/40">
                {lang === 'zh'
                  ? '用户没有停止提问，他们只是转向了更快、更即时、嵌入工作流的新入口。'
                  : 'Developers did not stop asking questions. They moved to faster, more immediate entry points embedded in the workflow.'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
