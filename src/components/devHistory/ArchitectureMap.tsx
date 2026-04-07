import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Hover tooltip ──────────────────────────────────────────────────────────────
function BlockTooltip({ node, isZh }: { node: LayoutNode; isZh: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.95 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 8px)',
        left: '50%',
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 50,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{
        background: 'rgba(15,17,26,0.96)',
        border: `1px solid ${node.color}60`,
        borderRadius: 8,
        padding: '6px 10px',
        boxShadow: `0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px ${node.color}20`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: node.color, marginBottom: 2 }}>
          {isZh ? node.titleZh : node.title}
        </div>
        <div style={{ fontSize: 10, fontFamily: 'monospace', color: 'rgba(255,255,255,0.45)' }}>
          {node.lines.toLocaleString()} lines · {node.components.length} files
        </div>
        {/* Arrow */}
        <div style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `5px solid ${node.color}60`,
        }} />
      </div>
    </motion.div>
  );
}

// ── Inline syntax highlighter (mirrors CodePeek logic) ─────────────────────
const KW = new Set([
  'import','export','from','default','const','let','var','function','return',
  'if','else','for','while','do','class','extends','new','this','super',
  'interface','type','enum','async','await','yield',
  'true','false','null','undefined','void','typeof','instanceof',
  'try','catch','finally','throw','switch','case','break','continue',
  'static','public','private','readonly','as','of','in','with',
  'useEffect','useRef','useState','useTransform','useScroll',
  'useMotionValueEvent','useReducedMotion','useId','useCallback','useMemo',
]);
const TC: Record<string, string> = {
  kw:'#ff79c6', type:'#8be9fd', str:'#f1fa8c', num:'#bd93f9',
  cmt:'#6272a4', fn:'#50fa7b', prop:'#ffb86c', tag:'#ff79c6',
  plain:'#f8f8f2', punct:'#f8f8f299',
};
function tok(line: string) {
  const res: { t: string; v: string }[] = [];
  let i = 0; const n = line.length;
  while (i < n) {
    if (line[i]==='/'&&line[i+1]==='/') { res.push({t:'cmt',v:line.slice(i)}); break; }
    if (line[i]==='"'||line[i]==="'"||line[i]==='`') {
      const q=line[i]; let j=i+1;
      while(j<n){if(line[j]==='\\'){j+=2;continue;}if(line[j]===q){j++;break;}j++;}
      res.push({t:'str',v:line.slice(i,j)}); i=j; continue;
    }
    if (line[i]==='<'&&line[i+1]==='/') {
      let j=i; while(j<n&&line[j]!=='>') j++;
      res.push({t:'tag',v:line.slice(i,j+1)}); i=j+1; continue;
    }
    if (line[i]==='<'&&line[i+1]&&/[A-Za-z]/.test(line[i+1])) {
      let j=i+1; while(j<n&&/[A-Za-z0-9.]/.test(line[j])) j++;
      res.push({t:'tag',v:line.slice(i,j)}); i=j; continue;
    }
    if (/[0-9]/.test(line[i])&&(i===0||!/[A-Za-z_$]/.test(line[i-1]))) {
      let j=i; while(j<n&&/[0-9._xXa-fA-F]/.test(line[j])) j++;
      res.push({t:'num',v:line.slice(i,j)}); i=j; continue;
    }
    if (/[A-Za-z_$]/.test(line[i])) {
      let j=i; while(j<n&&/[A-Za-z0-9_$]/.test(line[j])) j++;
      const word=line.slice(i,j); let k=j; while(k<n&&line[k]===' ') k++;
      if(KW.has(word)) res.push({t:'kw',v:word});
      else if(/^[A-Z]/.test(word)) res.push({t:'type',v:word});
      else if(line[k]==='(') res.push({t:'fn',v:word});
      else res.push({t:'plain',v:word});
      i=j; continue;
    }
    if (line[i]==='.'&&line[i+1]&&/[A-Za-z_$]/.test(line[i+1])) {
      let j=i+1; while(j<n&&/[A-Za-z0-9_$]/.test(line[j])) j++;
      res.push({t:'prop',v:line.slice(i,j)}); i=j; continue;
    }
    if (/[{}()[\];,<>]/.test(line[i])) { res.push({t:'punct',v:line[i]}); i++; continue; }
    res.push({t:'plain',v:line[i]}); i++;
  }
  return res;
}
function CodeHighlight({ code }: { code: string }) {
  const lines = code.split('\n');
  const w = String(lines.length).length;
  return (
    <pre style={{ fontFamily:"'JetBrains Mono','Fira Code','Cascadia Code',monospace", fontSize:12.5, lineHeight:1.7, margin:0, padding:'16px 20px', overflowX:'auto', tabSize:2 }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display:'flex', minHeight:'1.7em' }} className="hover:bg-white/[0.03] rounded">
          <span style={{ color:'#6272a4', userSelect:'none', minWidth:`${w+2}ch`, textAlign:'right', paddingRight:'1.5ch', flexShrink:0, fontSize:11, lineHeight:1.7 }}>{i+1}</span>
          <span style={{ flex:1 }}>{tok(line).map((t,j)=><span key={j} style={{color:TC[t.t]??TC.plain}}>{t.v}</span>)}</span>
        </div>
      ))}
    </pre>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface Comp {
  name: string;
  path: string;
  lines: number;
  desc: string;
  descZh: string;
}
interface Section {
  id: string;
  title: string;
  titleZh: string;
  lines: number;
  color: string;
  components: Comp[];
}
interface Rect { x: number; y: number; w: number; h: number }
interface LayoutNode extends Section { rect: Rect }

