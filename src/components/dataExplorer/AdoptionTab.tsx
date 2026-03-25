import { motion, useReducedMotion } from 'framer-motion';
import {
  AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import adoptionData from '../../data/ai_adoption.json';
import type { AIAdoptionData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = adoptionData as AIAdoptionData;

// Custom minimal tooltip
function MinimalTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1.5 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white">
          {p.name}: <span className="tabular-nums">{p.value}M</span>
        </p>
      ))}
    </div>
  );
}

export default function AdoptionTab() {
  const { theme } = useTheme();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)';

  // Latest data point for hero numbers
  const latest = data.userGrowth[data.userGrowth.length - 1];
  const totalUsers = latest ? (latest.chatgpt + latest.copilot + latest.cursor + latest.claudeCode) : 0;

  return (
    <div className="space-y-16">
      {/* Hero Stats — Apple style big numbers */}
      <div className="text-center py-8">
        <LineReveal className="mb-2">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            Total Users
          </span>
        </LineReveal>
        <LineReveal delay={0.1}>
          <span className="text-[clamp(3.5rem,10vw,6rem)] font-black text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
            {totalUsers.toFixed(1)}M
          </span>
        </LineReveal>
        <LineReveal delay={0.2} className="mt-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
            Across 4 Major Platforms · 2025
          </span>
        </LineReveal>
      </div>

      {/* Area Chart: User Growth — clean, no grid */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Growth</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        {/* Legend — inline, minimal */}
        <div className="flex gap-6 mb-4">
          {[
            { name: 'ChatGPT', color: '#6366f1' },
            { name: 'Copilot', color: '#64748b' },
            { name: 'Cursor', color: '#a1a1aa' },
            { name: 'Claude', color: '#cbd5e1' },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-[10px] text-slate-400 dark:text-white/20 tracking-wide">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data.userGrowth}>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<MinimalTooltip />} />
              <Area type="monotone" dataKey="chatgpt" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={1.5} name="ChatGPT" />
              <Area type="monotone" dataKey="copilot" stackId="1" stroke="#64748b" fill="#64748b" fillOpacity={0.1} strokeWidth={1.5} name="Copilot" />
              <Area type="monotone" dataKey="cursor" stackId="1" stroke="#a1a1aa" fill="#a1a1aa" fillOpacity={0.08} strokeWidth={1.5} name="Cursor" />
              <Area type="monotone" dataKey="claudeCode" stackId="1" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.06} strokeWidth={1.5} name="Claude" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Usage Frequency — horizontal bars, no chart library */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Frequency</h3>
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
                <span className="text-sm text-slate-600 dark:text-white/40 font-medium">{item.frequency}</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white/80 tabular-nums">{item.percentage}%</span>
              </div>
              <div className="h-1 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-slate-500 dark:bg-white/30"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.percentage}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Use Cases — donut-style ring + list */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Use Cases</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-10">
          {/* SVG Donut */}
          <div className="relative w-40 h-40 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              {(() => {
                const total = data.useCases.reduce((a, b) => a + b.value, 0);
                const r = 38;
                const circumference = 2 * Math.PI * r;
                let offset = 0;
                const grays = ['rgba(30,30,30,0.7)', 'rgba(80,80,80,0.5)', 'rgba(130,130,130,0.35)', 'rgba(180,180,180,0.25)', 'rgba(210,210,210,0.15)', 'rgba(230,230,230,0.1)'];
                const darkGrays = ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.35)', 'rgba(255,255,255,0.22)', 'rgba(255,255,255,0.14)', 'rgba(255,255,255,0.08)', 'rgba(255,255,255,0.04)'];
                return data.useCases.map((item, i) => {
                  const pct = item.value / total;
                  const dash = pct * circumference;
                  const gap = circumference - dash;
                  const currentOffset = offset;
                  offset += dash;
                  return (
                    <circle
                      key={item.name}
                      cx="50" cy="50" r={r}
                      fill="none"
                      stroke={theme === 'dark' ? darkGrays[i] : grays[i]}
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
              <span className="font-mono text-[9px] text-slate-400/50 dark:text-white/15 tracking-wider uppercase">Cases</span>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 space-y-3">
            {data.useCases.map((item, i) => {
              const total = data.useCases.reduce((a, b) => a + b.value, 0);
              const pct = Math.round((item.value / total) * 100);
              return (
                <motion.div
                  key={item.name}
                  initial={prefersReduced ? false : { opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-slate-600 dark:text-white/35">{item.name}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white/70 tabular-nums">{pct}%</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Insight Callout */}
      <InsightCallout
        text="92% of developers now use or plan to use AI tools — that's higher than version control adoption was in 2010."
        accent="cyan"
      />

      {/* Before / After — Developer Workflow Transformation */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Before / After</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2021 Card */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl p-6 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] text-slate-400/50 dark:text-white/15 uppercase mb-5">2021 Workflow</div>
            <div className="flex flex-wrap items-center gap-2">
              {['Stack Overflow', 'Manual Debug', 'Copy-Paste', 'Test'].map((step, i) => (
                <motion.div
                  key={step}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200/60 dark:bg-white/[0.06] text-slate-600 dark:text-white/40 border border-slate-200/40 dark:border-white/[0.04]">
                    {step}
                  </span>
                  {i < 3 && (
                    <span className="text-slate-300 dark:text-white/10 text-xs">→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 2025 Card */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl p-6 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]"
          >
            <div className="font-mono text-[10px] tracking-[0.3em] text-slate-400/50 dark:text-white/15 uppercase mb-5">2025 Workflow</div>
            <div className="flex flex-wrap items-center gap-2">
              {['AI Suggest', 'Auto-Complete', 'AI Review', 'Auto-Test'].map((step, i) => (
                <motion.div
                  key={step}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="flex items-center gap-2"
                >
                  <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-700/10 dark:bg-white/[0.1] text-slate-800 dark:text-white/60 border border-slate-300/40 dark:border-white/[0.08]">
                    {step}
                  </span>
                  {i < 3 && (
                    <span className="text-slate-400 dark:text-white/15 text-xs">→</span>
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
