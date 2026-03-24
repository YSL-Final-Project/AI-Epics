import { motion, useReducedMotion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import trafficData from '../../data/stackoverflow_traffic.json';
import surveyData from '../../data/stackoverflow_survey.json';
import type { SOTrafficPoint, SOSurveyData } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import LineReveal from '../../components/animations/LineReveal';
import InsightCallout from './InsightCallout';

const traffic = trafficData as SOTrafficPoint[];
const survey = surveyData as SOSurveyData;

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
  const prefersReduced = useReducedMotion();
  const axisColor = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';

  // Find peak & current for hero
  const peak = Math.max(...traffic.map(t => t.visits));
  const current = traffic[traffic.length - 1]?.visits || 0;
  const decline = Math.round(((peak - current) / peak) * 100);

  return (
    <div className="space-y-16">
      {/* Hero — decline stat */}
      <div className="text-center py-8">
        <LineReveal className="mb-2">
          <span className="font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/15 uppercase">
            Peak to Current
          </span>
        </LineReveal>
        <LineReveal delay={0.1}>
          <span className="text-[clamp(3.5rem,10vw,6rem)] font-black text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
            -{decline}%
          </span>
        </LineReveal>
        <LineReveal delay={0.2} className="mt-3">
          <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
            Traffic Decline Since ChatGPT Launch
          </span>
        </LineReveal>
      </div>

      {/* Traffic Line Chart */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Traffic</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={traffic}>
              <XAxis dataKey="month" tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} width={30} />
              <Tooltip content={<MinimalTooltip />} />
              <ReferenceLine x="2022-12" stroke={theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'} strokeDasharray="4 4" />
              <Line type="monotone" dataKey="visits" stroke={theme === 'dark' ? 'rgba(255,255,255,0.4)' : '#334155'} strokeWidth={2} dot={false} name="Visits" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Annual Questions — custom bars */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Questions</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={survey.annualQuestions}>
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
              <Bar dataKey="questions" fill={theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Heatmap — monochromatic */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Activity</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>
        <div className="overflow-x-auto rounded-2xl p-4 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
          <div className="min-w-[600px]">
            <div className="grid gap-1" style={{ gridTemplateColumns: `90px repeat(${survey.languageActivity[0].years.length}, 1fr)` }}>
              <div />
              {survey.languageActivity[0].years.map(y => (
                <div key={y.year} className="font-mono text-[9px] text-slate-400/40 dark:text-white/10 text-center py-1 tracking-wider">
                  {y.year}
                </div>
              ))}
            </div>
            {survey.languageActivity.map((lang, li) => (
              <motion.div
                key={lang.language}
                initial={prefersReduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: li * 0.04, duration: 0.4 }}
                className="grid gap-1"
                style={{ gridTemplateColumns: `90px repeat(${lang.years.length}, 1fr)` }}
              >
                <div className="text-[11px] text-slate-500 dark:text-white/25 font-medium py-2 pr-2 text-right">
                  {lang.language}
                </div>
                {lang.years.map(y => {
                  const intensity = y.activity / 100;
                  const bg = theme === 'dark'
                    ? `rgba(255,255,255,${intensity * 0.3})`
                    : `rgba(15,23,42,${intensity * 0.15})`;
                  return (
                    <div
                      key={y.year}
                      className="rounded-md py-2 text-center text-[10px] font-mono transition-transform hover:scale-110 cursor-default"
                      style={{ backgroundColor: bg }}
                      title={`${lang.language} ${y.year}: ${y.activity}`}
                    >
                      <span className={`tabular-nums ${
                        intensity > 0.5
                          ? 'text-white dark:text-white/70'
                          : 'text-slate-500/60 dark:text-white/20'
                      }`}>
                        {y.activity}
                      </span>
                    </div>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Insight Callout */}
      <InsightCallout
        text="Stack Overflow lost 55% of its traffic in 2 years — the fastest decline of any major developer platform in history."
        accent="rose"
      />

      {/* Where Did the Traffic Go? */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-8">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">Where Did the Traffic Go?</h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="space-y-5">
          {[
            { name: 'ChatGPT', pct: 35, icon: '🤖' },
            { name: 'GitHub Copilot Chat', pct: 22, icon: '🧑‍💻' },
            { name: 'Cursor / AI IDE', pct: 15, icon: '⚡' },
            { name: 'Phind', pct: 10, icon: '🔍' },
            { name: 'Perplexity', pct: 8, icon: '🧠' },
            { name: 'Documentation sites', pct: 6, icon: '📄' },
            { name: 'Other', pct: 4, icon: '···' },
          ].map((item, i) => (
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
                  {item.name}
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white/80 tabular-nums">{item.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-200/50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-slate-500 dark:bg-white/25"
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
