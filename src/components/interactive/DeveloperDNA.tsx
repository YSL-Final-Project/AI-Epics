import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useI18n } from '../../i18n';

/**
 * Developer DNA — a personality quiz that generates your "developer genome"
 * as a visual radar chart with typing archetype result.
 */

interface Question {
  question: string;
  questionEn: string;
  options: { label: string; labelEn: string; scores: number[] }[];
  // scores map to: [frontend, backend, devops, ai, creative, hacker]
}

const DIMS = ['Frontend', 'Backend', 'DevOps', 'AI/ML', 'Creative', 'Hacker'];
const DIM_COLORS = ['#06b6d4', '#a855f7', '#f59e0b', '#10a37f', '#f472b6', '#ef4444'];

const questions: Question[] = [
  {
    question: '你最享受的编程时刻是？',
    questionEn: "What's your favorite moment while coding?",
    options: [
      { label: '🎨 把一个页面做到像素级完美', labelEn: '🎨 Getting a page to pixel-perfect', scores: [3, 0, 0, 0, 2, 0] },
      { label: '⚡ 优化查询从 2s 到 20ms',     labelEn: '⚡ Optimizing a query from 2s to 20ms', scores: [0, 3, 1, 0, 0, 1] },
      { label: '🤖 训练模型看到 loss 下降',     labelEn: '🤖 Watching the loss curve drop while training', scores: [0, 0, 0, 3, 1, 1] },
      { label: '💀 在凌晨3点修复了一个诡异 bug', labelEn: '💀 Fixing a bizarre bug at 3am', scores: [0, 1, 0, 0, 0, 3] },
    ],
  },
  {
    question: '周末你会用什么方式 "充电"？',
    questionEn: 'How do you recharge on weekends?',
    options: [
      { label: '📱 做一个好玩的 side project', labelEn: '📱 Building a fun side project', scores: [2, 1, 0, 0, 2, 0] },
      { label: '📚 读技术博客和论文',           labelEn: '📚 Reading tech blogs and papers', scores: [0, 1, 1, 2, 0, 1] },
      { label: '🏗️ 搭建自己的 homelab 服务器', labelEn: '🏗️ Setting up a homelab server', scores: [0, 1, 3, 0, 0, 1] },
      { label: '🎮 打游戏 / 什么都不做',        labelEn: '🎮 Gaming / doing nothing', scores: [0, 0, 0, 0, 1, 2] },
    ],
  },
  {
    question: '面对一个新技术栈，你的第一反应是？',
    questionEn: "What's your first reaction to a new tech stack?",
    options: [
      { label: '🚀 立刻开始写 Hello World',          labelEn: '🚀 Jump in and write Hello World', scores: [1, 1, 0, 0, 1, 2] },
      { label: '📖 先读完官方文档再动手',              labelEn: '📖 Read the docs before touching anything', scores: [1, 2, 1, 1, 0, 0] },
      { label: '🔍 去 GitHub 看看 star 数和社区活跃度', labelEn: '🔍 Check GitHub stars and community activity', scores: [0, 1, 2, 0, 0, 1] },
      { label: '🧪 跑 benchmark 跟现有方案对比',       labelEn: '🧪 Run benchmarks against existing solutions', scores: [0, 2, 1, 2, 0, 1] },
    ],
  },
  {
    question: '你最想拥有的超能力是？',
    questionEn: 'What superpower do you want most?',
    options: [
      { label: '⏳ 让所有代码都没有 bug',         labelEn: '⏳ Make all code bug-free', scores: [1, 2, 1, 0, 0, 2] },
      { label: '👁️ 一眼看穿任何系统的架构',        labelEn: "👁️ See through any system's architecture instantly", scores: [0, 3, 2, 0, 0, 1] },
      { label: '🎯 让每个产品都有 100 万用户',     labelEn: '🎯 Make every product reach 1 million users', scores: [2, 0, 0, 0, 3, 0] },
      { label: '🧠 能理解 AI 到底在"想"什么',      labelEn: '🧠 Understand what AI is actually "thinking"', scores: [0, 0, 0, 3, 1, 1] },
    ],
  },
  {
    question: 'AI 编程助手对你来说是？',
    questionEn: 'What is an AI coding assistant to you?',
    options: [
      { label: '🛠️ 生产力工具，跟 IDE 一样',        labelEn: '🛠️ A productivity tool, like my IDE', scores: [1, 1, 1, 1, 0, 1] },
      { label: '🤝 结对编程的搭档',                labelEn: '🤝 A pair programming partner', scores: [1, 1, 0, 2, 1, 0] },
      { label: '🎪 有趣的玩具，经常给惊喜',         labelEn: '🎪 A fun toy that often surprises me', scores: [0, 0, 0, 1, 2, 2] },
      { label: '⚠️ 需要严格审核的初级实习生',        labelEn: '⚠️ A junior intern that needs strict review', scores: [0, 2, 2, 0, 0, 1] },
    ],
  },
];

