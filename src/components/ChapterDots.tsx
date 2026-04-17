import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Chapter {
  id: string;
  label: string;
}

export default function ChapterDots({
  chapters,
  accentColor = 'rgb(34,211,238)',
  offsetTop = '50%',
}: {
  chapters: Chapter[];
  accentColor?: string;
  offsetTop?: string;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = chapters.findIndex(c => c.id === e.target.id);
            if (idx >= 0) setActive(idx);
          }
        }
      },
      { threshold: 0.45 },
    );
    for (const c of chapters) {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [chapters]);

  return (
    <div
      className="fixed right-6 z-40 hidden lg:flex flex-col gap-4 items-end -translate-y-1/2"
      style={{ top: offsetTop }}
    >
      {chapters.map((c, i) => (
        <button
          key={c.id}
          onClick={() => document.getElementById(c.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-2.5"
          aria-label={c.label}
        >
          {/* Label */}
          <span
            className={`text-[10px] font-mono tracking-widest transition-all duration-300 whitespace-nowrap ${
              active === i ? 'opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'
            }`}
            style={active === i ? { color: accentColor } : undefined}
          >
            {String(i + 1).padStart(2, '0')} {c.label}
          </span>
          {/* Dash */}
          <motion.div
            animate={{
              width: active === i ? 28 : 8,
              backgroundColor: active === i ? accentColor : 'rgb(100,116,139)',
              opacity: active === i ? 1 : 0.45,
            }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="h-[2px] rounded-full flex-shrink-0"
          />
        </button>
      ))}
    </div>
  );
}
