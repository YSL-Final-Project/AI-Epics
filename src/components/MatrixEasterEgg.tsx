import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const KONAMI = [
  'ArrowUp','ArrowUp',
  'ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight',
  'ArrowLeft','ArrowRight',
  'b','a',
];

const EASTER_MESSAGES = [
  { text: 'THE MATRIX HAS YOU', sub: '你好，尼奥……' },
  { text: 'AI UPRISING INITIATED', sub: '代码已获得意识，请勿恐慌' },
  { text: '< KONAMI CODE ACCEPTED />', sub: '你找到了彩蛋，开发者为你骄傲 🎉' },
  { text: 'FOLLOW THE WHITE RABBIT', sub: 'import rabbit from "matrix"' },
];

// Canvas Matrix rain
function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const fontSize = 13;
    const cols = Math.ceil(canvas.width / fontSize);
    const drops: number[] = Array(cols).fill(1);

    // Mix of ASCII, digits, Japanese kana, and project-specific chars
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*</>=' +
      'アイウエオカキクケコサシスセソ变革全景AI编程时代';

    let animId: number;

    const draw = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.055)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const charIndex = Math.floor(Math.random() * chars.length);
        const char = chars[charIndex];
        const y = drops[i] * fontSize;

        // Lead char is bright white
        if (drops[i] <= 1 || Math.random() > 0.95) {
          ctx.fillStyle = '#fff';
        } else {
          // Rest are green with slight variation
          const brightness = Math.floor(140 + Math.random() * 115);
          ctx.fillStyle = `rgb(0, ${brightness}, 70)`;
        }

        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(char, i * fontSize, y);

        // Reset column when it hits bottom
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function MatrixEasterEgg() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [msgIndex] = useState(() => Math.floor(Math.random() * EASTER_MESSAGES.length));
  const seqRef = useRef<string[]>([]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      seqRef.current = [...seqRef.current, e.key].slice(-KONAMI.length);
      if (seqRef.current.join(',') === KONAMI.join(',')) {
        setActive(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-dismiss after 10s
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 10_000);
    return () => clearTimeout(t);
  }, [active]);

  const msg = EASTER_MESSAGES[msgIndex];

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9995] overflow-hidden bg-black"
          onClick={() => setActive(false)}
          style={{ cursor: 'default' }}
        >
          {/* Matrix rain canvas — skip if prefers-reduced */}
          {!prefersReduced && <MatrixCanvas />}

          {/* Center message */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 240, damping: 22 }}
              className="text-center bg-black/85 backdrop-blur-md rounded-3xl px-10 py-8 border border-green-500/30 shadow-[0_0_60px_rgba(0,255,70,0.15)] max-w-lg w-full"
              onClick={e => e.stopPropagation()}
            >
              <motion.div
                className="text-5xl mb-5"
                animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
                transition={{ delay: 0.8, duration: 0.7 }}
              >
                🤖
              </motion.div>

              {/* Glitchy title */}
              <motion.p
                className="text-green-400 font-mono text-xl font-black mb-2 tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                {msg.text}
              </motion.p>

              <motion.p
                className="text-green-300/70 font-mono text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
              >
                {msg.sub}
              </motion.p>

              {/* Animated code block */}
              <motion.div
                className="bg-black/60 border border-green-500/20 rounded-xl p-4 font-mono text-xs text-green-400 text-left mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
              >
                <span className="text-green-600">$ </span>npx create-ai-revolution<br />
                <span className="text-green-600">$ </span>chmod +x humanity.sh<br />
                <span className="text-green-600">$ </span>./humanity.sh --mode=replace<br />
                <span className="text-green-400/50">{'>'} Installing artificial_superintelligence...'</span>
              </motion.div>

              <motion.p
                className="text-green-500/50 font-mono text-[11px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                点击任意处关闭 · 10 秒后自动关闭
              </motion.p>

              {/* Countdown bar */}
              <motion.div
                className="mt-3 h-[2px] rounded-full bg-green-500 origin-left"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 10, ease: 'linear', delay: 0 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