// ── Codebase sections ──────────────────────────────────────────────────────────
const SECTIONS: Section[] = [
  {
    id: 'global',
    title: 'Global / Shared',
    titleZh: '全局 / 公共',
    lines: 2671,
    color: '#94a3b8',
    components: [
      { name: 'CodePeek',            path: '/src/components/shared/CodePeek.tsx',          lines: 443, desc: 'Draggable syntax-highlighted code preview window',    descZh: '可拖拽语法高亮代码预览窗口' },
      { name: 'MatrixRain',          path: '/src/components/MatrixRain.tsx',                lines: 280, desc: 'Canvas-based Matrix falling-code animation',          descZh: '基于 Canvas 的矩阵雨动画' },
      { name: 'StickyScrollNarrative',path:'/src/components/StickyScrollNarrative.tsx',    lines: 254, desc: 'Scroll-pinned narrative component',                   descZh: '滚动固定叙事组件' },
      { name: 'TechIcons',           path: '/src/components/icons/TechIcons.tsx',           lines: 219, desc: 'Custom SVG icon library for tech tools',              descZh: '自定义 SVG 技术图标库' },
      { name: 'Navbar',              path: '/src/components/layout/Navbar.tsx',             lines: 218, desc: 'Top nav with theme & language toggle',                descZh: '顶部导航，含主题和语言切换' },
      { name: 'MatrixEasterEgg',     path: '/src/components/MatrixEasterEgg.tsx',           lines: 204, desc: 'Hidden Matrix animation easter egg',                  descZh: '隐藏矩阵彩蛋动画' },
      { name: 'DataStream',          path: '/src/components/DataStream.tsx',                lines: 131, desc: 'Floating animated data stream overlay',               descZh: '浮动数据流叠层动画' },
      { name: 'CursorFollower',      path: '/src/components/CursorFollower.tsx',            lines: 108, desc: 'Custom glow cursor follower',                         descZh: '自定义光晕鼠标跟随' },
      { name: 'WelcomeToast',        path: '/src/components/WelcomeToast.tsx',              lines: 101, desc: 'Animated welcome notification toast',                 descZh: '欢迎通知动画 Toast' },
      { name: 'ScrambleText',        path: '/src/components/ScrambleText.tsx',              lines: 101, desc: 'Glitch text scramble animation',                      descZh: '故障字符乱码动画' },
      { name: 'HUDOverlay',          path: '/src/components/HUDOverlay.tsx',                lines:  99, desc: 'Sci-fi HUD corner overlays',                          descZh: '科幻 HUD 角落叠层' },
      { name: 'ParticleField',       path: '/src/components/ParticleField.tsx',             lines:  87, desc: 'Canvas particle field background',                   descZh: '粒子场 Canvas 背景' },
      { name: 'App',                 path: '/src/App.tsx',                                  lines:  83, desc: 'Root router and layout wrapper',                      descZh: '根路由与布局容器' },
      { name: 'ViewfinderCorners',   path: '/src/components/ViewfinderCorners.tsx',         lines:  64, desc: 'Camera viewfinder corner decorations',                descZh: '取景框角落装饰' },
      { name: 'ChapterDots',         path: '/src/components/ChapterDots.tsx',               lines:  64, desc: 'Chapter progress dot indicators',                    descZh: '章节进度圆点指示器' },
      { name: 'CyberGrid',           path: '/src/components/CyberGrid.tsx',                 lines:  54, desc: 'Cyberpunk-style grid background',                    descZh: '赛博朋克网格背景' },
      { name: 'PageTransition',      path: '/src/components/layout/PageTransition.tsx',     lines:  37, desc: 'Page enter/exit transition wrapper',                  descZh: '页面进出场过渡包装' },
      { name: 'LineReveal',          path: '/src/components/animations/LineReveal.tsx',     lines:  32, desc: 'Line-by-line text reveal animation',                  descZh: '逐行文字揭示动画' },
      { name: 'ScrollProgress',      path: '/src/components/ScrollProgress.tsx',            lines:  27, desc: 'Top scroll progress bar',                             descZh: '顶部滚动进度条' },
      { name: 'ScaleReveal',         path: '/src/components/animations/ScaleReveal.tsx',    lines:  26, desc: 'Scale-in reveal animation',                           descZh: '缩放揭示动画' },
      { name: 'Footer',              path: '/src/components/layout/Footer.tsx',             lines:  25, desc: 'Site footer with links',                              descZh: '网站底部链接区' },
      { name: 'AmbientLight',        path: '/src/components/shared/AmbientLight.tsx',       lines:  13, desc: 'Subtle ambient glow effect',                          descZh: '环境光晕效果' },
    ],
  },
  {
    id: 'story',
    title: 'Story',
    titleZh: '故事',
    lines: 2399,
    color: '#8b5cf6',
    components: [
      { name: 'StoryPage',           path: '/src/pages/StoryPage.tsx',                               lines: 819, desc: '22-slide cinematic scroll narrative',               descZh: '22 屏电影级滚动叙事' },
      { name: 'DesktopEvolution',    path: '/src/components/story/DesktopEvolution.tsx',             lines: 262, desc: 'Animated desktop OS evolution timeline',            descZh: '桌面操作系统演进动画' },
      { name: 'Starfield',           path: '/src/components/story/Starfield.tsx',                    lines: 214, desc: 'Warp speed starfield background',                   descZh: '曲速星空背景' },
      { name: 'StoryAutoScroll',     path: '/src/components/story/StoryAutoScroll.tsx',              lines: 206, desc: 'Hands-free autoplay scroll engine',                 descZh: '自动播放滚动引擎' },
      { name: 'HeroStat',            path: '/src/components/story/HeroStat.tsx',                     lines: 109, desc: 'Large animated stat counter hero card',             descZh: '大型动画数字统计卡片' },
      { name: 'GlitchText',          path: '/src/components/story/GlitchText.tsx',                   lines:  99, desc: 'CSS glitch text distortion effect',                 descZh: 'CSS 故障文字失真' },
      { name: 'SalaryDivide',        path: '/src/components/story/SalaryDivide.tsx',                 lines:  98, desc: 'AI vs non-AI salary comparison viz',                descZh: 'AI 与非 AI 薪资对比可视化' },
      { name: 'DualWaveText',        path: '/src/components/story/DualWaveText.tsx',                 lines:  95, desc: 'Dual wave animated text effect',                    descZh: '双波浪文字动画' },
      { name: 'SlideFrame',          path: '/src/components/story/SlideFrame.tsx',                   lines:  90, desc: 'Slide presentation frame component',                descZh: '幻灯片演示框架' },
      { name: 'ScrollLinkedBars',    path: '/src/components/story/ScrollLinkedBars.tsx',             lines:  86, desc: 'Scroll-driven animated bar chart',                  descZh: '滚动驱动动画柱状图' },
      { name: 'StorySlide',          path: '/src/components/story/StorySlide.tsx',                   lines:  77, desc: 'Individual story slide container',                  descZh: '单个故事幻灯片容器' },
      { name: 'ScrollRevealText',    path: '/src/components/story/ScrollRevealText.tsx',             lines:  65, desc: 'Scroll-triggered text reveal',                      descZh: '滚动触发文字揭示' },
      { name: 'ChapterTitle',        path: '/src/components/story/ChapterTitle.tsx',                 lines:  62, desc: 'Animated chapter title card',                       descZh: '动画章节标题卡片' },
      { name: 'CrossChart',          path: '/src/components/story/CrossChart.tsx',                   lines:  54, desc: 'Crossing line chart for trend comparison',           descZh: '交叉折线图趋势对比' },
      { name: 'ScrollLinkedPath',    path: '/src/components/story/ScrollLinkedPath.tsx',             lines:  52, desc: 'SVG path drawn by scroll progress',                 descZh: '滚动驱动 SVG 路径绘制' },
      { name: 'ScrollLinkedCounter', path: '/src/components/story/ScrollLinkedCounter.tsx',          lines:  42, desc: 'Counter animated by scroll position',               descZh: '滚动驱动数字计数器' },
      { name: 'StoryNav',            path: '/src/components/story/StoryNav.tsx',                     lines:  41, desc: 'Story chapter navigation dots',                     descZh: '故事章节导航圆点' },
      { name: 'StickyChapter',       path: '/src/components/story/StickyChapter.tsx',                lines:  28, desc: 'Sticky chapter header on scroll',                   descZh: '滚动时固定章节头部' },
    ],
  },
  {
    id: 'lab',
    title: 'Interactive Lab',
    titleZh: '交互实验室',
    lines: 2355,
    color: '#06b6d4',
    components: [
      { name: 'AgentLoop',       path: '/src/components/agentLoop/AgentLoop.tsx',           lines: 1115, desc: 'Interactive 11-step Claude agent loop visualizer', descZh: 'Claude Agent 11 步循环交互可视化' },
      { name: 'DeveloperDNA',    path: '/src/components/interactive/DeveloperDNA.tsx',      lines:  295, desc: 'Developer archetype quiz + radar chart',           descZh: '开发者原型性格测试 + 雷达图' },
      { name: 'AITimeMachine',   path: '/src/components/interactive/AITimeMachine.tsx',     lines:  293, desc: 'Year-based AI tool prediction quiz',               descZh: '年份 AI 工具预测问答' },
      { name: 'CodeQuiz',        path: '/src/components/interactive/CodeQuiz.tsx',          lines:  247, desc: 'AI-generated vs human code quiz',                  descZh: 'AI 代码 vs 人类代码辨别游戏' },
      { name: 'ToolRecommender', path: '/src/components/interactive/ToolRecommender.tsx',   lines:  146, desc: 'Language + experience → AI tool recommender',      descZh: '语言 + 经验 → AI 工具推荐' },
      { name: 'PredictionVote',  path: '/src/components/interactive/PredictionVote.tsx',    lines:  145, desc: 'Community vote on future AI predictions',           descZh: '未来 AI 预测社区投票' },
      { name: 'InteractivePage', path: '/src/pages/InteractivePage.tsx',                    lines:   82, desc: 'Lab page layout and section orchestration',        descZh: '实验室页面布局编排' },
      { name: 'CodeSnippetCard', path: '/src/components/interactive/CodeSnippetCard.tsx',   lines:   32, desc: 'Code snippet display card for quiz',               descZh: '问答代码片段展示卡片' },
    ],
  },
  {
    id: 'compare',
    title: 'Compare / Arena',
    titleZh: '对比 / 竞技场',
    lines: 1852,
    color: '#f59e0b',
    components: [
      { name: 'RacingBarChart',   path: '/src/components/compare/RacingBarChart.tsx',   lines: 423, desc: 'Animated racing bar chart for tool popularity',   descZh: '工具热度动态赛跑柱状图' },
      { name: 'LLMArena',         path: '/src/components/compare/LLMArena.tsx',         lines: 383, desc: 'Side-by-side 3-model streaming LLM comparison',   descZh: '三模型并排实时流式对比' },
      { name: 'IDEMarketChart',   path: '/src/components/compare/IDEMarketChart.tsx',   lines: 359, desc: 'IDE market share stacked area chart',              descZh: 'IDE 市场份额堆积面积图' },
      { name: 'RadarCompare',     path: '/src/components/compare/RadarCompare.tsx',     lines: 288, desc: 'Multi-axis radar chart for tool comparison',       descZh: '多轴雷达图工具对比' },
      { name: 'ToolCompareTable', path: '/src/components/compare/ToolCompareTable.tsx', lines: 233, desc: 'Feature comparison table for AI tools',            descZh: 'AI 工具功能对比表格' },
      { name: 'CursorSpotlight',  path: '/src/components/compare/CursorSpotlight.tsx', lines: 100, desc: 'Cursor-following spotlight hover effect',           descZh: '鼠标跟随聚光灯效果' },
      { name: 'ComparePage',      path: '/src/pages/ComparePage.tsx',                   lines:  66, desc: 'Compare page layout and tab orchestration',        descZh: '对比页面布局编排' },
    ],
  },
  {
    id: 'data',
    title: 'Data Explorer',
    titleZh: '数据探索器',
    lines: 1766,
    color: '#10b981',
    components: [
      { name: 'StackOverflowTab',  path: '/src/components/dataExplorer/StackOverflowTab.tsx',  lines: 474, desc: 'SO traffic decline + question trend charts', descZh: 'SO 流量下降与问题趋势图' },
      { name: 'AdoptionTab',       path: '/src/components/dataExplorer/AdoptionTab.tsx',       lines: 425, desc: 'AI tool adoption rate multi-chart dashboard', descZh: 'AI 工具采用率多图仪表盘' },
      { name: 'SalaryTab',         path: '/src/components/dataExplorer/SalaryTab.tsx',         lines: 367, desc: 'Developer salary by skill and AI proficiency', descZh: '技能与 AI 熟练度薪资分析' },
      { name: 'CodeGenTab',        path: '/src/components/dataExplorer/CodeGenTab.tsx',        lines: 340, desc: 'AI code generation share over time',           descZh: 'AI 代码生成占比时间趋势' },
      { name: 'DataExplorerTabs',  path: '/src/components/dataExplorer/DataExplorerTabs.tsx',  lines:  63, desc: 'Tab switcher for data explorer sections',      descZh: '数据探索器 Tab 切换器' },
      { name: 'InsightCallout',    path: '/src/components/dataExplorer/InsightCallout.tsx',    lines:  51, desc: 'Highlighted insight callout box',               descZh: '高亮洞察提示框' },
      { name: 'DataExplorerPage',  path: '/src/pages/DataExplorerPage.tsx',                    lines:  46, desc: 'Data explorer page wrapper',                   descZh: '数据探索器页面容器' },
    ],
  },
  {
    id: 'evolution',
    title: 'Tool Evolution',
    titleZh: '工具进化史',
    lines: 1183,
    color: '#f97316',
    components: [
      { name: 'ToolEvolutionPage',  path: '/src/pages/ToolEvolutionPage.tsx',                        lines: 316, desc: 'Tool evolution timeline page with 4 eras',  descZh: '4 个时代工具进化时间线' },
      { name: 'ChatDemo',           path: '/src/components/toolEvolution/ChatDemo.tsx',              lines: 194, desc: 'Interactive AI chat demo simulation',        descZh: 'AI 对话演示交互模拟' },
      { name: 'SectionNav',         path: '/src/components/toolEvolution/SectionNav.tsx',            lines: 180, desc: 'Sticky era navigation for tool evolution',   descZh: '工具进化固定时代导航' },
      { name: 'CopilotDemo',        path: '/src/components/toolEvolution/CopilotDemo.tsx',           lines: 154, desc: 'GitHub Copilot code completion demo',         descZh: 'Copilot 代码补全演示' },
      { name: 'AgentDemo',          path: '/src/components/toolEvolution/AgentDemo.tsx',             lines: 127, desc: 'Agentic AI multi-file task demo',             descZh: 'AI Agent 多文件任务演示' },
      { name: 'AutocompleteDemo',   path: '/src/components/toolEvolution/AutocompleteDemo.tsx',      lines: 106, desc: 'Basic autocomplete tool demo',                descZh: '基础自动补全工具演示' },
      { name: 'ToolCard',           path: '/src/components/toolEvolution/ToolCard.tsx',              lines:  53, desc: 'Individual tool display card',                descZh: '单个工具展示卡片' },
      { name: 'SectionHeader',      path: '/src/components/toolEvolution/SectionHeader.tsx',         lines:  53, desc: 'Era section header component',                descZh: '时代章节头部组件' },
    ],
  },
  {
    id: 'home',
    title: 'Home',
    titleZh: '首页',
    lines: 882,
    color: '#ec4899',
    components: [
      { name: 'HeroTerminal',   path: '/src/components/home/HeroTerminal.tsx',    lines: 293, desc: 'Animated terminal hero section',              descZh: '动画终端英雄区' },
      { name: 'HomePage',       path: '/src/pages/HomePage.tsx',                  lines: 272, desc: 'Home page with stats and page previews',      descZh: '含统计与预览的首页布局' },
      { name: 'PagePreviewCard',path: '/src/components/home/PagePreviewCard.tsx', lines: 133, desc: 'Animated page preview card',                  descZh: '动画页面预览卡片' },
      { name: 'StatCard',       path: '/src/components/home/StatCard.tsx',        lines: 131, desc: 'Animated statistic display card',             descZh: '动画统计数据卡片' },
      { name: 'StatsDashboard', path: '/src/components/home/StatsDashboard.tsx',  lines:  53, desc: 'Stats grid dashboard component',              descZh: '统计数据网格仪表盘' },
    ],
  },
  {
    id: 'devhistory',
    title: 'Dev History',
    titleZh: '开发日志',
    lines: 725,
    color: '#a855f7',
    components: [
      { name: 'DevHistoryPage', path: '/src/pages/DevHistoryPage.tsx', lines: 725, desc: 'Commit timeline + growth charts meta-page', descZh: '提交时间线 + 增长曲线元页面' },
    ],
  },
  {
    id: 'timeline',
    title: 'Timeline',
    titleZh: '时间线',
    lines: 643,
    color: '#22d3ee',
    components: [
      { name: 'TimelinePage',      path: '/src/pages/TimelinePage.tsx',                        lines: 160, desc: 'AI tooling history timeline page',    descZh: 'AI 工具历史时间线页面' },
      { name: 'TimelineEvent',     path: '/src/components/timeline/TimelineEvent.tsx',         lines: 158, desc: 'Individual timeline event card',       descZh: '单个时间线事件卡片' },
      { name: 'TimelineContainer', path: '/src/components/timeline/TimelineContainer.tsx',     lines: 128, desc: 'Timeline scroll container and layout', descZh: '时间线滚动容器布局' },
      { name: 'TimelineDetail',    path: '/src/components/timeline/TimelineDetail.tsx',        lines: 112, desc: 'Expanded event detail panel',          descZh: '展开事件详情面板' },
      { name: 'TimelineFilter',    path: '/src/components/timeline/TimelineFilter.tsx',        lines:  85, desc: 'Timeline category filter bar',         descZh: '时间线分类筛选栏' },
    ],
  },
  {
    id: 'about',
    title: 'About',
    titleZh: '关于',
    lines: 287,
    color: '#34d399',
    components: [
      { name: 'AboutPage',       path: '/src/pages/AboutPage.tsx',                     lines: 107, desc: 'About page with team and data sources', descZh: '团队与数据来源关于页' },
      { name: 'ContactForm',     path: '/src/components/about/ContactForm.tsx',        lines:  74, desc: 'Contact form with validation',           descZh: '带验证的联系表单' },
      { name: 'DataSourceList',  path: '/src/components/about/DataSourceList.tsx',     lines:  65, desc: 'Data sources list with links',           descZh: '数据来源列表含链接' },
      { name: 'TeamCard',        path: '/src/components/about/TeamCard.tsx',           lines:  41, desc: 'Team member display card',               descZh: '团队成员展示卡片' },
    ],
  },
];

