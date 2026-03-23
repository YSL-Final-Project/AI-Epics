import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import ScrambleText from '../ScrambleText';

const navLinks = [
  { path: '/',            label: '首页' },
  { path: '/timeline',   label: '时间线' },
  { path: '/data',       label: '洞察' },
  { path: '/compare',    label: '竞技场' },
  { path: '/interactive',label: '实验室' },
  { path: '/story',      label: '故事' },
  { path: '/about',      label: '关于' },
];

const mobileItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.23, 1, 0.32, 1] },
  }),
  exit: { opacity: 0, x: -12, transition: { duration: 0.2 } },
};

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
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

  return (
    <motion.nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass shadow-lg shadow-black/5 dark:shadow-black/20'
          : 'bg-transparent backdrop-blur-sm'
      }`}
      initial={prefersReduced ? false : { y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
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
          <div className="hidden md:flex items-center gap-0.5 p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/50">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                viewTransition
                className="relative px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors"
              >
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-lg bg-white dark:bg-slate-700 shadow-sm"
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
                {theme === 'dark' ? '🌙' : '☀️'}
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
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
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