interface Archetype {
  name: string;
  nameEn: string;
  emoji: string;
  desc: string;
  descEn: string;
  color: string;
}

const archetypes: Record<string, Archetype> = {
  Frontend:  { name: '界面诗人',  nameEn: 'UI Poet',        emoji: '🎨', desc: '你追求像素级完美，CSS 是你的画笔',       descEn: 'You chase pixel-perfect UI — CSS is your paintbrush',                   color: '#06b6d4' },
  Backend:   { name: '架构巫师',  nameEn: 'Arch Wizard',     emoji: '🧙', desc: '你能把混乱的系统变成优雅的架构',        descEn: 'You transform chaotic systems into elegant architecture',               color: '#a855f7' },
  DevOps:    { name: '基建狂魔',  nameEn: 'Infra Maniac',    emoji: '🏗️', desc: '没有你搭不起来的环境和流水线',         descEn: 'No environment or pipeline is too hard for you to build',              color: '#f59e0b' },
  'AI/ML':   { name: 'AI 驯兽师', nameEn: 'AI Tamer',        emoji: '🤖', desc: '你能让模型听话，loss 在你面前只能下降', descEn: 'You make models behave — the loss curve only goes down for you',       color: '#10a37f' },
  Creative:  { name: '创意黑客',  nameEn: 'Creative Hacker', emoji: '🎪', desc: '你不按套路出牌，产品在你手里总有惊喜', descEn: 'You break conventions — your products always surprise people',         color: '#f472b6' },
  Hacker:    { name: '深夜极客',  nameEn: 'Night Owl Geek',  emoji: '💀', desc: '凌晨3点的你比白天效率高10倍',          descEn: "You're 10× more productive at 3am than during the day",               color: '#ef4444' },
};

