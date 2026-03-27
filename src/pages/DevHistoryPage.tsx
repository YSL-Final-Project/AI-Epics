import { useState, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import PageTransition from '../components/layout/PageTransition';
import LineReveal from '../components/animations/LineReveal';

// ─── Raw commit data ───────────────────────────────────────────────────────────
const commits = [
  {
    hash: '5c1c62b',
    date: 'Mar 19 · 19:02',
    dateShort: '3/19',
    label: '00',
    title: 'Bootstrap',
    titleZh: '项目初始化',
    desc: 'Created a sample React framework — the blank canvas.',
    descZh: '从零开始，Vite + React + TypeScript 脚手架就位。',
    tags: ['React', 'Vite', 'TypeScript'],
    milestone: true,
    lines: 2951,
    components: 0,
    pages: 0,
    dataFiles: 0,
    totalFiles: 16,
    color: '#64748b',
    highlight: false,
  },
  {
    hash: 'd2da8ef',
    date: 'Mar 19 · 21:23',
    dateShort: '3/19 PM',
    label: '01',
    title: 'The Big Bang',
    titleZh: '大爆炸',
    desc: 'Complete AI Code Era project with premium Apple-style design — 36 components, 6 pages, 12 data files in one commit.',
    descZh: '一次提交完成整个 AI Code Era 项目核心，Apple 风格设计，36 个组件，6 个页面，12 个数据文件。',
    tags: ['Design System', 'Recharts', 'Framer Motion', 'Tailwind'],
    milestone: true,
    lines: 10792,
    components: 36,
    pages: 6,
    dataFiles: 12,
    totalFiles: 74,
    color: '#06b6d4',
    highlight: true,
  },
  {
    hash: 'ebbb36c',
    date: 'Mar 19 · 22:19',
    dateShort: '3/19 PM',
    label: '02',
    title: 'Architecture Refactor',
    titleZh: '架构重构',
    desc: 'Extract shared components, add lazy loading, 404 page, and team info. Foundation hardened.',
    descZh: '抽取公共组件、添加懒加载、404 页面及团队信息，夯实架构基础。',
    tags: ['Code Splitting', 'Lazy Load', '404'],
    milestone: false,
    lines: 10713,
    components: 38,
    pages: 7,
    dataFiles: 12,
    totalFiles: 77,
    color: '#8b5cf6',
    highlight: false,
  },
  {
    hash: 'd03c38e',
    date: 'Mar 19 · 23:45',
    dateShort: '3/19 Night',
    label: '03',
    title: 'Story Mode',
    titleZh: '故事模式',
    desc: 'Add /story — a standalone cinematic scroll experience with 11 new components.',
    descZh: '新增 /story 叙事页面，电影级滚动体验，独立渲染不含导航栏，一口气新增 11 个组件。',
    tags: ['Scroll Animation', 'Cinematic', 'Standalone Page'],
    milestone: true,
    lines: 12338,
    components: 49,
    pages: 8,
    dataFiles: 12,
    totalFiles: 89,
    color: '#10b981',
    highlight: true,
  },
  {
    hash: 'f44eef0',
    date: 'Mar 23 · 09:24',
    dateShort: '3/23',
    label: '04',
    title: 'Compare Redesign',
    titleZh: '对比页重设计',
    desc: 'Redesign Compare page with Apple-style scroll-driven charts + visual upgrades.',
    descZh: '对比页全面重设计，Apple 风格滚动驱动图表，视觉大升级。',
    tags: ['Scroll-driven', 'Apple UX', 'Charts'],
    milestone: false,
    lines: 13217,
    components: 51,
    pages: 8,
    dataFiles: 12,
    totalFiles: 91,
    color: '#f59e0b',
    highlight: false,
  },
  {
    hash: 'e13c110',
    date: 'Mar 23 · 09:35',
    dateShort: '3/23',
    label: '05',
    title: 'Motion FX',
    titleZh: '动效系统',
    desc: 'Ambient glow, velocity ribbon, stat pulse, dual-wave text, layoutId FLIP transitions.',
    descZh: '新增环境光晕、速度彩带、数据脉冲、双波浪文字和 layoutId FLIP 转场。',
    tags: ['Framer Motion', 'FLIP', 'Glow'],
    milestone: false,
    lines: 13378,
    components: 53,
    pages: 8,
    dataFiles: 12,
    totalFiles: 93,
    color: '#ec4899',
    highlight: false,
  },
  {
    hash: '982bd55',
    date: 'Mar 23 · 16:50',
    dateShort: '3/23 PM',
    label: '06',
    title: 'SVG Icon System + Matrix',
    titleZh: 'SVG 图标 + 矩阵雨',
    desc: 'Replace all emojis with custom SVG icons, add Matrix rain background, and Desktop Evolution to Story.',
    descZh: '用自定义 SVG 图标替换所有 emoji，加入矩阵雨背景，故事页新增桌面进化章节。',
    tags: ['SVG Icons', 'Matrix Rain', 'Easter Egg'],
    milestone: false,
    lines: 14011,
    components: 56,
    pages: 8,
    dataFiles: 12,
    totalFiles: 96,
    color: '#22d3ee',
    highlight: false,
  },
  {
    hash: '5daab30',
    date: 'Mar 23 · 22:23',
    dateShort: '3/23 Night',
    label: '07',
    title: 'i18n System',
    titleZh: '国际化系统',
    desc: 'Full Chinese/English toggle with i18n provider, CodePeek windows, and LineReveal bug fix.',
    descZh: '完整中英双语切换系统，CodePeek 代码预览窗口，修复 LineReveal 动画 bug。',
    tags: ['i18n', 'zh/EN', 'CodePeek'],
    milestone: true,
    lines: 15232,
    components: 57,
    pages: 8,
    dataFiles: 12,
    totalFiles: 101,
    color: '#a78bfa',
    highlight: true,
  },
  {
    hash: '5fdef14',
    date: 'Mar 24 · 10:07',
    dateShort: '3/24',
    label: '08',
    title: 'Autoplay Engine',
    titleZh: '自动播放引擎',
    desc: 'Add autoplay system with scroll guide to Story page — hands-free narrative experience.',
    descZh: '故事页新增自动播放系统和滚动引导，解放双手沉浸叙事。',
    tags: ['Autoplay', 'UX', 'Story'],
    milestone: false,
    lines: 15440,
    components: 58,
    pages: 8,
    dataFiles: 12,
    totalFiles: 102,
    color: '#34d399',
    highlight: false,
  },
  {
    hash: '86b790f',
    date: 'Mar 24 · 10:42',
    dateShort: '3/24',
    label: '09',
    title: 'Futuristic FX',
    titleZh: '赛博朋克特效',
    desc: 'CyberGrid, DataStream, HUD overlay, neon lines, holo cards, warp starfield — the lab goes sci-fi.',
    descZh: '赛博网格、数据流、HUD 叠层、霓虹线条、全息卡片、曲速星空——实验室进入科幻模式。',
    tags: ['CyberGrid', 'HUD', 'Neon', 'Starfield'],
    milestone: true,
    lines: 15885,
    components: 61,
    pages: 8,
    dataFiles: 12,
    totalFiles: 105,
    color: '#f472b6',
    highlight: true,
  },
  {
    hash: 'c69690b',
    date: 'Mar 24 · 10:50',
    dateShort: '3/24',
    label: '10',
    title: 'LLM Arena',
    titleZh: 'LLM 竞技场',
    desc: '3-model streaming chatbot comparison — GPT-4o vs Claude vs Gemini, side-by-side real-time.',
    descZh: '三模型实时流式对比 —— GPT-4o vs Claude vs Gemini，并排实时竞技。',
    tags: ['Streaming', 'LLM', 'WebSocket'],
    milestone: true,
    lines: 16726,
    components: 62,
    pages: 8,
    dataFiles: 13,
    totalFiles: 107,
    color: '#fb923c',
    highlight: true,
  },
  {
    hash: '9e86b65',
    date: 'Mar 24 · 13:07',
    dateShort: '3/24 PM',
    label: '11',
    title: 'AI Time Machine + DNA',
    titleZh: 'AI 时光机 + DNA',
    desc: 'AI Time Machine quiz and Developer DNA personality test — gamified learning in Lab.',
    descZh: 'AI 时光机问答和开发者 DNA 性格测试，实验室玩法升级为游戏化体验。',
    tags: ['Quiz', 'Gamification', 'Personality'],
    milestone: true,
    lines: 17319,
    components: 64,
    pages: 8,
    dataFiles: 13,
    totalFiles: 109,
    color: '#06b6d4',
    highlight: true,
  },
];

// Chart data (subset for readability)
const chartData = commits.map(c => ({
  label: `${c.label} ${c.title}`,
  shortLabel: c.label,
  lines: c.lines,
  components: c.components,
  pages: c.pages,
  dataFiles: c.dataFiles,
  totalFiles: c.totalFiles,
}));

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const commit = commits.find(c => `${c.label} ${c.title}` === label);
  return (
    <div className="bg-slate-900/95 border border-cyan-500/20 rounded-xl p-3 shadow-xl backdrop-blur-sm text-xs">
      <p className="text-cyan-400 font-mono mb-2">{commit?.date}</p>
      <p className="text-white font-bold mb-1">{commit?.title}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-300">
          <span style={{ color: p.color }}>■</span>
          <span className="capitalize">{p.name}:</span>
          <span className="font-mono text-white">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Stat Counter ──────────────────────────────────────────────────────────────
function StatCounter({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="text-center">
      <motion.div
        className="text-4xl font-black text-white tabular-nums"
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        {inView ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {value.toLocaleString()}{suffix}
          </motion.span>
        ) : '—'}
      </motion.div>
      <p className="text-slate-400 text-xs mt-1 font-mono uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────────
function TimelineItem({ commit, index, isZh }: { commit: typeof commits[0]; index: number; isZh: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`relative flex items-start gap-6 mb-10 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Content card */}
      <motion.div
        className={`flex-1 ${isLeft ? 'text-right pr-2' : 'text-left pl-2'}`}
        initial={prefersReduced ? false : { opacity: 0, x: isLeft ? -30 : 30 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className={`inline-block p-4 rounded-2xl border transition-all duration-300
          ${commit.highlight
            ? 'bg-slate-800/80 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
            : 'bg-slate-800/40 border-slate-700/40'
          }`}
        >
          {/* Label + date */}
          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            <span className="font-mono text-[10px] tracking-widest text-slate-500 uppercase">{commit.date}</span>
            {commit.milestone && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
                style={{ background: commit.color + '20', color: commit.color }}>
                Milestone
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-white mb-1">
            {isZh ? commit.titleZh : commit.title}
          </h3>

          {/* Desc */}
          <p className="text-slate-400 text-xs leading-relaxed mb-3">
            {isZh ? commit.descZh : commit.desc}
          </p>

          {/* Tags */}
          <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            {commit.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-700/60 text-slate-300 border border-slate-600/40">
                {tag}
              </span>
            ))}
          </div>

          {/* Stats delta */}
          <div className={`flex gap-3 mt-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            {[
              { label: 'Lines', val: commit.lines, icon: '≡' },
              { label: 'Cmps', val: commit.components, icon: '⬡' },
              { label: 'Files', val: commit.totalFiles, icon: '◈' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-[11px] font-mono font-bold" style={{ color: commit.color }}>
                  {s.icon} {s.val.toLocaleString()}
                </div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Center line + node */}
      <div className="flex flex-col items-center flex-none w-10">
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold border-2 z-10"
          style={{
            background: commit.highlight ? commit.color + '20' : '#1e293b',
            borderColor: commit.color,
            color: commit.color,
          }}
          initial={prefersReduced ? false : { scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.1, type: 'spring', stiffness: 300 }}
        >
          {commit.label}
        </motion.div>
        {/* Vertical connector */}
        {index < commits.length - 1 && (
          <motion.div
            className="w-px mt-1 flex-1 min-h-[3rem]"
            style={{ background: `linear-gradient(to bottom, ${commit.color}40, transparent)` }}
            initial={prefersReduced ? false : { scaleY: 0, originY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        )}
      </div>

      {/* Spacer for alternating layout */}
      <div className="flex-1" />
    </div>
  );
}

// ─── Chart Section ─────────────────────────────────────────────────────────────
function GrowthChart() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="space-y-10">
      {/* Lines of Code */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-6 rounded-full bg-cyan-400" />
          <h3 className="text-sm font-bold text-white">Lines of Code</h3>
          <span className="text-slate-500 text-xs font-mono ml-auto">(.ts .tsx .css .json)</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLines" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="shortLabel" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            {commits.filter(c => c.milestone).map(c => (
              <ReferenceLine key={c.hash} x={`${c.label} ${c.title}`} stroke={c.color} strokeDasharray="3 3" strokeOpacity={0.4} />
            ))}
            <Area type="monotone" dataKey="lines" name="Lines" stroke="#06b6d4" fill="url(#gradLines)" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Components + Files */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="bg-slate-800/50 border border-slate-700/40 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 rounded-full bg-violet-400" />
            <h3 className="text-sm font-bold text-white">Components & Files</h3>
          </div>
          <div className="flex gap-4 ml-auto text-xs text-slate-400 font-mono">
            <span><span className="text-violet-400">━</span> Components</span>
            <span><span className="text-amber-400">━</span> Total Files</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradCmp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFiles" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="shortLabel" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="components" name="Components" stroke="#8b5cf6" fill="url(#gradCmp)" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 3 }} />
            <Area type="monotone" dataKey="totalFiles" name="Total Files" stroke="#f59e0b" fill="url(#gradFiles)" strokeWidth={2} dot={{ fill: '#f59e0b', r: 3 }} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function DevHistoryPage() {
  const prefersReduced = useReducedMotion();
  const [isZh, setIsZh] = useState(false);
  const [activeTab, setActiveTab] = useState<'timeline' | 'charts'>('timeline');

  const final = commits[commits.length - 1];
  const initial = commits[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#080c14] text-slate-100 relative overflow-hidden">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(ellipse, #06b6d4 0%, transparent 70%)' }} />
          <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-6"
            style={{ background: 'radial-gradient(ellipse, #8b5cf6 0%, transparent 70%)' }} />
        </div>

        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20">

          {/* ── Hero ─────────────────────────────────────────────── */}
          <div className="text-center mb-20">
            <motion.p
              initial={prefersReduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.8 }}
              className="font-mono text-[10px] tracking-[0.6em] text-cyan-500/40 uppercase mb-6"
            >
              Dev · History · Map
            </motion.p>

            <LineReveal className="text-[clamp(2.8rem,9vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.92] text-white mb-6">
              {isZh ? '开发历史图谱' : 'Development\nHistory'}
            </LineReveal>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed mb-8"
            >
              {isZh
                ? '12 次提交 · 5 天 · 从一个空白模板到完整的数据可视化项目'
                : '12 commits · 5 days · From a blank template to a full data visualization project'
              }
            </motion.p>

            {/* Lang toggle */}
            <motion.button
              onClick={() => setIsZh(z => !z)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700/60 text-xs font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {isZh ? '🌐 Switch to EN' : '🌐 切换中文'}
            </motion.button>
          </div>

          {/* ── Key Stats ────────────────────────────────────────── */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-700/30 rounded-2xl overflow-hidden border border-slate-700/30 mb-16"
          >
            {[
              { value: final.lines - initial.lines, suffix: '', label: isZh ? '新增代码行' : 'Lines Added' },
              { value: final.components, suffix: '', label: isZh ? '组件总数' : 'Components' },
              { value: final.totalFiles - initial.totalFiles, suffix: '', label: isZh ? '新增文件数' : 'Files Created' },
              { value: commits.length - 1, suffix: '', label: isZh ? '有效提交' : 'Commits' },
            ].map(s => (
              <div key={s.label} className="bg-slate-900/80 py-8 px-4">
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </motion.div>

          {/* ── Tab switcher ─────────────────────────────────────── */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-xl bg-slate-800/60 border border-slate-700/40 gap-1">
              {[
                { id: 'timeline', label: isZh ? '时间轴' : 'Timeline' },
                { id: 'charts', label: isZh ? '增长曲线' : 'Growth Charts' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg bg-slate-700/80"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Timeline View ─────────────────────────────────────── */}
          {activeTab === 'timeline' && (
            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/20 via-slate-700/30 to-transparent -translate-x-1/2 pointer-events-none" />
              {commits.map((commit, i) => (
                <TimelineItem key={commit.hash} commit={commit} index={i} isZh={isZh} />
              ))}
            </div>
          )}

          {/* ── Charts View ───────────────────────────────────────── */}
          {activeTab === 'charts' && (
            <div>
              <GrowthChart />

              {/* Milestone legend */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 p-5 rounded-2xl border border-slate-700/40 bg-slate-800/30"
              >
                <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-4">
                  {isZh ? '里程碑节点' : 'Milestone Commits'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {commits.filter(c => c.milestone).map(c => (
                    <div key={c.hash} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-1 flex-none" style={{ background: c.color }} />
                      <div>
                        <p className="text-xs font-bold text-slate-200">{isZh ? c.titleZh : c.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Footer coda ───────────────────────────────────────── */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 text-center border-t border-slate-800 pt-12"
          >
            <p className="font-mono text-[10px] tracking-[0.4em] text-slate-600 uppercase mb-3">
              {isZh ? '从第一行到最后一行' : 'From first line to last'}
            </p>
            <p className="text-slate-500 text-sm">
              {isZh
                ? `${(final.lines - initial.lines).toLocaleString()} 行代码 · ${final.components} 个组件 · ${final.totalFiles} 个文件 · 5 天`
                : `${(final.lines - initial.lines).toLocaleString()} lines · ${final.components} components · ${final.totalFiles} files · 5 days`
              }
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
