import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StoryNav from '../components/story/StoryNav';
import Starfield from '../components/story/Starfield';
import GlitchText from '../components/story/GlitchText';
import { Link } from 'react-router-dom';
import SlideFrame from '../components/story/SlideFrame';
import StorySlide from '../components/story/StorySlide';
import DualWaveText from '../components/story/DualWaveText';
import { useI18n } from '../i18n';

/* ══════════════════════════════════════════════════════════════════════════
   STORY PAGE — Slide-by-slide presentation with glowing frame
   Each section is a full-viewport snap-scroll slide.
══════════════════════════════════════════════════════════════════════════ */

export default function StoryPage() {
  const { t } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(1);
  const TOTAL_SLIDES = 22;

  return (
    <div className="dark">
      <div
        className="bg-[#0a0a0f] text-white h-screen selection:bg-cyan-500/30"
        style={{ overflowY: 'auto', overflowX: 'hidden', scrollSnapType: 'y mandatory' }}
      >
        <Starfield density={50} speed={0.12} />
        <StoryNav />
        <SlideFrame current={currentSlide} total={TOTAL_SLIDES} />

        {/* ═══ 1: OVERTURE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(1)}>
          {(active) => <Overture active={active} />}
        </StorySlide>

        {/* ═══ 2: NARRATIVE — Before AI ═══ */}
        <StorySlide onActive={() => setCurrentSlide(2)}>
          {(active) => (
            <NarrativeSlide
              active={active}
              text={t.story.break1}
              subtext={t.story.break1Sub}
              ribbon="BEFORE AI"
            />
          )}
        </StorySlide>

        {/* ═══ 3: CH1 TITLE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(3)}>
          {(active) => (
            <ChapterTitleSlide active={active} chapter="Chapter 01" title={t.story.ch1Title} subtitle={t.story.ch1Subtitle} />
          )}
        </StorySlide>

        {/* ═══ 4: TIMELINE CARDS ═══ */}
        <StorySlide onActive={() => setCurrentSlide(4)}>
          {(active) => <TimelineSlide active={active} />}
        </StorySlide>

        {/* ═══ 5: SO TRAFFIC RISING ═══ */}
        <StorySlide onActive={() => setCurrentSlide(5)}>
          {(active) => <SOTrafficSlide active={active} />}
        </StorySlide>

        {/* ═══ 6: NARRATIVE — ChatGPT ═══ */}
        <StorySlide onActive={() => setCurrentSlide(6)}>
          {(active) => (
            <NarrativeSlide active={active} text={t.story.break2} subtext={t.story.break2Sub} glitch ribbon="CHATGPT" />
          )}
        </StorySlide>

        {/* ═══ 7: CH2 TITLE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(7)}>
          {(active) => (
            <ChapterTitleSlide active={active} chapter="Chapter 02" title={t.story.ch2Title} subtitle={t.story.ch2Subtitle} />
          )}
        </StorySlide>

        {/* ═══ 8: THE DATE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(8)}>
          {(active) => <TheDateSlide active={active} />}
        </StorySlide>

        {/* ═══ 9: SO CRASH ═══ */}
        <StorySlide onActive={() => setCurrentSlide(9)}>
          {(active) => <HeroStatSlide active={active} value={55} suffix="%" label={t.story.soTrafficCrash} sublabel={t.story.soTrafficCrashSub} />}
        </StorySlide>

        {/* ═══ 10: 40% AI CODE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(10)}>
          {(active) => <HeroStatSlide active={active} value={40} suffix="%" label={t.story.aiCodeOnGithub} sublabel={t.story.aiCodeConfirm} />}
        </StorySlide>

        {/* ═══ 11: INDUSTRY BARS ═══ */}
        <StorySlide onActive={() => setCurrentSlide(11)}>
          {(active) => <IndustryBarsSlide active={active} />}
        </StorySlide>

        {/* ═══ 12: KEY EVENTS ═══ */}
        <StorySlide onActive={() => setCurrentSlide(12)}>
          {(active) => <EventCascadeSlide active={active} />}
        </StorySlide>

        {/* ═══ 13: CH2 CLOSING ═══ */}
        <StorySlide onActive={() => setCurrentSlide(13)}>
          {(active) => (
            <NarrativeSlide active={active} text={t.story.ch2Closing} subtext={t.story.ch2ClosingSub} />
          )}
        </StorySlide>

        {/* ═══ 14: DUAL WAVE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(14)}>
          <div className="w-full">
            <DualWaveText />
          </div>
        </StorySlide>

        {/* ═══ 15: NARRATIVE — Human vs Machine ═══ */}
        <StorySlide onActive={() => setCurrentSlide(15)}>
          {(active) => (
            <NarrativeSlide active={active} text={t.story.break3} subtext={t.story.break3Sub} ribbon="HUMAN vs MACHINE" />
          )}
        </StorySlide>

        {/* ═══ 16: CH3 TITLE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(16)}>
          {(active) => (
            <ChapterTitleSlide active={active} chapter="Chapter 03" title={t.story.ch3Title} subtitle={t.story.ch3Subtitle} />
          )}
        </StorySlide>

        {/* ═══ 17: SALARY DIVIDE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(17)}>
          {(active) => <HeroStatSlide active={active} value={3} suffix="x" label={t.story.salaryGap} sublabel={t.story.salaryGapSub} />}
        </StorySlide>

        {/* ═══ 18: JOB DECLINE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(18)}>
          {(active) => <JobDeclineSlide active={active} />}
        </StorySlide>

        {/* ═══ 19: IDE REVOLUTION ═══ */}
        <StorySlide onActive={() => setCurrentSlide(19)}>
          {(active) => <IDERevolutionSlide active={active} />}
        </StorySlide>

        {/* ═══ 20: DISTILLATION ILLUSTRATION ═══ */}
        <StorySlide onActive={() => setCurrentSlide(20)}>
          {(active) => (
            <div className="px-6 sm:px-12 max-w-5xl w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                className="relative rounded-xl overflow-hidden border border-white/[0.06]"
                style={{ boxShadow: '0 0 60px rgba(6,182,212,0.08), 0 0 120px rgba(139,92,246,0.04)' }}
              >
                <img
                  src="/distillation.png"
                  alt="Ultimate Optimization: From Colleagues to Data Assets"
                  className="w-full h-auto"
                  loading="lazy"
                />
                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/60 via-transparent to-[#0a0a0f]/30 pointer-events-none" />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mt-4 text-center text-[10px] font-mono text-white/15 tracking-[0.2em]"
              >
                THE SO-CALLED "GRADUATION" IS NOTHING BUT EFFICIENT ASSET STRIPPING
              </motion.p>
            </div>
          )}
        </StorySlide>

        {/* ═══ 21: BRANCHING MOMENT ═══ */}
        <StorySlide onActive={() => setCurrentSlide(21)} noAnimation>
          <BranchingMoment />
        </StorySlide>

        {/* ═══ 22: EPILOGUE ═══ */}
        <StorySlide onActive={() => setCurrentSlide(22)} noAnimation>
          <Epilogue />
        </StorySlide>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  SLIDE CONTENT COMPONENTS                            */
/* ──────────────────────────────────────────────────── */

function Overture({ active }: { active: boolean }) {
  const codeText = 'function future() { return human + AI; }';
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (!active) return;
    setTyped('');
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setTyped(codeText.slice(0, i));
      if (i >= codeText.length) clearInterval(iv);
    }, 50);
    return () => clearInterval(iv);
  }, [active]);

  return (
    <div className="text-center px-8 max-w-3xl">
      <code className="text-lg sm:text-2xl md:text-3xl font-mono text-cyan-400/80 tracking-wide">
        {typed}
        <span className="inline-block w-[2px] h-[1.2em] bg-cyan-400 ml-0.5 align-middle animate-pulse" />
      </code>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 2, duration: 1 }}
        className="mt-16"
      >
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter">
          <span className="bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent">The AI</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Code Era</span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/25 font-extralight tracking-wide">
          {useI18n().t.story.overtureSubtitle}
        </p>
      </motion.div>
    </div>
  );
}

