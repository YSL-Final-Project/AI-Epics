import type { LiquidLinesConfig } from './LiquidLinesBackground';

/* ────────────────────────────────────────────────────────────────────────
 *  Liquid-lines background — tunable configuration
 *
 *  This file is the ONLY place you should edit to change the look and
 *  feel of the cursor-reactive background on the Insight page.
 *
 *  ─── How the animation works (30-second version) ─────────────────────
 *
 *  1. A grid of points is laid over the viewport, every `xGap` pixels
 *     horizontally and `yGap` pixels vertically. Each vertical column of
 *     points becomes one rendered line.
 *
 *  2. Ambient motion:
 *       angle   = perlin2D(pointX, pointY) * noiseAngleScale
 *       offset  = (cos(angle) * waveAmpX, sin(angle) * waveAmpY)
 *     The Perlin noise sample coordinates drift over time via
 *     `noiseDriftX/Y`, so the active/calm pockets travel across the
 *     screen — no sine grid pattern.
 *
 *  3. Cursor interaction:
 *       Each point is a spring-damper: {position, velocity, tension,
 *       friction}. When the cursor moves, nearby points get a push in
 *       the direction of the cursor's motion (not a pull toward it).
 *       The push radius grows with cursor speed (`max(baseRadius, v)`),
 *       so fast flicks "paint" further than slow hovers.
 *       Afterwards, spring tension + friction bring points back to rest.
 *
 *  4. Each vertical column is drawn as a Bézier-smoothed path so the
 *     lines read as continuous curves, not poly-line kinks.
 *
 *  ─── How to tune ──────────────────────────────────────────────────────
 *
 *  Just edit the numbers below and save — Vite HMR will hot-reload the
 *  page. Changing density fields (`xGap`, `yGap`) triggers a rebuild of
 *  the point grid; everything else updates live.
 *
 *  Each field has a comment describing what it controls. Sensible ranges
 *  are noted; values outside them usually still work but may look odd.
 *  The defaults here are what we shipped.
 *
 *  The animation is driven by `src/components/LiquidLinesBackground.tsx`.
 *  If you need to change the algorithm itself (e.g. swap Perlin for
 *  Simplex, add a second noise layer), edit that file. For cosmetic
 *  tuning, this config is enough.
 * ──────────────────────────────────────────────────────────────────────── */

export const insightBgConfig: LiquidLinesConfig = {
  /* ──────────────── GRID ───────────────────────────────────────────
   * Lower numbers here = denser grid = more CPU. Keep an eye on frame
   * time (Chrome DevTools → Performance) if you make the grid denser.
   */

  /** Horizontal distance between vertical lines (px). Typical: 8–14. */
  xGap: 10,
  /** Vertical distance between sample points along each line (px).
   *  Typical: 24–40. Smoother curves need smaller gaps. */
  yGap: 32,

  /* ──────────────── AMBIENT MOTION (Perlin noise) ──────────────────
   * These knobs shape the idle animation that runs when the user
   * isn't interacting. The `noiseScale*` fields control the SPATIAL
   * frequency of the noise; the `noiseDrift*` fields control how fast
   * it scrolls through time.
   */

  /** Noise sampling frequency along x. Lower → broader, lazier bulges.
   *  Typical: 0.0012–0.004. */
  noiseScaleX: 0.002,
  /** Noise sampling frequency along y. Lower → taller bulges.
   *  Typical: 0.001–0.003. */
  noiseScaleY: 0.0015,
  /** Per-millisecond drift applied to the noise x coordinate. Positive
   *  values translate the pattern leftward-to-rightward over time.
   *  Typical: 0.005–0.02. Set to 0 to freeze ambient motion. */
  noiseDriftX: 0.0125,
  /** Per-millisecond drift along y. Typical: 0.002–0.01. */
  noiseDriftY: 0.005,
  /** Multiplier that turns the noise value (~[-1, 1]) into a radian
   *  angle. Higher = more chaotic swirling direction changes.
   *  Typical: 6–16. */
  noiseAngleScale: 12,
  /** How far each point orbits horizontally at rest (px). Typical: 20–40. */
  waveAmpX: 32,
  /** How far each point orbits vertically at rest (px). Typical: 10–24.
   *  Keeping this smaller than waveAmpX preserves a horizontal-stretch feel. */
  waveAmpY: 16,

  /* ──────────────── CURSOR REACTION ────────────────────────────────
   * The cursor does not attract points — it pushes them in whatever
   * direction IT is moving. A still cursor does nothing. These values
   * shape the push strength, reach, and return-to-rest behaviour.
   */

  /** Minimum radius of cursor influence (px). The actual radius at any
   *  moment is `max(baseRadius, cursorSpeed)`, so a fast flick reaches
   *  further. Typical: 120–260. */
  baseRadius: 175,
  /** Master multiplier on the cursor push force. Small number because
   *  it gets scaled by radius * velocity inside the render loop.
   *  Typical: 0.0004–0.0010. */
  pushFactor: 0.00065,
  /** Spring stiffness pulling points back to rest each frame.
   *  Higher = snappier return. Typical: 0.003–0.012. */
  springTension: 0.005,
  /** Per-frame velocity decay (0 = frozen, 1 = frictionless).
   *  Closer to 1 = longer trails. Typical: 0.90–0.96. */
  friction: 0.925,
  /** Multiplier applied when converting point velocity to displacement
   *  each frame. Typical: 1–3. */
  strength: 2,
  /** Maximum absolute displacement per axis (px). Caps runaway values.
   *  Typical: 60–140. */
  clampMax: 100,

  /* ──────────────── STYLE ──────────────────────────────────────────
   * Colors use rgba so alpha can stay low for a subtle background.
   * Target the Insight page's actual card backgrounds — too bold and
   * the foreground charts compete with the animation.
   */

  /** Line stroke in light theme. Keep alpha low (0.15–0.35). */
  colorLight: 'rgba(15,23,42,0.2)',
  /** Line stroke in dark theme. White at too low an alpha vanishes on
   *  the page's near-black background, so keep this in the 0.12–0.22
   *  range. */
  colorDark: 'rgba(226,232,240,0.16)',
  /** Canvas stroke width (px). 1 is usually ideal. */
  lineWidth: 1,

  /* ──────────────── CURSOR MARKER ──────────────────────────────────
   * A small filled dot sitting at the smoothed cursor position — same
   * colour as the lines. Disable it if you want the interaction to
   * feel more invisible. */
  showCursorMarker: true,

  /* ──────────────── LAYOUT ─────────────────────────────────────────
   * `fullscreen: true` pins the canvas to the viewport via
   * `position: fixed`. `zIndex: 0` keeps it behind page content; the
   * content itself must sit in a wrapper with `z-index: 10` (already
   * wired up in DataExplorerPage). */
  fullscreen: true,
  zIndex: 0,
};
