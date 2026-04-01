import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * AI Time Machine — drag a slider through 2015→2030.
 * Each year shows a "terminal" that demonstrates what AI could do at that time,
 * with a typing animation and visual flair.
 */

interface YearData {
  year: number;
  era: string;
  eraEn: string;
  aiCapability: string;
  aiCapabilityEn: string;
  demo: string; // terminal demo text
  color: string;
  icon: string;
  powerLevel: number; // 0-100
}

const timeline: YearData[] = [
  {
    year: 2015,
    era: '史前时代',
    eraEn: 'Prehistoric',
    aiCapability: 'AI 只能识别猫和狗的图片',
    aiCapabilityEn: 'AI can only recognize cats and dogs in photos',
    demo: '$ ai classify photo.jpg\n> 🐱 Cat (87% confidence)\n> Processing time: 4.2s\n> GPU memory: 12GB\n> Model: VGG-16',
    color: '#6b7280',
    icon: '🦕',
    powerLevel: 5,
  },
  {
    year: 2017,
    era: '蒙昧时代',
    eraEn: 'Dark Ages',
    aiCapability: 'Transformer 论文发布，但没人知道它会改变世界',
    aiCapabilityEn: 'Transformer paper published — nobody knew it would change everything',
    demo: '$ paper search "attention is all you need"\n> Citations: 3\n> Impact: Unknown\n> Reviewer comment: "Interesting but\n  probably won\'t replace RNNs"',
    color: '#8b5cf6',
    icon: '📜',
    powerLevel: 8,
  },
  {
    year: 2019,
    era: '启蒙时代',
    eraEn: 'Enlightenment',
    aiCapability: 'GPT-2 写出了像样的段落，OpenAI 说"太危险不敢发布"',
    aiCapabilityEn: 'GPT-2 writes decent paragraphs — OpenAI says "too dangerous to release"',
    demo: '$ gpt2 generate --prompt "The future of AI"\n> "The future of AI is uncertain, but\n  one thing is clear: machines will\n  eventually surpass human..."\n> [OUTPUT CENSORED - Too dangerous]\n> Parameters: 1.5B',
    color: '#f59e0b',
    icon: '💡',
    powerLevel: 15,
  },
  {
    year: 2021,
    era: '文艺复兴',
    eraEn: 'Renaissance',
    aiCapability: 'Copilot 内测：AI 第一次帮你写代码，但经常写错',
    aiCapabilityEn: 'Copilot beta: AI writes code for the first time — often wrong',
    demo: '$ copilot suggest "sort an array"\n> function sort(arr) {\n>   return arr.sort(); // ⚠️ mutates original\n> }\n> Confidence: Medium\n> // TODO: this sorts strings, not numbers\n> // known issue #4521',
    color: '#06b6d4',
    icon: '🎨',
    powerLevel: 30,
  },
  {
    year: 2022,
    era: '大爆炸',
    eraEn: 'Big Bang',
    aiCapability: 'ChatGPT 发布，5天100万用户，世界从此不同',
    aiCapabilityEn: 'ChatGPT launched — 1M users in 5 days, world changed forever',
    demo: '$ chatgpt "explain quantum computing"\n> Quantum computing uses qubits that\n  can exist in superposition, allowing\n  parallel computation...\n>\n> [Response quality: Revolutionary]\n> [Users today: 1,000,000+]\n> [Time to 1M: 5 days]\n> [Twitter: #ChatGPT trending #1]',
    color: '#10a37f',
    icon: '💥',
    powerLevel: 55,
  },
  {
    year: 2023,
    era: '寒武纪爆发',
    eraEn: 'Cambrian Explosion',
    aiCapability: 'GPT-4 能通过律师考试，AI 工具数量爆炸式增长',
    aiCapabilityEn: 'GPT-4 passes the bar exam — AI tools explode in number',
    demo: '$ gpt4 --task "bar exam"\n> Score: 298/400 (Top 10%)\n> Analysis: Passed all sections\n>\n$ count ai-tools --category coding\n> 2022: 12 tools\n> 2023: 847 tools (+6,958%)\n>\n$ cursor users --growth\n> Jan: 10K → Dec: 500K',
    color: '#a855f7',
    icon: '🦠',
    powerLevel: 72,
  },
  {
    year: 2024,
    era: '基础设施时代',
    eraEn: 'Infrastructure Era',
    aiCapability: '40% GitHub 代码由 AI 生成，Devin 号称首个 AI 工程师',
    aiCapabilityEn: '40% of GitHub code is AI-generated — Devin claims first AI engineer',
    demo: '$ github stats --year 2024\n> AI-assisted code: 40%\n> Top AI tool: Copilot (1.5M users)\n> SO traffic: -55% from peak\n>\n$ devin status\n> Role: AI Software Engineer\n> Can: Plan, Code, Debug, Deploy\n> Cost: $500/month\n> Human equivalent: Junior Dev',
    color: '#ef4444',
    icon: '🏗️',
    powerLevel: 85,
  },
  {
    year: 2025,
    era: '新物种时代',
    eraEn: 'New Species Era',
    aiCapability: 'AI 编程助手成为标配，不用 AI 的开发者是少数派',
    aiCapabilityEn: 'AI coding assistants are the norm — devs without AI are the minority',
    demo: '$ survey developer-tools 2025\n> Using AI daily: 78%\n> Never used AI: 3%\n> "AI replaced my junior": 34%\n>\n$ salary compare\n> AI-native dev: $185K\n> Traditional dev: $95K\n> Gap: 1.95x\n>\n$ vibe-coding --status\n> It\'s not a meme anymore.',
    color: '#06b6d4',
    icon: '🧬',
    powerLevel: 92,
  },
  {
    year: 2028,
    era: '??? 未来',
    eraEn: '??? Future',
    aiCapability: '你来预测：AI 会取代开发者吗？还是成为超级搭档？',
    aiCapabilityEn: 'You decide: Will AI replace devs? Or become the ultimate partner?',
    demo: '$ predict --year 2028\n> [CLASSIFIED]\n> [INSUFFICIENT DATA]\n>\n> But consider:\n> - AI tokens/day: 10 trillion\n> - Human developers: still needed?\n> - New job title: "AI Whisperer"\n>\n> The only certainty:\n> > The future is unwritten.\n> > You\'re writing it now.',
    color: '#f472b6',
    icon: '🔮',
    powerLevel: 100,
  },
];

