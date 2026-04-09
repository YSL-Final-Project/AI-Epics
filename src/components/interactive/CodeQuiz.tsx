import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import snippetsData from '../../data/code_snippets.json';
import type { CodeSnippet } from '../../types';
import CodeSnippetCard from './CodeSnippetCard';
import { useI18n } from '../../i18n';

const snippets = snippetsData as CodeSnippet[];

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0, filter: 'blur(6px)', scale: 0.97 }),
  center:              ({ x: 0,        opacity: 1, filter: 'blur(0px)', scale: 1    }),
  exit:  (dir: number) => ({ x: dir * -60, opacity: 0, filter: 'blur(6px)', scale: 0.97 }),
};

export default function CodeQuiz() {
  const { t } = useI18n();
  const tq = t.interactive.quiz;
  const prefersReduced = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<Record<number, 'human' | 'ai'>>({});
  const [showResult, setShowResult] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const currentSnippet = snippets[currentIndex];
  const isAnswered = currentIndex in answers;
  const isFinished = Object.keys(answers).length === snippets.length;

  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => snippets[Number(idx)].source === ans
  ).length;
  const accuracy = snippets.length > 0 ? Math.round((correctCount / snippets.length) * 100) : 0;

  const handleAnswer = (answer: 'human' | 'ai') => {
    const isCorrect = answer === currentSnippet.source;
    setAnswers(prev => ({ ...prev, [currentIndex]: answer }));
    setFeedbackState(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setFeedbackState('idle');
    setDirection(1);
    if (currentIndex < snippets.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setAnswers({});
    setShowResult(false);
    setFeedbackState('idle');
    setDirection(1);
  };

  // ── Result Screen ──
  if (showResult) {
    const r = 42;
    const circumference = 2 * Math.PI * r;
    return (
      <motion.div
        key="result"
        initial={prefersReduced ? false : { opacity: 0, scale: 0.92, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="text-center py-10"
      >
        {/* Progress ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-200/40 dark:text-white/[0.04]" />
            <motion.circle
              cx="50" cy="50" r={r}
              fill="none" stroke="currentColor" strokeWidth="3"
              strokeLinecap="round"
              className="text-slate-700 dark:text-white/60"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - (circumference * accuracy) / 100 }}
              transition={{ duration: 1.5, delay: 0.3, ease: [0.32, 0.72, 0, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="text-3xl font-black text-slate-900 dark:text-white tabular-nums"
            >
              {accuracy}%
            </motion.span>
            <span className="font-mono text-[8px] tracking-[0.2em] text-slate-400/50 dark:text-white/15 uppercase">
              {tq.accuracy}
            </span>
          </div>
        </div>

        <div className="overflow-hidden mb-2">
          <motion.p
            initial={prefersReduced ? false : { y: '100%' }}
            animate={{ y: '0%' }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="font-mono text-[10px] tracking-[0.3em] text-slate-400/50 dark:text-white/15 uppercase"
          >
            {correctCount} / {snippets.length} {tq.correct}
          </motion.p>
        </div>

        <motion.button
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          onClick={handleRestart}
          className="mt-6 relative px-8 py-3 rounded-full text-sm font-medium overflow-hidden group"
          whileHover={prefersReduced ? {} : { scale: 1.05 }}
          whileTap={prefersReduced ? {} : { scale: 0.95 }}
        >
          <div className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white/15 transition-transform duration-300 group-hover:scale-105" />
          <span className="relative z-10 text-white tracking-wide">{tq.restart}</span>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Progress dots */}
      <div className="flex items-center gap-1.5 mb-6 justify-center">
        {snippets.map((_, i) => (
          <motion.div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 bg-slate-700 dark:bg-white/60'
                : i < currentIndex
                ? 'w-1.5 bg-slate-400/60 dark:bg-white/20'
                : 'w-1.5 bg-slate-200 dark:bg-white/[0.06]'
            }`}
            layout
          />
        ))}
      </div>

      {/* Snippet card — slide transition */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={prefersReduced ? {} : slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
          <CodeSnippetCard snippet={currentSnippet} />
        </motion.div>
      </AnimatePresence>

      {/* Answer Buttons */}
      <AnimatePresence mode="wait">
        {!isAnswered ? (
          <motion.div
            key="buttons"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex gap-3 justify-center mt-6"
          >
            {[
              { answer: 'human' as const, label: tq.human },
              { answer: 'ai' as const, label: tq.ai },
            ].map((btn, i) => (
              <motion.button
                key={btn.answer}
                onClick={() => handleAnswer(btn.answer)}
                className="relative px-8 py-3 rounded-full text-sm font-medium overflow-hidden group"
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                whileHover={prefersReduced ? {} : { scale: 1.06 }}
                whileTap={prefersReduced ? {} : { scale: 0.94 }}
              >
                <div className="absolute inset-0 rounded-full border border-slate-300 dark:border-white/10 group-hover:border-slate-500 dark:group-hover:border-white/25 transition-colors duration-300 group-hover:bg-slate-900 dark:group-hover:bg-white/10" />
                <span className="relative z-10 text-slate-600 dark:text-white/40 group-hover:text-white transition-colors duration-300 tracking-wide">
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="feedback"
            initial={prefersReduced ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="mt-6"
          >
            <motion.div
              className={`p-5 rounded-2xl border ${
                feedbackState === 'correct'
                  ? 'bg-slate-50 dark:bg-white/[0.02] border-slate-300 dark:border-white/10'
                  : 'bg-slate-50 dark:bg-white/[0.02] border-slate-300 dark:border-white/10'
              }`}
              animate={
                prefersReduced ? {} :
                feedbackState === 'wrong'
                  ? { x: [-8, 7, -5, 4, -2, 0] }
                  : { scale: [1, 1.02, 1] }
              }
              transition={{ duration: feedbackState === 'wrong' ? 0.45 : 0.3 }}
            >
              <div className="overflow-hidden">
                <motion.p
                  initial={prefersReduced ? false : { y: '100%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                  className="text-sm font-bold text-slate-800 dark:text-white/80 mb-1"
                >
                  {feedbackState === 'correct' ? tq.feedbackCorrect : tq.feedbackWrong} — {currentSnippet.source === 'human' ? tq.human : tq.ai}
                </motion.p>
              </div>
            </motion.div>

            <div className="text-center mt-4">
              <motion.button
                initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                onClick={handleNext}
                className="relative px-8 py-3 rounded-full text-sm font-medium overflow-hidden group"
                whileHover={prefersReduced ? {} : { scale: 1.05 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
              >
                <div className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white/15" />
                <span className="relative z-10 text-white tracking-wide">
                  {isFinished ? tq.results : tq.next}
                </span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
