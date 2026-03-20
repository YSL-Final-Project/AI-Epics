import { useRef, useState, useCallback, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

// Character pools for scrambling
const LATIN_POOL  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/=';
const CHINESE_POOL = '零一二三四五六七八九代码革命算法数据科技未来智能系统终端';

function pickScramble(char: string): string {
  if (/[\u4e00-\u9fff]/.test(char)) {
    return CHINESE_POOL[Math.floor(Math.random() * CHINESE_POOL.length)];
  }
  if (/[a-zA-Z0-9]/.test(char)) {
    return LATIN_POOL[Math.floor(Math.random() * LATIN_POOL.length)];
  }
  return char; // keep punctuation / spaces unchanged
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Tag to render — default span */
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
  /** How fast each char resolves (ms between reveals) */
  revealSpeed?: number;
}

export default function ScrambleText({
  text,
  className,
  as: Tag = 'span',
  revealSpeed = 35,
}: ScrambleTextProps) {
  const prefersReduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const rafRef     = useRef<number>(0);
  const iterRef    = useRef(0);
  const activeRef  = useRef(false);

  // Cleanup on unmount or text change
  useEffect(() => {
    setDisplay(text);
    return () => {
      cancelAnimationFrame(rafRef.current);
      activeRef.current = false;
    };
  }, [text]);

  const startScramble = useCallback(() => {
    if (prefersReduced) return;
    cancelAnimationFrame(rafRef.current);
    activeRef.current = true;
    iterRef.current = 0;

    let lastTime = 0;
    const step = (time: number) => {
      if (!activeRef.current) return;
      if (time - lastTime < revealSpeed) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastTime = time;

      const iter = iterRef.current;
      // Reveal chars up to `iter`, scramble the rest
      setDisplay(
        text.split('').map((char, i) => {
          if (char === ' ' || char === '\n') return char;
          if (i < iter) return char; // already revealed
          return pickScramble(char);
        }).join('')
      );

      if (iter < text.length) {
        iterRef.current += 0.6; // reveal ~1 char every ~2 frames
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        activeRef.current = false;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text, revealSpeed, prefersReduced]);

  const stopScramble = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    activeRef.current = false;
    setDisplay(text);
  }, [text]);

  return (
    <Tag
      className={className}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      aria-label={text}
    >
      {display}
    </Tag>
  );
}
