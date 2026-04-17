import { motion, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import LineReveal from '../../components/animations/LineReveal';
import CodeQuiz from '../interactive/CodeQuiz';
import PredictionVote from '../interactive/PredictionVote';
import NextChapterCard from './NextChapterCard';
import ChapterDots from '../ChapterDots';

const ACCENT = '#f59e0b';

export default function YouTab() {
  const { theme } = useTheme();
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();
  const isDark = theme === 'dark';
  const y = t.dataExplorer.you;

  const chapters = [
    { id: 'you-trust', label: y.chapterDots.trust },
    { id: 'you-verdict', label: y.chapterDots.verdict },
  ];

  return (
    <div className="space-y-12">
      <ChapterDots chapters={chapters} accentColor={ACCENT} />

      {/* Hero — amber gradient card, consistent with other tabs */}
      <div
        className="relative overflow-hidden rounded-[2rem] border p-8 md:p-12"
        style={{
          background: isDark
            ? 'linear-gradient(140deg, rgba(245,158,11,0.16) 0%, rgba(217,119,6,0.05) 40%, rgba(15,23,42,0) 100%)'
            : 'linear-gradient(140deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.03) 45%, rgba(255,255,255,0.6) 100%)',
          borderColor: isDark ? 'rgba(245,158,11,0.16)' : 'rgba(245,158,11,0.10)',
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative max-w-3xl">
          <LineReveal className="mb-4">
            <span
              className="font-mono text-[10px] tracking-[0.45em] uppercase"
              style={{ color: isDark ? 'rgba(245,158,11,0.55)' : 'rgba(217,119,6,0.85)' }}
            >
              {y.heroKicker}
            </span>
          </LineReveal>
          <LineReveal delay={0.08}>
            <h2
              className="text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-tight leading-[1.02] bg-clip-text text-transparent"
              style={{
                backgroundImage: isDark
                  ? 'linear-gradient(135deg, #ffffff 12%, #fbbf24 60%, #d97706 100%)'
                  : 'linear-gradient(135deg, #0f172a 0%, #b45309 100%)',
              }}
            >
              {y.heroTitle}
            </h2>
          </LineReveal>
          <LineReveal delay={0.18} className="mt-6">
            <p className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-white/50 max-w-2xl">
              {y.heroCopy}
            </p>
          </LineReveal>
        </div>
      </div>

      {/* §1 Trust Test */}
      <motion.section
        id="you-trust"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span style={{ color: ACCENT }} className="font-mono text-xs mr-2">01</span>
              {y.trustTitle}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="mb-6 max-w-3xl">
          <LineReveal delay={0.05}>
            <p
              className="text-xl md:text-2xl font-light italic leading-snug text-slate-800 dark:text-white/78"
              style={{ color: isDark ? undefined : '#0f172a' }}
            >
              {y.trustKicker}
            </p>
          </LineReveal>
          <LineReveal delay={0.12} className="mt-3">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/45">
              {y.trustIntro}
            </p>
          </LineReveal>
        </div>

        <div
          className="rounded-[1.75rem] border p-5 sm:p-8"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.82)',
            borderColor: isDark ? 'rgba(245,158,11,0.14)' : 'rgba(245,158,11,0.12)',
          }}
        >
          <CodeQuiz />
        </div>
      </motion.section>

      {/* §2 Verdict */}
      <motion.section
        id="you-verdict"
        initial={prefersReduced ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      >
        <div className="flex items-baseline gap-3 mb-6">
          <LineReveal>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white/80 tracking-tight">
              <span style={{ color: ACCENT }} className="font-mono text-xs mr-2">02</span>
              {y.verdictTitle}
            </h3>
          </LineReveal>
          <div className="flex-1 h-px bg-slate-200/40 dark:bg-white/[0.04]" />
        </div>

        <div className="mb-6 max-w-3xl">
          <LineReveal delay={0.05}>
            <p className="text-xl md:text-2xl font-light italic leading-snug text-slate-800 dark:text-white/78">
              {y.verdictKicker}
            </p>
          </LineReveal>
          <LineReveal delay={0.12} className="mt-3">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-white/45">
              {y.verdictIntro}
            </p>
          </LineReveal>
        </div>

        <div
          className="rounded-[1.75rem] border p-5 sm:p-8"
          style={{
            backgroundColor: isDark ? 'rgba(255,255,255,0.015)' : 'rgba(255,255,255,0.82)',
            borderColor: isDark ? 'rgba(245,158,11,0.14)' : 'rgba(245,158,11,0.12)',
          }}
        >
          <PredictionVote />
        </div>
      </motion.section>

      <NextChapterCard current="you" />
    </div>
  );
}
