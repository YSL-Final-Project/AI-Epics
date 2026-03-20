import { motion, useReducedMotion } from 'framer-motion';
import type { TimelineEvent } from '../../types';

interface TimelineDetailProps {
  event: TimelineEvent;
  onClose: () => void;
}

export default function TimelineDetail({ event, onClose }: TimelineDetailProps) {
  const prefersReduced = useReducedMotion();

  const r = 36;
  const circumference = 2 * Math.PI * r;
  const filled = (event.impactScore / 10) * circumference;

  // Truncate description to ~60 chars
  const shortDesc = event.description.length > 80
    ? event.description.slice(0, 80) + '…'
    : event.description;

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, height: 0, filter: 'blur(6px)' }}
      animate={{ opacity: 1, height: 'auto', filter: 'blur(0px)' }}
      exit={{ opacity: 0, height: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
      className="overflow-hidden"
    >
      <div className="mt-2 rounded-2xl p-6 bg-slate-50/60 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Left: impact visualization */}
          <div className="shrink-0">
            <div className="relative w-20 h-20">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r={r} fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200/40 dark:text-white/[0.04]" />
                <motion.circle
                  cx="40" cy="40" r={r}
                  fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round"
                  className="text-slate-500 dark:text-white/40"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray: `${filled} ${circumference}` }}
                  transition={{ duration: 1.2, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-slate-700 dark:text-white/60 tabular-nums leading-none">
                  {event.impactScore}
                </span>
                <span className="font-mono text-[7px] tracking-[0.2em] text-slate-400/50 dark:text-white/15 uppercase mt-0.5">
                  Impact
                </span>
              </div>
            </div>
          </div>

          {/* Right: brief text + links */}
          <div className="flex-1 min-w-0">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="text-sm text-slate-500 dark:text-white/30 leading-relaxed font-light"
            >
              {shortDesc}
            </motion.p>

            {event.relatedLinks.length > 0 && (
              <motion.div
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                className="flex flex-wrap gap-2 mt-4"
              >
                {event.relatedLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link inline-flex items-center gap-1.5 text-[11px] font-mono tracking-wide px-3 py-1.5 rounded-full border border-slate-200/50 dark:border-white/[0.06] text-slate-500 dark:text-white/30 hover:text-slate-800 dark:hover:text-white/60 hover:border-slate-400 dark:hover:border-white/15 transition-all duration-300 hover:scale-105 active:scale-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-40 group-hover/link:opacity-80 transition-all duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Close */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-4 pt-3 border-t border-slate-200/20 dark:border-white/[0.02] flex justify-end"
        >
          <button
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="font-mono text-[9px] tracking-[0.3em] text-slate-400/50 dark:text-white/15 uppercase hover:text-slate-600 dark:hover:text-white/40 transition-all duration-300 hover:tracking-[0.4em]"
          >
            Close ×
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
