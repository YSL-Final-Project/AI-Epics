import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/layout/PageTransition';

export default function NotFoundPage() {
  return (
    <PageTransition>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-[clamp(6rem,20vw,12rem)] font-black text-slate-200 dark:text-white/[0.06] leading-none select-none"
        >
          404
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-4 text-lg text-slate-500 dark:text-white/30 font-light"
        >
          页面不存在
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <Link
            to="/"
            className="mt-8 inline-block font-mono text-sm tracking-wide px-6 py-2.5 rounded-full border border-slate-300 dark:border-white/10 text-slate-600 dark:text-white/40 hover:text-slate-900 dark:hover:text-white/70 hover:border-slate-500 dark:hover:border-white/20 transition-all duration-300"
          >
            返回首页
          </Link>
        </motion.div>
      </div>
    </PageTransition>
  );
}
