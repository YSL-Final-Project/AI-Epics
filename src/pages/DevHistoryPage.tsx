import { useState, useRef } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useI18n } from '../i18n';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import PageTransition from '../components/layout/PageTransition';
import LineReveal from '../components/animations/LineReveal';
import ArchitectureMap from '../components/devHistory/ArchitectureMap';

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
  {
    hash: 'd11c7ae',
    date: 'Mar 24 · 14:32',
    dateShort: '3/24 PM',
    label: '12',
    title: 'Perf Optimization',
    titleZh: '性能优化',
    desc: 'Throttle all canvas animations to 24fps, reduce particle density, remove redundant DataStream from home.',
    descZh: '全局 canvas 动画限制 24fps，降低粒子密度，移除首页冗余 DataStream。',
    tags: ['Performance', '24fps', 'Canvas'],
    milestone: false,
    lines: 17280,
    components: 64,
    pages: 8,
    dataFiles: 13,
    totalFiles: 109,
    color: '#facc15',
    highlight: false,
  },
  {
    hash: 'd7b756e',
    date: 'Mar 24 · 16:15',
    dateShort: '3/24 PM',
    label: '13',
    title: 'Data Explorer v2',
    titleZh: '数据探索器 v2',
    desc: 'Enhance Data Explorer with insight callouts, funnels, skill tiers, traffic redistribution; add slide-based Story presentation.',
    descZh: '数据探索器增强：洞察卡片、漏斗图、技能分层、流量再分配可视化；故事页新增幻灯片演示模式。',
    tags: ['DataViz', 'Insights', 'Funnels', 'Slides'],
    milestone: true,
    lines: 18763,
    components: 67,
    pages: 8,
    dataFiles: 13,
    totalFiles: 111,
    color: '#f97316',
    highlight: true,
  },
  {
    hash: '1e136f4',
    date: 'Mar 26 · 15:30',
    dateShort: '3/26',
    label: '14',
    title: 'Dev History Page',
    titleZh: '开发历史页面',
    desc: 'Meta page — this page itself. Timeline + growth charts visualizing project evolution from git history.',
    descZh: '元页面——你正在看的这个页面。时间轴 + 增长曲线，从 git 历史可视化项目演变。',
    tags: ['Recharts', 'Timeline', 'Meta', 'Git'],
    milestone: true,
    lines: 19431,
    components: 67,
    pages: 9,
    dataFiles: 13,
    totalFiles: 112,
    color: '#a855f7',
    highlight: true,
  },
  {
    hash: 'a54e53a',
    date: 'Mar 31 · 22:40',
    dateShort: '3/31',
    label: '15',
    title: 'Full Dark Mode',
    titleZh: '全局深色模式',
    desc: 'Light/dark mode adaptation across all pages: Compare, Timeline, Lab, LLM Arena, Matrix Rain, sticky scroll narrative.',
    descZh: '所有页面完成明暗双模式适配：对比页、时间轴、实验室、LLM 竞技场、矩阵雨、滚动叙事，主题切换无缝。',
    tags: ['Dark Mode', 'Theming', 'Racing Bar'],
    milestone: true,
    lines: 19880,
    components: 67,
    pages: 9,
    dataFiles: 13,
    totalFiles: 113,
    color: '#0ea5e9',
    highlight: true,
  },
  {
    hash: 'd979f39',
    date: 'Apr 02 · 17:24',
    dateShort: '4/02',
    label: '16',
    title: 'Timeline Polish',
    titleZh: '时间轴精修',
    desc: 'Filter tabs, search bar, and year-label overlap fix for the AI Timeline page.',
    descZh: '时间轴页增加过滤标签和搜索栏，修复亮色模式下年份标签遮挡内容的问题。',
    tags: ['Timeline', 'Filter', 'Search'],
    milestone: false,
    lines: 19960,
    components: 67,
    pages: 9,
    dataFiles: 13,
    totalFiles: 113,
    color: '#64748b',
    highlight: false,
  },
  {
    hash: 'ca567c7',
    date: 'Apr 06 · 15:40',
    dateShort: '4/06',
    label: '17',
    title: 'Tool Evolution Page',
    titleZh: '工具演进页',
    desc: 'New page: 4-era interactive demos from CLI tools to Agent Loop — a chronological journey through AI coding tools.',
    descZh: '全新页面：从命令行工具到 Agent Loop，四个时代的交互式演示，带你走过 AI 编程工具的演进史。',
    tags: ['New Page', 'Interactive', '4 Eras', 'Agent Loop'],
    milestone: true,
    lines: 21700,
    components: 74,
    pages: 10,
    dataFiles: 14,
    totalFiles: 114,
    color: '#10b981',
    highlight: true,
  },
  {
    hash: '79e149a',
    date: 'Apr 06 · 19:59',
    dateShort: '4/06 PM',
    label: '18',
    title: 'DataExplorer v3',
    titleZh: '数据探索器 v3',
    desc: 'Full redesign with real-world data integration, i18n support, and Agent Loop interactive component on Tool Evolution.',
    descZh: '全面重设计：接入真实世界数据集，新增 i18n 支持，Tool Evolution 页面新增 Agent Loop 交互组件。',
    tags: ['Real Data', 'i18n', 'Redesign', 'Agent Loop'],
    milestone: true,
    lines: 23500,
    components: 75,
    pages: 10,
    dataFiles: 14,
    totalFiles: 116,
    color: '#f59e0b',
    highlight: true,
  },
  {
    hash: '402442b',
    date: 'Apr 07 · 14:36',
    dateShort: '4/07',
    label: '19',
    title: 'Compare v2 + Arena v2',
    titleZh: '对比页 v2 + 竞技场 v2',
    desc: 'Scroll-driven spotlight redesign for ToolCompare, upgraded LLM Arena voting logic, and radar chart visualization.',
    descZh: '对比页重设计为滚动驱动聚光灯样式，LLM 竞技场升级投票逻辑，新增雷达图可视化。',
    tags: ['Scroll Spotlight', 'Radar Chart', 'Arena v2'],
    milestone: true,
    lines: 25700,
    components: 76,
    pages: 10,
    dataFiles: 15,
    totalFiles: 117,
    color: '#ec4899',
    highlight: true,
  },
  {
    hash: '5a6950f',
    date: 'Apr 07 · 16:00',
    dateShort: '4/07 PM',
    label: '20',
    title: 'Architecture Treemap',
    titleZh: '架构树形图',
    desc: 'New Architecture tab in Dev History: interactive treemap of the codebase with inline code viewer.',
    descZh: '开发历史页新增架构标签：代码库交互式树形图，点击节点可内联预览对应源码。',
    tags: ['Treemap', 'Code Viewer', 'Architecture'],
    milestone: false,
    lines: 26200,
    components: 77,
    pages: 10,
    dataFiles: 15,
    totalFiles: 117,
    color: '#a855f7',
    highlight: false,
  },
  {
    hash: 'c840a1b',
    date: 'Apr 09 · 20:20',
    dateShort: '4/09',
    label: '21',
    title: 'Full i18n',
    titleZh: '全面国际化',
    desc: 'Chinese/English localization extended to all remaining pages: Homepage, Timeline, LLM Arena, Lab, About.',
    descZh: '中英双语扩展至全部页面：首页、时间轴、LLM 竞技场、实验室、关于页，国际化全覆盖。',
    tags: ['i18n', 'zh/EN', 'All Pages'],
    milestone: true,
    lines: 26850,
    components: 78,
    pages: 10,
    dataFiles: 15,
    totalFiles: 117,
    color: '#a78bfa',
    highlight: true,
  },
  {
    hash: '18ba15e',
    date: 'Apr 16 · 20:45',
    dateShort: '4/16',
    label: '22',
    title: 'Insight Page',
    titleZh: '洞察页',
    desc: '5-tab chapter narrative: DataExplorer reimagined as a cinematic journey — Liquid Lines background, chapter dots, 5 deep-dive tabs.',
    descZh: '5 标签章节叙事：数据探索器重构为电影化旅程——液态流线背景、章节点、5 个深度洞察标签页。',
    tags: ['5-Tab Narrative', 'Liquid Lines', 'Chapter Dots', 'DataViz'],
    milestone: true,
    lines: 29970,
    components: 82,
    pages: 10,
    dataFiles: 15,
    totalFiles: 123,
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
    <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-cyan-500/20 rounded-xl p-3 shadow-xl backdrop-blur-sm text-xs">
      <p className="text-cyan-600 dark:text-cyan-400 font-mono mb-2">{commit?.date}</p>
      <p className="text-slate-900 dark:text-white font-bold mb-1">{commit?.title}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span style={{ color: p.color }}>■</span>
          <span className="capitalize">{p.name}:</span>
          <span className="font-mono text-slate-900 dark:text-white">{p.value.toLocaleString()}</span>
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
        className="text-4xl font-black text-slate-900 dark:text-white tabular-nums"
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
      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 font-mono uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ─── Timeline Item ─────────────────────────────────────────────────────────────
function TimelineItem({ commit, index, isZh }: { commit: typeof commits[0]; index: number; isZh: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const prefersReduced = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
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
            ? 'bg-white dark:bg-slate-800/80 border-cyan-500/30 shadow-lg shadow-cyan-500/5'
            : 'bg-white/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/40'
          }`}
        >
          {/* Label + date */}
          <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            <span className="font-mono text-[10px] tracking-widest text-slate-400 dark:text-slate-500 uppercase">{commit.date}</span>
            {commit.milestone && (
              <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase"
                style={{ background: commit.color + '20', color: commit.color }}>
                Milestone
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            {isZh ? commit.titleZh : commit.title}
          </h3>

          {/* Desc */}
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-3">
            {isZh ? commit.descZh : commit.desc}
          </p>

          {/* Tags */}
          <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'justify-end' : 'justify-start'}`}>
            {commit.tags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600/40">
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
                <div className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</div>
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
            background: commit.highlight ? commit.color + '20' : (isDark ? '#1e293b' : '#f1f5f9'),
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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div ref={ref} className="space-y-10">
      {/* Lines of Code */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-2 h-6 rounded-full bg-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Lines of Code</h3>
          <span className="text-slate-400 dark:text-slate-500 text-xs font-mono ml-auto">(.ts .tsx .css .json)</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLines" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
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
        className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6"
      >
        <div className="flex items-center gap-4 mb-5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-6 rounded-full bg-violet-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Components & Files</h3>
          </div>
          <div className="flex gap-4 ml-auto text-xs text-slate-500 dark:text-slate-400 font-mono">
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
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1e293b" : "#e2e8f0"} />
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
  const [activeTab, setActiveTab] = useState<'timeline' | 'charts' | 'architecture'>('timeline');
  const { t, lang } = useI18n();
  const isZh = lang === 'zh';

  const final = commits[commits.length - 1];
  const initial = commits[0];

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-50 dark:bg-[#080c14] text-slate-800 dark:text-slate-100 relative overflow-hidden">

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
              className="font-mono text-[10px] tracking-[0.6em] text-cyan-600/50 dark:text-cyan-500/40 uppercase mb-6"
            >
              {t.devHistory.heroLabel}
            </motion.p>

            <LineReveal className="text-[clamp(2.8rem,9vw,5.5rem)] font-black tracking-[-0.04em] leading-[0.92] text-slate-900 dark:text-white mb-6">
              {t.devHistory.heroTitle}
            </LineReveal>

            <motion.p
              initial={prefersReduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto leading-relaxed"
            >
              {t.devHistory.heroSubtitle}
            </motion.p>
          </div>

          {/* ── Key Stats ────────────────────────────────────────── */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-700/30 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/30 mb-16"
          >
            {[
              { value: final.lines - initial.lines, suffix: '', label: t.devHistory.stats.linesAdded   },
              { value: final.components,             suffix: '', label: t.devHistory.stats.components   },
              { value: final.totalFiles - initial.totalFiles, suffix: '', label: t.devHistory.stats.filesCreated },
              { value: 93,                            suffix: '', label: t.devHistory.stats.commits      },
            ].map(s => (
              <div key={s.label} className="bg-white dark:bg-slate-900/80 py-8 px-4">
                <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </motion.div>

          {/* ── Tab switcher ─────────────────────────────────────── */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700/40 gap-1">
              {[
                { id: 'timeline',     label: t.devHistory.tabs.timeline     },
                { id: 'charts',       label: t.devHistory.tabs.charts       },
                { id: 'architecture', label: t.devHistory.tabs.architecture },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`relative px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-slate-900 dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-bg"
                      className="absolute inset-0 rounded-lg bg-white dark:bg-slate-700/80"
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
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 dark:from-cyan-500/20 via-slate-300 dark:via-slate-700/30 to-transparent -translate-x-1/2 pointer-events-none" />
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
                className="mt-10 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-800/30"
              >
                <p className="text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                  {t.devHistory.milestones}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {commits.filter(c => c.milestone).map(c => (
                    <div key={c.hash} className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full mt-1 flex-none" style={{ background: c.color }} />
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{isZh ? c.titleZh : c.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{c.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* ── Architecture View ─────────────────────────────────── */}
          {activeTab === 'architecture' && (
            <ArchitectureMap isZh={isZh} />
          )}

          {/* ── Footer coda ───────────────────────────────────────── */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mt-24 text-center border-t border-slate-200 dark:border-slate-800 pt-12"
          >
            <p className="font-mono text-[10px] tracking-[0.4em] text-slate-400 dark:text-slate-600 uppercase mb-3">
              {t.devHistory.footerLabel}
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              {isZh
                ? `${(final.lines - initial.lines).toLocaleString()} 行代码 · ${final.components} 个组件 · ${final.totalFiles} 个文件 · 28 天`
                : `${(final.lines - initial.lines).toLocaleString()} lines · ${final.components} components · ${final.totalFiles} files · 28 days`
              }
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
