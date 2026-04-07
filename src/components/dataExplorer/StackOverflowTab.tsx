import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, Cell, LineChart, Line,
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

// Per-language brand colors: JS, Python, Java, C++, TypeScript, Rust, Go, PHP
const LANG_COLORS = ['#f59e0b', '#3b82f6', '#f43f5e', '#8b5cf6', '#06b6d4', '#f97316', '#10b981', '#6366f1'];

const DEST_ITEMS = [
  { name: 'ChatGPT', pct: 35, icon: '🤖', color: '#10a37f' },
  { name: 'GitHub Copilot Chat', pct: 22, icon: '🧑‍💻', color: '#6366f1' },
  { name: 'Cursor / AI IDE', pct: 15, icon: '⚡', color: '#3b82f6' },
  { name: 'Phind', pct: 10, icon: '🔍', color: '#8b5cf6' },
  { name: 'Perplexity', pct: 8, icon: '🧠', color: '#06b6d4' },
  { name: 'Documentation sites', pct: 6, icon: '📄', color: '#f59e0b' },
  { name: 'Other', pct: 4, icon: '···', color: '#94a3b8' },
];

/* ── Animated counter hook ── */
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

function MinimalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white tabular-nums">{p.value}M</p>
      ))}
    </div>
  );
}

export default function StackOverflowTab() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const isDark = theme === 'dark';
  const s = t.dataExplorer.stackoverflow;
  const destLabel = (key: string) => (s.trafficDests as Record<string, string>)[key] ?? key;

  const peak = Math.max(...traffic.map(t => t.visits));
  const current = traffic[traffic.length - 1]?.visits || 0;
  const decline = Math.round(((peak - current) / peak) * 100);

  const questionsFirst = survey.annualQuestions[0];
  const questionsLast = survey.annualQuestions[survey.annualQuestions.length - 1];
  const questionsDecline = Math.round(((questionsFirst.questions - questionsLast.questions) / questionsFirst.questions) * 100);

  const ROSE = isDark ? '#fb7185' : '#e11d48';
  const ROSE_SOFT = isDark ? '#fb718540' : '#e11d4820';

  // Transform nested language data → flat rows for Recharts LineChart
  const langChartData = survey.languageActivity[0].years.map((_, yi) => {
    const row: Record<string, number> = { year: survey.languageActivity[0].years[yi].year };
    survey.languageActivity.forEach(lang => {
      row[lang.language] = lang.years[yi].activity;
    });
    return row;
  });

  // Hero animation
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHeroVisible(true); }, { threshold: 0.3 });
    if (heroRef.current) obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);
  const animatedDecline = useCountUp(decline, 2000, heroVisible);

  return (
    <div className="space-y-8">

      {/* ═══ Hero — decline percentage + peak vs current comparison ═══ */}
      <div ref={heroRef} className="relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, rgba(251,113,133,0.08) 0%, rgba(225,29,72,0.04) 50%, rgba(0,0,0,0) 100%)'
            : 'linear-gradient(135deg, rgba(225,29,72,0.06) 0%, rgba(225,29,72,0.02) 50%, rgba(255,255,255,0) 100%)',
        }}
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

        <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left: Big number */}
          <div className="text-center md:text-left flex-shrink-0">
            <LineReveal className="mb-2">
              <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
                {s.trafficDecline}
              </span>
            </LineReveal>
            <LineReveal delay={0.1}>
              <span
                className="text-[clamp(4rem,12vw,7rem)] font-black tracking-tight tabular-nums leading-none bg-clip-text text-transparent"
                style={{
                  backgroundImage: isDark
                    ? 'linear-gradient(135deg, #fff 10%, #fb7185 50%, #e11d48 100%)'
                    : 'linear-gradient(135deg, #0f172a 10%, #e11d48 80%)',
                }}
              >
                -{Math.round(animatedDecline)}%
              </span>
            </LineReveal>
          </div>

          {/* Right: Peak vs Current cards */}
          <div className="flex gap-4 flex-1 w-full md:w-auto">
            {/* Peak */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 rounded-2xl p-5 border text-center"
              style={{
                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
                borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
              }}
            >
              <div className="font-mono text-[9px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase mb-3">2022 Peak</div>
              <div className="text-3xl font-black tabular-nums text-slate-600 dark:text-white/50">{peak}M</div>
              <div className="font-mono text-[9px] text-slate-400/30 dark:text-white/8 mt-1">visits/mo</div>
            </motion.div>
            {/* Arrow */}
            <div className="flex items-center">
              <span className="text-2xl font-bold" style={{ color: ROSE_SOFT }}>→</span>
            </div>
            {/* Current */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="flex-1 rounded-2xl p-5 border-l-2 text-center"
              style={{
                backgroundColor: isDark ? 'rgba(251,113,133,0.06)' : 'rgba(225,29,72,0.04)',
                borderLeftColor: ROSE,
              }}
            >
              <div className="font-mono text-[9px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase mb-3">2025 Now</div>
              <div className="text-3xl font-black tabular-nums" style={{ color: ROSE }}>{current}M</div>
              <div className="font-mono text-[9px] text-slate-400/30 dark:text-white/8 mt-1">visits/mo</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ Section 1: Traffic Area Chart — dramatic gradient fill ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border-l-2"
        style={{
          backgroundColor: isDark ? 'rgba(251,113,133,0.06)' : 'rgba(225,29,72,0.03)',
          borderLeftColor: ROSE,
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">01</span>
            {s.traffic}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          <span className="font-mono text-xs tabular-nums" style={{ color: ROSE }}>
            {peak}M → {current}M
          </span>
        </div>
        <div className="overflow-x-auto rounded-xl bg-white/40 dark:bg-black/20 p-3">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={traffic}>
              <defs>
                <linearGradient id="soTrafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={ROSE} stopOpacity={isDark ? 0.35 : 0.25} />
                  <stop offset="100%" stopColor={ROSE} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={35} tickFormatter={(v: number) => `${v}M`} />
              <Tooltip content={<MinimalTooltip />} />
              <ReferenceLine
                x="2022-12"
                stroke={isDark ? 'rgba(251,113,133,0.4)' : 'rgba(225,29,72,0.3)'}
                strokeDasharray="4 4"
                label={{ value: 'ChatGPT', fill: isDark ? 'rgba(251,113,133,0.5)' : 'rgba(225,29,72,0.4)', fontSize: 10, fontWeight: 700, position: 'top' }}
              />
              <Area type="monotone" dataKey="visits" stroke={ROSE} strokeWidth={2.5} fill="url(#soTrafficGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ═══ Section 2: Questions — colorful gradient bars ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border"
        style={{
          backgroundColor: isDark ? 'rgba(251,113,133,0.04)' : 'rgba(225,29,72,0.02)',
          borderColor: isDark ? 'rgba(251,113,133,0.1)' : 'rgba(225,29,72,0.08)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">02</span>
            {s.questions}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-xs tabular-nums text-slate-400 dark:text-white/20">
              {(questionsFirst.questions / 1000000).toFixed(1)}M → {(questionsLast.questions / 1000000).toFixed(1)}M
            </span>
            <span className="font-mono text-xs font-bold tabular-nums" style={{ color: ROSE }}>
              -{questionsDecline}%
            </span>
          </div>
        </div>
        <div className="overflow-x-auto rounded-xl bg-white/40 dark:bg-black/20 p-3">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={survey.annualQuestions}>
              <defs>
                {survey.annualQuestions.map((_e, i) => {
                  // Gradient from warm (early) to cool (late): amber → orange → rose → violet → slate
                  const palette = ['#f59e0b', '#f97316', '#fb7185', '#e11d48', '#be123c', '#9f1239', '#64748b'];
                  const color = palette[i] || palette[palette.length - 1];
                  return (
                    <linearGradient key={i} id={`qBar${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.8 : 0.7} />
                      <stop offset="100%" stopColor={color} stopOpacity={isDark ? 0.35 : 0.25} />
                    </linearGradient>
                  );
                })}
              </defs>
              <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={35} tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={({ active, payload, label }: any) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
                    <p className="font-mono text-[10px] text-white/40 mb-1">{label}</p>
                    <p className="text-sm font-bold text-white tabular-nums">{(payload[0].value / 1000000).toFixed(2)}M</p>
                  </div>
                );
              }} />
              <Bar dataKey="questions" radius={[6, 6, 0, 0]}>
                {survey.annualQuestions.map((_entry, index) => (
                  <Cell key={index} fill={`url(#qBar${index})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ═══ Section 3: Language Activity — sparkline grid ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">03</span>
            {s.activity}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {survey.languageActivity.map((lang, li) => {
            const color = LANG_COLORS[li];
            const peakVal = Math.max(...lang.years.map(y => y.activity));
            const lastVal = lang.years[lang.years.length - 1].activity;
            const change = Math.round(((lastVal - peakVal) / peakVal) * 100);
            return (
              <motion.div
                key={lang.language}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: li * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: isDark ? `${color}08` : `${color}05`,
                  borderColor: isDark ? `${color}18` : `${color}12`,
                }}
              >
                {/* Header: name + change */}
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold" style={{ color: isDark ? `${color}cc` : color }}>
                    {lang.language}
                  </span>
                  <span className="font-mono text-[10px] font-bold tabular-nums" style={{ color: ROSE }}>
                    {change}%
                  </span>
                </div>
                {/* Peak → Current */}
                <div className="font-mono text-[9px] text-slate-400/50 dark:text-white/15 mb-2">
                  {peakVal} → {lastVal}
                </div>
                {/* Mini area chart */}
                <ResponsiveContainer width="100%" height={64}>
                  <AreaChart data={lang.years} margin={{ top: 2, right: 2, bottom: 0, left: 2 }}>
                    <defs>
                      <linearGradient id={`spark-${li}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity={isDark ? 0.4 : 0.3} />
                        <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={[0, 100]} />
                    <Area
                      type="monotone"
                      dataKey="activity"
                      stroke={color}
                      strokeWidth={2}
                      fill={`url(#spark-${li})`}
                      dot={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ Section 4: OverflowAI Response ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border"
        style={{
          backgroundColor: isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.03)',
          borderColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.12)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: '#6366f1' }} className="font-mono text-xs mr-2">04</span>
            {s.overflowAI}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        {/* Timeline dots */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500/60" />
            <span className="font-mono text-xs text-slate-500 dark:text-white/30">{s.overflowAIAnnounced}</span>
          </div>
          <div className="flex-1 h-px bg-indigo-500/20" />
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="font-mono text-xs text-slate-500 dark:text-white/30">{s.overflowAIGA}</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-white/25 leading-relaxed">{s.overflowAIDesc}</p>
      </motion.div>

      {/* Insight */}
      <InsightCallout text={s.insightText} accent="rose" />

      {/* ═══ Section 5: Where Did Traffic Go — featured layout ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: ROSE }} className="font-mono text-xs mr-2">05</span>
            {s.whereDidTrafficGo}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        {/* Top 3 as featured cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {DEST_ITEMS.slice(0, 3).map((item, i) => (
            <motion.div
              key={item.name}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-xl p-5 border text-center"
              style={{
                backgroundColor: isDark ? `${item.color}0a` : `${item.color}06`,
                borderColor: isDark ? `${item.color}25` : `${item.color}20`,
              }}
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-2xl font-black tabular-nums mb-1" style={{ color: item.color }}>
                {item.pct}%
              </div>
              <div className="text-xs text-slate-500 dark:text-white/30">{destLabel(item.name)}</div>
            </motion.div>
          ))}
        </div>

        {/* Rest as bars */}
        <div className="space-y-4">
          {DEST_ITEMS.slice(3).map((item, i) => (
            <motion.div
              key={item.name}
              initial={prefersReduced ? false : { opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-white/30 flex items-center gap-2">
                  <span className="text-xs">{item.icon}</span>
                  {destLabel(item.name)}
                </span>
                <span className="text-lg font-black tabular-nums" style={{ color: item.color }}>{item.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: item.color, opacity: isDark ? 0.6 : 0.7 }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.pct / 40) * 100}%` }}
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
