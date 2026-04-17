import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/* ── Minimal 2-D classical Perlin noise ───────────────────────────────── */

class Perlin2 {
  private p: Uint8Array;

  constructor(seed: number = Math.random()) {
    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;
    // Fisher-Yates shuffle with a seeded LCG so the noise is stable per instance
    let s = Math.max(1, Math.floor(seed * 2147483647));
    for (let i = 255; i > 0; i--) {
      s = (s * 16807) % 2147483647;
      const j = s % (i + 1);
      const tmp = perm[i];
      perm[i] = perm[j];
      perm[j] = tmp;
    }
    this.p = new Uint8Array(512);
    for (let i = 0; i < 512; i++) this.p[i] = perm[i & 255];
  }

  private static fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  private static lerp(t: number, a: number, b: number) {
    return a + t * (b - a);
  }
  private static grad(hash: number, x: number, y: number) {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
  }

  /** Value in roughly [-1, 1]. */
  perlin2(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    const u = Perlin2.fade(x);
    const v = Perlin2.fade(y);
    const A = this.p[X] + Y;
    const B = this.p[X + 1] + Y;
    return Perlin2.lerp(
      v,
      Perlin2.lerp(u, Perlin2.grad(this.p[A], x, y), Perlin2.grad(this.p[B], x - 1, y)),
      Perlin2.lerp(
        u,
        Perlin2.grad(this.p[A + 1], x, y - 1),
        Perlin2.grad(this.p[B + 1], x - 1, y - 1)
      )
    );
  }
}

/* ── Types ────────────────────────────────────────────────────────────── */

interface Point {
  baseX: number;
  baseY: number;
  waveX: number;
  waveY: number;
  /** Displacement from cursor interaction, a spring-damper system. */
  cx: number;
  cy: number;
  cvx: number;
  cvy: number;
}

export interface LiquidLinesConfig {
  /** Grid spacing between neighbouring vertical lines (px). */
  xGap?: number;
  /** Sampling distance along each line (px). */
  yGap?: number;

  // Ambient noise-driven motion. Each point orbits on a small ellipse whose
  // orientation is given by a Perlin field. The field slowly drifts over time.
  noiseScaleX?: number;
  noiseScaleY?: number;
  /** Per-second drift applied to the noise x sample (in px-space). */
  noiseDriftX?: number;
  noiseDriftY?: number;
  /** Multiplier that turns the noise value into an angle (radians). */
  noiseAngleScale?: number;
  waveAmpX?: number;
  waveAmpY?: number;

  // Cursor interaction — velocity-driven push, not positional attraction.
  /** Minimum influence radius (px), overridden by the smoothed cursor speed. */
  baseRadius?: number;
  pushFactor?: number;
  springTension?: number;
  friction?: number;
  strength?: number;
  clampMax?: number;

  colorLight?: string;
  colorDark?: string;
  lineWidth?: number;

  fullscreen?: boolean;
  zIndex?: number;
  showCursorMarker?: boolean;
}

/**
 * LiquidLinesBackground — faithful port of wodniack.dev's
 * `<a-waves>` custom element to React + Canvas 2D.
 *
 * Ambient motion is driven by 2-D Perlin noise used as an angle field:
 * every grid point orbits on a small ellipse whose direction is read from
 * the noise. The field itself drifts slowly, so active and calm pockets
 * appear and dissolve naturally — no grid-aligned sine patterns.
 *
 * The cursor does NOT attract points. Instead each point is a spring-damper
 * ({cx, cy, cvx, cvy}) and the cursor's velocity pushes nearby points in
 * the direction of its motion. String tension pulls them back to rest and
 * friction damps the velocity. The effective radius grows with cursor speed
 * — slow mouse barely moves anything, fast mouse sweeps a long trail.
 *
 * SVG L-commands in the original are canvas `lineTo` segments here.
 */
