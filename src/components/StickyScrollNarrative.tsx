import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useI18n } from '../i18n';

/**
 * Apple-style sticky scroll narrative — 3 cinematic scenes.
 * Scroll-driven crossfade. The ring in scene 2 auto-plays when scene becomes visible.
 */
export default function StickyScrollNarrative() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track if scene 2 is active (for auto-playing ring)
  const [scene2Active, setScene2Active] = useState(false);
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Scene 2 is visible roughly between 0.40 and 0.65
    setScene2Active(v > 0.38 && v < 0.68);
  });

  // ── Scene 1: 0 → 0.38 ──
  const s1Op    = useTransform(scrollYProgress, [0, 0.06, 0.26, 0.38], [0, 1, 1, 0]);
  const s1Scale = useTransform(scrollYProgress, [0, 0.10, 0.26, 0.38], [0.7, 1, 1, 1.15]);
  const s1Blur  = useTransform(scrollYProgress, [0, 0.08, 0.26, 0.38], [24, 0, 0, 16]);
  const s1Fil   = useTransform(s1Blur, v => `blur(${v}px)`);
  const s1SubY  = useTransform(scrollYProgress, [0.05, 0.35], [30, -20]);
  const s1SubOp = useTransform(scrollYProgress, [0.08, 0.14, 0.26, 0.35], [0, 1, 1, 0]);

  // ── Scene 2: 0.35 → 0.70 ──
  const s2Op    = useTransform(scrollYProgress, [0.35, 0.43, 0.60, 0.70], [0, 1, 1, 0]);
  const s2Scale = useTransform(scrollYProgress, [0.35, 0.45, 0.60, 0.70], [0.7, 1, 1, 1.12]);
  const s2Blur  = useTransform(scrollYProgress, [0.35, 0.42, 0.60, 0.70], [24, 0, 0, 14]);
  const s2Fil   = useTransform(s2Blur, v => `blur(${v}px)`);
  const s2NumY  = useTransform(scrollYProgress, [0.38, 0.65], [40, -15]);
  const s2CapOp = useTransform(scrollYProgress, [0.46, 0.52, 0.58, 0.66], [0, 1, 1, 0]);

  // ── Scene 3: 0.67 → 1.00 ──
  const s3Op    = useTransform(scrollYProgress, [0.67, 0.76, 0.92, 1.00], [0, 1, 1, 0]);
  const s3Scale = useTransform(scrollYProgress, [0.67, 0.78, 0.92, 1.00], [0.72, 1, 1, 1.08]);
  const s3Blur  = useTransform(scrollYProgress, [0.67, 0.75, 0.92, 1.00], [24, 0, 0, 12]);
  const s3Fil   = useTransform(s3Blur, v => `blur(${v}px)`);
  const s3SubOp = useTransform(scrollYProgress, [0.78, 0.84, 0.90, 0.98], [0, 1, 1, 0]);
  const s3SubY  = useTransform(scrollYProgress, [0.76, 0.95], [25, -10]);

  // ── Shared ──
  const bgOp       = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  const dot1       = useTransform(scrollYProgress, [0, 0.06, 0.32, 0.38], [0.2, 1, 1, 0.2]);
  const dot2       = useTransform(scrollYProgress, [0.33, 0.40, 0.64, 0.70], [0.2, 1, 1, 0.2]);
  const dot3       = useTransform(scrollYProgress, [0.65, 0.72, 0.96, 1.00], [0.2, 1, 1, 0.2]);
  const hintOp     = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const progressY  = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const isZh = lang === 'zh';
  const scene1Main = isZh ? '我们曾亲手写下每一行' : 'We once wrote every line by hand';
  const scene1Sub  = isZh ? '然后我们教会了机器同样的事' : 'Then we taught the machines to do the same';
  const scene2Pre  = isZh ? '现在，每两行新代码中' : 'Now, for every two new lines of code';
  const scene2Post = isZh ? '有一行，不是人写的' : 'one was not written by a human';
  const scene3Main = isZh ? '如果代码不再需要人类' : 'If code no longer needs humans';
  const scene3Sub  = isZh ? '人类还需要代码吗？' : 'do humans still need code?';
  const scene3Coda = isZh ? '这不是技术问题。这是身份问题。' : "This isn't a technology question. It's an identity question.";

  if (prefersReduced) {
    return (
      <section className="py-24 px-6 bg-[#060612] text-center space-y-20">
        {[
          { label: t.narrative.scene1Label, title: t.narrative.scene1Title, accent: 'text-cyan-400' },
          { label: t.narrative.scene2Label, title: t.narrative.scene2Title, accent: 'text-violet-400' },
          { label: t.narrative.scene3Label, title: t.narrative.scene3Title, accent: 'text-rose-400' },
        ].map(s => (
          <div key={s.label}>
            <p className={`font-mono text-[11px] tracking-[0.4em] uppercase mb-4 ${s.accent}`}>{s.label}</p>
            <h2 className="text-4xl sm:text-6xl font-black text-white">{s.title}</h2>
          </div>
        ))}
      </section>
    );
  }

  return (
    <div ref={containerRef} style={{ height: '400vh', position: 'relative' }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: '100vh' }}>

        <motion.div style={{ opacity: bgOp }} className="absolute inset-0 bg-[#060612]" />

        {/* Left progress */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 overflow-hidden">
          <motion.div style={{ scaleY: progressY }} className="absolute inset-x-0 top-0 h-full bg-white/40 origin-top" />
        </div>

        {/* ═══ Scene 1: The Confession ═══ */}
        <motion.div
          style={{ opacity: s1Op, scale: s1Scale, filter: s1Fil }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 will-change-transform"
        >
          <p className="font-mono text-[10px] tracking-[0.55em] text-white/25 uppercase mb-12">
            01
          </p>
          {/* Mini code fragment visual */}
          <div className="mb-10 font-mono text-[clamp(0.6rem,1.5vw,0.8rem)] text-left inline-block">
            <div className="text-white/20 mb-1">function <span className="text-white/50">intelligence</span>() {'{'}</div>
            <div className="pl-5 text-white/15">return <span className="text-white/40">human</span> + <span className="text-white/70">AI</span>;</div>
            <div className="text-white/20">{'}'}</div>
          </div>
          <span className="block text-[clamp(4.5rem,12vw,8.5rem)] font-black text-white tracking-tight leading-none">
            {t.narrative.code}
          </span>
          <span className="block text-[clamp(1.2rem,3.5vw,2.4rem)] font-light text-white/45 tracking-widest mt-4">
            {t.narrative.codeSubtitle}
          </span>
        </motion.div>

        {/* ═══ Scene 2: The Evidence (ring auto-plays) ═══ */}
        <motion.div
          style={{ opacity: s2Op, scale: s2Scale, filter: s2Fil }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 will-change-transform"
        >
          <p className="font-mono text-[10px] tracking-[0.55em] text-white/30 uppercase mb-6">
            02
          </p>
          <p className="text-sm sm:text-base font-light text-white/30 mb-8 max-w-md leading-relaxed">
            {t.narrative.numbersDesc}
          </p>
          <div className="flex items-start justify-center leading-none">
            <span className="text-[clamp(6rem,20vw,13rem)] font-black text-white tracking-tight tabular-nums">
              46
            </span>
            <span className="text-[clamp(3rem,8vw,5.5rem)] font-black text-white/60 mt-2 ml-1">
              %
            </span>
          </div>
          <p className="mt-5 text-base sm:text-lg font-light text-white/40">
            {t.narrative.numbersLabel}
          </p>
          {/* SVG ring showing 46% */}
          <div className="mt-5 relative w-14 h-14">
            <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
              <circle
                cx="32" cy="32" r="28"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 28 * 0.46} ${2 * Math.PI * 28}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="mt-3 font-mono text-[9px] tracking-[0.35em] text-white/20 uppercase">
            {t.narrative.numbersSource}
          </p>

          <motion.div style={{ y: s2NumY }} className="relative">
            <ProgressRing active={scene2Active} target={0.46} size={260} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="flex items-start leading-none">
                <AnimCounter active={scene2Active} target={46} duration={2000} className="text-[clamp(3.5rem,12vw,6rem)] font-black text-white tracking-tighter tabular-nums" />
                <span className="text-[clamp(1.2rem,4vw,2.5rem)] font-black text-white/40 mt-2 ml-0.5">%</span>
              </div>
            </div>
          </motion.div>

          <motion.p
            style={{ opacity: s2CapOp }}
            className="mt-8 text-[clamp(1rem,2.5vw,1.4rem)] text-white/40 font-light tracking-wide"
          >
            {scene2Post}
          </motion.p>
          <motion.p
            style={{ opacity: s2CapOp }}
            className="mt-6 font-mono text-[9px] tracking-[0.4em] text-white/[0.12] uppercase"
          >
            GitHub · 2024
          </motion.p>
        </motion.div>

        {/* ═══ Scene 3: The Question ═══ */}
        <motion.div
          style={{ opacity: s3Op, scale: s3Scale, filter: s3Fil }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 will-change-transform"
        >
          <p className="font-mono text-[10px] tracking-[0.55em] text-white/30 uppercase mb-10">
            03
          </p>
          <span className="block text-[clamp(3rem,9vw,7rem)] font-black text-white tracking-tight leading-none mb-8">
            {t.narrative.scene3Title}
          </span>
          {/* Orbit visual — 3 dots orbiting a center */}
          <div className="relative w-20 h-20 mb-6">
            <svg viewBox="0 0 80 80" className="w-full h-full">
              <circle cx="40" cy="40" r="2" fill="rgba(255,255,255,0.8)" />
              <circle cx="40" cy="40" r="16" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <circle cx="56" cy="40" r="2.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="29" cy="26" r="1.5" fill="rgba(255,255,255,0.3)" />
              <circle cx="40" cy="68" r="1.5" fill="rgba(255,255,255,0.2)" />
            </svg>
          </div>
          <p className="font-mono text-[10px] tracking-[0.5em] text-white/20 uppercase">
            Autonomous · 2025
          </p>
        </motion.div>

        {/* Scene dots */}
        <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {[dot1, dot2, dot3].map((d, i) => (
            <motion.div key={i} style={{ opacity: d }} className="w-1 h-1 rounded-full bg-white" />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOp }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="font-mono text-[9px] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
          <motion.div
            className="w-px bg-white/25"
            animate={{ height: ['0px', '28px', '0px'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </div>
  );
}
