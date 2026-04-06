import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';

interface Section {
  id: string;
  number: string;
  labelKey: string;
}

interface Props {
  sections: Section[];
  activeSection: string;
  onNavigate: (id: string) => void;
  heroVisible: boolean;
}

export default function SectionNav({ sections, activeSection, onNavigate, heroVisible }: Props) {
  const { t } = useI18n();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawer on outside click
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Close drawer on ESC
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawerOpen]);

  const handleNav = (id: string) => {
    onNavigate(id);
    setDrawerOpen(false);
  };

  // Don't show when hero is visible
  if (heroVisible) return null;

  const sectionItems = sections.filter(s => s.id !== 'hero');

  // ── MOBILE: bottom floating button + drawer ──
  if (isMobile) {
    return (
      <>
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => setDrawerOpen(true)}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 rounded-full
                     bg-[#1a1a1a]/90 backdrop-blur-md border border-[#2a2520] shadow-lg
                     text-[#8a8580] text-xs tracking-wide uppercase active:scale-95 transition-transform"
          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="2" y1="4" x2="14" y2="4" />
            <line x1="2" y1="8" x2="14" y2="8" />
            <line x1="2" y1="12" x2="14" y2="12" />
          </svg>
          Sections
        </motion.button>

        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                ref={drawerRef}
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-[#1a1a1a] border-t border-[#2a2520] p-6 pb-10"
              >
                {/* Drag handle */}
                <div className="w-10 h-1 rounded-full bg-[#2a2520] mx-auto mb-6" />

                <div className="space-y-1">
                  {sectionItems.map((sec) => {
                    const isActive = sec.id === activeSection;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => handleNav(sec.id)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-left transition-colors ${
                          isActive ? 'bg-[#d4a853]/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className={`text-sm font-mono ${isActive ? 'text-[#d4a853]' : 'text-[#5a5550]'}`}>
                          {sec.number}
                        </span>
                        <span
                          className={`text-sm font-medium ${isActive ? 'text-[#d4a853]' : 'text-[#8a8580]'}`}
                          style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                        >
                          {t.toolEvolution.sectionNames[sec.labelKey as keyof typeof t.toolEvolution.sectionNames]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ── DESKTOP: fixed left sidebar ──
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40"
    >
      <div className="bg-[#1a1a1a]/80 backdrop-blur-md border border-[#2a2520] rounded-xl p-2 space-y-1">
        {sectionItems.map((sec) => {
          const isActive = sec.id === activeSection;
          return (
            <button
              key={sec.id}
              onClick={() => handleNav(sec.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-300 w-full group ${
                isActive ? 'bg-[#0d0d0d]/60' : 'hover:bg-[#0d0d0d]/30'
              }`}
            >
              {/* Gold bar indicator */}
              <div className={`w-[3px] h-5 rounded-full transition-colors duration-300 ${
                isActive ? 'bg-[#d4a853]' : 'bg-transparent group-hover:bg-[#2a2520]'
              }`} />

              <span className={`text-xs font-mono transition-colors duration-300 ${
                isActive ? 'text-[#d4a853]' : 'text-[#5a5550]'
              }`}>
                {sec.number}
              </span>

              <span
                className={`text-xs font-medium transition-all duration-300 whitespace-nowrap overflow-hidden ${
                  isActive
                    ? 'text-[#e8e4df] max-w-[120px] opacity-100'
                    : 'text-[#5a5550] max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100'
                }`}
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                {t.toolEvolution.sectionNames[sec.labelKey as keyof typeof t.toolEvolution.sectionNames]}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
