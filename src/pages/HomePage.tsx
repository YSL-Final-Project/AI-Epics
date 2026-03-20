import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';
import HeroTerminal from '../components/home/HeroTerminal';
import StatsDashboard from '../components/home/StatsDashboard';
import PagePreviewCard from '../components/home/PagePreviewCard';
import ParticleField from '../components/ParticleField';
import ChapterDots from '../components/ChapterDots';
import StickyScrollNarrative from '../components/StickyScrollNarrative';
import LineReveal from '../components/animations/LineReveal';
import ScaleReveal from '../components/animations/ScaleReveal';
import type { PagePreview } from '../types';

const pagesPreviews: PagePreview[] = [
  {
    title: 'AI 进化时间线',
    description: '从 GPT-1 到 Claude 4，25 个里程碑事件串起 AI 编程的完整进化史',
    path: '/timeline',
    icon: '📅',
    color: 'bg-cyan-500',
  },
  {
    title: '深度洞察',
    description: '4 大维度深度剖析：工具采用率、SO 衰落、代码生成占比、开发者薪资',
    path: '/data',
    icon: '📊',
    color: 'bg-violet-500',
  },
  {
    title: '技术竞技场',
    description: '编程语言争霸动画、AI 工具擂台赛、IDE 生态变迁全景图',
    path: '/compare',
    icon: '⚔️',
    color: 'bg-amber-500',
  },
  {
    title: '创意实验室',
    description: 'AI 代码猜猜看、未来预测投票、个性化工具推荐',
    path: '/interactive',
    icon: '🎮',
    color: 'bg-emerald-500',
  },
  {
    title: '关于项目',
    description: '数据来源、研究方法、团队介绍',
    path: '/about',
    icon: '📝',
    color: 'bg-rose-500',
  },
];

const CHAPTERS = [
  { id: 'chapter-hero',      label: '引言' },
  { id: 'chapter-narrative', label: '叙事' },
  { id: 'chapter-stats',     label: '数据' },
  { id: 'chapter-explore',   label: '探索' },
];

// ─── Char-by-char 3D reveal (hero only) ───────────────────────────────────────
function SplitChars({
  text,
  className,
  baseDelay = 0,
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  stagger?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <span className={className} aria-label={text}>
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={prefersReduced ? false : { opacity: 0, y: 28, rotateX: -30 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            delay: baseDelay + i * stagger,
            duration: 0.55,
            ease: [0.32, 0.72, 0, 1],
          }}
          style={{ transformOrigin: 'bottom center' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}

// ─── Thin hairline divider — neutral, restrained ──────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function HairlineDivider({ color: _color = 'neutral' }: { color?: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      className="w-full h-px bg-gradient-to-r from-transparent via-white/8 dark:via-white/8 to-transparent"
      initial={prefersReduced ? false : { scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.6, ease: [0.32, 0.72, 0, 1] }}
      style={{ transformOrigin: 'center' }}
    />
  );
}

export default function HomePage() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax orbs follow mouse
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const orb1X = useSpring(rawX, { stiffness: 40, damping: 20 });
  const orb1Y = useSpring(rawY, { stiffness: 40, damping: 20 });
  const orb2X = useSpring(rawX, { stiffness: 25, damping: 18 });
  const orb2Y = useSpring(rawY, { stiffness: 25, damping: 18 });

  useEffect(() => {
    if (prefersReduced) return;
    const handler = (e: MouseEvent) => {
      rawX.set((e.clientX / window.innerWidth  - 0.5) * 60);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, [rawX, rawY, prefersReduced]);

  return (
    <PageTransition>
      <ChapterDots chapters={CHAPTERS} />

      <div>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 1 — Hero
        ═══════════════════════════════════════════════════════════════════ */}
        <section
          id="chapter-hero"
          ref={sectionRef}
          className="relative py-16 sm:py-24 px-4 overflow-hidden min-h-[90vh] flex flex-col justify-center"
        >
          {/* Particle field */}
          <ParticleField count={50} color="6,182,212" className="opacity-50 dark:opacity-90" />

          {/* Parallax orbs */}
          <motion.div
            style={{ x: orb1X, y: orb1Y }}
            className="absolute top-16 left-[8%] w-80 h-80 bg-cyan-500/20 dark:bg-cyan-500/15 rounded-full blur-[110px] pointer-events-none"
          />
          <motion.div
            style={{ x: orb2X, y: orb2Y }}
            className="absolute top-32 right-[8%] w-64 h-64 bg-violet-500/20 dark:bg-violet-500/15 rounded-full blur-[100px] pointer-events-none"
          />

          <div className="max-w-7xl mx-auto text-center relative" style={{ perspective: '1000px' }}>

            {/* Eyebrow badge — scale+blur in */}
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.88, filter: 'blur(6px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.05, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-medium mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              2018 — 2025 数据驱动洞察
            </motion.div>

            {/* Main title — char-by-char rotateX reveal */}
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
              style={{ perspective: '600px' }}
            >
              <SplitChars text="AI 编程时代的" baseDelay={0.15} stagger={0.045} />
              <br />
              <SplitChars
                text="变革全景"
                className="text-shimmer"
                baseDelay={0.55}
                stagger={0.06}
              />
            </h1>

            {/* Subtitle — one clean line */}
            <div className="mb-14">
              <LineReveal delay={0.7} className="text-base sm:text-lg text-slate-400 dark:text-slate-500 tracking-wide">
                2018 — 2025 · AI 如何重塑软件开发
              </LineReveal>
            </div>

            <HeroTerminal />
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 2 — Sticky Scroll Narrative (Apple-style 3-scene)
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="chapter-narrative">
          <StickyScrollNarrative />
        </section>

        <HairlineDivider color="violet" />

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 3 — Stats
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="chapter-stats" className="relative py-20 px-4 overflow-hidden">
          {/* Chapter label */}
          <motion.span
            className="absolute top-8 right-8 font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/20 uppercase"
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            02 / Data
          </motion.span>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <motion.p
                className="font-mono text-[10px] tracking-[0.5em] text-slate-400/60 dark:text-white/25 uppercase mb-5"
                initial={prefersReduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Data
              </motion.p>
              <LineReveal className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                关键数据一览
              </LineReveal>
            </div>

            <StatsDashboard />
          </div>
        </section>

        <HairlineDivider color="rose" />

        {/* ═══════════════════════════════════════════════════════════════════
            CHAPTER 4 — Explore
        ═══════════════════════════════════════════════════════════════════ */}
        <section id="chapter-explore" className="relative py-20 sm:py-24 px-4 overflow-hidden">

          {/* Chapter label */}
          <motion.span
            className="absolute top-8 left-8 font-mono text-[10px] tracking-[0.4em] text-slate-400/50 dark:text-white/20 uppercase"
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            03 / Explore
          </motion.span>

          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14">
              <motion.p
                className="font-mono text-[10px] tracking-[0.5em] text-slate-400/50 dark:text-white/20 uppercase mb-5"
                initial={prefersReduced ? false : { opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                Explore
              </motion.p>
              <LineReveal className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                深入探索每个维度
              </LineReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pagesPreviews.map((preview, index) => (
                <PagePreviewCard key={preview.path} preview={preview} index={index} />
              ))}
            </div>

            {/* Bottom byline */}
            <ScaleReveal delay={0.3} className="mt-20 text-center">
              <div className="flex items-center gap-6 justify-center">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-slate-400/30" />
                <p className="font-mono text-[11px] tracking-[0.4em] text-slate-400 uppercase">
                  AI Code Era · 2018—2025
                </p>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-slate-400/30" />
              </div>
            </ScaleReveal>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
