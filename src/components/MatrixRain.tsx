import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface MatrixRainProps {
  className?: string;
  color?: string;     // CSS color for the glyphs
  density?: number;   // columns count factor (lower = more columns)
  speed?: number;     // fall speed multiplier
}

// Claude Code CLI keywords + symbols
const WORDS = [
  'claude','code','commit','push','pull','diff','merge','rebase','init','deploy',
  'build','test','lint','fmt','run','exec','scan','eval','parse','compile',
  'async','await','yield','import','export','return','const','let','function',
  'npm','npx','git','ssh','curl','grep','sed','awk','pipe','fork',
  'model','prompt','token','agent','tool','hook','skill','plan','edit','read',
  'write','bash','glob','grep','spawn','kill','debug','trace','log','error',
  '$','>>','&&','||','|>','->','<=','!=','===','/**','*/','//','=>',
  '{}','[]','()','</>','...','::','##','%%','@@','~~',
  'API','CLI','SDK','LLM','RAG','MCP','TCP','SSH','GPT','AI',
  '0x0F','0xFF','null','void','true','NaN','EOF','SIGTERM','STDOUT',
];
// Pick random characters from the word pool
const CHAR_POOL = WORDS.join(' ').split('');
const randChar = () => CHAR_POOL[Math.floor(Math.random() * CHAR_POOL.length)];

export default function MatrixRain({
  className = '',
  color = '#0fa',
  density = 18,
  speed = 1,
}: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let columns: number[] = [];
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const colCount = Math.floor(w / density);
      columns = Array.from({ length: colCount }, () => Math.random() * h);
    };

    resize();
    window.addEventListener('resize', resize);

    const fontSize = Math.max(density * 0.85, 10);

    const draw = () => {
      // Fade trail — slower fade = longer tails
      const fadeAlpha = speed < 0.5 ? 0.03 : 0.06;
      ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
      ctx.fillRect(0, 0, w, h);

      ctx.font = `${fontSize}px "Courier New", monospace`;

      for (let i = 0; i < columns.length; i++) {
        const char = randChar();
        const x = i * density;
        const y = columns[i];

        // Head glyph — white-green flash
        ctx.fillStyle = '#fff';
        ctx.globalAlpha = 0.85;
        ctx.fillText(char, x, y);

        // Second glyph — main color
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;
        ctx.fillText(randChar(), x, y - fontSize);

        // Third glyph — dimmer trail
        ctx.globalAlpha = 0.25;
        ctx.fillText(randChar(), x, y - fontSize * 2);

        ctx.globalAlpha = 1;

        // Reset column when it goes off screen
        if (y > h + 50) {
          if (Math.random() > 0.98) {
            columns[i] = -Math.random() * h * 0.5; // stagger re-entry
          }
        }

        columns[i] += fontSize * 0.65 * speed;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [prefersReduced, color, density, speed]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
