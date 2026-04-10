import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';
import ScrambleText from '../ScrambleText';
import { IconSun, IconMoon } from '../icons/TechIcons';

const navKeys = [
  { path: '/',            key: 'home' as const },
  { path: '/timeline',   key: 'timeline' as const },
  { path: '/data',       key: 'data' as const },
  { path: '/compare',    key: 'compare' as const },
  { path: '/interactive', key: 'interactive' as const },
  { path: '/story',      key: 'story' as const },
  { path: '/tool-evolution', key: 'toolEvolution' as const },
  { path: '/about',      key: 'about' as const },
  { path: '/dev-history', key: 'devHistory' as const },
];

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] as const },
  }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLang, lang } = useI18n();
  const location = useLocation();
  const prefersReduced = useReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);

  const navLinks = navKeys.map(n => ({ path: n.path, label: t.nav[n.key] }));

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent backdrop-blur-sm'
      }`}
      initial={prefersReduced ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] as const }}
    >
      {/* Gradient bottom-border that appears on scroll */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" viewTransition className="flex items-center gap-1.5 group">
            <motion.span
              className="text-cyan-500 font-mono text-lg"
              whileHover={{ rotate: -15, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {'<'}
            </motion.span>
            <ScrambleText
              text="AI Code Era"
              className="font-bold text-slate-900 dark:text-white tracking-tight"
              revealSpeed={28}
            />
            <motion.span
              className="text-violet-500 font-mono text-lg"
              whileHover={{ rotate: 15, scale: 1.2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              {'/>'}
            </motion.span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 p-1.5 rounded-xl bg-slate-200/80 dark:bg-slate-800/50">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                viewTransition
                className="relative px-4 py-2 rounded-lg text-base font-semibold transition-colors"
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-slate-100 dark:bg-slate-700 shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <motion.span
                  className={`relative z-10 ${
                    location.pathname === link.path
                      ? 'text-cyan-600 dark:text-cyan-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                  whileHover={{
                    color: location.pathname === link.path ? undefined : '#06b6d4',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <motion.button
              onClick={toggleLang}
              className="relative px-4 py-2 rounded-lg text-lg font-mono font-semibold tracking-wide border border-slate-200/60 dark:border-white/10 bg-slate-200/80 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/30 transition-all duration-200"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
              aria-label="Toggle language"
            >
              {lang === 'zh' ? 'EN' : <span className="text-sm">中文</span>}
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.94 }}
            >
              <motion.div
                className="absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-900 shadow-md flex items-center justify-center text-xs"
                animate={{ left: theme === 'dark' ? '30px' : '2px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {theme === 'dark' ? <IconMoon size={13} /> : <IconSun size={13} />}
              </motion.div>
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              whileTap={{ scale: 0.9 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  animate={mobileMenuOpen
                    ? { d: 'M6 18L18 6M6 6l12 12' }
                    : { d: 'M4 6h16M4 12h16M4 18h16' }
                  }
                  transition={{ duration: 0.25 }}
                />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ opacity: 1, height: 'auto', overflow: 'hidden' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] as const }}
              className="md:hidden pb-4 space-y-1"
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  custom={i}
                  variants={prefersReduced ? {} : mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    to={link.path}
                    viewTransition
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      location.pathname === link.path
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
