import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Floating HUD (Heads-Up Display) overlay — sci-fi readout elements
 * at screen corners. Very subtle, adds a "command center" feel.
 */
export default function HUDOverlay() {
  const [scrollPct, setScrollPct] = useState(0);
  const [time, setTime] = useState('');

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? Math.round((window.scrollY / max) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const mono = "font-mono text-[9px] tracking-[0.2em] uppercase";
  const dim = "text-white/[0.08]";

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Top-left: System status */}
      <motion.div
        className="absolute top-16 left-4 flex flex-col gap-1"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className={`${mono} ${dim}`}>SYS:ONLINE</span>
        <span className={`${mono} ${dim}`}>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500/20 mr-1 align-middle" />
          {time}
        </span>
      </motion.div>

      {/* Top-right: Scroll progress */}
      <motion.div
        className="absolute top-16 right-4 flex flex-col items-end gap-1"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        <span className={`${mono} ${dim}`}>SCROLL</span>
        <span className={`${mono} text-cyan-500/15 tabular-nums`}>
          {scrollPct.toString().padStart(3, '0')}%
        </span>
      </motion.div>

      {/* Bottom-left: Corner brackets + label */}
      <motion.div
        className="absolute bottom-16 left-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        {/* Corner bracket SVG */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1">
          <path d="M0 8V0H8" />
          <path d="M12 0H20V8" />
          <path d="M20 12V20H12" />
          <path d="M8 20H0V12" />
        </svg>
        <span className={`${mono} ${dim} block mt-1`}>AI.CODE.ERA</span>
      </motion.div>

      {/* Bottom-right: Frame counter */}
      <motion.div
        className="absolute bottom-16 right-4 flex flex-col items-end gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.7, duration: 1 }}
      >
        <span className={`${mono} ${dim}`}>v2.0.25</span>
        <div className="flex gap-0.5">
          {[0.06, 0.08, 0.12, 0.08, 0.06].map((op, i) => (
            <div key={i} className="w-0.5 rounded-full bg-cyan-400" style={{ height: 4 + Math.random() * 8, opacity: op }} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
