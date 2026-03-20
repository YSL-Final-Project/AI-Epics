import { motion, useReducedMotion } from 'framer-motion';

interface TimelineFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { key: 'all', label: '全部' },
  { key: 'tool_release', label: '工具' },
  { key: 'company', label: '公司' },
  { key: 'open_source', label: '开源' },
  { key: 'policy', label: '政策' },
];

export default function TimelineFilter({
  searchQuery,
  onSearchChange,
  activeCategory,
  onCategoryChange,
}: TimelineFilterProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 py-5 border-b border-slate-200/40 dark:border-white/[0.04]"
    >
      {/* Search — minimal line input */}
      <div className="relative w-full sm:w-72 group">
        <input
          type="text"
          placeholder="搜索..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-0 py-2 bg-transparent border-0 border-b border-slate-200/60 dark:border-white/[0.08] text-slate-900 dark:text-white placeholder-slate-300 dark:placeholder-white/15 focus:outline-none focus:border-slate-400 dark:focus:border-white/25 transition-colors text-sm font-light tracking-wide"
        />
        {/* Animated underline on focus */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className="h-full bg-slate-800 dark:bg-white/50 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-left" />
        </div>
        <svg
          className="absolute right-0 top-2.5 w-4 h-4 text-slate-300 dark:text-white/15 group-focus-within:text-slate-500 dark:group-focus-within:text-white/40 transition-colors"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Category buttons — text-only with animated indicator */}
      <div className="flex items-center gap-1">
        {categories.map(cat => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => onCategoryChange(cat.key)}
              className="relative px-4 py-2 text-xs tracking-wide transition-colors duration-300"
            >
              {isActive && (
                <motion.div
                  layoutId="timeline-cat-pill"
                  className="absolute inset-0 rounded-full bg-slate-900 dark:bg-white/10"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative z-10 font-medium transition-colors duration-200 ${
                isActive
                  ? 'text-white dark:text-white'
                  : 'text-slate-400 dark:text-white/25 hover:text-slate-700 dark:hover:text-white/50'
              }`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
