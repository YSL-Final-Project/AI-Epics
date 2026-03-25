import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import RacingBarChart from '../components/compare/RacingBarChart';
import RadarCompare from '../components/compare/RadarCompare';
import ToolCompareTable from '../components/compare/ToolCompareTable';
import IDEMarketChart from '../components/compare/IDEMarketChart';
import LineReveal from '../components/animations/LineReveal';
import CursorSpotlight from '../components/compare/CursorSpotlight';
import { useI18n } from '../i18n';

export default function ComparePage() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  return (
    <PageTransition>
      <CursorSpotlight />
      <div className="min-h-screen">
        {/* Hero */}
        <div className="text-center pt-16 mb-20 px-4">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-mono text-[10px] tracking-[0.6em] text-slate-400/50 dark:text-white/20 uppercase mb-6"
          >
            Compare
          </motion.p>
          <LineReveal className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-slate-900 dark:text-white tracking-[-0.03em] leading-[0.95]">
            {t.compare.title}
          </LineReveal>
          <motion.p
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-4 text-base text-slate-400 dark:text-white/20 font-light"
          >
            {t.compare.subtitle}
          </motion.p>
        </div>

        {/* Section 01: Racing Bar Chart — 500vh scroll-driven */}
        <RacingBarChart />

        {/* Section 02: Radar Compare — 250vh scroll-driven */}
        <RadarCompare />

        {/* Section 03: Tool Compare — viewport-triggered */}
        <div className="max-w-5xl mx-auto px-6">
          <ToolCompareTable />
        </div>

        {/* Section 04: IDE Market Chart — 300vh scroll-driven */}
        <IDEMarketChart />
      </div>
    </PageTransition>
  );
}
