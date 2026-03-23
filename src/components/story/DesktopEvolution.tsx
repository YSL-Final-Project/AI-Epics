import { useState } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';

/* ── code content per era ── */
const classicMac = [
  { text: '$ vim main.py', color: 'text-emerald-400' },
  { text: '', color: '' },
  { text: 'def train_model(data):', color: 'text-blue-400' },
  { text: '    for epoch in range(100):', color: 'text-white/70' },
  { text: '        loss = compute_loss(data)', color: 'text-white/50' },
  { text: '        optimizer.step()', color: 'text-white/50' },
  { text: '    print("Training complete")', color: 'text-orange-300/70' },
];

const classicWin = [
  { text: 'function processData(input) {', color: 'text-blue-400' },
  { text: '  const result = [];', color: 'text-white/70' },
  { text: '  for (let i = 0; i < input.length; i++) {', color: 'text-white/50' },
  { text: '    result.push(input[i] * 2);', color: 'text-white/50' },
  { text: '  }', color: 'text-white/50' },
  { text: '  return result;', color: 'text-purple-400/70' },
  { text: '}', color: 'text-white/50' },
];

const classicLinux = [
  { text: '$ gcc -o main main.c && ./main', color: 'text-emerald-400' },
  { text: '', color: '' },
  { text: '#include <stdio.h>', color: 'text-cyan-400/70' },
  { text: 'int main() {', color: 'text-blue-400' },
  { text: '    printf("Hello, World\\n");', color: 'text-orange-300/70' },
  { text: '    return 0;', color: 'text-white/50' },
  { text: '}', color: 'text-white/50' },
];

const aiMac = [
  { text: '⌘K  "重构这个函数用 async/await"', color: 'text-purple-400' },
  { text: '', color: '' },
  { text: 'async def train_model(data):', color: 'text-blue-400' },
  { text: '    batch = await prepare(data)', color: 'text-cyan-300' },
  { text: '    result = await model.fit(batch)', color: 'text-cyan-300' },
  { text: '    # AI: 已添加错误处理 + 日志', color: 'text-emerald-400/50' },
  { text: '    logger.info(f"Loss: {result.loss}")', color: 'text-emerald-400/50' },
];

const aiWin = [
  { text: '// Copilot ✦ 建议 3 行', color: 'text-amber-400/60' },
  { text: 'async function processData(input) {', color: 'text-blue-400' },
  { text: '  return input', color: 'text-white/70' },
  { text: '    .filter(x => x !== null)', color: 'text-white/30' },
  { text: '    .map(x => transform(x))', color: 'text-white/30' },
  { text: '    .reduce((a, b) => merge(a, b));', color: 'text-white/30' },
  { text: '}', color: 'text-white/50' },
];

const aiLinux = [
  { text: '$ claude "fix the segfault in parser"', color: 'text-purple-400' },
  { text: '', color: '' },
  { text: '✓ Analyzing codebase... 847 files', color: 'text-cyan-300' },
  { text: '✓ Found: null pointer at line 142', color: 'text-emerald-400' },
  { text: '✓ Applied fix + added null guard', color: 'text-emerald-400' },
  { text: '✓ All 23 tests passing', color: 'text-emerald-400' },
  { text: '$ git commit -m "fix: null check"', color: 'text-white/50' },
];

/* ── helper: lerp opacity from progress ── */
function lerp4(p: number, keys: number[], vals: number[]) {
  if (p <= keys[0]) return vals[0];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i]) {
      const t = (p - keys[i - 1]) / (keys[i] - keys[i - 1]);
      return vals[i - 1] + t * (vals[i] - vals[i - 1]);
    }
  }
  return vals[vals.length - 1];
}

/* ── OS Window component ── */
function OsWindow({
  os,
  app,
  lines,
  lineReveal,
  titleBarClass,
  glitching,
}: {
  os: 'mac' | 'win' | 'linux';
  app: string;
  lines: { text: string; color: string }[];
  lineReveal: number; // 0–1 how many lines visible
  titleBarClass: string;
  glitching: boolean;
}) {
  const visibleCount = Math.ceil(lineReveal * lines.length);

  return (
    <div
      className={`flex-1 min-w-0 rounded-lg overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50 transition-transform duration-100 ${
        glitching ? 'animate-[glitchShake_0.15s_steps(2)_infinite]' : ''
      }`}
      style={glitching ? { filter: 'hue-rotate(90deg) saturate(2)' } : {}}
    >
      {/* Title bar */}
      <div className={`flex items-center gap-2 px-3 py-2 ${titleBarClass}`}>
        {os === 'mac' && (
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
        )}
        {os === 'win' && (
          <div className="flex gap-1 ml-auto order-2">
            <div className="w-2.5 h-2.5 border border-white/20 rounded-none text-[6px] flex items-center justify-center text-white/30">─</div>
            <div className="w-2.5 h-2.5 border border-white/20 rounded-none text-[6px] flex items-center justify-center text-white/30">□</div>
            <div className="w-2.5 h-2.5 bg-red-500/60 rounded-none text-[6px] flex items-center justify-center text-white/50">×</div>
          </div>
        )}
        {os === 'linux' && (
          <div className="w-2 h-2 rounded-full bg-white/20" />
        )}
        <span className="text-[9px] font-mono text-white/40 truncate">{app}</span>
      </div>

      {/* Code area */}
      <div className="bg-[#0d1117] p-3 font-mono text-[10px] sm:text-[11px] leading-[1.6] min-h-[120px] sm:min-h-[160px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre transition-all duration-300 ${line.color}`}
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateY(0)' : 'translateY(4px)',
            }}
          >
            {line.text || '\u00A0'}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main component ── */
