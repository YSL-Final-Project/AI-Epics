import { useEffect, useRef, useState } from 'react';
import CodePeek from '../shared/CodePeek';

const PEEK_CODE = `// 200 stars drift upward, each with independent speed & pulse
interface Star {
  x: number; y: number;
  size: number; opacity: number;
  speed: number;
  pulse: number; pulseSpeed: number; // sine-wave twinkle
}

function initStars() {
  stars = Array.from({ length: density }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size:  Math.random() * 1.5 + 0.3,
    opacity: Math.random() * 0.5 + 0.1,
    speed: Math.random() * speed + 0.1,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.02 + 0.005,
  }));
}

function draw() {
  ctx.clearRect(0, 0, w, h);
  for (const star of stars) {
    star.y -= star.speed;           // drift upward
    star.pulse += star.pulseSpeed;  // advance twinkle phase

    // Wrap: reappear at bottom when off top
    if (star.y < -2) {
      star.y = h + 2;
      star.x = Math.random() * w;
    }

    // Sinusoidal twinkle modulates opacity
    const pulseOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fillStyle = \`rgba(255, 255, 255, \${pulseOpacity})\`;
    ctx.fill();
  }
  animId = requestAnimationFrame(draw);
}`;

interface StarfieldProps {
  density?: number;
  speed?: number;
}

/**
 * Canvas-based starfield that slowly drifts upward, giving depth to the dark background.
 */
export default function Starfield({ density = 200, speed = 0.3 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [warp, setWarp] = useState(false);

  // Detect fast scrolling → trigger warp effect
  useEffect(() => {
    let lastY = window.scrollY;
    let lastTime = Date.now();
    let warpTimeout: ReturnType<typeof setTimeout>;

    const onScroll = () => {
      const now = Date.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const velocity = Math.abs(window.scrollY - lastY) / dt;
        if (velocity > 2.5) {
          setWarp(true);
          clearTimeout(warpTimeout);
          warpTimeout = setTimeout(() => setWarp(false), 800);
        }
      }
      lastY = window.scrollY;
      lastTime = now;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(warpTimeout);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let isWarping = false;

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      pulse: number;
      pulseSpeed: number;
      trail: number; // trail length for warp
    }

    let stars: Star[] = [];

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    }

    function initStars() {
      stars = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        speed: Math.random() * speed + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        trail: 0,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      // Smoothly transition trail length
      const targetTrail = isWarping ? 1 : 0;

      for (const star of stars) {
        // Smooth warp trail
        star.trail += (targetTrail - star.trail) * 0.1;

        const warpSpeed = isWarping ? star.speed * 8 : star.speed;
        star.y -= warpSpeed;
        star.pulse += star.pulseSpeed;

        if (star.y < -60) {
          star.y = h + 2;
          star.x = Math.random() * w;
          star.trail = 0;
        }

        const pulseOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse));
        const trailLen = star.trail * (30 + star.speed * 40);

        if (trailLen > 1) {
          // Draw streak line (warp effect)
          const grad = ctx!.createLinearGradient(star.x, star.y + trailLen, star.x, star.y);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(0.5, `rgba(6, 182, 212, ${pulseOpacity * 0.3})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${pulseOpacity})`);
          ctx!.beginPath();
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = star.size * 0.8;
          ctx!.moveTo(star.x, star.y + trailLen);
          ctx!.lineTo(star.x, star.y);
          ctx!.stroke();
        }

        // Draw star dot
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    // Subscribe to warp state
    const warpCheck = setInterval(() => { isWarping = canvasRef.current?.dataset.warp === 'true'; }, 50);

    resize();
    initStars();
    draw();

    window.addEventListener('resize', () => { resize(); initStars(); });

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(warpCheck);
      window.removeEventListener('resize', resize);
    };
  }, [density, speed]);

  return (
    <>
      <canvas
        ref={canvasRef}
        data-warp={warp}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: 0.6 }}
      />
      <CodePeek
        code={PEEK_CODE}
        title="Starfield"
        fileName="Starfield.tsx"
        className="fixed top-5 right-5 z-10"
      />
    </>
  );
}
