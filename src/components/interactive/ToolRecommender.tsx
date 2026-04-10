import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import recommendationsData from '../../data/tool_recommendations.json';
import type { ToolRecommendation } from '../../types';
import { useI18n } from '../../i18n';

const recommendations = recommendationsData as ToolRecommendation[];
const languages = ['Python', 'JavaScript', 'TypeScript', 'Java', 'Go', 'Rust'];

export default function ToolRecommender() {
  const { t, lang } = useI18n();
  const tr = t.interactive.recommend;
  const prefersReduced = useReducedMotion();

  const experienceLevels = [
    { key: 'beginner',     label: tr.expBeginner },
    { key: 'intermediate', label: tr.expIntermediate },
    { key: 'advanced',     label: tr.expAdvanced },
  ];
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');

  const recommendation = recommendations.find(
    r => r.language === selectedLanguage && r.experienceLevel === selectedExperience
  );

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        {/* Language Selection */}
        <div>
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="font-mono text-[10px] tracking-[0.3em] text-slate-400/60 dark:text-white/20 uppercase mb-4"
          >
            {tr.languageLabel}
          </motion.p>
          <div className="grid grid-cols-3 gap-2">
            {languages.map((lang, i) => (
              <motion.button
                key={lang}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => setSelectedLanguage(lang)}
                className="relative px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden"
                whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
              >
                {selectedLanguage === lang && (
                  <motion.div
                    layoutId="lang-select"
                    className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-white/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${
                  selectedLanguage === lang
                    ? 'text-white'
                    : 'text-slate-500 dark:text-white/30 hover:text-slate-800 dark:hover:text-white/60'
                }`}>
                  {lang}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Experience Selection */}
        <div>
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.32, 0.72, 0, 1] }}
            className="font-mono text-[10px] tracking-[0.3em] text-slate-400/60 dark:text-white/20 uppercase mb-4"
          >
            {tr.experienceLabel}
          </motion.p>
          <div className="flex gap-2">
            {experienceLevels.map((exp, i) => (
              <motion.button
                key={exp.key}
                initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                onClick={() => setSelectedExperience(exp.key)}
                className="relative flex-1 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden"
                whileHover={prefersReduced ? {} : { scale: 1.04, y: -2 }}
                whileTap={prefersReduced ? {} : { scale: 0.95 }}
              >
                {selectedExperience === exp.key && (
                  <motion.div
                    layoutId="exp-select"
                    className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-white/15"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${
                  selectedExperience === exp.key
                    ? 'text-white'
                    : 'text-slate-500 dark:text-white/30 hover:text-slate-800 dark:hover:text-white/60'
                }`}>
                  {exp.label}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendation Result */}
      <AnimatePresence mode="wait">
        {recommendation && (
          <motion.div
            key={`${selectedLanguage}-${selectedExperience}`}
            initial={prefersReduced ? false : { opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="rounded-2xl border border-slate-200/40 dark:border-white/[0.04] p-8 text-center bg-slate-50/50 dark:bg-white/[0.02]"
          >
            <motion.h3
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              className="text-2xl font-black text-slate-900 dark:text-white mb-2"
            >
              {recommendation.tool}
            </motion.h3>
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-sm text-slate-500 dark:text-white/30 max-w-md mx-auto font-light"
            >
              {lang === 'en' && recommendation.reasonEn ? recommendation.reasonEn : recommendation.reason}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
