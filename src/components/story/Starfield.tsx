import { useEffect, useRef } from 'react';

interface StarfieldProps {
  density?: number;
  speed?: number;
}

/**
 * Canvas-based starfield that slowly drifts upward, giving depth to the dark background.
 */
export default function Starfield({ density = 200, speed = 0.3 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;

    interface Star {
      x: number;
      y: number;
      size: number;
      opacity: number;
      speed: number;
      pulse: number;
      pulseSpeed: number;
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
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const star of stars) {
        star.y -= star.speed;
        star.pulse += star.pulseSpeed;
        if (star.y < -2) {
          star.y = h + 2;
          star.x = Math.random() * w;
        }
        const pulseOpacity = star.opacity * (0.6 + 0.4 * Math.sin(star.pulse));
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        ctx!.fill();
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    initStars();
    draw();

    window.addEventListener('resize', () => {
      resize();
      initStars();
    });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
