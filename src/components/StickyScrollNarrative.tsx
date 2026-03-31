import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent } from 'framer-motion';
import { useI18n } from '../i18n';

/* ── Animated SVG ring — auto-plays from 0→target when triggered ── */
function ProgressRing({ active, target = 0.46, size = 260 }: { active: boolean; target?: number; size?: number }) {
  const r = (size - 20) / 2;
  const circumference = 2 * Math.PI * r;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) { setValue(0); return; }
    // Small delay then animate
    const t = setTimeout(() => setValue(target), 200);
    return () => clearTimeout(t);
  }, [active, target]);

  const offset = circumference * (1 - value);
  const glowOp = Math.min(value * 1.8, 0.7);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
      {/* Glow */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset} opacity={glowOp} filter="url(#ringBlur)"
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.32,0.72,0,1), opacity 2s ease' }}
      />
      {/* Main */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="3.5" strokeLinecap="round"
        strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.32,0.72,0,1)' }}
      />
      {/* Leading dot */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`2 ${circumference - 2}`} strokeDashoffset={offset} opacity={0.9}
        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.32,0.72,0,1)' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="ringBlur"><feGaussianBlur in="SourceGraphic" stdDeviation="6" /></filter>
      </defs>
    </svg>
  );
}

/* ── Counter that auto-animates from 0→target when active ── */
function AnimCounter({ active, target, duration = 2000, className = '' }: { active: boolean; target: number; duration?: number; className?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    const start = performance.now();
    let raf: number;
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    // Small delay to sync with ring
    const timer = setTimeout(() => { raf = requestAnimationFrame(step); }, 200);
    return () => { clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [active, target, duration]);
  return <span className={className}>{val}</span>;
}

/**
 * Apple-style sticky scroll narrative — 3 cinematic scenes.
 * Scroll-driven crossfade. The ring in scene 2 auto-plays when scene becomes visible.
 */
export default function StickyScrollNarrative() {
  const { lang } = useI18n();
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
  const bgOp       = useTransform(scrollYProgress, [0.97, 1], [1, 0]);
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
        <div><h2 className="text-4xl sm:text-6xl font-black text-white">{scene1Main}</h2></div>
        <div><h2 className="text-8xl font-black text-white">46<span className="text-white/50">%</span></h2></div>
        <div><h2 className="text-4xl sm:text-6xl font-black text-white">{scene3Main}</h2></div>
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
          <div className="w-8 h-px bg-white/20 mb-12" />
          <h2 className="text-[clamp(2.2rem,6vw,4.5rem)] font-extralight text-white/90 tracking-tight leading-[1.15] max-w-3xl">
            {scene1Main}
          </h2>
          <motion.p
            style={{ y: s1SubY, opacity: s1SubOp }}
            className="mt-8 text-[clamp(1rem,2.5vw,1.5rem)] text-white/25 font-light tracking-wide max-w-xl"
          >
            {scene1Sub}
          </motion.p>
          <motion.div
            style={{ opacity: s1SubOp }}
            className="mt-14 font-mono text-[11px] text-white/[0.08] tracking-wider select-none"
          >
            {'{ human: true, ai: false }  →  { human: true, ai: true }'}
          </motion.div>
        </motion.div>

        {/* ═══ Scene 2: The Evidence (ring auto-plays) ═══ */}
        <motion.div
          style={{ opacity: s2Op, scale: s2Scale, filter: s2Fil }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 will-change-transform"
        >
          <p className="text-sm sm:text-base font-light text-white/25 mb-10 max-w-md tracking-wide">
            {scene2Pre}
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
          <h2 className="text-[clamp(2rem,5.5vw,4rem)] font-extralight text-white/70 tracking-tight leading-[1.2] max-w-2xl">
            {scene3Main}
          </h2>
          <h2 className="mt-2 text-[clamp(2rem,5.5vw,4rem)] font-black text-white tracking-tight leading-[1.2] max-w-2xl">
            {scene3Sub}
          </h2>
          <motion.div style={{ y: s3SubY, opacity: s3SubOp }}>
            <div className="w-6 h-px bg-white/15 mx-auto mt-14 mb-8" />
            <p className="text-sm sm:text-base text-white/20 font-light tracking-wide max-w-md italic">
              {scene3Coda}
            </p>
          </motion.div>
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
