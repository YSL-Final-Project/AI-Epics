import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import codeGenData from '../../data/code_generation.json';
import type { CodeGenData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import LineReveal from '../../components/animations/LineReveal';

const data = codeGenData as CodeGenData;

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
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';

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
            AI-Generated Code on GitHub
          </span>
        </LineReveal>

        <div className="relative w-44 h-44">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor"
              className="text-slate-200/50 dark:text-white/[0.04]" strokeWidth="3" />
            <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor"
              className="text-slate-700 dark:text-white/50" strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.32, 0.72, 0, 1)' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
              {animated ? data.overallPercentage : 0}%
            </span>
            <span className="font-mono text-[8px] text-slate-400/40 dark:text-white/10 tracking-wider uppercase mt-1">
              of new code
            </span>
          </div>
        </div>
      </div>

      {/* Industry Comparison — horizontal custom bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">By Industry</h3>
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
                <span className="text-sm text-slate-500 dark:text-white/30">{item.industry}</span>
                <span className="text-xl font-black text-slate-900 dark:text-white/80 tabular-nums">{item.percentage}%</span>
              </div>
              <div className="h-1 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-slate-600 dark:bg-white/35"
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

      {/* Acceptance Rate Line */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Acceptance Rate</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.acceptanceRate}>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={1} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} domain={[15, 50]} />
              <Tooltip content={<MinimalTooltip suffix="%" />} />
              <Line type="monotone" dataKey="rate" stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#334155'} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: theme === 'dark' ? '#fff' : '#0f172a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
