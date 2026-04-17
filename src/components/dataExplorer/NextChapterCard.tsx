import { motion, useReducedMotion } from 'framer-motion';
import { useI18n } from '../../i18n';
import { TAB_KEYS, TAB_ACCENTS, type TabKey } from './tabConstants';

function dispatchNavigate(key: TabKey) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<TabKey>('dataExplorer:navigate', { detail: key }));
}

export default function NextChapterCard({ current }: { current: TabKey }) {
  const { t } = useI18n();
  const prefersReduced = useReducedMotion();

  const idx = TAB_KEYS.indexOf(current);
  const nextIdx = (idx + 1) % TAB_KEYS.length;
  const nextKey = TAB_KEYS[nextIdx];
  const isLoopBack = nextIdx === 0;
  const accent = TAB_ACCENTS[nextKey];

  const nav = t.dataExplorer.nav;
  const tabLabels = t.dataExplorer.tabs;
  const kicker = t.dataExplorer.tabKickers[nextKey];

  const kickerText = isLoopBack ? nav.backToStart : nav.continue;

  return (
    <motion.button
      type="button"
      onClick={() => dispatchNavigate(nextKey)}
      initial={prefersReduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      whileHover={prefersReduced ? undefined : { y: -2 }}
      className="group relative w-full text-left rounded-[2rem] border p-7 md:p-9 overflow-hidden mt-12"
      style={{
        borderColor: `${accent}33`,
        background: `linear-gradient(135deg, ${accent}0f 0%, transparent 60%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          color: accent,
        }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div
            className="font-mono text-[10px] tracking-[0.4em] uppercase mb-3"
            style={{ color: accent }}
          >
            {kickerText}
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span
              className="font-mono text-[11px] tracking-[0.3em] uppercase"
              style={{ color: `${accent}cc` }}
            >
              {String(nextIdx + 1).padStart(2, '0')} / {kicker.tag}
            </span>
          </div>
          <div className="mt-2 text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {tabLabels[nextKey]}
          </div>
          <div className="mt-2 text-sm text-slate-500 dark:text-white/45 leading-relaxed max-w-xl">
            {kicker.subtitle}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span
            className="font-mono text-[10px] tracking-[0.28em] uppercase hidden md:inline"
            style={{ color: `${accent}99` }}
          >
            {nav.nextChapter}
          </span>
          <motion.span
            aria-hidden
            className="inline-flex items-center justify-center w-12 h-12 rounded-full border"
            style={{
              borderColor: `${accent}55`,
              color: accent,
              backgroundColor: `${accent}0f`,
            }}
            animate={prefersReduced ? undefined : { x: [0, 4, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 9h10" />
              <path d="M10 5l4 4-4 4" />
            </svg>
          </motion.span>
        </div>
      </div>
    </motion.button>
  );
}
