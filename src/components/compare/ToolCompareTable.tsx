import { motion } from 'framer-motion';
import toolsData from '../../data/ai_tools_compare.json';
import type { AIToolInfo } from '../../types';

const tools = toolsData as AIToolInfo[];

/* ── color palette ── */
const TOOL_COLORS: Record<string, string> = {
  'GitHub Copilot': '#5a7ec2',
  Cursor: '#a855f7',
  'Claude Code': '#c4a24d',
  Windsurf: '#4db0ba',
  'Cody (Sourcegraph)': '#5f8f64',
};

/* ── metric definitions ── */
interface MetricDef {
  key: string;
  label: string;
  sublabel: string;
  type: 'bar' | 'text';
  getValue: (t: AIToolInfo) => number;
  formatValue: (t: AIToolInfo) => string;
  max: number;
}

const metrics: MetricDef[] = [
  {
    key: 'accuracy',
    label: '准确率',
    sublabel: 'Benchmark Score',
    type: 'bar',
    getValue: t => t.accuracy,
    formatValue: t => `${t.accuracy}%`,
    max: 100,
  },
  {
    key: 'languages',
    label: '语言支持',
    sublabel: 'Languages',
    type: 'bar',
    getValue: t => t.languages,
    formatValue: t => `${t.languages}`,
    max: 35,
  },
  {
    key: 'context',
    label: '上下文窗口',
    sublabel: 'Context Window',
    type: 'text',
    getValue: () => 0,
    formatValue: t => t.contextWindow,
    max: 0,
  },
  {
    key: 'pricing',
    label: '定价',
    sublabel: 'Pricing',
    type: 'text',
    getValue: () => 0,
    formatValue: t => t.pricing,
    max: 0,
  },
  {
    key: 'ide',
    label: 'IDE 支持',
    sublabel: 'IDE Support',
    type: 'text',
    getValue: () => 0,
    formatValue: t => t.ideSupport.join(' · '),
    max: 0,
  },
];

function findBest(metric: MetricDef): string | null {
  if (metric.type !== 'bar') return null;
  let best = tools[0];
  tools.forEach(t => { if (metric.getValue(t) > metric.getValue(best)) best = t; });
  return best.name;
}

/* ── row animation variants ── */
const rowVariants = {
  hidden: { opacity: 0, x: 40, filter: 'blur(6px)' },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: 'blur(0px)',
    transition: { delay: 0.3 + i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] as const },
  }),
};

const barVariants = {
  hidden: { width: '0%' },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: { delay: 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] as const },
  }),
};

export default function ToolCompareTable() {
  // Hero stat — Claude Code accuracy
  const claude = tools.find(t => t.name === 'Claude Code')!;

  return (
    <div className="py-24">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="text-center mb-16"
      >
        <p className="text-xs font-mono tracking-[0.5em] text-slate-400/40 dark:text-white/15 uppercase mb-6">
          AI Coding Tools
        </p>
        <h3 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          五款工具。没有全能冠军。
        </h3>
        <p className="mt-4 text-sm text-slate-400 dark:text-white/20 font-light leading-relaxed">
          每个维度的赢家都不一样。<br className="sm:hidden" />选错工具，代价是效率。
        </p>
      </motion.div>

      {/* Hero stat */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ delay: 0.15, duration: 0.7 }}
        className="text-center mb-16"
      >
        <span className="text-7xl sm:text-8xl font-black tracking-tight text-[#c4a24d]">
          {claude.accuracy}%
        </span>
        <p className="mt-3 text-base text-slate-400 dark:text-white/20 font-light">
          Claude Code。准确率最高的那一个。
        </p>
      </motion.div>

      {/* Metric rows */}
      <div className="space-y-6 max-w-3xl mx-auto">
        {metrics.map((metric, mIdx) => {
          const best = findBest(metric);
          return (
            <motion.div
              key={metric.key}
              custom={mIdx}
              variants={rowVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-xl p-5 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/20 dark:border-white/[0.03]"
            >
              {/* Metric label */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-sm font-bold text-slate-900 dark:text-white/80">
                  {metric.label}
                </span>
                <span className="text-[10px] font-mono text-slate-300 dark:text-white/10 uppercase tracking-wider">
                  {metric.sublabel}
                </span>
              </div>

              {/* Tool entries */}
              <div className="space-y-2">
                {tools.map((tool) => {
                  const color = TOOL_COLORS[tool.name] || '#888';
                  const isBest = tool.name === best;

                  if (metric.type === 'bar') {
                    const pct = (metric.getValue(tool) / metric.max) * 100;
                    return (
                      <div key={tool.name} className="flex items-center gap-3"
                        data-cursor-label={tool.name}
                        data-cursor-value={metric.formatValue(tool)}
                        data-cursor-color={color}
                        data-cursor-sub={`${metric.label}${isBest ? ' · 最佳' : ''}`}
                      >
                        <span className={`w-[100px] text-right text-[12px] shrink-0 tracking-tight ${isBest ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                          {tool.name.replace(' (Sourcegraph)', '')}
                        </span>
                        <div className="flex-1 h-6 bg-slate-100/60 dark:bg-white/[0.02] rounded overflow-hidden relative">
                          <motion.div
                            custom={pct}
                            variants={barVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="h-full rounded relative overflow-hidden"
                            style={{ backgroundColor: color, opacity: isBest ? 0.85 : 0.4 }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/[0.1] to-white/0" />
                          </motion.div>
                          {isBest && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] font-bold tracking-widest text-slate-400 dark:text-white/20 uppercase">
                              Best
                            </span>
                          )}
                        </div>
                        <span className={`w-8 text-right text-xs tabular-nums ${isBest ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400 dark:text-white/25'}`}>
                          {metric.formatValue(tool)}
                        </span>
                      </div>
                    );
                  }

                  // Text-type metric
                  return (
                    <div key={tool.name} className="flex items-center gap-3"
                      data-cursor-label={tool.name}
                      data-cursor-value=""
                      data-cursor-color={color}
                      data-cursor-sub={metric.label}
                    >
                      <span className="w-[100px] text-right text-[12px] text-slate-400 dark:text-slate-500 shrink-0 tracking-tight">
                        {tool.name.replace(' (Sourcegraph)', '')}
                      </span>
                      <span className="text-[12px] text-slate-600 dark:text-white/30 font-mono">
                        {metric.formatValue(tool)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