function NarrativeSlide({ active, text, subtext, glitch = false, ribbon }: {
  active: boolean; text: string; subtext: string; glitch?: boolean; ribbon?: string;
}) {
  return (
    <div className="text-center px-8 max-w-2xl relative">
      {/* Ribbon background text */}
      {ribbon && (
        <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none -mx-[50vw]">
          <p className="text-[clamp(2rem,6vw,5rem)] font-black text-white/[0.02] tracking-tight whitespace-nowrap select-none">
            {`${ribbon} · `.repeat(6)}
          </p>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {glitch ? (
          <GlitchText text={text} className="text-2xl sm:text-4xl font-light text-white/60 leading-relaxed" />
        ) : (
          <p className="text-2xl sm:text-4xl font-light text-white/80 leading-relaxed">{text}</p>
        )}
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-6 text-lg sm:text-xl text-white/30 font-extralight"
      >
        {subtext}
      </motion.p>
    </div>
  );
}

function ChapterTitleSlide({ active, chapter, title, subtitle }: {
  active: boolean; chapter: string; title: string; subtitle: string;
}) {
  return (
    <div className="text-center px-8">
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="font-mono text-[10px] tracking-[0.5em] text-cyan-500/40 uppercase mb-6"
      >
        {chapter}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={active ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="text-[clamp(3rem,10vw,7rem)] font-black text-white tracking-tight leading-[0.95]"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={active ? { opacity: 1, y: 0 } : { opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
        className="mt-4 text-base sm:text-lg text-white/25 font-light max-w-xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function TimelineSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  const items = t.story.ch1Timeline;
  return (
    <div className="px-8 w-full max-w-4xl">
      <p className="text-xs font-mono text-white/15 tracking-[0.4em] uppercase mb-8 text-center">
        {t.story.scrollHint}
      </p>
      <div className="flex items-center gap-0 overflow-x-auto pb-4 scrollbar-none">
        {items.map((item, i) => (
          <motion.div
            key={item.year}
            className="flex items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
          >
            {i > 0 && <div className="w-12 sm:w-20 h-px bg-gradient-to-r from-white/5 to-white/10 shrink-0" />}
            <div className="flex flex-col items-center shrink-0 w-40 sm:w-48">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-cyan-500/60 ring-4 ring-cyan-500/10" />
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs font-mono text-cyan-500/50">{item.year}</span>
                <p className="text-sm text-white/70 font-medium mt-1">{item.event}</p>
                <p className="text-xs text-white/25 font-light mt-1">{item.detail}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function SOTrafficSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  return (
    <div className="text-center px-8 max-w-xl">
      <p className="text-xs font-mono text-white/20 tracking-[0.3em] uppercase mb-8">
        {t.story.soTrafficLabel}
      </p>
      <AnimatedCounter active={active} from={1120} to={1700} duration={1500} className="text-5xl sm:text-6xl font-black text-white/80 tabular-nums" />
      <span className="text-5xl sm:text-6xl font-black text-white/25 ml-1">M</span>
      <p className="text-xs text-white/20 mt-4 font-light">{t.story.soMonthlyPeak}</p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="text-sm text-white/40 mt-2 font-light"
      >
        {t.story.soNobodySaw}
      </motion.p>
    </div>
  );
}

function TheDateSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        className="text-xs font-mono text-white/20 tracking-[0.5em] uppercase mb-6"
      >
        {t.story.thatDay}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, scale: 0.5 }}
        animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
        transition={{ delay: 0.2, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="text-6xl sm:text-8xl md:text-9xl font-black tabular-nums tracking-tight"
      >
        <span className="text-white/90">2022</span>
        <span className="text-white/20">.</span>
        <span className="text-white/70">11</span>
        <span className="text-white/20">.</span>
        <span className="text-cyan-400/80">30</span>
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6 text-lg text-white/30 font-light"
      >
        {t.story.chatgptLaunch}
      </motion.p>
    </div>
  );
}

function HeroStatSlide({ active, value, suffix, label, sublabel }: {
  active: boolean; value: number; suffix: string; label: string; sublabel: string;
}) {
  return (
    <div className="text-center px-8">
      <div className="flex items-start justify-center leading-none">
        <AnimatedCounter active={active} from={0} to={value} duration={1200} className="text-[clamp(5rem,16vw,10rem)] font-black text-white tracking-tight tabular-nums" />
        <span className="text-[clamp(2rem,6vw,4rem)] font-black text-white/50 mt-3 ml-1">{suffix}</span>
      </div>
      <p className="mt-4 text-base text-white/40 font-light">{label}</p>
      <p className="mt-2 text-xs text-white/15 font-mono">{sublabel}</p>
    </div>
  );
}

function IndustryBarsSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  const data = t.story.industries;
  return (
    <div className="px-8 max-w-lg w-full">
      <p className="text-lg text-white/50 font-light mb-2 text-center">{t.story.aiPenetration}</p>
      <p className="text-xs text-white/15 font-mono mb-8 text-center">{t.story.noFieldSpared}</p>
      <div className="space-y-3">
        {data.map((d, i) => (
          <motion.div
            key={d.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          >
            <span className="text-xs text-white/40 w-20 text-right shrink-0">{d.label}</span>
            <div className="flex-1 h-6 bg-white/[0.03] rounded overflow-hidden">
              <motion.div
                className="h-full rounded bg-cyan-500/50"
                initial={{ width: 0 }}
                animate={active ? { width: `${d.value}%` } : { width: 0 }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="text-xs font-mono text-white/30 w-10">{d.value}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function EventCascadeSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  const events = t.story.keyEvents;
  return (
    <div className="px-6 max-w-md w-full">
      <p className="text-xs font-mono tracking-[0.3em] text-cyan-500/30 uppercase mb-8 text-center">
        {t.story.keyEventsTimeline}
      </p>
      <div className="relative space-y-5">
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent" />
        {events.map((event, i) => (
          <motion.div
            key={event.date}
            className="flex items-start gap-4 pl-4"
            initial={{ opacity: 0, x: 30 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
          >
            <div className="w-[10px] h-[10px] rounded-full bg-cyan-500/40 border border-cyan-500/30 shrink-0 mt-1" />
            <div className="flex-1">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-cyan-500/50 shrink-0">{event.date}</span>
                <span className="text-sm text-white/70 font-medium">{event.title}</span>
              </div>
              <span className="text-xs text-white/20">{event.impact}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function JobDeclineSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  const bars = [920, 980, 890, 1050, 1150, 980, 850, 820];
  return (
    <div className="text-center px-8">
      <p className="text-xs font-mono text-white/15 tracking-[0.3em] uppercase mb-6">{t.story.jobPositions}</p>
      <div className="flex items-end gap-1.5 h-44 justify-center">
        {bars.map((v, i) => {
          const isDecline = (2018 + i) >= 2023;
          return (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-1.5 w-10 sm:w-14"
              initial={{ opacity: 0 }}
              animate={active ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div className="relative h-36 w-full flex items-end">
                <motion.div
                  className={`w-full rounded-t ${isDecline ? 'bg-red-500/40' : 'bg-cyan-500/25'}`}
                  initial={{ height: 0 }}
                  animate={active ? { height: `${(v / 1200) * 100}%` } : { height: 0 }}
                  transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className={`text-[9px] font-mono ${isDecline ? 'text-red-400/30' : 'text-white/20'}`}>{2018 + i}</span>
            </motion.div>
          );
        })}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-6"
      >
        <span className="text-3xl font-black text-red-400/80 tabular-nums">-29%</span>
        <p className="text-sm text-white/25 mt-2 font-light">{t.story.declineFromPeak} · 2022 → 2025</p>
      </motion.div>
    </div>
  );
}

function IDERevolutionSlide({ active }: { active: boolean }) {
  const { t } = useI18n();
  const ideData = [
    { name: 'VS Code', share: 55, color: '#3b82f6' },
    { name: 'Cursor', share: 18, color: '#06b6d4' },
    { name: 'JetBrains', share: 17, color: '#a855f7' },
    { name: 'Vim', share: 5, color: '#22c55e' },
  ];
  return (
    <div className="px-8 max-w-md w-full">
      <p className="text-xs font-mono text-white/15 tracking-[0.3em] uppercase mb-2 text-center">{t.story.ideLandscape}</p>
      <p className="text-sm text-white/30 font-light mb-8 text-center">{t.story.ideDisruptor}</p>
      <div className="space-y-4">
        {ideData.map((ide, i) => (
          <motion.div
            key={ide.name}
            className="flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={active ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            <span className="text-xs text-white/40 w-20 text-right shrink-0">{ide.name}</span>
            <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
              <motion.div
                className="h-full rounded"
                style={{ backgroundColor: ide.color, opacity: 0.6 }}
                initial={{ width: 0 }}
                animate={active ? { width: `${ide.share}%` } : { width: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50">{ide.share}%</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-xs text-white/15 font-light text-center max-w-sm mx-auto"
      >
        {t.story.ideDesc}<br />{t.story.ideToolWar}
      </motion.p>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  BRANCHING MOMENT                                    */
/* ──────────────────────────────────────────────────── */
const DILEMMAS = [
  {
    id: 'identity',
    icon: '🪞',
    color: 'violet',
    question: 'Are you using the tool, or is the tool using you?',
    questionZh: '你在使用工具，还是工具在使用你？',
    sideA: { label: 'Amplifier', labelZh: '放大器', desc: 'AI is a bicycle for the mind. It amplifies human creativity — the best developers will be those who ask the best questions, not write the most syntax.', descZh: 'AI 是思维的自行车。它放大人类创造力——最好的开发者将是问出最好问题的人，而不是写最多语法的人。' },
    sideB: { label: 'Puppet Master', labelZh: '提线木偶', desc: "When you can't ship without Copilot, who's the dependency? You trained for years to think in code — now you think in prompts. The skill atrophied so gradually you didn't notice.", descZh: '当你离不开 Copilot 就无法交付时，谁才是依赖？你花了数年学会用代码思考——现在你用提示词思考。技能退化得如此缓慢，以至于你没有察觉。' },
  },
  {
    id: 'prediction',
    icon: '🔮',
    color: 'cyan',
    question: 'By 2030, will writing code be a luxury or a basic skill?',
    questionZh: '2030 年，写代码是奢侈品还是基本技能？',
    sideA: { label: 'Luxury', labelZh: '奢侈品', desc: 'Like calligraphy after the printing press — beautiful, respected, but unnecessary. AI generates 90% of production code. Hand-coding becomes artisanal, a mark of craftsmanship.', descZh: '像印刷术之后的书法——美丽、受人尊敬、但非必需。AI 生成 90% 的生产代码。手写代码变成手工艺，变成匠心的标志。' },
    sideB: { label: 'Literacy', labelZh: '基本素养', desc: "Like reading after Gutenberg — more people code than ever, not fewer. AI lowers the floor so far that 'coding' becomes as normal as making a spreadsheet. Everyone's a developer.", descZh: '像古腾堡之后的阅读——编程的人比以往更多，而非更少。AI 把门槛降得如此之低，以至于"编程"变得和做表格一样普通。人人都是开发者。' },
  },
  {
    id: 'ethics',
    icon: '⚖️',
    color: 'amber',
    question: "AI wrote the code. The code has a bug. Who's responsible?",
    questionZh: 'AI 写了代码，代码有 bug，谁负责？',
    sideA: { label: 'The Developer', labelZh: '开发者', desc: "You reviewed it. You merged it. You shipped it. AI is a tool — you don't blame the hammer for a crooked nail. Professional responsibility means owning every line, regardless of who (or what) authored it.", descZh: '你审查了它。你合并了它。你上线了它。AI 是工具——你不会因为钉子歪了而怪锤子。专业责任意味着为每一行代码负责，无论作者是谁（或什么）。' },
    sideB: { label: 'The System', labelZh: '系统', desc: "When AI generates 10,000 lines a day, 'review every line' is a fiction. The real question isn't blame — it's whether our entire QA model is obsolete. We need new guardrails, not scapegoats.", descZh: '当 AI 每天生成一万行代码时，"逐行审查"就是一个幻想。真正的问题不是归咎——而是我们整个质量保障模型是否已经过时。我们需要新的防护栏，而不是替罪羊。' },
  },
  {
    id: 'strategy',
    icon: '🧬',
    color: 'emerald',
    question: 'Adapt or resist?',
    questionZh: '适应还是抵抗？',
    sideA: { label: 'Ride the Wave', labelZh: '顺势而为', desc: 'Every technological revolution rewards early adopters. Learn prompt engineering, master AI workflows, build on top of AI. The gap between AI-native and AI-resistant developers is already 3x in salary.', descZh: '每一次技术革命都奖励先行者。学习提示工程、掌握 AI 工作流、在 AI 之上构建。AI 原生开发者与 AI 抵触者之间的薪资差距已经达到 3 倍。' },
    sideB: { label: 'Hold the Line', labelZh: '坚守阵地', desc: 'Fundamentals don\'t expire. Algorithms, system design, debugging intuition — these survive every hype cycle. When the AI bubble deflates (and it will), the engineers who understand the machine will be the ones still standing.', descZh: '基本功不会过期。算法、系统设计、调试直觉——这些能穿越每一个炒作周期。当 AI 泡沫破灭时（它终将破灭），理解机器的工程师才是最后站着的人。' },
  },
];

function BranchingMoment() {
  const { lang } = useI18n();
  const isZh = lang === 'zh';
  const [selected, setSelected] = useState<string | null>(null);
  const [side, setSide] = useState<'A' | 'B' | null>(null);

  const dilemma = DILEMMAS.find(d => d.id === selected);

  return (
    <div className="flex flex-col items-center justify-center px-6 sm:px-10 h-full relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: `radial-gradient(circle, ${
            selected === 'identity' ? '#8b5cf6' : selected === 'prediction' ? '#06b6d4' : selected === 'ethics' ? '#f59e0b' : selected === 'strategy' ? '#10b981' : '#8b5cf6'
          }, transparent 70%)` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          /* ── Topic Selection Grid ── */
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10 w-full max-w-3xl"
          >
            <p className="font-mono text-[10px] tracking-[0.5em] text-white/20 uppercase mb-3">
              {isZh ? '选择一个问题' : 'Pick a dilemma'}
            </p>
            <p className="text-xl sm:text-2xl text-white/50 font-extralight mb-10">
              {isZh ? 'AI 时代没有标准答案，只有更好的问题。' : 'In the AI era, there are no right answers — only better questions.'}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {DILEMMAS.map((d, i) => (
                <motion.button
                  key={d.id}
                  onClick={() => { setSelected(d.id); setSide(null); }}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="group relative rounded-xl overflow-hidden text-left transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className={`absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity bg-${d.color}-500`} />
                  <div className={`absolute inset-0 border border-${d.color}-500/10 group-hover:border-${d.color}-500/30 rounded-xl transition-colors`} />
                  <div className="relative px-5 py-5 sm:py-6">
                    <span className="text-2xl">{d.icon}</span>
                    <p className="text-sm sm:text-base text-white/60 group-hover:text-white/80 font-light mt-2 leading-snug transition-colors">
                      {isZh ? d.questionZh : d.question}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : !side ? (
          /* ── Choose a Side ── */
          <motion.div
            key={`sides-${selected}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="text-center relative z-10 w-full max-w-2xl"
          >
            <span className="text-3xl mb-4 block">{dilemma!.icon}</span>
            <p className="text-lg sm:text-2xl text-white/60 font-light leading-relaxed mb-12">
              {isZh ? dilemma!.questionZh : dilemma!.question}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {(['A', 'B'] as const).map((s) => {
                const data = s === 'A' ? dilemma!.sideA : dilemma!.sideB;
                const colors = s === 'A' ? 'cyan' : 'rose';
                return (
                  <button
                    key={s}
                    onClick={() => setSide(s)}
                    className="group relative flex-1 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br from-${colors}-500/[0.08] to-transparent group-hover:from-${colors}-500/[0.15] transition-all`} />
                    <div className={`absolute inset-0 border border-${colors}-500/10 group-hover:border-${colors}-500/30 rounded-xl transition-colors`} />
                    <div className="relative px-6 py-8">
                      <p className={`text-lg text-${colors}-400/70 group-hover:text-${colors}-300 font-light transition-colors`}>
                        {isZh ? data.labelZh : data.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setSelected(null)} className="mt-8 text-xs font-mono text-white/15 hover:text-white/40 transition-colors inline-flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 10 L4 6 L8 2"/></svg>
              {isZh ? '换一个问题' : 'Different question'}
            </button>
          </motion.div>
        ) : (
          /* ── Answer Revealed ── */
          <motion.div
            key={`answer-${selected}-${side}`}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="text-center relative z-10 max-w-2xl"
          >
            <div className={`w-12 h-[2px] mx-auto mb-8 ${side === 'A' ? 'bg-cyan-500/40' : 'bg-rose-500/40'}`} />

            <p className={`text-3xl sm:text-4xl font-extralight mb-6 tracking-tight ${side === 'A' ? 'text-cyan-400/80' : 'text-rose-400/80'}`}>
              {isZh ? (side === 'A' ? dilemma!.sideA.labelZh : dilemma!.sideB.labelZh) : (side === 'A' ? dilemma!.sideA.label : dilemma!.sideB.label)}
            </p>

            <p className="text-base sm:text-lg text-white/45 font-light leading-relaxed max-w-xl mx-auto">
              {isZh ? (side === 'A' ? dilemma!.sideA.descZh : dilemma!.sideB.descZh) : (side === 'A' ? dilemma!.sideA.desc : dilemma!.sideB.desc)}
            </p>

            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setSide(side === 'A' ? 'B' : 'A')}
                className="text-xs font-mono text-white/20 hover:text-white/50 transition-colors"
              >
                {isZh ? '听听另一边 →' : 'Hear the other side →'}
              </button>
              <span className="text-white/8">|</span>
              <button
                onClick={() => { setSelected(null); setSide(null); }}
                className="text-xs font-mono text-white/15 hover:text-white/40 transition-colors inline-flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M8 10 L4 6 L8 2"/></svg>
                {isZh ? '换一个问题' : 'Different question'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  EPILOGUE                                            */
/* ──────────────────────────────────────────────────── */
function Epilogue() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center px-8 text-center h-full relative">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <p className="text-2xl sm:text-3xl text-white/40 font-extralight max-w-2xl leading-relaxed">
          {t.story.epilogueP1}
        </p>
        <p className="text-2xl sm:text-3xl text-white/70 font-light max-w-2xl leading-relaxed mt-3">
          {t.story.epilogueP2}<GlitchText text={t.story.epilogueP2Highlight} className="text-cyan-400/70" />{t.story.epilogueP2End}
        </p>
        <p className="mt-12 text-base text-white/20 font-light max-w-lg mx-auto leading-relaxed">
          {t.story.epilogueP3}<br />{t.story.epilogueP3End}
        </p>
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-4">
          <Link to="/" viewTransition className="px-8 py-3.5 rounded-full border border-white/10 text-sm text-white/40 hover:text-white/70 hover:border-white/25 transition-all duration-300 font-mono">
            {t.story.exploreData}
          </Link>
          <Link to="/timeline" viewTransition className="px-8 py-3.5 rounded-full border border-cyan-500/15 text-sm text-cyan-500/50 hover:text-cyan-400/80 hover:border-cyan-500/30 transition-all duration-300 font-mono">
            {t.story.browseTimeline}
          </Link>
        </div>
        <p className="mt-24 text-[10px] text-white/[0.08] font-mono tracking-widest">
          {t.story.epilogueByline}
        </p>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  ANIMATED COUNTER (simple, no scroll dependency)     */
/* ──────────────────────────────────────────────────── */
function AnimatedCounter({ active, from, to, duration = 1200, className = '' }: {
  active: boolean; from: number; to: number; duration?: number; className?: string;
}) {
  const [display, setDisplay] = useState(from);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setDisplay(from); startRef.current = null; return; }
    startRef.current = null;
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(from + (to - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, from, to, duration]);

  return <span className={className}>{display}</span>;
}
