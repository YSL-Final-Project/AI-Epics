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
              <div className="px-3 py-1 bg-black/[0.06] dark:bg-white/[0.08] text-[10px] font-mono text-black/40 dark:text-white/40 border-b border-black/[0.04] dark:border-white/[0.04]">
                {codeLang}
              </div>
            )}
            <pre className="p-3 bg-black/[0.03] dark:bg-white/[0.04] text-[12px] font-mono leading-relaxed overflow-x-auto text-cyan-700 dark:text-cyan-300/80">
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

    if (line.startsWith('## ')) {
      elements.push(<h4 key={i} className="text-sm font-bold text-black/90 dark:text-white/90 mt-3 mb-1">{line.slice(3)}</h4>);
      return;
    }
    if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={i} className="text-xs font-semibold text-black/70 dark:text-white/70 mt-2 mb-0.5">{line.slice(2, -2)}</p>);
      return;
    }

    if (line.startsWith('|')) {
      if (line.includes('---')) return;
      const cells = line.split('|').filter(c => c.trim());
      elements.push(
        <div key={i} className="flex gap-2 text-[11px] font-mono text-black/50 dark:text-white/50 py-0.5">
          {cells.map((cell, ci) => (
            <span key={ci} className="flex-1 truncate">{cell.trim()}</span>
          ))}
        </div>
      );
      return;
    }

    if (line.trim() === '') {
      elements.push(<div key={i} className="h-1.5" />);
      return;
    }

    const formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-black/[0.08] dark:bg-white/[0.10] rounded text-[11px] text-cyan-700 dark:text-cyan-400/90 font-mono">$1</code>');

    if (line.startsWith('- ')) {
      elements.push(
        <div key={i} className="flex gap-1.5 text-xs text-black/60 dark:text-white/60 leading-relaxed ml-1">
          <span className="text-cyan-500/40 mt-0.5 shrink-0">&#x2022;</span>
          <span dangerouslySetInnerHTML={{ __html: formatted.slice(2) }} />
        </div>
      );
      return;
    }
    if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      elements.push(
        <div key={i} className="flex gap-1.5 text-xs text-black/60 dark:text-white/60 leading-relaxed ml-1">
          <span className="text-black/20 dark:text-white/20 shrink-0 w-3 text-right">{num}.</span>
          <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\. /, '') }} />
        </div>
      );
      return;
    }

    elements.push(
      <p key={i} className="text-xs text-black/60 dark:text-white/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
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

// ── Judging Animation ───────────────────────────────────────────────────────

function JudgingAnimation({ models, onComplete }: { models: ArenaModel[]; onComplete: () => void }) {
  const [phase, setPhase] = useState<'pulse' | 'check'>('pulse');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('check');
      setTimeout(onComplete, 400);
    }, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-3"
    >
      {phase === 'pulse' ? (
        models.map((m, i) => (
          <motion.div
            key={m.name}
            className="w-3 h-3 rounded-full"
            style={{ background: m.color }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
          />
        ))
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-500">
            <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Quality Metrics Bar (speed auto-computed, rest data-driven) ──────────────

function QualityMetrics({
  models,
  scores,
  labels,
}: {
  models: ArenaModel[];
  scores: [number, number][];  // per model: [completeness, codeQuality]
  labels: { speed: string; completeness: string; codeQuality: string; title: string };
}) {
  // Auto-compute speed from animation: lower finish time = higher score
  // finish time = delay(ms) + (answer.length / speed) * 16.67ms per RAF frame
  const finishTimes = models.map(m => m.delay + (m.answer.length / m.speed) * 16.67);
  const minTime = Math.min(...finishTimes);
  const speedScores = finishTimes.map(t => Math.round((minTime / t) * 100));

  const allScores = models.map((_, mi) => [speedScores[mi], scores[mi][0], scores[mi][1]]);

  const rows = [
    { key: 0, label: labels.speed },
    { key: 1, label: labels.completeness },
    { key: 2, label: labels.codeQuality },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-6 max-w-3xl mx-auto"
    >
      <p className="text-[10px] font-mono tracking-[0.4em] text-black/30 dark:text-white/25 uppercase mb-4 text-center">
        {labels.title}
      </p>
      <div className="space-y-4">
        {rows.map((row, ri) => (
          <motion.div
            key={row.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + ri * 0.1, duration: 0.4 }}
          >
            <p className="text-[11px] text-black/50 dark:text-white/40 mb-1.5 font-mono">{row.label}</p>
            <div className="space-y-1">
              {models.map((m, mi) => {
                const val = allScores[mi][row.key];
                const isBest = val === Math.max(...allScores.map(s => s[row.key]));
                return (
                  <div key={m.name} className="flex items-center gap-2">
                    <span className="w-20 text-[10px] text-right text-black/40 dark:text-white/35 truncate shrink-0">
                      {m.name.replace(' 3.5 Sonnet', '').replace(' Pro', '')}
                    </span>
                    <div className="flex-1 h-4 bg-black/[0.05] dark:bg-white/[0.05] rounded overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${val}%` }}
                        transition={{ delay: 0.4 + ri * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                        className="h-full rounded"
                        style={{ backgroundColor: m.color, opacity: isBest ? 0.9 : 0.55 }}
                      />
                    </div>
                    <span className={`text-[10px] tabular-nums w-8 text-right ${isBest ? 'font-bold text-black/60 dark:text-white/60' : 'text-black/30 dark:text-white/25'}`}>
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Single Model Chat Column ────────────────────────────────────────────────

type ArenaPhase = 'idle' | 'streaming' | 'judging' | 'voted';

function ModelColumn({
  model,
  playing,
  onDone,
  statusLabels,
  phase,
  isVoted,
  onVote,
  colIndex,
}: {
  model: ArenaModel;
  playing: boolean;
  onDone: () => void;
  statusLabels: { done: string; typing: string; wait: string; charsLabel: string };
  phase: ArenaPhase;
  isVoted: boolean;
  onVote: () => void;
  colIndex: number;
}) {
  const speedMultiplier = 1;
  const [displayedChars, setDisplayedChars] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number>(0);
  const accRef = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [displayedChars]);

  const visibleText = model.answer.slice(0, displayedChars);
  const tokensPerSec = Math.round(model.speed * speedMultiplier * 60);

  const showVoteOverlay = phase === 'voted' && !isVoted;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: colIndex * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="relative flex flex-col rounded-xl overflow-hidden bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.08] dark:border-white/[0.10] h-[420px]"
      style={{
        boxShadow: started && !done
          ? `0 0 24px ${model.color}30, 0 0 48px ${model.color}15`
          : isVoted
            ? `0 0 28px ${model.color}35, 0 0 56px ${model.color}18`
            : 'none',
        transition: 'box-shadow 0.5s ease',
      }}
    >
      {/* Model Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] shrink-0">
        <span className="text-lg">{model.avatar}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black/90 dark:text-white/90 truncate">{model.name}</p>
          <p className="text-[10px] font-mono text-black/35 dark:text-white/35 tracking-wide">{model.badge}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: done ? model.color : started ? model.color : 'rgba(255,255,255,0.15)' }}
            animate={started && !done ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
          <span className="text-[9px] font-mono text-black/35 dark:text-white/35">
            {done ? statusLabels.done : started ? statusLabels.typing : statusLabels.wait}
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
            {!done && (
              <motion.span
                className="inline-block w-[6px] h-[14px] ml-0.5 align-middle rounded-sm"
                style={{ background: model.color }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>
        ) : (
          /* Idle state — show placeholder */
          phase === 'idle' ? (
            <div className="h-full flex items-center justify-center">
              <span className="text-[11px] text-black/25 dark:text-white/20 font-mono">···</span>
            </div>
          ) : null
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] shrink-0">
        <span className="text-[10px] font-mono text-black/30 dark:text-white/30">
          {displayedChars} / {model.answer.length} {statusLabels.charsLabel}
        </span>
        <span className="text-[10px] font-mono tabular-nums" style={{ color: model.color, opacity: 0.7 }}>
          {started ? `~${tokensPerSec} tok/s` : '—'}
        </span>
      </div>

      {/* Vote Overlay */}
      <AnimatePresence>
        {showVoteOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center bg-black/[0.03] dark:bg-black/20 backdrop-blur-[2px] cursor-pointer z-10"
            onClick={onVote}
          >
            <motion.div
              whileHover={{ scale: 1.08, backgroundColor: `${model.color}20` }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2.5 rounded-lg border-2 text-sm font-bold transition-colors"
              style={{
                borderColor: model.color,
                color: model.color,
                backgroundColor: `${model.color}10`,
              }}
            >
              Vote
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voted indicator */}
      {isVoted && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="absolute top-3 right-3 z-10"
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: model.color }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2">
              <path d="M2.5 6.5l2.5 2.5 5-5.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ── Main LLMArena ───────────────────────────────────────────────────────────

// No localStorage persistence — voting is per-session only

export default function LLMArena() {
  const { t, lang } = useI18n();
  const tc = t.compare.arena;
  const [activeQ, setActiveQ] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [phase, setPhase] = useState<ArenaPhase>('idle');
  const [userVote, setUserVote] = useState<number | null>(null);
  const judgingDoneRef = useRef(false);
  const question = arenaQuestions[activeQ];

  // Reset vote when switching questions (no persistence — fresh choice each time)
  useEffect(() => {
    setUserVote(null);
  }, [question.id]);

  const handleModelDone = useCallback(() => {
    setDoneCount(c => c + 1);
  }, []);

  // Phase transitions: streaming → judging → voted
  useEffect(() => {
    if (doneCount >= 3 && phase === 'streaming') {
      setPhase('judging');
      judgingDoneRef.current = false;
    }
  }, [doneCount, phase]);

  const handleJudgingComplete = useCallback(() => {
    if (!judgingDoneRef.current) {
      judgingDoneRef.current = true;
      setPhase('voted');
    }
  }, []);

  const handleVote = useCallback((modelIdx: number) => {
    setUserVote(modelIdx);
  }, []);

  const startPlay = useCallback(() => {
    setDoneCount(0);
    setPhase('streaming');
    setPlaying(true);
  }, []);

  const switchQuestion = useCallback((idx: number) => {
    setPlaying(false);
    setDoneCount(0);
    setPhase('idle');
    setActiveQ(idx);
  }, []);

  // Get voted model name for emotional feedback
  const votedModelName = userVote !== null ? question.models[userVote].name : '';

  return (
    <div className="py-20">
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.p
          className="font-mono text-[10px] tracking-[0.6em] text-black/30 dark:text-white/30 uppercase mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          {tc.sectionLabel}
        </motion.p>
        <LineReveal className="text-3xl sm:text-4xl font-black text-black dark:text-white tracking-tight">
          {tc.title}
        </LineReveal>
        <motion.p
          className="mt-3 text-sm text-black/40 dark:text-white/40 font-light"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {tc.subtitle}
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
                : 'bg-black/[0.03] dark:bg-white/[0.05] border-black/10 dark:border-white/[0.10] text-black/50 dark:text-white/40 hover:text-black/70 dark:hover:text-white/60 hover:border-black/20 dark:hover:border-white/20'
            }`}
          >
            {lang === 'zh' ? q.question.slice(0, 15) + '...' : q.questionEn.slice(0, 25) + '...'}
          </button>
        ))}
      </div>

      {/* Question Prompt Bar */}
      <motion.div
        layout
        className="max-w-3xl mx-auto mb-8 px-5 py-3.5 rounded-xl bg-black/[0.04] dark:bg-white/[0.06] border border-black/[0.08] dark:border-white/[0.10] flex items-center gap-3"
      >
        <span className="text-cyan-500/70 shrink-0 text-sm">{'>'}</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={question.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-sm text-black/70 dark:text-white/70 font-mono flex-1"
          >
            {lang === 'zh' ? question.question : question.questionEn}
          </motion.p>
        </AnimatePresence>

        {/* Start button inside prompt bar */}
        {phase === 'idle' && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startPlay}
            className="shrink-0 px-4 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold transition-colors hover:bg-cyan-500/25"
          >
            {tc.startButton}
          </motion.button>
        )}
      </motion.div>

      {/* Status Area */}
      <div className="flex flex-col items-center justify-center mb-8 min-h-[32px]">
        <AnimatePresence mode="wait">
          {phase === 'judging' && (
            <motion.div key="judging" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <JudgingAnimation models={question.models} onComplete={handleJudgingComplete} />
            </motion.div>
          )}
          {phase === 'voted' && userVote === null && (
            <motion.span
              key="voting-prompt"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] font-mono text-cyan-500/80"
            >
              {tc.votingPrompt}
            </motion.span>
          )}
          {phase === 'voted' && userVote !== null && (
            <motion.div
              key="vote-done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-500">
                  <path d="M3 7.5l3 3 5.5-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[12px] font-mono text-cyan-500/90">
                  {tc.voteThank} <span className="font-bold" style={{ color: question.models[userVote].color }}>{votedModelName}</span>
                </span>
              </div>
              <span className="text-[10px] text-black/30 dark:text-white/25">{tc.voteEncourage}</span>
              <button
                onClick={() => setUserVote(null)}
                className="text-[10px] font-mono text-black/30 dark:text-white/25 hover:text-black/50 dark:hover:text-white/45 underline mt-1 transition-colors"
              >
                {tc.changeVote}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3-Column Chat Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {question.models.map((model, i) => (
            <ModelColumn
              key={`${question.id}-${model.name}`}
              model={model}
              playing={playing}
              onDone={handleModelDone}
              statusLabels={{ done: tc.statusDone, typing: tc.statusTyping, wait: tc.statusWait, charsLabel: tc.charsLabel }}
              phase={phase}
              isVoted={userVote === i}
              onVote={() => handleVote(i)}
              colIndex={i}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Quality Metrics (shown after voting) */}
      <AnimatePresence>
        {phase === 'voted' && userVote !== null && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <QualityMetrics
              models={question.models}
              scores={question.qualityScores}
              labels={{
                title: tc.metricsTitle,
                speed: tc.metricSpeed,
                completeness: tc.metricCompleteness,
                codeQuality: tc.metricCodeQuality,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
