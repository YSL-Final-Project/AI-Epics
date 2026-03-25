import { motion, useReducedMotion } from 'framer-motion';

/**
 * InsightCallout — editorial-style bold insight between charts.
 * A cinematic callout box with accent border and large quote text.
 */
export default function InsightCallout({
  text,
  source,
  accent = 'cyan',
}: {
  text: string;
  source?: string;
  accent?: 'cyan' | 'violet' | 'rose' | 'amber' | 'emerald';
}) {
  const prefersReduced = useReducedMotion();

  const colors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
    cyan:    { border: 'border-cyan-500/20', bg: 'bg-cyan-500/[0.03]', text: 'text-cyan-400/30', glow: 'rgba(6,182,212,0.06)' },
    violet:  { border: 'border-violet-500/20', bg: 'bg-violet-500/[0.03]', text: 'text-violet-400/30', glow: 'rgba(139,92,246,0.06)' },
    rose:    { border: 'border-rose-500/20', bg: 'bg-rose-500/[0.03]', text: 'text-rose-400/30', glow: 'rgba(244,63,94,0.06)' },
    amber:   { border: 'border-amber-500/20', bg: 'bg-amber-500/[0.03]', text: 'text-amber-400/30', glow: 'rgba(245,158,11,0.06)' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/[0.03]', text: 'text-emerald-400/30', glow: 'rgba(16,185,129,0.06)' },
  };

  const c = colors[accent] || colors.cyan;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
      className={`relative rounded-2xl border-l-2 ${c.border} ${c.bg} px-8 py-7 my-12 overflow-hidden`}
      style={{ boxShadow: `0 0 40px ${c.glow}` }}
    >
      {/* Quote mark */}
      <span className={`absolute top-3 left-3 text-4xl font-serif ${c.text} select-none leading-none`}>"</span>

      <p className="text-base sm:text-lg text-slate-700 dark:text-white/60 font-light leading-relaxed pl-4">
        {text}
      </p>

      {source && (
        <p className="mt-3 pl-4 font-mono text-[10px] text-slate-400/50 dark:text-white/15 tracking-wider uppercase">
          {source}
        </p>
      )}
    </motion.div>
  );
}
