import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../../i18n';

export default function StoryNav() {
  const { t, toggleLang, lang } = useI18n();
  return (
    <>
      <motion.div
        className="fixed top-6 left-6 z-50"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          to="/"
          viewTransition
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-mono"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10 12L6 8l4-4" />
          </svg>
          {t.story.back}
        </Link>
      </motion.div>
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <button
          onClick={toggleLang}
          className="px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-mono font-semibold tracking-wide"
        >
          {lang === 'zh' ? 'EN' : '中文'}
        </button>
      </motion.div>
    </>
  );
}