export default function LiquidLinesBackground({
  xGap = 10,
  yGap = 32,

  noiseScaleX = 0.002,
  noiseScaleY = 0.0015,
  noiseDriftX = 0.0125,
  noiseDriftY = 0.005,
  noiseAngleScale = 12,
  waveAmpX = 32,
  waveAmpY = 16,

  baseRadius = 175,
  pushFactor = 0.00065,
  springTension = 0.005,
  friction = 0.925,
  strength = 2,
  clampMax = 100,

  colorLight = 'rgba(15,23,42,0.75)',
  colorDark = 'rgba(255,255,255,0.6)',
  lineWidth = 1,

  fullscreen = true,
  zIndex = 0,
  showCursorMarker = true,
}: LiquidLinesConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const prefersReduced = useReducedMotion();

  // All mutable simulation state lives in this ref — it survives across
  // React renders without triggering re-renders of its own.
  const stateRef = useRef({
    width: 0,
    height: 0,
    dpr: 1,
    lines: [] as Point[][],
    noise: new Perlin2(1),
    // Cursor tracking mirrors the original's mouse state.
    mouse: {
      x: -9999,
      y: -9999,
      lx: 0,
      ly: 0, // last frame
      sx: 0,
      sy: 0, // smoothed
      v: 0,
      vs: 0, // instantaneous & smoothed speed
      a: 0, // angle of motion
      set: false,
      inside: false,
    },
    theme: 'light' as 'light' | 'dark',
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const st = stateRef.current;
    st.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    st.noise = new Perlin2(0.42);

    const setSize = () => {
      const parent = canvas.parentElement;
      if (fullscreen || !parent) {
        st.width = window.innerWidth;
        st.height = window.innerHeight;
      } else {
        st.width = parent.clientWidth;
        st.height = parent.clientHeight;
      }
      st.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(st.width * st.dpr));
      canvas.height = Math.max(1, Math.floor(st.height * st.dpr));
      canvas.style.width = `${st.width}px`;
      canvas.style.height = `${st.height}px`;
      ctx.setTransform(st.dpr, 0, 0, st.dpr, 0, 0);
    };

    const buildLines = () => {
      // Over-extend slightly so lines run off the edges smoothly, mirroring
      // the reference implementation's oWidth/oHeight trick.
      const oWidth = st.width + 200;
      const oHeight = st.height + 30;
      const totalLines = Math.ceil(oWidth / xGap);
      const totalPoints = Math.ceil(oHeight / yGap);
      const xStart = (st.width - xGap * totalLines) / 2;
      const yStart = (st.height - yGap * totalPoints) / 2;

      const lines: Point[][] = [];
      for (let i = 0; i <= totalLines; i++) {
        const col: Point[] = [];
        for (let j = 0; j <= totalPoints; j++) {
          col.push({
            baseX: xStart + xGap * i,
            baseY: yStart + yGap * j,
            waveX: 0,
            waveY: 0,
            cx: 0,
            cy: 0,
            cvx: 0,
            cvy: 0,
          });
        }
        lines.push(col);
      }
      st.lines = lines;
    };

    setSize();
    buildLines();

    const onResize = () => {
      setSize();
      buildLines();
    };
    window.addEventListener('resize', onResize);

    const onMove = (e: PointerEvent) => {
      const m = st.mouse;
      m.x = e.clientX;
      m.y = e.clientY;
      m.inside = true;
      if (!m.set) {
        // First sighting — snap smoothed+last so the initial frame
        // doesn't register a huge jump as velocity.
        m.sx = m.x;
        m.sy = m.y;
        m.lx = m.x;
        m.ly = m.y;
        m.set = true;
      }
    };
    const onLeave = () => {
      st.mouse.inside = false;
      st.mouse.x = -9999;
      st.mouse.y = -9999;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);

    const themeObserver = new MutationObserver(() => {
      st.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    const render = (time: number) => {
      const { lines, noise, mouse: m } = st;

      /* ── Update mouse state ───────────────────────────────── */
      m.sx += (m.x - m.sx) * 0.1;
      m.sy += (m.y - m.sy) * 0.1;
      const dx = m.x - m.lx;
      const dy = m.y - m.ly;
      const d = Math.hypot(dx, dy);
      m.v = d;
      m.vs += (d - m.vs) * 0.1;
      m.vs = Math.min(100, m.vs);
      m.lx = m.x;
      m.ly = m.y;
      m.a = Math.atan2(dy, dx);

      /* ── Move points ──────────────────────────────────────── */
      const timeFactorX = time * noiseDriftX;
      const timeFactorY = time * noiseDriftY;
      const mouseActive =
        m.inside &&
        m.sx > -200 &&
        m.sx < st.width + 200 &&
        m.sy > -200 &&
        m.sy < st.height + 200;
      const cosA = Math.cos(m.a);
      const sinA = Math.sin(m.a);

      for (let li = 0; li < lines.length; li++) {
        const col = lines[li];
        for (let pi = 0; pi < col.length; pi++) {
          const p = col[pi];

          // Ambient — Perlin field drives a rotation angle which in turn
          // picks a point on an ellipse of size (waveAmpX, waveAmpY).
          if (prefersReduced) {
            p.waveX = 0;
            p.waveY = 0;
          } else {
            const move =
              noise.perlin2(
                (p.baseX + timeFactorX) * noiseScaleX,
                (p.baseY + timeFactorY) * noiseScaleY
              ) * noiseAngleScale;
            p.waveX = Math.cos(move) * waveAmpX;
            p.waveY = Math.sin(move) * waveAmpY;
          }

          // Cursor push — radius grows with cursor velocity, so a fast
          // sweep "paints" further than a slow nudge.
          if (mouseActive) {
            const ddx = p.baseX - m.sx;
            const ddy = p.baseY - m.sy;
            const dist = Math.hypot(ddx, ddy);
            const radius = Math.max(baseRadius, m.vs);
            if (dist < radius) {
              const s = 1 - dist / radius;
              const f = Math.cos(dist * 0.001) * s;
              const push = f * radius * m.vs * pushFactor;
              p.cvx += cosA * push;
              p.cvy += sinA * push;
            }
          }

          // Spring back to rest + friction
          p.cvx += (0 - p.cx) * springTension;
          p.cvy += (0 - p.cy) * springTension;
          p.cvx *= friction;
          p.cvy *= friction;
          p.cx += p.cvx * strength;
          p.cy += p.cvy * strength;
          // Clamp
          if (p.cx > clampMax) p.cx = clampMax;
          else if (p.cx < -clampMax) p.cx = -clampMax;
          if (p.cy > clampMax) p.cy = clampMax;
          else if (p.cy < -clampMax) p.cy = -clampMax;
        }
      }

      /* ── Draw ─────────────────────────────────────────────── */
      ctx.clearRect(0, 0, st.width, st.height);
      ctx.strokeStyle = st.theme === 'dark' ? colorDark : colorLight;
      ctx.lineWidth = lineWidth;

      // Smoothed path via quadratic midpoint curves — each sample point is
      // used as a Bézier control point with the segment ending at the
      // midpoint of it and its neighbour. The reference had this commented
      // out in favour of straight L-commands; we re-enable it so the
      // curvature reads as organic rather than poly-line-ish at low yGaps.
      for (let li = 0; li < lines.length; li++) {
        const col = lines[li];
        const n = col.length;
        if (n < 2) continue;

        // Helper: visible coords for point `idx`. First and last points
        // ignore the cursor spring offset so they stay anchored at the
        // top and bottom edges (matches the reference semantics).
        const getX = (idx: number): number => {
          const p = col[idx];
          const isAnchor = idx === 0 || idx === n - 1;
          return p.baseX + p.waveX + (isAnchor ? 0 : p.cx);
        };
        const getY = (idx: number): number => {
          const p = col[idx];
          const isAnchor = idx === 0 || idx === n - 1;
          return p.baseY + p.waveY + (isAnchor ? 0 : p.cy);
        };

        ctx.beginPath();
        ctx.moveTo(getX(0), getY(0));

        if (n === 2) {
          ctx.lineTo(getX(1), getY(1));
        } else {
          // Curve through the interior points using each as a control
          // point, ending at the midpoint of it and the next.
          for (let i = 1; i < n - 1; i++) {
            const cx = getX(i);
            const cy = getY(i);
            const nx = getX(i + 1);
            const ny = getY(i + 1);
            const mx = (cx + nx) * 0.5;
            const my = (cy + ny) * 0.5;
            ctx.quadraticCurveTo(cx, cy, mx, my);
          }
          // Final straight segment into the bottom anchor.
          ctx.lineTo(getX(n - 1), getY(n - 1));
        }
        ctx.stroke();
      }

      // Cursor marker — a simple filled dot at the smoothed cursor
      // position, like the reference. Its colour is DECOUPLED from the
      // line stroke alpha so the dot stays clearly visible even when
      // the lines are intentionally dim — otherwise lowering the line
      // alpha also made the cursor disappear.
      if (showCursorMarker && mouseActive) {
        ctx.fillStyle =
          st.theme === 'dark' ? 'rgba(226,232,240,0.92)' : 'rgba(15,23,42,0.92)';
        ctx.beginPath();
        ctx.arc(m.sx, m.sy, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };
    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      themeObserver.disconnect();
    };
  }, [
    xGap,
    yGap,
    noiseScaleX,
    noiseScaleY,
    noiseDriftX,
    noiseDriftY,
    noiseAngleScale,
    waveAmpX,
    waveAmpY,
    baseRadius,
    pushFactor,
    springTension,
    friction,
    strength,
    clampMax,
    colorLight,
    colorDark,
    lineWidth,
    fullscreen,
    showCursorMarker,
    prefersReduced,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={fullscreen ? 'fixed inset-0' : 'absolute inset-0'}
      style={{
        zIndex,
        pointerEvents: 'none',
      }}
    />
  );
}
