import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import rankingsData from '../../data/language_rankings.json';
import type { LanguageRankingsData } from '../../types';

const data = rankingsData as LanguageRankingsData;

export default function RacingBarChart() {
  const [yearIndex, setYearIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentYear = data.years[yearIndex];
  const maxScore = 100;

  const sortedLanguages = [...data.languages]
    .map(lang => ({ ...lang, score: lang.scores[yearIndex] }))
    .sort((a, b) => b.score - a.score);

  const play = useCallback(() => setIsPlaying(true), []);
  const pause = useCallback(() => setIsPlaying(false), []);
  const reset = useCallback(() => { setIsPlaying(false); setYearIndex(0); }, []);

  useEffect(() => {
    if (!isPlaying) return;
    if (yearIndex >= data.years.length - 1) { setIsPlaying(false); return; }
    const timer = setTimeout(() => setYearIndex(i => i + 1), 1200);
    return () => clearTimeout(timer);
  }, [isPlaying, yearIndex]);

  return (
    <div>
      {/* Year display — massive watermark */}
      <div className="text-center mb-8 relative">
        <span className="text-[120px] sm:text-[160px] font-black text-slate-100 dark:text-white/[0.03] select-none leading-none">
          {currentYear}
        </span>
      </div>

      {/* Bars */}
      <div className="space-y-2.5 -mt-20 relative">
        <AnimatePresence>
          {sortedLanguages.map((lang) => (
            <motion.div
              key={lang.name}
              layout
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="flex items-center gap-3"
            >
              <div className="w-24 text-right text-sm font-bold text-slate-600 dark:text-slate-400 shrink-0 font-mono">
                {lang.name}
              </div>
              <div className="flex-1 h-9 bg-slate-100 dark:bg-white/[0.03] rounded-lg overflow-hidden">
                <motion.div
                  className="h-full rounded-lg flex items-center justify-end pr-3 relative overflow-hidden"
                  style={{ backgroundColor: lang.color }}
                  animate={{ width: `${(lang.score / maxScore) * 100}%` }}
                  transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Shine effect on bar */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_3s_ease_infinite]" />
                  <span className="text-xs font-black text-white drop-shadow-md relative z-10">
                    {lang.score}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Controls — premium pill buttons */}
      <div className="flex items-center justify-center gap-3 mt-10">
        <motion.button
          onClick={reset}
          className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-white/[0.06] text-slate-500 dark:text-white/30 text-sm font-medium hover:border-slate-400 dark:hover:border-white/15 hover:text-slate-800 dark:hover:text-white/60 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Reset
        </motion.button>
        <motion.button
          onClick={isPlaying ? pause : play}
          className="px-7 py-2.5 rounded-full bg-slate-900 dark:bg-white/15 text-white text-sm font-medium transition-all duration-300 hover:bg-slate-800 dark:hover:bg-white/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </motion.button>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={data.years.length - 1}
            value={yearIndex}
            onChange={(e) => { setIsPlaying(false); setYearIndex(Number(e.target.value)); }}
            className="w-28 accent-slate-500 h-px cursor-pointer"
          />
          <span className="font-mono text-[10px] text-slate-400/50 dark:text-white/15 w-10 tabular-nums tracking-wider">{currentYear}</span>
        </div>
      </div>
    </div>
  );
}
