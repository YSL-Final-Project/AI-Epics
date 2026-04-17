import { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import AdoptionTab from './AdoptionTab';
import StackOverflowTab from './StackOverflowTab';
import CodeGenTab from './CodeGenTab';
import SalaryTab from './SalaryTab';
import YouTab from './YouTab';
import { useI18n } from '../../i18n';
import { TAB_KEYS, TAB_ACCENTS, isTabKey, type TabKey } from './tabConstants';

export default function DataExplorerTabs() {
  const prefersReduced = useReducedMotion();
  const { t } = useI18n();
  const tabLabels = t.dataExplorer.tabs;
  const tabKickers = t.dataExplorer.tabKickers;
  const nav = t.dataExplorer.nav;

  const [activeTab, setActiveTab] = useState<TabKey>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (isTabKey(hash)) return hash;
    }
    return 'adoption';
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const mainBarRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showSticky, setShowSticky] = useState(false);

  const { scrollYProgress } = useScroll({
    target: contentRef,
    offset: ['start center', 'end end'],
  });
  const progressX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  const changeTab = useCallback((key: TabKey) => {
    setActiveTab(key);
    if (typeof window === 'undefined') return;
    const newHash = `#${key}`;
    if (window.location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
    requestAnimationFrame(() => {
      if (rootRef.current) {
        const top = rootRef.current.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({
          top: Math.max(top, 0),
          behavior: prefersReduced ? 'auto' : 'smooth',
        });
      }
    });
  }, [prefersReduced]);

  // External navigation from NextChapterCard etc.
  useEffect(() => {
    const onNav = (e: Event) => {
      const ce = e as CustomEvent<TabKey>;
      if (isTabKey(ce.detail)) changeTab(ce.detail);
    };
    window.addEventListener('dataExplorer:navigate', onNav);
    return () => window.removeEventListener('dataExplorer:navigate', onNav);
  }, [changeTab]);

  // Respond to browser back/forward
  useEffect(() => {
    const onHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (isTabKey(hash) && hash !== activeTab) setActiveTab(hash);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [activeTab]);

  // Keyboard: ← / → / 1-4
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (['input', 'textarea', 'select'].includes(tag)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const idx = TAB_KEYS.indexOf(activeTab);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        changeTab(TAB_KEYS[(idx + 1) % TAB_KEYS.length]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        changeTab(TAB_KEYS[(idx - 1 + TAB_KEYS.length) % TAB_KEYS.length]);
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const target = TAB_KEYS[parseInt(e.key, 10) - 1];
        if (target) changeTab(target);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, changeTab]);

  // Sticky mini bar appears once the main bar has scrolled under the navbar
  useEffect(() => {
    const NAV_HEIGHT = 64;
    const update = () => {
      if (!mainBarRef.current) return;
      const rect = mainBarRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom < NAV_HEIGHT);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const activeIdx = TAB_KEYS.indexOf(activeTab);
  const activeAccent = TAB_ACCENTS[activeTab];

  return (
    <div ref={rootRef}>
      {/* Main chapter navigation — always one row. md+ uses 5-col grid,
          smaller viewports fall back to a horizontally-scrollable flex row so
          nothing ever wraps to a second line. */}
      <div ref={mainBarRef} className="mb-12">
        <div
          className="flex md:grid md:grid-cols-5 gap-2 md:gap-2.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none' }}
        >
          {TAB_KEYS.map((key, i) => {
            const accent = TAB_ACCENTS[key];
            const isActive = activeTab === key;
            const kicker = tabKickers[key];
            return (
              <button
                key={key}
                onClick={() => changeTab(key)}
                className="group relative rounded-2xl p-3.5 md:p-4 text-left transition-all duration-300 border overflow-hidden shrink-0 w-[64vw] max-w-[260px] md:w-auto md:max-w-none snap-start"
                style={{
                  borderColor: isActive ? `${accent}55` : 'rgba(148,163,184,0.18)',
                  backgroundColor: isActive ? `${accent}12` : 'transparent',
                }}
              >
                <div className="flex items-baseline justify-between mb-2 gap-2">
                  <span
                    className="font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
                    style={{ color: isActive ? accent : 'rgba(148,163,184,0.55)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-mono text-[9px] tracking-[0.24em] uppercase transition-colors truncate"
                    style={{
                      color: isActive ? `${accent}cc` : 'rgba(148,163,184,0.4)',
                    }}
                  >
                    {kicker.tag}
                  </span>
                </div>
                <div
                  className={`text-sm md:text-[15px] font-bold leading-tight mb-1 transition-colors truncate ${
                    isActive
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-white/50 group-hover:text-slate-800 dark:group-hover:text-white/80'
                  }`}
                >
                  {tabLabels[key]}
                </div>
                <div className="text-[11px] leading-relaxed text-slate-400 dark:text-white/28 line-clamp-2">
                  {kicker.subtitle}
                </div>
                {isActive && (
                  <motion.div
                    layoutId="data-tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: accent }}
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex mt-5 justify-center gap-8 font-mono text-[9px] tracking-[0.26em] uppercase text-slate-400 dark:text-white/22">
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-slate-300/60 dark:border-white/15 text-slate-500 dark:text-white/40 text-[10px]">←</kbd>
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-slate-300/60 dark:border-white/15 text-slate-500 dark:text-white/40 text-[10px]">→</kbd>
            <span className="ml-1">{nav.keyboardHint1}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-slate-300/60 dark:border-white/15 text-slate-500 dark:text-white/40 text-[10px]">1</kbd>
            <span>—</span>
            <kbd className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded border border-slate-300/60 dark:border-white/15 text-slate-500 dark:text-white/40 text-[10px]">5</kbd>
            <span className="ml-1">{nav.keyboardHint2}</span>
          </span>
        </div>
      </div>

      {/* Sticky mini nav — iOS Dynamic Island styling applied to the bar itself.
          Portaled to <body> to escape PageTransition's scale/filter which
          otherwise becomes the containing block for any `position: fixed`. */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showSticky && (
            <motion.div
              initial={{ y: -18, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -14, opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="fixed top-[72px] left-1/2 z-40 -translate-x-1/2 px-4"
              style={{ willChange: 'transform' }}
            >
              <div
                className="relative flex items-center gap-1 rounded-full border border-white/10 bg-black/90 px-1.5 py-1 backdrop-blur-2xl"
                style={{
                  boxShadow:
                    '0 18px 48px -14px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)',
                }}
              >
                {TAB_KEYS.map((key, i) => {
                  const isActive = activeTab === key;
                  const accent = TAB_ACCENTS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => changeTab(key)}
                      className="relative flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1 transition-colors"
                      style={{
                        color: isActive ? accent : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="di-active-pill"
                          className="absolute inset-0 rounded-full"
                          style={{
                            backgroundColor: `${accent}1f`,
                            border: `1px solid ${accent}66`,
                          }}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative font-mono text-[10px] font-bold tabular-nums tracking-[0.18em] opacity-70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Label: show always on sm+; on mobile, show only the active tab's label to save space */}
                      <span
                        className={`relative text-xs font-semibold whitespace-nowrap ${
                          isActive ? '' : 'hidden sm:inline'
                        }`}
                      >
                        {tabLabels[key]}
                      </span>
                    </button>
                  );
                })}

                {/* Counter badge */}
                <div className="hidden sm:flex items-center ml-1 pl-2.5 pr-2 border-l border-white/10">
                  <span className="font-mono text-[9px] tabular-nums tracking-[0.22em] text-white/40">
                    <span className="text-white/80">{activeIdx + 1}</span>
                    <span className="mx-1">/</span>
                    <span>5</span>
                  </span>
                </div>

                {/* Progress sliver — thin line hugging the bottom of the capsule */}
                <div className="pointer-events-none absolute inset-x-4 -bottom-[3px] h-[2px] overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    className="h-full origin-left rounded-full"
                    style={{ scaleX: progressX, backgroundColor: activeAccent }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Tab Content */}
      <div ref={contentRef} className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={prefersReduced ? false : { opacity: 0, y: 32, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -18, filter: 'blur(4px)' }}
            transition={{ duration: 0.65, ease: [0.32, 0.72, 0, 1] }}
          >
            {activeTab === 'adoption' && <AdoptionTab />}
            {activeTab === 'stackoverflow' && <StackOverflowTab />}
            {activeTab === 'codegen' && <CodeGenTab />}
            {activeTab === 'salary' && <SalaryTab />}
            {activeTab === 'you' && <YouTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
