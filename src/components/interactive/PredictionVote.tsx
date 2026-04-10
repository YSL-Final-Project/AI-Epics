import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import questionsData from '../../data/quiz_questions.json';
import type { QuizQuestion } from '../../types';
import { useI18n } from '../../i18n';

const questions = questionsData as QuizQuestion[];

export default function PredictionVote() {
  const { t, lang } = useI18n();
  const prefersReduced = useReducedMotion();
  const [votes, setVotes] = useState<Record<number, number>>(() => {
    try {
      const saved = localStorage.getItem('prediction_votes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleVote = (questionId: number, optionIndex: number) => {
    const newVotes = { ...votes, [questionId]: optionIndex };
    setVotes(newVotes);
    try { localStorage.setItem('prediction_votes', JSON.stringify(newVotes)); } catch { /* noop */ }
  };

  return (
    <div className="space-y-8">
      {questions.map((q, qi) => {
        const hasVoted = q.id in votes;
        const userChoice = votes[q.id];
        const totalVotes = hasVoted
          ? q.mockResults.reduce((a, b) => a + b, 0) + 1
          : 0;

        return (
          <motion.div
            key={q.id}
            initial={prefersReduced ? false : { opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: qi * 0.08, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl p-6 bg-slate-50/60 dark:bg-white/[0.02] border border-slate-200/40 dark:border-white/[0.04] relative overflow-hidden"
          >
            {/* Question — line reveal */}
            <div className="overflow-hidden mb-5">
              <motion.h4
                initial={prefersReduced ? false : { y: '100%' }}
                whileInView={{ y: '0%' }}
                viewport={{ once: true }}
                transition={{ delay: qi * 0.08 + 0.1, duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                className="text-base font-bold text-slate-900 dark:text-white/90"
              >
                {lang === 'en' && q.questionEn ? q.questionEn : q.question}
              </motion.h4>
            </div>

            <AnimatePresence mode="wait">
              {!hasVoted ? (
                /* ── Option Buttons — premium pill style ── */
                <motion.div
                  key="options"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {(lang === 'en' && q.optionsEn ? q.optionsEn : q.options).map((opt, i) => (
                    <motion.button
                      key={i}
                      initial={prefersReduced ? false : { opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: qi * 0.08 + i * 0.06, duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                      onClick={() => handleVote(q.id, i)}
                      className="px-4 py-3 rounded-xl text-sm text-left font-medium bg-white/60 dark:bg-white/[0.03] text-slate-600 dark:text-white/35 border border-slate-200/50 dark:border-white/[0.05] hover:border-slate-400 dark:hover:border-white/15 hover:text-slate-900 dark:hover:text-white/70 transition-all duration-300"
                      whileHover={prefersReduced ? {} : { scale: 1.02, x: 4 }}
                      whileTap={prefersReduced ? {} : { scale: 0.97 }}
                    >
                      {opt}
                    </motion.button>
                  ))}
                </motion.div>
              ) : (
                /* ── Results — animated bars ── */
                <motion.div
                  key="results"
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="space-y-3"
                >
                  {(lang === 'en' && q.optionsEn ? q.optionsEn : q.options).map((opt, i) => {
                    const rawCount = q.mockResults[i] + (userChoice === i ? 1 : 0);
                    const pct = totalVotes > 0 ? (rawCount / totalVotes) * 100 : 0;
                    const isChosen = userChoice === i;

                    return (
                      <motion.div
                        key={i}
                        initial={prefersReduced ? false : { opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                      >
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <span className={`text-sm truncate ${
                            isChosen
                              ? 'font-bold text-slate-800 dark:text-white/70'
                              : 'text-slate-500 dark:text-white/25'
                          }`}>
                            {opt}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-400 dark:text-white/20 tabular-nums">
                            {Math.round(pct)}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-slate-200/60 dark:bg-white/[0.03] rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              isChosen
                                ? 'bg-slate-700 dark:bg-white/50'
                                : 'bg-slate-300/60 dark:bg-white/10'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ delay: 0.15 + i * 0.1, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="font-mono text-[9px] text-slate-400/50 dark:text-white/15 tracking-wider uppercase pt-2"
                  >
                    {totalVotes} {t.interactive.vote.votes}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
