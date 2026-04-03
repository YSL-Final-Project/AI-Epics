/**
 * SlideFrame — cinematic glowing border hugging the viewport.
 * Single elegant gradient (cyan ↔ violet) with thick flowing light.
 */
export default function SlideFrame({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="fixed inset-0 z-40 pointer-events-none" aria-hidden>

      {/* ── Primary border ── */}
      <div
        className="absolute inset-0"
        style={{
          border: '5px solid transparent',
          borderImage:
            'conic-gradient(from var(--frame-angle, 0deg), #06b6d4, transparent 25%, #8b5cf6, transparent 75%, #06b6d4) 1',
          animation: 'slideFrameSpin 4s linear infinite',
        }}
      />

      {/* ── Bloom layer ── */}
      <div
        className="absolute inset-0"
        style={{
          border: '8px solid transparent',
          borderImage:
            'conic-gradient(from var(--frame-angle, 0deg), rgba(6,182,212,0.35), transparent 25%, rgba(139,92,246,0.35), transparent 75%, rgba(6,182,212,0.35)) 1',
          animation: 'slideFrameSpin 4s linear infinite',
          filter: 'blur(12px)',
        }}
      />

      {/* ── Corner brackets ── */}
      {[
        { t: true, l: true },
        { t: true, l: false },
        { t: false, l: true },
        { t: false, l: false },
      ].map(({ t, l }, i) => (
        <div
          key={i}
          className="absolute w-6 h-6"
          style={{
            top: t ? 0 : undefined,
            bottom: t ? undefined : 0,
            left: l ? 0 : undefined,
            right: l ? undefined : 0,
            borderTop: t ? '2.5px solid rgba(6,182,212,0.4)' : 'none',
            borderBottom: t ? 'none' : '2.5px solid rgba(139,92,246,0.4)',
            borderLeft: l ? '2.5px solid rgba(6,182,212,0.4)' : 'none',
            borderRight: l ? 'none' : '2.5px solid rgba(139,92,246,0.4)',
            borderRadius: 0,
          }}
        />
      ))}

      {/* ── Slide counter ── */}
      <div className="absolute bottom-4 right-5 flex items-center gap-2.5">
        <span className="font-mono text-[11px] tracking-[0.15em] text-white/25 tabular-nums">
          {String(current).padStart(2, '0')}<span className="text-white/10 mx-0.5">/</span>{String(total).padStart(2, '0')}
        </span>
        <div className="w-14 h-[3px] bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${(current / total) * 100}%`,
              background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)',
            }}
          />
        </div>
      </div>

      {/* ── Scroll hint on first slide ── */}
      {current <= 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
          <span className="font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase">Scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" className="text-white/20">
            <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1"/>
            <circle cx="6" cy="6" r="1.5" fill="currentColor" className="animate-bounce" style={{ animationDuration: '1.5s' }}/>
          </svg>
        </div>
      )}
    </div>
  );
}
