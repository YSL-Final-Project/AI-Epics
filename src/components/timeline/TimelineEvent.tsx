import { motion, useReducedMotion } from 'framer-motion';
import type { TimelineEvent as TimelineEventType } from '../../types';
import LineReveal from '../animations/LineReveal';

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
}

const categoryLabel: Record<string, string> = {
  tool_release: 'Tool',
  company: 'Industry',
  open_source: 'Open Source',
  policy: 'Policy',
};


export default function TimelineEvent({ event, index }: TimelineEventProps) {
  const prefersReduced = useReducedMotion();

  // Format date: "2021-06-29" → "Jun"
  const d = new Date(event.date);
  const month = d.toLocaleString('en', { month: 'short' });
  const baseDelay = (index % 4) * 0.06;

  return (
    <div className="relative">
      {/* Timeline dot on the vertical line */}
      <motion.div
        initial={prefersReduced ? false : { scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
        className="absolute -left-6 sm:-left-20 top-6 w-2 h-2"
      >
        <div className="w-full h-full rounded-full bg-slate-300 dark:bg-white/20" />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 sm:w-[52px] h-px bg-slate-200/60 dark:bg-white/[0.06]" />
      </motion.div>

      {/* Card — scale+blur reveal */}
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
        whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.7,
          delay: baseDelay,
          ease: [0.32, 0.72, 0, 1],
        }}
        className="group relative"
      >
        <div className="relative rounded-2xl overflow-hidden bg-slate-50/80 dark:bg-white/[0.02] border border-slate-200/40 dark:border-white/[0.04] transition-all duration-500 hover:border-slate-300/60 dark:hover:border-white/[0.08] hover:shadow-lg dark:hover:shadow-none">
          {/* Hover glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-slate-100/50 dark:from-white/[0.02] via-transparent to-transparent" />

          <div className="p-5 sm:p-6">
            {/* Top row: date + category + impact */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <LineReveal delay={baseDelay + 0.1}>
                  <span className="font-mono text-[11px] text-slate-400 dark:text-white/25 tracking-wider">
                    {month}
                  </span>
                </LineReveal>
                <div className="w-px h-3 bg-slate-200 dark:bg-white/[0.06]" />
                <LineReveal delay={baseDelay + 0.15}>
                  <span className="font-mono text-[9px] tracking-[0.2em] text-slate-400/60 dark:text-white/15 uppercase">
                    {categoryLabel[event.category] || event.category}
                  </span>
                </LineReveal>
              </div>
              <ImpactRing score={event.impactScore} />
            </div>

            {/* Title */}
            <LineReveal delay={baseDelay + 0.2}>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white/90 leading-snug tracking-tight">
                {event.title}
              </h3>
            </LineReveal>

            {/* Description — directly visible */}
            <LineReveal delay={baseDelay + 0.28} className="mt-3">
              <p className="text-sm text-slate-500 dark:text-white/30 leading-relaxed font-light">
                {event.description}
              </p>
            </LineReveal>

            {/* Links + event number */}
            <div className="mt-4 flex items-end justify-between gap-4">
              {event.relatedLinks.length > 0 && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: baseDelay + 0.35, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="flex flex-wrap gap-2"
                >
                  {event.relatedLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wide px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/[0.06] text-slate-500 dark:text-white/30 hover:text-slate-800 dark:hover:text-white/60 hover:border-slate-400 dark:hover:border-white/15 transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      {link.label}
                      <svg className="w-3 h-3 opacity-40 group-hover/link:opacity-80 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                      </svg>
                    </a>
                  ))}
                </motion.div>
              )}
              <span className="font-mono text-[9px] text-slate-300 dark:text-white/[0.06] tabular-nums shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Impact Ring — tiny SVG arc ── */
function ImpactRing({ score }: { score: number }) {
  const r = 12;
  const circumference = 2 * Math.PI * r;
  const filled = (score / 10) * circumference;

  return (
    <motion.div
      className="relative w-8 h-8 group/ring"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
    >
      <svg viewBox="0 0 32 32" className="w-full h-full -rotate-90">
        <circle cx="16" cy="16" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-200/50 dark:text-white/[0.04]" />
        <motion.circle
          cx="16" cy="16" r={r}
          fill="none" stroke="currentColor" strokeWidth="1.5"
          strokeLinecap="round"
          className="text-slate-400 dark:text-white/30"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          whileInView={{ strokeDasharray: `${filled} ${circumference}` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[8px] text-slate-400 dark:text-white/20 tabular-nums font-bold">
        {score}
      </span>
    </motion.div>
  );
}