function RadarChart({ scores, maxScores }: { scores: number[]; maxScores: number }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const CX = 120, CY = 120, R = 90;
  const n = DIMS.length;

  const getPoint = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (value / maxScores) * R;
    return { x: CX + r * Math.cos(angle), y: CY + r * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[260px] mx-auto">
      {/* Grid rings */}
      {gridLevels.map(level => (
        <polygon
          key={level}
          points={Array.from({ length: n }, (_, i) => {
            const p = getPoint(i, maxScores * level);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.07)"}
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {DIMS.map((_, i) => {
        const p = getPoint(i, maxScores);
        return (
          <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
        );
      })}

      {/* Data shape */}
      <motion.polygon
        points={scores.map((s, i) => { const p = getPoint(i, s); return `${p.x},${p.y}`; }).join(' ')}
        fill="rgba(6,182,212,0.12)"
        stroke="#06b6d4"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        style={{ transformOrigin: `${CX}px ${CY}px` }}
      />

      {/* Vertex dots + labels */}
      {DIMS.map((dim, i) => {
        const p = getPoint(i, maxScores * 1.18);
        const dp = getPoint(i, scores[i]);
        return (
          <g key={dim}>
            <motion.circle
              cx={dp.x} cy={dp.y} r="4"
              fill={DIM_COLORS[i]}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: 1, r: 4 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
            />
            <text
              x={p.x} y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] font-mono fill-slate-400 dark:fill-white/30"
            >
              {dim}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function DeveloperDNA() {
  const { t, lang } = useI18n();
  const td = t.interactive.dna;
  const [currentQ, setCurrentQ] = useState(0);
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [done, setDone] = useState(false);

  const handleAnswer = (optionScores: number[]) => {
    const newScores = scores.map((s, i) => s + optionScores[i]);
    setScores(newScores);
    if (currentQ < questions.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setDone(true);
    }
  };

  const restart = () => {
    setCurrentQ(0);
    setScores([0, 0, 0, 0, 0, 0]);
    setDone(false);
  };

  // Find top archetype
  const maxScore = Math.max(...scores);
  const topIdx = scores.indexOf(maxScore);
  const topDim = DIMS[topIdx];
  const archetype = archetypes[topDim];

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-[10px] font-mono text-slate-400 dark:text-white/20 tracking-[0.3em] uppercase mb-4">{td.yourDna}</p>

        <RadarChart scores={scores} maxScores={Math.max(15, maxScore)} />

        {/* Archetype result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-6"
        >
          <span className="text-4xl">{archetype.emoji}</span>
          <h3 className="text-2xl font-black mt-2" style={{ color: archetype.color }}>
            {lang === 'en' ? archetype.nameEn : archetype.name}
          </h3>
          <p className="text-xs text-slate-400 dark:text-white/30 font-mono mt-1">{lang === 'en' ? archetype.name : archetype.nameEn}</p>
          <p className="text-sm text-slate-600 dark:text-white/50 mt-3 max-w-sm mx-auto">{lang === 'en' ? archetype.descEn : archetype.desc}</p>
        </motion.div>

        {/* Score breakdown */}
        <div className="mt-6 space-y-2 max-w-xs mx-auto">
          {DIMS.map((dim, i) => (
            <div key={dim} className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-slate-400 dark:text-white/20 w-16 text-right">{dim}</span>
              <div className="flex-1 h-1.5 bg-slate-200 dark:bg-white/[0.04] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: DIM_COLORS[i] }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(scores[i] / Math.max(15, maxScore)) * 100}%` }}
                  transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                />
              </div>
              <span className="text-[10px] font-mono tabular-nums text-slate-400 dark:text-white/20 w-4">{scores[i]}</span>
            </div>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          onClick={restart}
          className="mt-8 px-6 py-2.5 rounded-full border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-400 dark:text-white/30 hover:text-slate-700 dark:hover:text-white/60 hover:border-slate-400 dark:hover:border-white/20 transition-all"
        >
          {td.restart}
        </motion.button>
      </motion.div>
    );
  }

  const q = questions[currentQ];

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-1.5 mb-6 justify-center">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === currentQ ? 'w-6 bg-cyan-400' : i < currentQ ? 'w-1.5 bg-slate-300 dark:bg-white/20' : 'w-1.5 bg-slate-200 dark:bg-white/[0.06]'
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
        >
          <p className="text-lg font-bold text-slate-800 dark:text-white/80 mb-6 text-center">{lang === 'en' ? q.questionEn : q.question}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(opt.scores)}
                className="px-5 py-4 rounded-xl text-sm text-left font-medium bg-slate-50 dark:bg-white/[0.03] text-slate-600 dark:text-white/40 border border-slate-200 dark:border-white/[0.06] hover:border-cyan-500/30 hover:text-slate-900 dark:hover:text-white/70 hover:bg-cyan-500/5 transition-all duration-200"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.35 }}
              >
                {lang === 'en' ? opt.labelEn : opt.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