function TerminalDemo({ text, color, playing }: { text: string; color: string; playing: boolean }) {
  const [displayedChars, setDisplayedChars] = useState(0);
  const rafRef = useRef<number>(0);
  const accRef = useRef(0);

  useEffect(() => {
    setDisplayedChars(0);
    accRef.current = 0;
    if (!playing) return;

    const tick = () => {
      accRef.current += 1.8;
      const n = Math.floor(accRef.current);
      if (n >= text.length) {
        setDisplayedChars(text.length);
        return;
      }
      setDisplayedChars(n);
      rafRef.current = requestAnimationFrame(tick);
    };
    const delay = setTimeout(() => { rafRef.current = requestAnimationFrame(tick); }, 300);
    return () => { clearTimeout(delay); cancelAnimationFrame(rafRef.current); };
  }, [text, playing]);

  const visible = text.slice(0, displayedChars);
  const done = displayedChars >= text.length;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-white/[0.06] bg-slate-50 dark:bg-[#0d1117]">
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-100/50 dark:bg-white/[0.03] border-b border-slate-200 dark:border-white/[0.04]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] font-mono text-slate-400 dark:text-white/20 ml-1">ai-time-machine</span>
      </div>
      {/* Terminal body */}
      <pre className="p-4 text-[12px] font-mono leading-relaxed h-[180px] overflow-y-auto" style={{ color }}>
        {visible}
        {!done && (
          <motion.span
            className="inline-block w-[6px] h-[14px] align-middle rounded-sm ml-0.5"
            style={{ background: color }}
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
      </pre>
    </div>
  );
}

export default function AITimeMachine() {
  const [yearIdx, setYearIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const current = timeline[yearIdx];

  // Auto-advance every 5s
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setYearIdx(prev => (prev + 1) % timeline.length);
    }, 6000);
    return () => clearInterval(t);
  }, [isPlaying]);

  return (
    <div>
      <p className="text-center text-xs text-slate-400 dark:text-white/20 mb-6 font-light">
        {/* Instruction */}
        拖动时间轴，穿越 AI 编程的进化史
      </p>

      {/* Year Slider */}
      <div className="relative mb-8">
        <input
          type="range"
          min={0}
          max={timeline.length - 1}
          value={yearIdx}
          onChange={e => { setYearIdx(Number(e.target.value)); setIsPlaying(false); }}
          className="w-full h-1 appearance-none bg-slate-200 dark:bg-white/[0.06] rounded-full cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(6,182,212,0.5)]
            [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:active:cursor-grabbing"
        />
        {/* Year labels */}
        <div className="flex justify-between mt-2 px-1">
          {timeline.map((y, i) => (
            <button
              key={y.year}
              onClick={() => { setYearIdx(i); setIsPlaying(false); }}
              className={`text-[9px] font-mono transition-all ${
                i === yearIdx ? 'text-cyan-400 scale-110 font-bold' : 'text-slate-400/50 dark:text-white/15 hover:text-slate-500 dark:hover:text-white/30'
              }`}
            >
              {y.year}
            </button>
          ))}
        </div>
      </div>

      {/* Current Year Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.year}
          initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        >
          {/* Era header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{current.icon}</span>
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{current.year}</p>
                <p className="text-xs font-mono text-slate-400 dark:text-white/30">{current.era}</p>
              </div>
            </div>
            {/* Power level bar */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono text-slate-400/70 dark:text-white/20 uppercase">AI Power</span>
              <div className="w-24 h-2 bg-slate-200 dark:bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: current.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${current.powerLevel}%` }}
                  transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                />
              </div>
              <span className="text-[10px] font-mono tabular-nums" style={{ color: current.color }}>
                {current.powerLevel}%
              </span>
            </div>
          </div>

          {/* Capability description */}
          <p className="text-sm text-slate-600 dark:text-white/50 mb-4 leading-relaxed">{current.aiCapability}</p>

          {/* Terminal demo */}
          <TerminalDemo text={current.demo} color={current.color} playing={true} />
        </motion.div>
      </AnimatePresence>

      {/* Auto-play toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setIsPlaying(p => !p)}
          className="text-[10px] font-mono text-slate-400 dark:text-white/20 hover:text-slate-600 dark:hover:text-white/40 transition-colors flex items-center gap-1.5"
        >
          {isPlaying ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              自动播放中 · 点击暂停
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-white/20" />
              已暂停 · 点击继续
            </>
          )}
        </button>
      </div>
    </div>
  );
}