export default function DesktopEvolution({ progress }: { progress: MotionValue<number> }) {
  const [titleOp, setTitleOp] = useState(1);
  const [screenOp, setScreenOp] = useState(0);
  const [outroOp, setOutroOp] = useState(0);
  const [era, setEra] = useState<'classic' | 'ai'>('classic');
  const [glitch, setGlitch] = useState(false);
  const [lineReveal, setLineReveal] = useState(0);

  useMotionValueEvent(progress, 'change', (p) => {
    // Title
    setTitleOp(lerp4(p, [0, 0.05, 0.08, 0.13], [0, 1, 1, 0]));

    // Screens
    setScreenOp(lerp4(p, [0.10, 0.15, 0.85, 0.92], [0, 1, 1, 0]));

    // Era switch
    if (p < 0.45) {
      setEra('classic');
      setGlitch(false);
    } else if (p < 0.55) {
      setGlitch(true);
      if (p > 0.50) setEra('ai');
    } else {
      setEra('ai');
      setGlitch(false);
    }

    // Line reveal
    if (p < 0.45) {
      setLineReveal(lerp4(p, [0.15, 0.42], [0, 1]));
    } else if (p >= 0.55) {
      setLineReveal(lerp4(p, [0.55, 0.80], [0, 1]));
    }

    // Outro
    setOutroOp(lerp4(p, [0.88, 0.93, 0.97, 1.0], [0, 1, 1, 0]));
  });

  const macLines = era === 'classic' ? classicMac : aiMac;
  const winLines = era === 'classic' ? classicWin : aiWin;
  const linuxLines = era === 'classic' ? classicLinux : aiLinux;

  const macApp = era === 'classic' ? 'Terminal — vim' : 'Cursor — AI Editor';
  const winApp = era === 'classic' ? 'VS Code — main.js' : 'VS Code + Copilot ✦';
  const linuxApp = era === 'classic' ? 'bash — ~/project' : 'claude-code — ~/project';

  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-8">
      {/* Title */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: titleOp, pointerEvents: titleOp < 0.1 ? 'none' : 'auto' }}
      >
        <p className="text-[10px] font-mono tracking-[0.5em] text-white/20 uppercase mb-4">
          Three Desktops
        </p>
        <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          开发者的桌面。
        </h3>
        <p className="mt-3 text-sm text-white/25 font-light">
          同样的屏幕，不同的时代。
        </p>
      </div>

      {/* Three screens */}
      <div
        className="w-full max-w-5xl flex flex-col sm:flex-row gap-3 sm:gap-4"
        style={{ opacity: screenOp, pointerEvents: screenOp < 0.1 ? 'none' : 'auto' }}
      >
        {/* Era label */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center">
          <span className={`text-xs font-mono tracking-[0.4em] uppercase transition-all duration-500 ${
            era === 'classic' ? 'text-white/20' : 'text-cyan-400/40'
          }`}>
            {era === 'classic' ? '2018 · 传统开发' : '2024 · AI 时代'}
          </span>
        </div>

        <OsWindow
          os="mac"
          app={macApp}
          lines={macLines}
          lineReveal={lineReveal}
          titleBarClass="bg-[#2d2d2d]"
          glitching={glitch}
        />
        <OsWindow
          os="win"
          app={winApp}
          lines={winLines}
          lineReveal={lineReveal}
          titleBarClass="bg-[#1e3a5f]"
          glitching={glitch}
        />
        <OsWindow
          os="linux"
          app={linuxApp}
          lines={linuxLines}
          lineReveal={lineReveal}
          titleBarClass="bg-[#2d2d2d]"
          glitching={glitch}
        />
      </div>

      {/* Outro */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        style={{ opacity: outroOp, pointerEvents: outroOp < 0.1 ? 'none' : 'auto' }}
      >
        <p className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          工具变了。
        </p>
        <p className="mt-2 text-lg text-white/30 font-light">
          但屏幕前的人，还在。
        </p>
      </div>
    </div>
  );
}
