import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const terminalLines = [
  { prompt: '$ ', text: 'npx create-future --template ai-coding', delay: 38 },
  { prompt: '', text: '', delay: 0 },
  { prompt: '  ', text: '[scan] Analyzing the AI coding revolution...', delay: 22 },
  { prompt: '  ', text: '[data] Loading data from 2018-2025...', delay: 22 },
  { prompt: '  ', text: '', delay: 0 },
  { prompt: '  ', text: '[done] 25 milestones tracked', delay: 28 },
  { prompt: '  ', text: '[done] 5 AI tools compared', delay: 28 },
  { prompt: '  ', text: '[done] 10 programming languages ranked', delay: 28 },
  { prompt: '', text: '', delay: 0 },
  { prompt: '$ ', text: 'echo "Welcome to the AI Code Era"', delay: 38 },
];

// Fun quotes shown when user is idle ≥ 25s
const IDLE_QUOTES = [
  '// 我不是在偷懒，我在等待 AI 帮我写代码',
  '// The best code is no code at all. -- AI probably',
  '$ git blame -- AI wrote this, not me',
  '// TODO: 让 AI 完成这个 TODO',
  '$ curl https://api.ai/v1/do_my_job | bash',
  '// 程序员的进化：码农 → 提示工程师',
  '$ sudo apt-get install artificial_intelligence',
  '// 99 bugs in the code, 99 bugs... take one down, patch it around... 127 bugs in the code.',
];

function getLineColor(line: string) {
  if (line.startsWith('$')) return 'text-emerald-400';
  if (line.includes('[done]')) return 'text-cyan-300';
  if (line.includes('[scan]') || line.includes('[data]')) return 'text-slate-400';
  return 'text-green-400';
}

