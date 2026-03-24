import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis
} from 'recharts';
import salaryData from '../../data/developer_salary.json';
import type { DeveloperSalaryData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = salaryData as DeveloperSalaryData;

function MinimalTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white tabular-nums">
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function SalaryTab() {
  const { theme } = useTheme();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';

  // Hero stat: average premium
  const avgWithAI = data.salaryComparison.reduce((a, b) => a + b.withAI, 0) / data.salaryComparison.length;
  const avgWithout = data.salaryComparison.reduce((a, b) => a + b.withoutAI, 0) / data.salaryComparison.length;
  const premium = Math.round(((avgWithAI - avgWithout) / avgWithout) * 100);

  return (
    <div className="space-y-16">
      {/* Hero — salary premium */}
      <div className="text-center py-8">
        <LineReveal className="mb-2">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            AI Skill Premium
          </span>
        </LineReveal>
        <LineReveal delay={0.1}>
          <span className="text-[clamp(3.5rem,10vw,6rem)] font-black text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
            +{premium}%
          </span>
        </LineReveal>
        <LineReveal delay={0.2} className="mt-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
            Higher Salary with AI Tools Proficiency
          </span>
        </LineReveal>
      </div>

      {/* Salary Comparison — grouped bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Comparison</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          {[
            { name: 'With AI', color: theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#334155' },
            { name: 'Without AI', color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#cbd5e1' },
          ].map(item => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="font-mono text-[10px] text-slate-400 dark:text-white/20 tracking-wide">{item.name}</span>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.salaryComparison} barGap={2}>
              <XAxis dataKey="category" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={40} tickFormatter={(v: number) => `$${v / 1000}k`} />
              <Tooltip content={<MinimalTooltip formatter={(v: number) => `$${v.toLocaleString()}`} />} />
              <Bar dataKey="withAI" fill={theme === 'dark' ? 'rgba(255,255,255,0.35)' : '#334155'} radius={[4, 4, 0, 0]} name="With AI" />
              <Bar dataKey="withoutAI" fill={theme === 'dark' ? 'rgba(255,255,255,0.08)' : '#cbd5e1'} radius={[4, 4, 0, 0]} name="Without AI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Job Trends */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-6">
            <LineReveal>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Jobs</h3>
            </LineReveal>
            <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          </div>
          <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.jobTrends}>
                <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={35} tickFormatter={(v: number) => `${v / 1000}k`} />
                <Tooltip content={<MinimalTooltip formatter={(v: number) => v.toLocaleString()} />} />
                <Line type="monotone" dataKey="positions" stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#334155'} strokeWidth={2} dot={false} name="Positions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scatter */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="flex items-baseline gap-3 mb-6">
            <LineReveal>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Correlation</h3>
            </LineReveal>
            <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          </div>
          <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
            <ResponsiveContainer width="100%" height={260}>
              <ScatterChart>
                <XAxis type="number" dataKey="proficiency" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} name="Proficiency" />
                <YAxis type="number" dataKey="salary" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v / 1000}k`} name="Salary" />
                <ZAxis range={[40, 40]} />
                <Tooltip content={({ active, payload }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
                      <p className="text-sm font-bold text-white tabular-nums">${payload[1]?.value?.toLocaleString()}</p>
                      <p className="font-mono text-[10px] text-white/40">{payload[0]?.value}% proficiency</p>
                    </div>
                  );
                }} />
                <Scatter data={data.proficiencyVsSalary} fill={theme === 'dark' ? 'rgba(255,255,255,0.3)' : '#64748b'} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Insight Callout */}
      <InsightCallout
        text="The gap isn't talent — it's tools. A $65K junior with AI skills earns what a $100K mid-level earned without them."
        accent="amber"
      />

      {/* AI Skill Tier Progression */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">AI Skill Tier Progression</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { tier: 1, label: 'No AI', salary: '$65K', premium: null },
            { tier: 2, label: 'Occasional ChatGPT', salary: '$85K', premium: '+31%' },
            { tier: 3, label: 'Daily Copilot', salary: '$120K', premium: '+85%' },
            { tier: 4, label: 'AI-Native Workflow', salary: '$175K', premium: '+169%' },
          ].map((item, i) => (
            <motion.div
              key={item.tier}
              initial={prefersReduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="relative rounded-2xl p-5 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03] text-center"
            >
              {/* Arrow connector (hidden on first card) */}
              {i > 0 && (
                <span className="hidden lg:block absolute -left-3 top-1/2 -translate-y-1/2 text-slate-300 dark:text-white/10 text-sm">→</span>
              )}
              <div className="font-mono text-[10px] tracking-[0.3em] text-slate-400/50 dark:text-white/15 uppercase mb-3">
                Tier {item.tier}
              </div>
              <div className="text-sm text-slate-600 dark:text-white/40 font-medium mb-3">
                {item.label}
              </div>
              <div className="text-2xl font-black text-slate-900 dark:text-white/80 tabular-nums">
                {item.salary}
              </div>
              {item.premium && (
                <div className="mt-2 inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200/60 dark:bg-white/[0.06] text-slate-600 dark:text-white/40">
                  {item.premium}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
