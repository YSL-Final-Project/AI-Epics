import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * Apple-style sticky scroll narrative.
 *
 * Outer container: 380vh (acts as scroll track).
 * Inner container: sticky top-0 100vh (stays pinned).
 * Three scenes crossfade based on continuous scroll progress — no thresholds,
 * no whileInView — pure progress → transform mapping like Apple product pages.
 *
 *  Scene 1 (0 → 0.38):  "代码" — the statement
 *  Scene 2 (0.35→ 0.70): "46%" — the numbers
 *  Scene 3 (0.67→ 1.00): "边界正在消失" — the future
 */
export default function StickyScrollNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // ── Scene 1 ────────────────────────────────────────────────────────────────
  const s1Opacity = useTransform(scrollYProgress, [0, 0.08, 0.28, 0.38], [0, 1, 1, 0]);
  const s1Scale   = useTransform(scrollYProgress, [0, 0.12, 0.28, 0.38], [0.72, 1, 1, 1.12]);
  const s1BlurVal = useTransform(scrollYProgress, [0, 0.10, 0.28, 0.38], [20, 0, 0, 14]);
  const s1Filter  = useTransform(s1BlurVal, v => `blur(${v}px)`);

  // ── Scene 2 ────────────────────────────────────────────────────────────────
  const s2Opacity = useTransform(scrollYProgress, [0.35, 0.45, 0.62, 0.70], [0, 1, 1, 0]);
  const s2Scale   = useTransform(scrollYProgress, [0.35, 0.47, 0.62, 0.70], [0.74, 1, 1, 1.10]);
  const s2BlurVal = useTransform(scrollYProgress, [0.35, 0.44, 0.62, 0.70], [20, 0, 0, 12]);
  const s2Filter  = useTransform(s2BlurVal, v => `blur(${v}px)`);

  // ── Scene 3 ────────────────────────────────────────────────────────────────
  const s3Opacity = useTransform(scrollYProgress, [0.67, 0.77, 0.93, 1.00], [0, 1, 1, 0]);
  const s3Scale   = useTransform(scrollYProgress, [0.67, 0.79, 0.93, 1.00], [0.76, 1, 1, 1.08]);
  const s3BlurVal = useTransform(scrollYProgress, [0.67, 0.76, 0.93, 1.00], [20, 0, 0, 10]);
  const s3Filter  = useTransform(s3BlurVal, v => `blur(${v}px)`);

  // ── Shared: bg darkens in / fades out at boundaries ───────────────────────
  const bgOpacity     = useTransform(scrollYProgress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);

  // ── Scene indicator dots ───────────────────────────────────────────────────
  const dot1 = useTransform(scrollYProgress, [0, 0.06, 0.32, 0.38], [0.25, 1, 1, 0.25]);
  const dot2 = useTransform(scrollYProgress, [0.33, 0.40, 0.64, 0.70], [0.25, 1, 1, 0.25]);
  const dot3 = useTransform(scrollYProgress, [0.65, 0.72, 0.96, 1.00], [0.25, 1, 1, 0.25]);

  // ── Scroll hint (disappears after first scene locks in) ───────────────────
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // ── Thin progress line on left ────────────────────────────────────────────
  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (prefersReduced) {
    // Static fallback — show all three headlines stacked
    return (
      <section className="py-24 px-6 bg-[#060612] text-center space-y-20">
        {[
          { label: '01 · THE SHIFT', title: '代码不再只是人类的语言', accent: 'text-cyan-400' },
          { label: '02 · THE NUMBERS', title: 'GitHub 上 46% 的新代码由 AI 生成', accent: 'text-violet-400' },
          { label: '03 · THE FUTURE', title: '边界正在消失', accent: 'text-rose-400' },
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
    <div ref={containerRef} style={{ height: '380vh', position: 'relative' }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 overflow-hidden" style={{ height: '100vh' }}>

        {/* Background */}
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[#060612]"
        />

        {/* Left progress line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-white/5 overflow-hidden">
          <motion.div
            style={{ scaleY: progressScaleY }}
            className="absolute inset-x-0 top-0 h-full bg-white/40 origin-top"
          />
        </div>

        {/* ── Scene 1: The Statement ──────────────────────────────────────── */}
        <motion.div
          style={{ opacity: s1Opacity, scale: s1Scale, filter: s1Filter }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 will-change-transform"
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
            代码
          </span>
          <span className="block text-[clamp(1.2rem,3.5vw,2.4rem)] font-light text-white/45 tracking-widest mt-4">
            不再只是人类的语言
          </span>
        </motion.div>

        {/* ── Scene 2: The Numbers ────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: s2Opacity, scale: s2Scale, filter: s2Filter }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 will-change-transform"
        >
          <p className="font-mono text-[10px] tracking-[0.55em] text-white/30 uppercase mb-6">
            02
          </p>
          <p className="text-sm sm:text-base font-light text-white/30 mb-8 max-w-md leading-relaxed">
            GitHub 上每提交两行新代码，<br className="sm:hidden" />就有一行来自 AI。
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
            新代码由 AI 生成
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
            来源：GitHub · 2023
          </p>
        </motion.div>

        {/* ── Scene 3: The Future ─────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: s3Opacity, scale: s3Scale, filter: s3Filter }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 will-change-transform"
        >
          <p className="font-mono text-[10px] tracking-[0.55em] text-white/30 uppercase mb-10">
            03
          </p>
          <span className="block text-[clamp(3rem,9vw,7rem)] font-black text-white tracking-tight leading-none mb-8">
            边界正在消失
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

        {/* Scene indicator dots — right side */}
        <div className="absolute right-7 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
          {[dot1, dot2, dot3].map((dotOpacity, i) => (
            <motion.div
              key={i}
              style={{ opacity: dotOpacity }}
              className="w-1 h-1 rounded-full bg-white"
            />
          ))}
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
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
