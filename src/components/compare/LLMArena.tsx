import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import arenaQuestions from '../../data/arena_questions';
import type { ArenaModel } from '../../data/arena_questions';
import { useI18n } from '../../i18n';
import LineReveal from '../animations/LineReveal';

// ── Simple Markdown-ish renderer ────────────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = '';

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.slice(3).trim();
        codeLines = [];
      } else {
        elements.push(
          <div key={`code-${i}`} className="my-2 rounded-lg overflow-hidden">
            {codeLang && (
              <div className="px-3 py-1 bg-black/[0.04] dark:bg-white/[0.04] text-[10px] font-mono text-black/30 dark:text-white/30 border-b border-black/[0.04] dark:border-white/[0.04]">
                {codeLang}
              </div>
            )}
            <pre className="p-3 bg-black/[0.02] dark:bg-white/[0.02] text-[12px] font-mono leading-relaxed overflow-x-auto text-cyan-700 dark:text-cyan-300/70">
              {codeLines.join('\n')}
            </pre>
          </div>
        );
        inCode = false;
        codeLines = [];
        codeLang = '';
      }
      return;
    }

    if (inCode) {
      codeLines.push(line);
      return;
    }

    // Headers
    if (line.startsWith('## ')) {
      elements.push(<h4 key={i} className="text-sm font-bold text-black/80 dark:text-white/80 mt-3 mb-1">{line.slice(3)}</h4>);
      return;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="text-xs font-semibold text-black/60 dark:text-white/60 mt-2 mb-0.5">{line.slice(2, -2)}</p>);
      return;
    }

    // Table (simplified)
    if (line.startsWith('|')) {
      if (line.includes('---')) return; // separator row
      const cells = line.split('|').filter(c => c.trim());
      elements.push(
        <div key={i} className="flex gap-2 text-[11px] font-mono text-black/40 dark:text-white/40 py-0.5">
          {cells.map((cell, ci) => (
            <span key={ci} className="flex-1 truncate">{cell.trim()}</span>
          ))}
        </div>
      );
      return;
    }

    // Inline formatting
    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
      return;
    }

    // Bold + inline code
    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-black/[0.06] dark:bg-white/[0.06] rounded text-[11px] text-cyan-700 dark:text-cyan-400/70 font-mono">$1</code>');

    // List items
    if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-1.5 text-xs text-black/50 dark:text-white/50 leading-relaxed ml-1">
          <span className="text-cyan-500/40 mt-0.5 shrink-0">&#x2022;</span>
          <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
        </div>
      );
      return;
    }
    if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      elements.push(
        <div key={i} className="flex gap-1.5 text-xs text-black/50 dark:text-white/50 leading-relaxed ml-1">
          <span className="text-black/20 dark:text-white/20 shrink-0 w-3 text-right">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\. /, '') }} />
        </div>
      );
      return;
    }

    elements.push(
      <p key={i} className="text-xs text-black/50 dark:text-white/50 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
    );
  });

  return elements;
}

// ── Typing Indicator ────────────────────────────────────────────────────────

function TypingDots({ color }: { color: string }) {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: color }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
          transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ── Single Model Chat Column ────────────────────────────────────────────────

