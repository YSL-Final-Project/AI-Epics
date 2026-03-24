import { motion, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import CodeQuiz from '../components/interactive/CodeQuiz';
import PredictionVote from '../components/interactive/PredictionVote';
import ToolRecommender from '../components/interactive/ToolRecommender';
import LineReveal from '../components/animations/LineReveal';
import ScaleReveal from '../components/animations/ScaleReveal';
import { useI18n } from '../i18n';

const sections = [
  { id: 'quiz', label: '01', title: 'Code Quiz', Component: CodeQuiz },
  { id: 'vote', label: '02', title: 'Predict', Component: PredictionVote },
  { id: 'recommend', label: '03', title: 'Recommend', Component: ToolRecommender },
];

export default function InteractivePage() {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  return (
    <PageTransition>
      <div className="min-h-screen py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-20">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-mono text-[10px] tracking-[0.6em] text-slate-400/50 dark:text-white/20 uppercase mb-6"
            >
              Interactive
            </motion.p>
            <LineReveal className="text-[clamp(2.5rem,8vw,4.5rem)] font-black text-slate-900 dark:text-white tracking-[-0.03em] leading-[0.95]">
              {t.interactive.title}
            </LineReveal>
          </div>

          {/* Sections */}
          {sections.map((section, i) => (
            <section key={section.id} className="mb-20">
              {/* Section header — asymmetric */}
              <div className="flex items-baseline gap-4 mb-6">
                <LineReveal delay={i * 0.05}>
                  <span className="font-mono text-[10px] tracking-[0.3em] text-slate-400/40 dark:text-white/10 uppercase">
                    {section.label}
                  </span>
                </LineReveal>
                <LineReveal delay={i * 0.05 + 0.05}>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white/80 tracking-tight">
                    {section.title}
                  </h2>
                </LineReveal>
                <motion.div
                  initial={prefersReduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 + 0.15, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                  className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04] origin-left"
                />
              </div>

              <ScaleReveal delay={i * 0.05 + 0.1}>
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
