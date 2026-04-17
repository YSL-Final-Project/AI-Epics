import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  label2021: string;
  label2025: string;
  steps2021: string[];
  steps2025: string[];
  dragHint: string;
  isDark: boolean;
}

/**
 * Before/After drag comparison slider.
 * 2021 workflow sits on the base layer (full width).
 * 2025 workflow overlays on top, clipped from the left edge via clip-path so
 * the divider position reveals more or less of it.
 * User drags the center handle (or clicks anywhere in the card) to change split.
 */
export default function WorkflowCompareSlider({
  label2021,
  label2025,
  steps2021,
  steps2025,
  dragHint,
  isDark,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const prefersReduced = useReducedMotion();

  const updateFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(98, Math.max(2, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    setDragging(true);
    setHasInteracted(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId);
    } catch { /* noop */ }
    setDragging(false);
  };

  // Keyboard accessibility — arrow keys move the handle by 5%
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (document.activeElement !== el) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSplit(s => Math.max(2, s - 5));
        setHasInteracted(true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSplit(s => Math.min(98, s + 5));
        setHasInteracted(true);
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, []);

  const cyan = '#06b6d4';

  const pastePillStyle = {
    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(100,116,139,0.06)',
    borderColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(100,116,139,0.12)',
    color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(100,116,139,0.7)',
  };
  const cyanPillStyle = {
    backgroundColor: `${cyan}14`,
    borderColor: `${cyan}55`,
    color: isDark ? '#67e8f9' : '#0e7490',
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      role="slider"
      aria-valuenow={Math.round(split)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Compare 2021 and 2025 workflows"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative select-none overflow-hidden rounded-2xl border outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
      style={{
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.08)',
        cursor: dragging ? 'grabbing' : 'ew-resize',
        touchAction: 'none',
      }}
    >
      {/* Layer A — 2021 workflow (base, full width) */}
      <div
        className="p-6 md:p-7"
        style={{
          background: isDark ? 'rgba(255,255,255,0.012)' : 'rgba(100,116,139,0.04)',
          minHeight: 220,
        }}
      >
        <div
          className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5"
          style={{ color: isDark ? 'rgba(244,63,94,0.4)' : 'rgba(100,116,139,0.6)' }}
        >
          {label2021}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {steps2021.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap"
                style={pastePillStyle}
              >
                {step}
              </span>
              {i < steps2021.length - 1 && (
                <span
                  style={{ color: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(100,116,139,0.45)' }}
                  className="text-xs"
                >
                  →
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Layer B — 2025 workflow (overlay, clipped on the left by `split`) */}
      <div
        className="absolute inset-0 p-6 md:p-7"
        style={{
          clipPath: `inset(0 0 0 ${split}%)`,
          background: isDark
            ? 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(6,182,212,0.04))'
            : 'linear-gradient(135deg, rgba(6,182,212,0.08), rgba(6,182,212,0.03))',
          transition: dragging || prefersReduced ? 'none' : 'clip-path 0.18s ease-out',
        }}
      >
        <div
          className="font-mono text-[10px] tracking-[0.3em] uppercase mb-5 text-right"
          style={{ color: isDark ? 'rgba(6,182,212,0.55)' : 'rgba(6,182,212,0.75)' }}
        >
          {label2025}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          {steps2025.map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <span
                className="px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap"
                style={cyanPillStyle}
              >
                {step}
              </span>
              {i < steps2025.length - 1 && (
                <span style={{ color: `${cyan}66` }} className="text-xs">→</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Divider line + handle */}
      <div
        className="pointer-events-none absolute top-0 bottom-0 w-px"
        style={{
          left: `${split}%`,
          background: `linear-gradient(to bottom, transparent, ${cyan}88 20%, ${cyan}88 80%, transparent)`,
          transition: dragging || prefersReduced ? 'none' : 'left 0.18s ease-out',
        }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full border backdrop-blur-md pointer-events-auto"
          style={{
            backgroundColor: isDark ? 'rgba(15,23,42,0.7)' : 'rgba(255,255,255,0.9)',
            borderColor: `${cyan}80`,
            boxShadow: `0 0 22px ${cyan}44, 0 4px 16px rgba(0,0,0,0.2)`,
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          animate={
            prefersReduced || hasInteracted
              ? { scale: dragging ? 1.08 : 1 }
              : { scale: [1, 1.08, 1] }
          }
          transition={
            prefersReduced || hasInteracted
              ? { duration: 0.18 }
              : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={cyan} strokeWidth="1.6" strokeLinecap="round">
            <path d="M5 3L2 7L5 11" />
            <path d="M9 3L12 7L9 11" />
          </svg>
        </motion.div>
      </div>

      {/* Drag hint — only shown before first interaction */}
      {!hasInteracted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <span
            className="font-mono text-[9px] tracking-[0.3em] uppercase px-3 py-1 rounded-full border"
            style={{
              color: `${cyan}cc`,
              borderColor: `${cyan}44`,
              backgroundColor: isDark ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.75)',
            }}
          >
            ← {dragHint} →
          </span>
        </motion.div>
      )}
    </div>
  );
}
