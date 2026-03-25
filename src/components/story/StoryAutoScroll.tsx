import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';

/**
 * Story page autoplay controller.
 *
 * - Starts automatically after a short delay
 * - Smoothly scrolls the page at a constant rate
 * - Pauses on user interaction (wheel / touch / click)
 * - Resumes after idle timeout
 * - Shows a floating control pill to toggle play/pause
 * - Shows a scroll guide animation at the very beginning
 */

const SCROLL_SPEED = 0.6;        // px per frame (~36px/s at 60fps)
const IDLE_RESUME_MS = 4000;     // resume after 4s of no interaction
const AUTOPLAY_START_DELAY = 3500; // start autoplay 3.5s after page load

export default function StoryAutoScroll() {
  const { lang } = useI18n();
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const rafRef = useRef<number>(0);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const playingRef = useRef(false);
  const userPausedRef = useRef(false); // true = user explicitly clicked pause

  // Keep ref in sync
  useEffect(() => { playingRef.current = playing; }, [playing]);

  // Scroll animation loop
  const scrollLoop = useCallback(() => {
    if (!playingRef.current) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY >= maxScroll - 2) {
      setPlaying(false);
      return;
    }
    window.scrollBy(0, SCROLL_SPEED);
    rafRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  // Start / stop scroll loop
  useEffect(() => {
    if (playing) {
      rafRef.current = requestAnimationFrame(scrollLoop);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, scrollLoop]);

  // Auto-start after delay
  useEffect(() => {
    const t = setTimeout(() => {
      setStarted(true);
      setPlaying(true);
      setShowGuide(false);
    }, AUTOPLAY_START_DELAY);
    return () => clearTimeout(t);
  }, []);

  // Hide guide on any scroll
  useEffect(() => {
    const handler = () => {
      if (showGuide) setShowGuide(false);
    };
    window.addEventListener('scroll', handler, { passive: true, once: true });
    return () => window.removeEventListener('scroll', handler);
  }, [showGuide]);

  // Pause on user interaction, resume after idle
  useEffect(() => {
    const pause = () => {
      if (!started || userPausedRef.current) return;
      if (playingRef.current) {
        setPlaying(false);
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
          if (!userPausedRef.current) setPlaying(true);
        }, IDLE_RESUME_MS);
      }
    };

    window.addEventListener('wheel', pause, { passive: true });
    window.addEventListener('touchstart', pause, { passive: true });
    window.addEventListener('keydown', pause, { passive: true });
    return () => {
      window.removeEventListener('wheel', pause);
      window.removeEventListener('touchstart', pause);
      window.removeEventListener('keydown', pause);
      clearTimeout(idleTimerRef.current);
    };
  }, [started]);

  const togglePlay = () => {
    if (playing) {
      userPausedRef.current = true;
      setPlaying(false);
      clearTimeout(idleTimerRef.current);
    } else {
      userPausedRef.current = false;
      setStarted(true);
      setPlaying(true);
      setShowGuide(false);
    }
  };

  return (
    <>
      {/* ── Scroll Guide (shows at beginning) ── */}
      <AnimatePresence>
        {showGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 pointer-events-none"
          >
            {/* Mouse shape */}
            <motion.div
              className="relative w-7 h-11 rounded-full border-2 border-white/30"
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Scroll wheel dot */}
              <motion.div
                className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-2.5 rounded-full bg-white/60"
                animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>

            {/* Arrow hints */}
            <motion.div
              className="flex flex-col items-center gap-0.5"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
            >
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="opacity-40">
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="opacity-20">
                <path d="M1 1L6 6L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </motion.div>

            <motion.p
              className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {lang === 'zh' ? '向下滚动 或 等待自动播放' : 'Scroll down or wait for autoplay'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Play/Pause Pill ── */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <motion.button
          onClick={togglePlay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-xs font-mono"
        >
          {playing ? (
            <>
              {/* Pause icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <rect x="2" y="1" width="3" height="10" rx="0.5" />
                <rect x="7" y="1" width="3" height="10" rx="0.5" />
              </svg>
              <span className="tracking-wide">{lang === 'zh' ? '暂停' : 'Pause'}</span>
            </>
          ) : (
            <>
              {/* Play icon */}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M2.5 1L10.5 6L2.5 11V1Z" />
              </svg>
              <span className="tracking-wide">{lang === 'zh' ? '自动播放' : 'Autoplay'}</span>
            </>
          )}

          {/* Animated progress ring when playing */}
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/30"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.button>
      </motion.div>
    </>
  );
}