// ── Binary-split treemap layout ────────────────────────────────────────────────
function splitRect(items: Section[], rect: Rect): LayoutNode[] {
  if (!items.length) return [];
  if (items.length === 1) return [{ ...items[0], rect }];
  const total = items.reduce((s, i) => s + i.lines, 0);
  let cum = 0, splitAt = 0;
  for (let i = 0; i < items.length - 1; i++) {
    cum += items[i].lines;
    splitAt = i + 1;
    if (cum * 2 >= total) break;
  }
  const frac = cum / total;
  const a = items.slice(0, splitAt);
  const b = items.slice(splitAt);
  let ra: Rect, rb: Rect;
  if (rect.w >= rect.h) {
    ra = { x: rect.x,              y: rect.y, w: rect.w * frac,        h: rect.h };
    rb = { x: rect.x + rect.w * frac, y: rect.y, w: rect.w * (1 - frac), h: rect.h };
  } else {
    ra = { x: rect.x, y: rect.y,              w: rect.w, h: rect.h * frac        };
    rb = { x: rect.x, y: rect.y + rect.h * frac, w: rect.w, h: rect.h * (1 - frac) };
  }
  return [...splitRect(a, ra), ...splitRect(b, rb)];
}

function buildLayout(): LayoutNode[] {
  const sorted = [...SECTIONS].sort((a, b) => b.lines - a.lines);
  return splitRect(sorted, { x: 0, y: 0, w: 100, h: 100 });
}

