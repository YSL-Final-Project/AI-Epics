import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import CodePeek from './shared/CodePeek';

const PEEK_CODE = `// Classic Matrix digital rain
// Every column filled with characters, multiple streams
// Head = bright white, trail fades green → dark

const draw = () => {
  // Semi-transparent black overlay for trail fade
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    // Bright head
    ctx.fillStyle = '#fff';
    ctx.fillText(randChar(), x, y);

    // Trail chars randomly flicker
    if (Math.random() < 0.02) {
      const ry = Math.floor(Math.random() * rows);
      ctx.fillStyle = 'rgba(0,255,65,0.6)';
      ctx.fillText(randChar(), x, ry * fontSize);
    }

    // Advance or reset
    if (drops[i] * fontSize > h && Math.random() > 0.975)
      drops[i] = 0;
    drops[i]++;
  }
};`;

interface MatrixRainProps {
  className?: string;
  color?: string;
  density?: number;
  speed?: number;
  showPeek?: boolean;
  mouseRepelRadius?: number;
}

// Techy character set — hex, binary, operators, unicode blocks
const HEX = '0123456789ABCDEF';
const BINARY = '01';
const OPERATORS = '<>=!&|^~+-*/%@#$:;?.';
const BLOCKS = '█▓▒░▐▌▄▀■□▪▫●○◆◇◈⬡⬢';
const BRACKETS = '{}[]()<>/\\';
const TECH = HEX + HEX + BINARY + BINARY + BINARY + OPERATORS + BLOCKS + BRACKETS;
const randChar = () => TECH[Math.floor(Math.random() * TECH.length)];

export default function MatrixRain({
  className = '',
  color = '#0fa',
  density = 18,
  speed = 1,
  showPeek = false,
  mouseRepelRadius = 0,
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
    let w = 0;
    let h = 0;

    const fontSize = density;
    // drops[i] = current row position of stream head for column i
    let drops: number[] = [];
    // Secondary streams for extra density
    let drops2: number[] = [];
    let drops3: number[] = [];
    let colCount = 0;

    // Mouse
    let mouseX = -9999;
    let mouseY = -9999;
    const repelR = mouseRepelRadius;
    const repelR2 = repelR * repelR;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    const onMouseLeave = () => { mouseX = -9999; mouseY = -9999; };

    if (repelR > 0) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      window.addEventListener('mouseleave', onMouseLeave);
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      colCount = Math.ceil(w / fontSize);
      // Initialize drops at random rows so screen is already full
      drops = Array.from({ length: colCount }, () => Math.floor(Math.random() * (h / fontSize)));
      drops2 = Array.from({ length: colCount }, () => Math.floor(Math.random() * (h / fontSize)));
      drops3 = Array.from({ length: colCount }, () => Math.floor(Math.random() * (h / fontSize)));
    };

    resize();
    window.addEventListener('resize', resize);

    // Pre-fill: paint the entire canvas with dim green characters
    const preFill = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textBaseline = 'top';
      const rowCount = Math.ceil(h / fontSize);
      for (let c = 0; c < colCount; c++) {
        for (let r = 0; r < rowCount; r++) {
          ctx.fillStyle = `rgba(0, 255, 65, ${0.03 + Math.random() * 0.12})`;
          ctx.fillText(randChar(), c * fontSize, r * fontSize);
        }
      }
    };
    preFill();

    let lastTime = 0;
    const FRAME_INTERVAL = 1000 / 30;

    const getRepel = (px: number, py: number): number => {
      if (repelR <= 0 || mouseX < -9000) return 1;
      const dx = px - mouseX;
      const dy = py - mouseY;
      const d2 = dx * dx + dy * dy;
      if (d2 >= repelR2) return 1;
      const t = Math.sqrt(d2) / repelR;
      return t * t * (3 - 2 * t);
    };

    const drawStream = (dropsArr: number[], baseSpeed: number, brightness: number) => {
      for (let i = 0; i < dropsArr.length; i++) {
        const x = i * fontSize;
        const y = dropsArr[i] * fontSize;

        const repel = getRepel(x + fontSize / 2, y + fontSize / 2);

        if (repel > 0.05) {
          // Head character — bright white
          ctx.fillStyle = `rgba(180, 255, 180, ${(0.95 * brightness) * repel})`;
          ctx.fillText(randChar(), x, y);

          // Second char — bright green
          if (dropsArr[i] > 0) {
            const repel2 = getRepel(x + fontSize / 2, y - fontSize + fontSize / 2);
            if (repel2 > 0.05) {
              ctx.fillStyle = `rgba(0, 255, 65, ${(0.8 * brightness) * repel2})`;
              ctx.fillText(randChar(), x, y - fontSize);
            }
          }
        }

        // Random flicker — replace a random char in this column with fresh green
        if (Math.random() < 0.03) {
          const ry = Math.floor(Math.random() * Math.ceil(h / fontSize));
          const fy = ry * fontSize;
          const repelF = getRepel(x + fontSize / 2, fy + fontSize / 2);
          if (repelF > 0.05) {
            ctx.fillStyle = `rgba(0, 255, 65, ${(0.25 + Math.random() * 0.35) * repelF})`;
            ctx.fillText(randChar(), x, fy);
          }
        }

        // Advance drop
        dropsArr[i] += baseSpeed;

        // Reset when off screen — staggered re-entry
        if (dropsArr[i] * fontSize > h) {
          if (Math.random() > 0.975) {
            dropsArr[i] = 0;
          }
        }
      }
    };

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw);
      if (now - lastTime < FRAME_INTERVAL) return;
      lastTime = now;

      // Semi-transparent black overlay — creates the fade trail
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, w, h);

      // Extra fade around mouse
      if (repelR > 0 && mouseX > -9000) {
        ctx.save();
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, repelR);
        grad.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
        grad.addColorStop(0.7, 'rgba(0, 0, 0, 0.1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(mouseX - repelR, mouseY - repelR, repelR * 2, repelR * 2);
        ctx.restore();
      }

      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textBaseline = 'top';

      // Three overlapping stream layers at different speeds for density
      drawStream(drops, 1.0 * speed, 1.0);
      drawStream(drops2, 0.6 * speed, 0.7);
      drawStream(drops3, 0.35 * speed, 0.5);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (repelR > 0) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseleave', onMouseLeave);
      }
    };
  }, [prefersReduced, color, density, speed, mouseRepelRadius]);

  if (prefersReduced) return null;

  if (showPeek) {
    return (
      <>
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 w-full h-full ${className}`}
          style={{ pointerEvents: 'none' }}
        />
        <CodePeek
          code={PEEK_CODE}
          title="Matrix Digital Rain"
          fileName="MatrixRain.tsx"
          className="absolute bottom-5 right-5 z-10"
        />
      </>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ pointerEvents: 'none' }}
    />
  );
}
