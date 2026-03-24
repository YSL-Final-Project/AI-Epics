import { useState, useEffect } from 'react';
import CodePeek from '../shared/CodePeek';

const PEEK_CODE = `// Random character bursts corrupt the text every 3–7s.
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~\`0123456789';

const glitch = () => {
  if (frame >= maxFrames) {      // restore original after 6 frames
    setDisplay(text);
    return;
  }
  const arr = text.split('');
  const numGlitched = Math.max(1, Math.floor(Math.random() * 3));

  for (let i = 0; i < numGlitched; i++) {
    const idx = Math.floor(Math.random() * arr.length);
    arr[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
  }
  setDisplay(arr.join(''));
  frame++;
  setTimeout(glitch, 50 + Math.random() * 30); // variable timing
};

// Chromatic aberration: two ghost copies offset ±2px
{glitching && (
  <span className="absolute inset-0 text-cyan-500/30"
    style={{ transform: 'translateX(2px)' }}>
    {display}
  </span>
  <span className="absolute inset-0 text-red-500/20"
    style={{ transform: 'translateX(-2px)' }}>
    {display}
  </span>
)}`;

interface GlitchTextProps {
  text: string;
  className?: string;
  active?: boolean;
  showPeek?: boolean;
}

const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

export default function GlitchText({ text, className = '', active = true, showPeek = false }: GlitchTextProps) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }

    // Periodic glitch bursts
    const interval = setInterval(() => {
      setGlitching(true);
      let frame = 0;
      const maxFrames = 6;

      const glitch = () => {
        if (frame >= maxFrames) {
          setDisplay(text);
          setGlitching(false);
          return;
        }
        const arr = text.split('');
        const numGlitched = Math.max(1, Math.floor(Math.random() * 3));
        for (let i = 0; i < numGlitched; i++) {
          const idx = Math.floor(Math.random() * arr.length);
          arr[idx] = glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        setDisplay(arr.join(''));
        frame++;
        setTimeout(glitch, 50 + Math.random() * 30);
      };
      glitch();
    }, 3000 + Math.random() * 4000);

    return () => clearInterval(interval);
  }, [text, active]);

  return (
    <span className={`relative ${className}`}>
      <span className={glitching ? 'animate-pulse' : ''}>{display}</span>
      {glitching && (
        <>
          <span className="absolute inset-0 text-cyan-500/30" style={{ transform: 'translateX(2px)' }}>{display}</span>
          <span className="absolute inset-0 text-red-500/20" style={{ transform: 'translateX(-2px)' }}>{display}</span>
        </>
      )}
      {showPeek && (
        <CodePeek
          code={PEEK_CODE}
          title="Glitch Text"
          fileName="GlitchText.tsx"
          className="absolute -top-8 right-0 z-10"
        />
      )}
    </span>
  );
}