// ── Lazy raw-file loader ───────────────────────────────────────────────────────
const rawModules = import.meta.glob('/src/**/*.tsx', { query: '?raw', import: 'default' });

// ── Component ──────────────────────────────────────────────────────────────────
export default function ArchitectureMap({ isZh }: { isZh: boolean }) {
  const [selected, setSelected] = useState<LayoutNode | null>(null);
  const [activeComp, setActiveComp] = useState<Comp | null>(null);
  const [fileCode, setFileCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const layout = buildLayout();
  const total = SECTIONS.reduce((s, i) => s + i.lines, 0);

  const handleBlockClick = (node: LayoutNode) => {
    setSelected(prev => prev?.id === node.id ? null : node);
    setActiveComp(null);
    setFileCode('');
  };

  const handleCompClick = useCallback(async (comp: Comp) => {
    setActiveComp(comp);
    setLoading(true);
    setFileCode('');
    try {
      const loader = rawModules[comp.path];
      setFileCode(loader ? (await loader() as string) : `// File not found: ${comp.path}`);
    } catch {
      setFileCode('// Error loading file');
    }
    setLoading(false);
  }, []);

  return (
    <div>
      {/* ── Legend ── */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-4 text-xs font-mono text-slate-500 dark:text-slate-400">
        {SECTIONS.map(s => (
          <span key={s.id} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-none" style={{ background: s.color + '60', border: `1px solid ${s.color}` }} />
            {isZh ? s.titleZh : s.title}
          </span>
        ))}
        <span className="ml-auto opacity-60">{total.toLocaleString()} lines total</span>
      </div>

      {/* ── Treemap ── */}
      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{ aspectRatio: '16/9', background: 'transparent' }}
      >
        {layout.map(node => {
          const isSelected = selected?.id === node.id;
          const pct = (node.lines / total * 100).toFixed(1);
          const showTitle = node.rect.w > 8 && node.rect.h > 7;
          const showMeta  = node.rect.w > 13 && node.rect.h > 11;

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.rect.x}%`,
                top:  `${node.rect.y}%`,
                width: `${node.rect.w}%`,
                height: `${node.rect.h}%`,
                padding: 3,
                boxSizing: 'border-box',
                zIndex: hoveredId === node.id ? 10 : 1,
              }}
            >
              {/* Hover tooltip */}
              <AnimatePresence>
                {hoveredId === node.id && (
                  <BlockTooltip node={node} isZh={isZh} />
                )}
              </AnimatePresence>

              <motion.div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 6,
                  cursor: 'pointer',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '5px 7px',
                  boxSizing: 'border-box',
                  position: 'relative',
                  border: `1px solid ${node.color}35`,
                  background: node.color + '14',
                }}
                animate={{
                  background: isSelected ? node.color + '2e' : node.color + '14',
                  borderColor: isSelected ? node.color + 'cc' : node.color + '35',
                  scale: hoveredId === node.id ? 1.03 : 1,
                }}
                whileHover={{
                  background: node.color + '22',
                  borderColor: node.color + '70',
                }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                onHoverStart={() => setHoveredId(node.id)}
                onHoverEnd={() => setHoveredId(null)}
                onClick={() => handleBlockClick(node)}
              >
                {/* Selected ring */}
                {isSelected && (
                  <motion.div
                    layoutId="sel-ring"
                    style={{
                      position: 'absolute', inset: 0, borderRadius: 6,
                      border: `2px solid ${node.color}cc`,
                      pointerEvents: 'none',
                    }}
                  />
                )}

                {showTitle && (
                  <div style={{ userSelect: 'none', pointerEvents: 'none' }}>
                    {showMeta && (
                      <div style={{ fontSize: 9, fontFamily: 'monospace', color: node.color + 'aa', marginBottom: 1, letterSpacing: '0.05em' }}>
                        {pct}% · {node.lines.toLocaleString()}L
                      </div>
                    )}
                    <div style={{
                      fontSize: Math.min(12, Math.max(8.5, node.rect.w * 0.55)),
                      fontWeight: 700,
                      color: node.color,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      lineHeight: 1.25,
                    }}>
                      {isZh ? node.titleZh : node.title}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* ── Detail panel (slides in below treemap) ── */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden mt-3"
          >
            <div
              className="rounded-2xl p-5 border"
              style={{ borderColor: selected.color + '28', background: selected.color + '08' }}
            >
              {/* Panel header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold" style={{ color: selected.color }}>
                    {isZh ? selected.titleZh : selected.title}
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    {selected.lines.toLocaleString()} lines &middot; {selected.components.length} files &middot; {(selected.lines / total * 100).toFixed(1)}% of codebase
                  </p>
                </div>
                <button
                  onClick={() => { setSelected(null); setActiveComp(null); }}
                  className="text-slate-400 hover:text-slate-200 text-xl leading-none w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Component grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2">
                {selected.components
                  .slice()
                  .sort((a, b) => b.lines - a.lines)
                  .map(comp => {
                    const isActive = activeComp?.path === comp.path;
                    return (
                      <motion.button
                        key={comp.path}
                        onClick={() => handleCompClick(comp)}
                        className="text-left p-3 rounded-xl border transition-colors duration-150"
                        style={{
                          borderColor: isActive ? selected.color + '80' : selected.color + '20',
                          background:  isActive ? selected.color + '1a' : selected.color + '08',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <div
                          className="font-mono text-[11px] font-bold mb-0.5 truncate"
                          style={{ color: selected.color }}
                        >
                          {comp.name}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                          {isZh ? comp.descZh : comp.desc}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1.5">
                          {comp.lines} lines
                        </div>
                      </motion.button>
                    );
                  })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Code viewer modal ── */}
      <AnimatePresence>
        {activeComp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
            onClick={() => setActiveComp(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
              style={{
                width: '88vw', maxWidth: 1040,
                maxHeight: '82vh',
                background: '#0d1117',
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Title bar */}
              <div style={{ background: '#161b22', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setActiveComp(null)} style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer', padding: 0, boxShadow: '0 0 6px rgba(255,95,87,0.4)' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 6px rgba(254,188,46,0.3)' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840', boxShadow: '0 0 6px rgba(40,200,64,0.3)' }} />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, color: 'rgba(255,255,255,0.3)', flex: 1, textAlign: 'center', letterSpacing: '0.03em' }}>
                  {activeComp.path.replace('/src/', 'src/')}
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#50fa7b', background: 'rgba(80,250,123,0.08)', border: '1px solid rgba(80,250,123,0.18)', borderRadius: 4, padding: '2px 7px', letterSpacing: '0.05em', flexShrink: 0 }}>
                  {activeComp.lines} lines
                </span>
              </div>

              {/* Code area */}
              <div style={{ overflow: 'auto', flex: 1 }}>
                {loading ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#6272a4', fontFamily: 'monospace', fontSize: 12, letterSpacing: '0.05em' }}>
                    loading…
                  </div>
                ) : (
                  <CodeHighlight code={fileCode} />
                )}
              </div>

              {/* Status bar */}
              <div style={{ background: '#161b22', borderTop: '1px solid rgba(255,255,255,0.04)', padding: '5px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.18)' }}>
                  TypeScript · React
                </span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,0.12)' }}>
                  click outside to close
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
