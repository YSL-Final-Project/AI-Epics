/** Inline SVG icons — replaces all emoji with high-tech minimal line icons */

interface IconProps {
  className?: string;
  size?: number;
}

const d = (size: number, cls: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: cls,
});

// ── Terminal / Code ──
export function IconTerminal({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

// ── Search / Scan ──
export function IconScan({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

// ── Chart / Analytics ──
export function IconChart({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

// ── Trend Up ──
export function IconTrendUp({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

// ── Lightning / Bolt ──
export function IconBolt({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" />
    </svg>
  );
}

// ── Rocket / Launch ──
export function IconRocket({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

// ── CPU / AI Chip ──
export function IconCpu({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <line x1="9" y1="1" x2="9" y2="4" />
      <line x1="15" y1="1" x2="15" y2="4" />
      <line x1="9" y1="20" x2="9" y2="23" />
      <line x1="15" y1="20" x2="15" y2="23" />
      <line x1="20" y1="9" x2="23" y2="9" />
      <line x1="20" y1="14" x2="23" y2="14" />
      <line x1="1" y1="9" x2="4" y2="9" />
      <line x1="1" y1="14" x2="4" y2="14" />
    </svg>
  );
}

// ── Swords / Battle ──
export function IconSwords({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
      <line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" />
      <polyline points="9.5 17.5 21 6 21 3 18 3 6.5 14.5" />
      <line x1="11" y1="19" x2="5" y2="13" />
      <line x1="8" y1="16" x2="4" y2="20" />
    </svg>
  );
}

// ── Gamepad / Lab ──
export function IconLab({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="7" y1="16" x2="17" y2="16" />
    </svg>
  );
}

// ── Timeline / Clock ──
export function IconTimeline({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Check / Verified ──
export function IconCheck({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ── Refresh / Cycle ──
export function IconRefresh({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

// ── Sun ──
export function IconSun({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// ── Moon ──
export function IconMoon({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

// ── User / Developer ──
export function IconUser({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── Palette / Design ──
export function IconPalette({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

// ── Microscope / Research ──
export function IconMicroscope({ className = '', size = 18 }: IconProps) {
  return (
    <svg {...d(size, className)}>
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}