export default function HeroTerminal() {
  const prefersReduced = useReducedMotion();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isDone, setIsDone] = useState(false);
  const [idleLines, setIdleLines] = useState<string[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const quoteIndexRef = useRef(0);

  // Idle easter egg — after 25s of no user interaction, type a fun quote
  const resetIdleTimer = useCallback(() => {
    clearTimeout(idleTimerRef.current);
    if (!isDone) return;
    idleTimerRef.current = setTimeout(() => {
      const quote = IDLE_QUOTES[quoteIndexRef.current % IDLE_QUOTES.length];
      quoteIndexRef.current++;
      // Type it char by char into idleLines
      let i = 0;
      const typeInterval = setInterval(() => {
        setIdleLines(prev => {
          const lines = [...prev];
          if (lines.length === 0 || lines[lines.length - 1] === quote.slice(0, i - 1)) {
            lines.push('');
          }
          lines[lines.length - 1] = quote.slice(0, i + 1);
          return lines;
        });
        i++;
        if (i >= quote.length) {
          clearInterval(typeInterval);
          // Keep last 3 idle lines max
          setTimeout(() => setIdleLines(prev => prev.slice(-3)), 0);
        }
      }, 45);
    }, 25_000);
  }, [isDone]);

  useEffect(() => {
    if (!isDone) return;
    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      clearTimeout(idleTimerRef.current);
    };
  }, [isDone, resetIdleTimer]);

  // Typewriter logic
  useEffect(() => {
    if (prefersReduced) {
      // Instantly show all lines
      setDisplayedLines(terminalLines.map(l => l.prompt + l.text));
      setIsTyping(false);
      setIsDone(true);
      return;
    }
    if (currentLine >= terminalLines.length) {
      setIsTyping(false);
      setIsDone(true);
      return;
    }

    const line = terminalLines[currentLine];
    const fullText = line.prompt + line.text;

    if (currentChar < fullText.length) {
      const id = setTimeout(() => {
        setDisplayedLines(prev => {
          const next = [...prev];
          next[currentLine] = fullText.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar(c => c + 1);
      }, line.delay);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
        setDisplayedLines(prev => [...prev, '']);
      }, 180);
      return () => clearTimeout(id);
    }
  }, [currentLine, currentChar, prefersReduced]);

  // Auto-scroll terminal body
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayedLines]);

  // 3D tilt on mouse move
  useEffect(() => {
    if (prefersReduced) return;
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: dy * -5, y: dx * 6 });
    };
    const onLeave = () => setTilt({ x: 0, y: 0 });
    el.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [prefersReduced]);

  return (
    <motion.div
      ref={containerRef}
      initial={prefersReduced ? false : { opacity: 0, y: 60, rotateX: 12, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      transition={{ duration: 1.1, delay: 0.95, ease: [0.23, 1, 0.32, 1] }}
      className="w-full max-w-2xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="rounded-2xl overflow-hidden terminal-glow"
        style={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {/* Terminal header — macOS style */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-200/90 dark:bg-[#1a1a2e] border-b border-slate-300/50 dark:border-white/5 relative overflow-hidden">
          {/* Subtle shimmer on header */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-[shimmer_4s_ease-in-out_2s_infinite]" />

          <div className="flex gap-1.5">
            <motion.div
              className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-[0_0_6px_rgba(255,95,87,0.4)]"
              whileHover={{ scale: 1.3 }}
              title="close"
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-[#febc2e] shadow-[0_0_6px_rgba(254,188,46,0.4)]"
              whileHover={{ scale: 1.3 }}
              title="minimize"
            />
            <motion.div
              className="w-3 h-3 rounded-full bg-[#28c840] shadow-[0_0_6px_rgba(40,200,64,0.4)]"
              whileHover={{ scale: 1.3 }}
              title="fullscreen"
            />
          </div>
          <span className="ml-2 text-xs text-slate-400 dark:text-slate-500 font-mono tracking-wide">
            ai-code-era — zsh — 80×24
          </span>

          {/* Live indicator */}
          {isTyping && (
            <span className="ml-auto flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          )}
          {isDone && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-auto flex items-center gap-1.5 text-[10px] text-cyan-400 font-mono"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              READY
            </motion.span>
          )}
        </div>

        {/* Terminal body */}
        <div
          ref={bodyRef}
          className="bg-[#0d1117] p-5 sm:p-6 font-mono text-[13px] leading-6 max-h-[320px] overflow-y-auto relative scroll-smooth"
          role="log"
          aria-live="polite"
          aria-label="Terminal output"
        >
          {/* CRT scanline overlay */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.08)_2px,rgba(0,0,0,0.08)_4px)] pointer-events-none z-10" />

          {/* Vertical scan beam */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.025] to-transparent bg-[length:100%_40px] animate-[scanlineMove_3s_linear_infinite] pointer-events-none z-10" />

          {displayedLines.map((line, i) => (
            <motion.div
              key={i}
              className="whitespace-pre-wrap relative z-20"
              initial={prefersReduced ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <span className={getLineColor(line)}>{line}</span>
              {i === currentLine && isTyping && (
                <motion.span
                  className="text-cyan-400"
                  style={{ textShadow: '0 0 10px rgba(6,182,212,0.9)' }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  ▊
                </motion.span>
              )}
            </motion.div>
          ))}

          {isDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-1 relative z-20"
            >
              {/* Idle easter egg lines */}
              {idleLines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  <span className="text-violet-400/80 text-[11px]">{line}</span>
                </div>
              ))}

              <span className="text-emerald-400">$ </span>
              <motion.span
                className="text-cyan-400"
                style={{ textShadow: '0 0 10px rgba(6,182,212,0.9)' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              >
                ▊
              </motion.span>
            </motion.div>
          )}
        </div>

        {/* Glow footer bar */}
        <motion.div
          className="h-[2px] bg-gradient-to-r from-cyan-500 via-violet-500 to-rose-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isDone ? 1 : 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: 'left center' }}
        />
      </motion.div>
    </motion.div>
  );
}