function ModelColumn({
  model,
  playing,
  speedMultiplier,
  onDone,
}: {
  model: ArenaModel;
  playing: boolean;
  speedMultiplier: number;
  onDone: () => void;
}) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const accRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

  // Reset on play
  useEffect(() => {
    if (playing) {
      setDisplayedChars(0);
      setStarted(false);
      setDone(false);
      accRef.current = 0;

      const delayTimer = setTimeout(() => {
        setStarted(true);
      }, model.delay);

      return () => clearTimeout(delayTimer);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
  }, [playing, model.delay]);

  // Streaming animation
  useEffect(() => {
    if (!started || !playing) return;

    const tick = () => {
      accRef.current += model.speed * speedMultiplier;
      const newChars = Math.floor(accRef.current);
      if (newChars >= model.answer.length) {
        setDisplayedChars(model.answer.length);
        setDone(true);
        onDone();
        return;
      }
      setDisplayedChars(newChars);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [started, playing, model.speed, model.answer.length, speedMultiplier, onDone]);

  // Auto-scroll chat body
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayedChars]);

  const visibleText = model.answer.slice(0, displayedChars);
  const tokensPerSec = Math.round(model.speed * speedMultiplier * 60);

  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.05] dark:border-white/[0.05] h-[420px]">
      {/* Model Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/[0.04] dark:border-white/[0.04] bg-black/[0.02] dark:bg-white/[0.02] shrink-0">
        <span className="text-lg">{model.avatar}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black/80 dark:text-white/80 truncate">{model.name}</p>
          <p className="text-[10px] font-mono text-black/25 dark:text-white/25 tracking-wide">{model.badge}</p>
        </div>
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: done ? model.color : started ? model.color : 'rgba(255,255,255,0.15)' }}
            animate={started && !done ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono text-black/20 dark:text-white/20">
            {done ? 'DONE' : started ? 'TYPING' : 'WAIT'}
          </span>
        </div>
      </div>

      {/* Chat Body */}
      <div ref={bodyRef} className="flex-1 overflow-y-auto px-4 py-3 scroll-smooth">
        {!started && playing ? (
          <TypingDots color={model.color} />
        ) : displayedChars > 0 ? (
          <div className="space-y-0">
            {renderMarkdown(visibleText)}
            {/* Blinking cursor */}
            {!done && (
              <motion.span
                className="inline-block w-[6px] h-[14px] ml-0.5 align-middle rounded-sm"
                style={{ background: model.color }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>
        ) : null}
      </div>

      {/* Footer: Token counter */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.04] dark:border-white/[0.04] bg-black/[0.015] dark:bg-white/[0.015] shrink-0">
        <span className="text-[10px] font-mono text-black/15 dark:text-white/15">
          {displayedChars} / {model.answer.length} chars
        </span>
        <span className="text-[10px] font-mono tabular-nums" style={{ color: model.color, opacity: 0.5 }}>
          {started ? `~${tokensPerSec} tok/s` : '—'}
        </span>
      </div>
    </div>
  );
}

// ── Main LLMArena ───────────────────────────────────────────────────────────

export default function LLMArena() {
  const { lang } = useI18n();
  const [activeQ, setActiveQ] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState(0);
  const [doneCount, setDoneCount] = useState(0);
  const speeds = [1, 2, 4];
  const question = arenaQuestions[activeQ];

  const handleModelDone = useCallback(() => {
    setDoneCount(c => c + 1);
  }, []);

  const startPlay = useCallback(() => {
    setDoneCount(0);
    setPlaying(true);
  }, []);

  const switchQuestion = useCallback((idx: number) => {
    setPlaying(false);
    setDoneCount(0);
    setActiveQ(idx);
    setTimeout(() => {
      setDoneCount(0);
      setPlaying(true);
    }, 300);
  }, []);

  // Auto-start on mount
  useEffect(() => {
    const t = setTimeout(() => startPlay(), 800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const allDone = doneCount >= 3;

  return (
    <div className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.p
          className="font-mono text-[10px] tracking-[0.6em] text-black/20 dark:text-white/20 uppercase mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          05 / Arena
        </motion.p>
        <LineReveal className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
          {lang === 'zh' ? 'LLM 竞技场' : 'LLM Arena'}
        </LineReveal>
        <motion.p
          className="mt-3 text-sm text-black/30 dark:text-white/30 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {lang === 'zh'
            ? '同一个问题，三个 AI 模型，谁更胜一筹？'
            : 'Same question, three AI models — who does it better?'}
        </motion.p>
      </div>

      {/* Question Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {arenaQuestions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => switchQuestion(i)}
            className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 border ${
              activeQ === i
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-black/[0.02] dark:bg-white/[0.02] border-black/20 dark:border-white/[0.06] text-black/60 dark:text-white/30 hover:text-black/80 dark:hover:text-white/50 hover:border-black/30 dark:hover:border-white/10'
            }`}
          >
            {lang === 'zh' ? q.question.slice(0, 15) + '...' : q.questionEn.slice(0, 25) + '...'}
          </button>
        ))}
      </div>

      {/* Question Prompt Bar */}
      <motion.div
        layout
        className="max-w-3xl mx-auto mb-8 px-5 py-3.5 rounded-xl bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] flex items-center gap-3"
      >
        <span className="text-cyan-500/50 shrink-0 text-sm">{'>'}</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-black/60 dark:text-white/60 font-mono"
          >
            {lang === 'zh' ? question.question : question.questionEn}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {/* Replay */}
        <button
          onClick={startPlay}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/20 dark:border-white/[0.06] text-xs font-mono text-black/60 dark:text-white/40 hover:text-black/80 dark:hover:text-white/70 hover:border-black/30 dark:hover:border-white/15 transition-all"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 6a5 5 0 019.5-1.5M11 1v3.5H7.5" />
            <path d="M11 6a5 5 0 01-9.5 1.5M1 11V7.5h3.5" />
          </svg>
          {lang === 'zh' ? '重新播放' : 'Replay'}
        </button>

        {/* Speed */}
        <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06]">
          <span className="text-[10px] font-mono text-black/50 dark:text-white/20 mr-1">
            {lang === 'zh' ? '速度' : 'Speed'}
          </span>
          {speeds.map((s, i) => (
            <button
              key={s}
              onClick={() => setSpeedIdx(i)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-all ${
                speedIdx === i
                  ? 'bg-cyan-500/15 text-cyan-400'
                  : 'text-black/55 dark:text-white/25 hover:text-black/80 dark:hover:text-white/50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Status */}
        {allDone && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-mono text-cyan-500/50 flex items-center gap-1"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 5.5l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {lang === 'zh' ? '全部完成' : 'All done'}
          </motion.span>
        )}
      </div>

      {/* 3-Column Chat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {question.models.map((model) => (
          <ModelColumn
            key={`${question.id}-${model.name}`}
            model={model}
            playing={playing}
            speedMultiplier={speeds[speedIdx]}
            onDone={handleModelDone}
          />
        ))}
      </div>
    </div>
  );
}
