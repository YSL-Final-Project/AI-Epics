import { useEffect, useRef, useState } from 'react';

interface CursorData {
  label: string;
  value: string;
  color: string;
  sub?: string;
}

export default function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>(0);
  const [data, setData] = useState<CursorData | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };

      // Find closest element with data-cursor-label
      const el = (e.target as HTMLElement).closest?.('[data-cursor-label]') as HTMLElement | null;
      if (el) {
        setData({
          label: el.dataset.cursorLabel || '',
          value: el.dataset.cursorValue || '',
          color: el.dataset.cursorColor || '#888',
          sub: el.dataset.cursorSub || '',
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const onLeave = () => setVisible(false);

    // Smooth follow loop
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (ref.current) {
        ref.current.style.transform = `translate(${pos.current.x + 16}px, ${pos.current.y - 8}px)`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{
        opacity: visible && data ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
    >
      {data && (
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-white/10 max-w-[240px]">
          {/* Color dot */}
          <div
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: data.color }}
          />
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[12px] font-bold text-slate-900 dark:text-white truncate">
                {data.label}
              </span>
              {data.value && (
                <span
                  className="text-[12px] font-bold tabular-nums"
                  style={{ color: data.color }}
                >
                  {data.value}
                </span>
              )}
            </div>
            {data.sub && (
              <p className="text-[10px] text-slate-400 dark:text-white/25 truncate mt-0.5 leading-tight">
                {data.sub}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
