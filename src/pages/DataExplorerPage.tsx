import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import DataExplorerTabs from '../components/dataExplorer/DataExplorerTabs';
import LiquidLinesBackground from '../components/LiquidLinesBackground';
import { insightBgConfig } from '../components/liquidLinesConfig';
import { useI18n } from '../i18n';

export default function DataExplorerPage() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  return (
    <>
      {/*
        Cursor-reactive liquid-lines background. Rendered as a sibling of
        PageTransition (not inside it) because PageTransition applies
        `scale` and `filter` to its child, which would otherwise become
        the containing block for this `position: fixed` canvas and pin
        it to the page wrapper instead of the viewport.
        All visual tuning lives in `src/components/liquidLinesConfig.ts`.
      */}
      <LiquidLinesBackground {...insightBgConfig} />
    <PageTransition>
      <div className="relative z-10 min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero — minimal, animated */}
          <div className="text-center mb-14">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-[10px] tracking-[0.6em] text-slate-400/50 dark:text-white/20 uppercase mb-6"
            >
              Data
            </motion.p>
            <div className="overflow-hidden">
              <motion.h1
                initial={prefersReduced ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ delay: 0.3, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
                className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-slate-900 dark:text-white tracking-[-0.03em] leading-[0.95]"
              >
                {t.dataExplorer.title}
              </motion.h1>
            </div>
          </div>
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          >
            <DataExplorerTabs />
          </motion.div>
        </div>
      </div>
    </PageTransition>
    </>
  );
}
