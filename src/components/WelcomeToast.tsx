import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useI18n } from '../i18n';

const DURATION = 6000; // ms before auto-dismiss

export default function WelcomeToast() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const visited = localStorage.getItem('aice_visited');
      if (!visited) {
        const t = setTimeout(() => {
          setShow(true);
          localStorage.setItem('aice_visited', '1');
        }, 1800);
        return () => clearTimeout(t);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => setShow(false), DURATION);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 72, scale: 0.88 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="fixed bottom-6 right-6 z-[9990] w-[320px] glass rounded-2xl overflow-hidden shadow-2xl dark:shadow-black/40"
        >
          {/* Gradient border top */}
          <div className="h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500" />

          <div className="p-4 relative">
            <div className="flex items-start gap-3">
              {/* Animated icon */}
              <motion.div
                className="text-2xl shrink-0 mt-0.5"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                👋
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 dark:text-white text-sm leading-snug">
                  {t.welcome.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {t.welcome.desc}
                </p>

                {/* Tags */}
                <div className="flex gap-1.5 mt-2 flex-wrap">
                  {t.welcome.tags.map((tag, i) => (
                    <motion.span
                      key={tag}
                      initial={prefersReduced ? false : { opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 400 }}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-medium"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Close */}
              <button
                onClick={() => setShow(false)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-lg leading-none mt-0.5"
                aria-label={t.welcome.close}
              >
                ×
              </button>
            </div>
          </div>

          {/* Countdown progress */}
          <motion.div
            className="h-[2px] bg-gradient-to-r from-cyan-500 to-violet-500 origin-left"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: DURATION / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
