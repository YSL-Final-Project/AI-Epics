import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import RacingBarChart from '../components/compare/RacingBarChart';
import RadarCompare from '../components/compare/RadarCompare';
import ToolCompareTable from '../components/compare/ToolCompareTable';
import IDEMarketChart from '../components/compare/IDEMarketChart';

function LineReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={prefersReduced ? false : { y: '105%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function ScaleReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={prefersReduced ? false : { opacity: 0, scale: 0.95, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  );
}

const sections = [
  { label: '01', title: 'Racing', Component: RacingBarChart },
  { label: '02', title: 'Radar', Component: RadarCompare },
  { label: '03', title: 'Battle', Component: ToolCompareTable },
  { label: '04', title: 'IDE', Component: IDEMarketChart },
];

export default function ComparePage() {
  const prefersReduced = useReducedMotion();

  return (
    <PageTransition>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero — minimal */}
          <div className="text-center mb-20">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-[10px] tracking-[0.6em] text-slate-400/50 dark:text-white/20 uppercase mb-6"
            >
              Compare
            </motion.p>
            <LineReveal className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-slate-900 dark:text-white tracking-[-0.03em] leading-[0.95]">
              技术竞技场
            </LineReveal>
          </div>

          {/* Sections */}
          {sections.map((section, i) => (
            <section key={section.label} className="mb-20">
              <div className="flex items-baseline gap-4 mb-6">
                <LineReveal delay={0}>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
                    {section.label}
                  </span>
                </LineReveal>
                <LineReveal delay={0.05}>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white/80 tracking-tight">
                    {section.title}
                  </h2>
                </LineReveal>
                <motion.div
                  initial={prefersReduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                  className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04] origin-left"
                />
              </div>

              <ScaleReveal delay={i * 0.03}>
                <div className="rounded-2xl p-5 sm:p-8 bg-slate-50/50 dark:bg-white/[0.015] border border-slate-200/30 dark:border-white/[0.03]">
                  <section.Component />
                </div>
              </ScaleReveal>
            </section>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
