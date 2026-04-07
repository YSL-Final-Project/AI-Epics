import { motion, useReducedMotion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, ScatterChart, Scatter,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ZAxis
} from 'recharts';
import salaryData from '../../data/developer_salary.json';
import type { DeveloperSalaryData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const data = salaryData as DeveloperSalaryData;

const TIER_COLORS = ['#64748b', '#f59e0b', '#06b6d4', '#10b981'];

function MinimalTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/90 dark:bg-white/10 backdrop-blur-xl rounded-xl px-4 py-3 shadow-2xl border border-white/5">
      <p className="font-mono text-[10px] text-white/40 mb-1 tracking-wider">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-sm font-bold text-white tabular-nums flex items-center gap-2">
          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: p.color || p.fill }} />
          {p.name}: {formatter ? formatter(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export default function SalaryTab() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const isDark = theme === 'dark';
  const sal = t.dataExplorer.salary;

  // Hero stat: average premium
  const avgWithAI = data.salaryComparison.reduce((a, b) => a + b.withAI, 0) / data.salaryComparison.length;
  const avgWithout = data.salaryComparison.reduce((a, b) => a + b.withoutAI, 0) / data.salaryComparison.length;
  const premium = Math.round(((avgWithAI - avgWithout) / avgWithout) * 100);

  const EMERALD = isDark ? '#34d399' : '#059669';
  const EMERALD_DIM = isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.06)';
  const barColorWith = isDark ? '#34d399' : '#059669';
  const barColorWithout = isDark ? 'rgba(255,255,255,0.12)' : '#cbd5e1';

  return (
    <div className="space-y-6">
      {/* ═══ Hero — salary premium ═══ */}
      <div className="text-center py-10">
        <LineReveal className="mb-2">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            {sal.aiSkillPremium}
          </span>
        </LineReveal>
        <LineReveal delay={0.1}>
          <span
            className="text-[clamp(3.5rem,10vw,6rem)] font-black tracking-tight tabular-nums leading-none bg-clip-text text-transparent"
            style={{
              backgroundImage: isDark
                ? 'linear-gradient(135deg, #fff 20%, #34d399 60%, #059669 100%)'
                : 'linear-gradient(135deg, #0f172a 20%, #059669 100%)',
            }}
          >
            +{premium}%
          </span>
        </LineReveal>
        <LineReveal delay={0.2} className="mt-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
            {sal.higherSalary}
          </span>
        </LineReveal>
      </div>

      {/* ═══ Section 1: Salary Comparison — accent card ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border-l-2"
        style={{
          backgroundColor: EMERALD_DIM,
          borderLeftColor: EMERALD,
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: EMERALD }} className="font-mono text-xs mr-2">01</span>
            {sal.comparison}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          {/* Legend inline */}
          <div className="flex gap-4">
            {[
              { name: sal.withAI, color: barColorWith },
              { name: sal.withoutAI, color: barColorWithout },
            ].map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="font-mono text-[10px] text-slate-400 dark:text-white/20 tracking-wide">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white/50 dark:bg-black/20 p-3">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data.salaryComparison} barGap={2}>
              <XAxis dataKey="category" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={40} tickFormatter={(v: number) => `$${v / 1000}k`} />
              <Tooltip content={<MinimalTooltip formatter={(v: number) => `$${v.toLocaleString()}`} />} />
              <Bar dataKey="withAI" fill={barColorWith} fillOpacity={isDark ? 0.7 : 0.8} radius={[4, 4, 0, 0]} name={sal.withAI} />
              <Bar dataKey="withoutAI" fill={barColorWithout} radius={[4, 4, 0, 0]} name={sal.withoutAI} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ═══ Section 2 & 3: Jobs + Scatter — side by side ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Trends — accent border card */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: isDark ? 'rgba(52,211,153,0.04)' : 'rgba(5,150,105,0.02)',
            borderColor: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.1)',
          }}
        >
          <div className="flex items-baseline gap-3 mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span style={{ color: EMERALD }} className="font-mono text-xs mr-2">02</span>
              {sal.jobs}
            </h3>
            <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
            {/* Inline latest stat */}
            <span className="font-mono text-xs tabular-nums" style={{ color: EMERALD }}>
              {(data.jobTrends[data.jobTrends.length - 1]?.positions / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="overflow-x-auto rounded-xl bg-white/50 dark:bg-black/20 p-3">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.jobTrends}>
                <XAxis dataKey="year" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={35} tickFormatter={(v: number) => `${v / 1000}k`} />
                <Tooltip content={<MinimalTooltip formatter={(v: number) => v.toLocaleString()} />} />
                <Line type="monotone" dataKey="positions" stroke={EMERALD} strokeWidth={2.5} dot={false} name="Positions" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Scatter — accent border card */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
          className="rounded-2xl p-5 border"
          style={{
            backgroundColor: isDark ? 'rgba(52,211,153,0.04)' : 'rgba(5,150,105,0.02)',
            borderColor: isDark ? 'rgba(52,211,153,0.12)' : 'rgba(5,150,105,0.1)',
          }}
        >
          <div className="flex items-baseline gap-3 mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span style={{ color: EMERALD }} className="font-mono text-xs mr-2">03</span>
              {sal.correlation}
            </h3>
            <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          </div>
          <div className="overflow-x-auto rounded-xl bg-white/50 dark:bg-black/20 p-3">
            <ResponsiveContainer width="100%" height={240}>
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
                <Scatter data={data.proficiencyVsSalary} fill={EMERALD} fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* ═══ Section 4: Premium Growth Trend — line chart ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="rounded-2xl p-6 border"
        style={{
          backgroundColor: isDark ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.03)',
          borderColor: isDark ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.12)',
        }}
      >
        <div className="flex items-baseline gap-3 mb-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: '#f59e0b' }} className="font-mono text-xs mr-2">04</span>
            {sal.premiumGrowth}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
          <span className="font-mono text-xs tabular-nums" style={{ color: '#f59e0b' }}>
            +{data.premiumTrend[data.premiumTrend.length - 1]?.premium}%
          </span>
        </div>
        {/* Premium stat cards per year */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {data.premiumTrend.map((pt, i) => (
            <motion.div
              key={pt.year}
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-xl p-4 bg-white/50 dark:bg-black/20 text-center"
            >
              <div className="font-mono text-[10px] text-slate-400/50 dark:text-white/15 mb-2">{pt.year}</div>
              <div className="text-2xl font-black tabular-nums" style={{ color: '#f59e0b' }}>+{pt.premium}%</div>
            </motion.div>
          ))}
        </div>
        <p className="font-mono text-[9px] text-slate-400/30 dark:text-white/8 text-center">{sal.premiumSource}</p>
      </motion.div>

      {/* Insight Callout */}
      <InsightCallout text={sal.insightText} accent="amber" />

      {/* ═══ Section 5: Hot AI Skills ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: EMERALD }} className="font-mono text-xs mr-2">05</span>
            {sal.hotSkills}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.hotSkills.map((skill, i) => {
            const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#f59e0b'];
            const color = colors[i % colors.length];
            const skillName = (sal.skillNames as Record<string, string>)[skill.skill] ?? skill.skill;
            return (
              <motion.div
                key={skill.skill}
                initial={prefersReduced ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="rounded-xl p-5 border-l-2"
                style={{
                  backgroundColor: isDark ? `${color}08` : `${color}04`,
                  borderLeftColor: color,
                }}
              >
                <div className="text-sm font-bold mb-3" style={{ color: isDark ? `${color}cc` : color }}>
                  {skillName}
                </div>
                {skill.demandGrowth && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-white/20">{sal.demandGrowth}</span>
                    <span className="text-lg font-black tabular-nums" style={{ color }}>+{skill.demandGrowth}%</span>
                  </div>
                )}
                {skill.avgSalary && (
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-white/20">{sal.avgSalaryLabel}</span>
                    <span className="text-lg font-black tabular-nums" style={{ color }}>${(skill.avgSalary / 1000).toFixed(0)}K</span>
                  </div>
                )}
                {skill.premiumRange && (
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] text-slate-400 dark:text-white/20">{sal.premiumRangeLabel}</span>
                    <span className="text-lg font-black tabular-nums" style={{ color }}>{skill.premiumRange}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ Section 6: AI Skill Tier Progression — featured cards ═══ */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
            <span style={{ color: EMERALD }} className="font-mono text-xs mr-2">06</span>
            {sal.tierProgression}
          </h3>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(sal.tiers as { label: string; salary: string; premium: string }[]).map((item, i) => {
            const color = TIER_COLORS[i];
            return (
              <motion.div
                key={i}
                initial={prefersReduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="relative rounded-2xl p-5 text-center border-l-2"
                style={{
                  backgroundColor: isDark ? `${color}10` : `${color}08`,
                  borderLeftColor: color,
                }}
              >
                {/* Arrow connector */}
                {i > 0 && (
                  <span className="hidden lg:block absolute -left-4 top-1/2 -translate-y-1/2 text-base font-bold" style={{ color: `${color}60` }}>→</span>
                )}
                <div className="font-mono text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: `${color}90` }}>
                  {sal.tier} {i + 1}
                </div>
                <div className="text-sm font-medium mb-3" style={{ color: isDark ? `${color}dd` : color }}>
                  {item.label}
                </div>
                <div className="text-2xl font-black tabular-nums" style={{ color }}>
                  {item.salary}
                </div>
                {item.premium && (
                  <div
                    className="mt-3 inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: isDark ? `${color}20` : `${color}15`,
                      color,
                    }}
                  >
                    {item.premium}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
