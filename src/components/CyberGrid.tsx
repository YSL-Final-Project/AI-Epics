/**
 * Tron-style perspective grid receding into the distance.
 * Pure CSS — no canvas needed. Very lightweight.
 */
export default function CyberGrid({
  color = 'cyan',
  opacity = 0.04,
  className = '',
}: {
  color?: 'cyan' | 'violet' | 'rose';
  opacity?: number;
  className?: string;
}) {
  const colorMap = {
    cyan: 'rgba(6,182,212,',
    violet: 'rgba(139,92,246,',
    rose: 'rgba(244,63,94,',
  };
  const c = colorMap[color];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ perspective: '600px' }}
    >
      {/* Horizontal receding grid */}
      <div
        className="absolute bottom-0 left-[-50%] w-[200%] h-[70%]"
        style={{
          transform: 'rotateX(65deg)',
          transformOrigin: 'bottom center',
          backgroundImage: `
            linear-gradient(to right, ${c}${opacity}) 1px, transparent 1px),
            linear-gradient(to bottom, ${c}${opacity}) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          maskImage: 'linear-gradient(to top, white 10%, transparent 90%)',
          WebkitMaskImage: 'linear-gradient(to top, white 10%, transparent 90%)',
          animation: 'cyberGridScroll 8s linear infinite',
        }}
      />

      {/* Horizon glow line */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          bottom: '30%',
          background: `linear-gradient(to right, transparent, ${c}0.15), transparent)`,
          boxShadow: `0 0 30px ${c}0.08), 0 0 60px ${c}0.04)`,
        }}
      />
    </div>
  );
}
