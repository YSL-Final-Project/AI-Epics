import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../i18n';
import eras from '../data/tool_evolution';
import SectionNav from '../components/toolEvolution/SectionNav';
import SectionHeader from '../components/toolEvolution/SectionHeader';
import ToolCard from '../components/toolEvolution/ToolCard';
import AutocompleteDemo from '../components/toolEvolution/AutocompleteDemo';
import CopilotDemo from '../components/toolEvolution/CopilotDemo';
import ChatDemo from '../components/toolEvolution/ChatDemo';
import AgentDemo from '../components/toolEvolution/AgentDemo';
import AgentLoop from '../components/agentLoop/AgentLoop';
import PageTransition from '../components/layout/PageTransition';

const sections = [
  { id: 'hero', number: '00', labelKey: 'hero' },
  { id: 'autocomplete', number: '01', labelKey: 'autocomplete' },
  { id: 'copilot', number: '02', labelKey: 'copilot' },
  { id: 'chat', number: '03', labelKey: 'chat' },
  { id: 'agent', number: '04', labelKey: 'agent' },
];

const demoComponents: Record<string, React.FC> = {
  autocomplete: AutocompleteDemo,
  copilot: CopilotDemo,
  chat: ChatDemo,
  agent: AgentDemo,
};

export default function ToolEvolutionPage() {
  const { t, lang } = useI18n();
  const [activeSection, setActiveSection] = useState('hero');
  const [heroVisible, setHeroVisible] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Track hero visibility for SectionNav
  useEffect(() => {
    const hero = document.getElementById('te-hero');
    if (!hero) return;
    const obs = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(hero);
    return () => obs.disconnect();
  }, []);

  // Track active section
  useEffect(() => {
    const els = sections
      .filter(s => s.id !== 'hero')
      .map(s => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { threshold: 0.15, rootMargin: '-10% 0px -60% 0px' }
    );

    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const navigateToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const setRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    sectionRefs.current[id] = el;
  }, []);

  const te = t.toolEvolution;

  return (
    <>
      {/* Left sidebar / mobile drawer nav — outside PageTransition to keep fixed positioning */}
      <SectionNav
        sections={sections}
        activeSection={activeSection}
        onNavigate={navigateToSection}
        heroVisible={heroVisible}
      />
    <PageTransition>

      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section
        id="te-hero"
        ref={setRef('hero')}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
      >
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(212,168,83,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(212,168,83,0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl"
        >
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-[#e8e4df] mb-2 tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            {te.heroTitle1}
          </h1>
          <h1
            className="text-5xl sm:text-6xl lg:text-8xl font-bold text-[#d4a853] mb-8 tracking-tight"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
          >
            {te.heroTitle2}
          </h1>

          <p
            className="text-lg sm:text-xl text-[#8a8580] max-w-2xl mx-auto mb-12 leading-relaxed"
            style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
          >
            {te.subtitle}
          </p>

          {/* Hero stats — golden large numbers */}
          <div className="relative z-10 mt-10 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
            {te.heroStats.map((stat: { value: string; label: string }, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="text-center"
              >
                <div
                  className="text-3xl sm:text-4xl md:text-6xl font-bold text-[#d4a853] tabular-nums"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs sm:text-sm text-[#5a5550] uppercase tracking-wider mt-1"
                  style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll CTA */}
          <motion.button
            onClick={() => navigateToSection('autocomplete')}
            className="mt-12 sm:mt-16 px-6 py-3 rounded-full border border-[#d4a853]/40 text-[#d4a853] text-sm uppercase tracking-widest hover:bg-[#d4a853]/10 transition-colors"
            style={{ fontFamily: '"Space Grotesk", sans-serif' }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {te.startExploring} ↓
          </motion.button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          ERA SECTIONS (01–04)
          ═══════════════════════════════════════════ */}
      {eras.map((era) => {
        const DemoComponent = demoComponents[era.key];
        return (
          <section
            key={era.id}
            id={era.key}
            ref={setRef(era.key)}
            className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 max-w-5xl mx-auto"
          >
            <SectionHeader
              number={String(era.id).padStart(2, '0')}
              title={te.eras[era.key as keyof typeof te.eras]}
              subtitle={te.descriptions[era.key as keyof typeof te.descriptions]}
            />

            {/* Two-column: Interactive demo + Tools & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left: Interactive demo (3/5) */}
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {DemoComponent && <DemoComponent />}
                </motion.div>
              </div>

              {/* Right: Tools + Stats (2/5) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Representative tools */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-3"
                >
                  <h3
                    className="text-xs text-[#d4a853]/70 uppercase tracking-widest font-semibold"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {te.toolsLabel}
                  </h3>
                  {era.tools.map((tool, i) => (
                    <ToolCard key={tool.name} tool={tool} index={i} />
                  ))}
                </motion.div>

                {/* Key stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3
                    className="text-xs text-[#d4a853]/70 uppercase tracking-widest font-semibold"
                    style={{ fontFamily: '"Space Grotesk", sans-serif' }}
                  >
                    {te.statsLabel}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {era.stats.map((stat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#1a1a1a]/50 border border-[#2a2520]"
                      >
                        <span className="text-sm text-[#8a8580]">
                          {lang === 'zh' ? stat.label.zh : stat.label.en}
                        </span>
                        <span className="text-sm font-bold text-[#d4a853] font-mono">
                          {stat.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Agent Loop — only in the agent era section */}
            {era.key === 'agent' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-12"
              >
                <AgentLoop />
              </motion.div>
            )}
          </section>
        );
      })}

      {/* ═══════════════════════════════════════════
          CLOSING SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4a853]/50 to-transparent mx-auto" />

          {/* Role evolution summary */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {['🚗 → ⌨️', '🧑‍✈️ → 🤖', '❓ → 💬', '🔍 → 🧠'].map((pair, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0 }}
                transition={{ delay: i * 0.15 }}
                className="px-3 py-1.5 rounded-full bg-[#1a1a1a]/50 border border-[#2a2520] text-base"
              >
                {pair}
              </motion.span>
            ))}
          </div>

          <p
            className="text-[#8a8580] leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: '"Source Serif 4", Georgia, serif' }}
          >
            {te.insightText}
          </p>
        </motion.div>
      </section>
    </PageTransition>
    </>

  );
}
