import { useEffect, useRef } from 'react';

/**
 * Flowing data streams — horizontal dashes moving across the screen.
 * Lightweight canvas effect for a "data in motion" sci-fi feel.
 */
interface DataStreamProps {
  direction?: 'horizontal' | 'vertical';
  color?: string;
  density?: number;
  speed?: number;
  className?: string;
}

interface Dash {
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  width: number;
}

export default function DataStream({
  direction = 'horizontal',
  color = '#06b6d4',
  density = 25,
  speed = 1.5,
  className = '',
}: DataStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = 0;
    let h = 0;
    let dashes: Dash[] = [];

    function resize() {
      w = canvas!.parentElement?.clientWidth ?? window.innerWidth;
      h = canvas!.parentElement?.clientHeight ?? window.innerHeight;
      canvas!.width = w;
      canvas!.height = h;
    }

    function initDashes() {
      dashes = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        length: Math.random() * 40 + 10,
        speed: (Math.random() * speed + 0.3) * (direction === 'horizontal' ? 1 : 1),
        opacity: Math.random() * 0.25 + 0.05,
        width: Math.random() > 0.7 ? 1.5 : 0.5,
      }));
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);

      for (const dash of dashes) {
        if (direction === 'horizontal') {
          dash.x += dash.speed;
          if (dash.x > w + dash.length) {
            dash.x = -dash.length;
            dash.y = Math.random() * h;
          }
        } else {
          dash.y -= dash.speed;
          if (dash.y < -dash.length) {
            dash.y = h + dash.length;
            dash.x = Math.random() * w;
          }
        }

        ctx!.beginPath();
        ctx!.strokeStyle = color;
        ctx!.globalAlpha = dash.opacity;
        ctx!.lineWidth = dash.width;

        if (direction === 'horizontal') {
          // Gradient trail: bright head, fading tail
          const grad = ctx!.createLinearGradient(dash.x - dash.length, 0, dash.x, 0);
          grad.addColorStop(0, 'transparent');
          grad.addColorStop(1, color);
          ctx!.strokeStyle = grad;
          ctx!.moveTo(dash.x - dash.length, dash.y);
          ctx!.lineTo(dash.x, dash.y);
        } else {
          const grad = ctx!.createLinearGradient(0, dash.y, 0, dash.y + dash.length);
          grad.addColorStop(0, color);
          grad.addColorStop(1, 'transparent');
          ctx!.strokeStyle = grad;
          ctx!.moveTo(dash.x, dash.y);
          ctx!.lineTo(dash.x, dash.y + dash.length);
        }
        ctx!.stroke();
        ctx!.globalAlpha = 1;
      }
      animId = requestAnimationFrame(draw);
    }

    resize();
    initDashes();
    draw();

    window.addEventListener('resize', () => { resize(); initDashes(); });
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [direction, color, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.7 }}
    />
  );
}
