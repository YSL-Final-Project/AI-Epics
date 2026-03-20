import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useTransform, useMotionValueEvent, MotionValue, useScroll } from 'framer-motion';
import StickyChapter from '../components/story/StickyChapter';
import ChapterTitle from '../components/story/ChapterTitle';
import HeroStat from '../components/story/HeroStat';
import CrossChart from '../components/story/CrossChart';
import ScrollLinkedBars from '../components/story/ScrollLinkedBars';
import ScrollLinkedCounter from '../components/story/ScrollLinkedCounter';
import SalaryDivide from '../components/story/SalaryDivide';
import StoryNav from '../components/story/StoryNav';
import Starfield from '../components/story/Starfield';
import GlitchText from '../components/story/GlitchText';
import { Link } from 'react-router-dom';

const industryData = [
  { label: 'Web 前端', value: 52 },
  { label: '数据科学', value: 45 },
  { label: '企业后端', value: 42 },
  { label: '移动端', value: 38 },
  { label: 'DevOps', value: 35 },
  { label: '游戏开发', value: 28 },
  { label: '嵌入式', value: 18 },
];

const keyEvents = [
  { date: '2022.11', title: 'ChatGPT 发布', impact: '5天100万用户' },
  { date: '2023.03', title: 'GPT-4 发布', impact: '代码质量质变' },
  { date: '2023.10', title: 'Cursor 爆发', impact: 'AI 原生 IDE' },
  { date: '2024.02', title: 'Devin 发布', impact: '首个 AI 工程师' },
  { date: '2024.06', title: '40% 代码由 AI 生成', impact: '基础设施级别' },
  { date: '2025.01', title: 'DeepSeek-R1', impact: '开源震动硅谷' },
];

const ch1Timeline = [
  { year: 2018, event: 'GPT-1', detail: '1.17亿参数，少有人关注' },
  { year: 2019, event: 'GPT-2', detail: '太危险不敢公开发布' },
  { year: 2020, event: 'GPT-3', detail: '1750亿参数，开始写代码' },
  { year: 2021, event: 'Copilot 内测', detail: 'AI 第一次坐上副驾' },
  { year: 2022, event: 'ChatGPT', detail: '一切都变了' },
];

export default function StoryPage() {
  return (
    <div className="dark">
      <div className="bg-[#0a0a0f] text-white min-h-screen selection:bg-cyan-500/30" style={{ overflowX: 'clip' }}>
        <Starfield density={250} speed={0.2} />
        <StoryNav />

        {/* ═══════════════ OVERTURE ═══════════════ */}
        <StickyChapter heightVh={250}>
          {(progress) => <Overture progress={progress} />}
        </StickyChapter>

        {/* Narrative transition: Overture → Chapter 1 */}
        <NarrativeBreak
          text="在那之前，一切都还很简单。"
          subtext="代码是人类写的。毫无例外。"
        />

        {/* ═══════════════ CHAPTER 1: THE QUIET BEFORE ═══════════════ */}
        <StickyChapter heightVh={400}>
          {(progress) => (
            <>
              <ChapterTitle
                progress={progress}
                range={[0, 0.18]}
                chapter="Chapter 01"
                title="暗流涌动"
                subtitle="2018–2021：编程曾是纯人类的手艺，然后地基开始动摇"
              />
              <Chapter1Content progress={progress} />
            </>
          )}
        </StickyChapter>

        {/* Narrative transition: Chapter 1 → Chapter 2 */}
        <NarrativeBreak
          text="然后，2022年11月30日，"
          subtext="世界醒来发现规则已经改变。"
          glitch
        />

        {/* ═══════════════ CHAPTER 2: THE EXPLOSION ═══════════════ */}
        <StickyChapter heightVh={800}>
          {(progress) => (
            <>
              <ChapterTitle
                progress={progress}
                range={[0, 0.08]}
                chapter="Chapter 02"
                title="大爆炸"
                subtitle="2022–2024：700 天内，AI 从实验变成基础设施"
              />
              <Chapter2Content progress={progress} />
            </>
          )}
        </StickyChapter>

        {/* Narrative transition: Chapter 2 → Chapter 3 */}
        <NarrativeBreak
          text="当尘埃落定，一个问题浮现——"
          subtext="开发者，到底还剩下什么？"
        />

        {/* ═══════════════ CHAPTER 3: THE NEW DEVELOPER ═══════════════ */}
        <StickyChapter heightVh={550}>
          {(progress) => (
            <>
              <ChapterTitle
                progress={progress}
                range={[0, 0.12]}
                chapter="Chapter 03"
                title="新物种"
                subtitle="2025+：AI 没有取代开发者，而是重新定义了'开发者'的含义"
              />
              <Chapter3Content progress={progress} />
            </>
          )}
        </StickyChapter>

        {/* ═══════════════ BRANCHING MOMENT ═══════════════ */}
        <BranchingMoment />

        {/* ═══════════════ EPILOGUE ═══════════════ */}
        <Epilogue />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  NARRATIVE BREAK — emotional transitions             */
/* ──────────────────────────────────────────────────── */
function NarrativeBreak({ text, subtext, glitch = false }: { text: string; subtext: string; glitch?: boolean }) {
  return (
    <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Gradient separators */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0a0a0f] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center px-8 max-w-2xl"
      >
        {glitch ? (
          <GlitchText
            text={text}
            className="text-2xl sm:text-4xl font-light text-white/60 leading-relaxed"
          />
        ) : (
          <p className="text-2xl sm:text-4xl font-light text-white/60 leading-relaxed">
            {text}
          </p>
        )}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 1.0 }}
          className="mt-6 text-lg sm:text-xl text-white/30 font-extralight"
        >
          {subtext}
        </motion.p>
      </motion.div>

      {/* Subtle horizontal line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  HELPER HOOKS                                        */
/* ──────────────────────────────────────────────────── */
function useScrollOpacity(progress: MotionValue<number>, keys: number[], values: number[]) {
  const [op, setOp] = useState(values[0]);
  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= keys[0]) { setOp(values[0]); return; }
    for (let i = 1; i < keys.length; i++) {
      if (p <= keys[i]) {
        const t = (p - keys[i - 1]) / (keys[i] - keys[i - 1]);
        setOp(values[i - 1] + t * (values[i] - values[i - 1]));
        return;
      }
    }
    setOp(values[values.length - 1]);
  });
  return op;
}

function useScrollValue(progress: MotionValue<number>, keys: number[], values: number[]) {
  const [val, setVal] = useState(values[0]);
  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= keys[0]) { setVal(values[0]); return; }
    for (let i = 1; i < keys.length; i++) {
      if (p <= keys[i]) {
        const t = (p - keys[i - 1]) / (keys[i] - keys[i - 1]);
        setVal(values[i - 1] + t * (values[i] - values[i - 1]));
        return;
      }
    }
    setVal(values[values.length - 1]);
  });
  return val;
}

/* ──────────────────────────────────────────────────── */
/*  OVERTURE                                            */
/* ──────────────────────────────────────────────────── */
function Overture({ progress }: { progress: MotionValue<number> }) {
  const codeText = 'function future() { return human + AI; }';
  const charCount = useTransform(progress, [0.08, 0.4], [0, codeText.length]);

  const codeOp = useScrollOpacity(progress, [0.08, 0.15, 0.6, 0.7], [0, 1, 1, 0.3]);
  const titleOp = useScrollOpacity(progress, [0.42, 0.55, 0.75, 0.85], [0, 1, 1, 0]);
  const titleY = useScrollValue(progress, [0.42, 0.55], [40, 0]);
  const titleScale = useScrollValue(progress, [0.42, 0.55, 0.75, 0.85], [0.9, 1, 1, 1.1]);

  // Parallax: code line drifts up as title appears
  const codeY = useScrollValue(progress, [0.42, 0.7], [0, -60]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
        />
      </div>

      {/* Typing code */}
      <div style={{ opacity: codeOp, transform: `translateY(${codeY}px)` }}>
        <code className="text-lg sm:text-2xl md:text-3xl font-mono text-cyan-400/80 tracking-wide">
          <CodeTyping text={codeText} charCount={charCount} />
          <motion.span
            className="inline-block w-[2px] h-[1.2em] bg-cyan-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </code>
      </div>

      {/* Title with scale effect */}
      <div
        style={{
          opacity: titleOp,
          transform: `translateY(${titleY}px) scale(${titleScale})`,
        }}
        className="mt-16 text-center"
      >
        <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter">
          <span className="bg-gradient-to-b from-white via-white/90 to-white/30 bg-clip-text text-transparent">
            The AI
          </span>
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
            Code Era
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-white/25 font-extralight tracking-wide">
          一个关于编程如何被永远改变的故事
        </p>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="mt-12"
        >
          <div className="w-5 h-8 rounded-full border border-white/10 mx-auto flex items-start justify-center p-1">
            <div className="w-1 h-2 rounded-full bg-white/20" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CodeTyping({ text, charCount }: { text: string; charCount: MotionValue<number> }) {
  const [display, setDisplay] = useState('');
  useMotionValueEvent(charCount, 'change', (n) => {
    setDisplay(text.slice(0, Math.round(n)));
  });
  return <span>{display}</span>;
}

/* ──────────────────────────────────────────────────── */
/*  CHAPTER 1 — THE QUIET BEFORE (Horizontal Timeline)*/
/* ──────────────────────────────────────────────────── */
function Chapter1Content({ progress }: { progress: MotionValue<number> }) {
  const timelineOp = useScrollOpacity(progress, [0.18, 0.25, 0.55, 0.6], [0, 1, 1, 0]);
  const soOp = useScrollOpacity(progress, [0.6, 0.65, 0.88, 0.95], [0, 1, 1, 0]);

  // Horizontal scroll driven by vertical scroll progress
  const scrollX = useScrollValue(progress, [0.22, 0.55], [0, -100]);
  const soLineProgress = useTransform(progress, [0.65, 0.85], [0, 1]);

  const soRisePath = 'M 20 170 C 80 165, 140 155, 200 130 S 350 90, 450 60 S 550 40, 580 35';

  return (
    <>
      {/* Horizontal scrolling timeline */}
      <div style={{ opacity: timelineOp }} className="absolute inset-0 flex items-center overflow-hidden">
        <div
          className="flex items-center gap-0 whitespace-nowrap pl-[50vw]"
          style={{ transform: `translateX(${scrollX}vw)` }}
        >
          {ch1Timeline.map((item, i) => (
            <TimelineCard key={item.year} item={item} index={i} progress={progress} />
          ))}

          {/* End connector */}
          <div className="w-32 h-px bg-gradient-to-r from-white/10 to-transparent ml-4" />
        </div>

        {/* Fixed label */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs font-mono text-white/15 tracking-[0.4em] uppercase">
            向下滚动 · 时间在流动
          </p>
        </div>
      </div>

      {/* SO traffic — appears after timeline scrolls away */}
      <div style={{ opacity: soOp }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
        <p className="text-xs font-mono text-white/20 tracking-[0.3em] uppercase mb-8">
          Stack Overflow 流量 · 上升期
        </p>
        <div className="w-full max-w-xl">
          <svg viewBox="0 0 600 200" className="w-full" fill="none">
            {[50, 100, 150].map(y => (
              <line key={y} x1="20" y1={y} x2="580" y2={y} stroke="white" strokeOpacity="0.03" />
            ))}
            <path d={soRisePath} stroke="white" strokeWidth="1.5" opacity={0.06} />
            <motion.path
              d={soRisePath}
              stroke="#22d3ee"
              strokeWidth="2.5"
              strokeLinecap="round"
              style={{ pathLength: soLineProgress }}
            />
            {/* Glow effect */}
            <motion.path
              d={soRisePath}
              stroke="#22d3ee"
              strokeWidth="8"
              strokeLinecap="round"
              opacity={0.15}
              style={{ pathLength: soLineProgress }}
            />
          </svg>
          <div className="flex justify-between px-2 mt-2">
            <span className="text-[10px] font-mono text-white/15">2018</span>
            <span className="text-[10px] font-mono text-white/15">2022</span>
          </div>
        </div>

        <div className="mt-10 text-center">
          <ScrollLinkedCounter
            progress={progress}
            from={1120}
            to={1700}
            range={[0.65, 0.85]}
            className="text-4xl sm:text-5xl font-black text-white/80 tabular-nums"
          />
          <span className="text-4xl sm:text-5xl font-black text-white/25 ml-1">M</span>
          <p className="text-xs text-white/20 mt-3 font-light">
            Stack Overflow 月访问量达到历史最高——
          </p>
          <p className="text-sm text-white/40 mt-1 font-light">
            没有人预见到接下来会发生什么。
          </p>
        </div>
      </div>
    </>
  );
}

function TimelineCard({
  item,
  index,
  progress,
}: {
  item: typeof ch1Timeline[0];
  index: number;
  progress: MotionValue<number>;
}) {
  const cardOp = useScrollOpacity(
    progress,
    [0.22 + index * 0.05, 0.27 + index * 0.05],
    [0, 1]
  );
  const cardScale = useScrollValue(
    progress,
    [0.22 + index * 0.05, 0.27 + index * 0.05],
    [0.8, 1]
  );

  return (
    <div className="flex items-center">
      {/* Connector line */}
      {index > 0 && (
        <div className="w-16 sm:w-24 h-px bg-gradient-to-r from-white/5 to-white/10" />
      )}
      <div
        style={{ opacity: cardOp, transform: `scale(${cardScale})` }}
        className="flex flex-col items-center shrink-0 w-48 sm:w-56"
      >
        {/* Year dot */}
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-cyan-500/60 ring-4 ring-cyan-500/10" />
          <div className="absolute inset-0 w-3 h-3 rounded-full bg-cyan-400/40 animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        {/* Content */}
        <div className="mt-4 text-center whitespace-normal">
          <span className="text-xs font-mono text-cyan-500/50">{item.year}</span>
          <p className="text-sm text-white/70 font-medium mt-1">{item.event}</p>
          <p className="text-xs text-white/25 font-light mt-1">{item.detail}</p>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  CHAPTER 2 — THE EXPLOSION                          */
/* ──────────────────────────────────────────────────── */
function Chapter2Content({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      {/* Part 1: The date that changed everything — 0.08 to 0.18 */}
      <TheDateScene progress={progress} />

      {/* Part 2: SO crashes — 0.18 to 0.32 */}
      <HeroStat
        progress={progress}
        range={[0.18, 0.3]}
        from={0}
        to={55}
        suffix="%"
        label="Stack Overflow 流量从峰值暴跌"
        sublabel="1700M → 760M 月访问量"
      />

      {/* Part 3: Cross chart — 0.3 to 0.44 */}
      <CrossChartScene progress={progress} />

      {/* Part 4: 40% hero — 0.44 to 0.55 */}
      <HeroStat
        progress={progress}
        range={[0.44, 0.53]}
        from={0}
        to={40}
        suffix="%"
        label="GitHub 上的新代码由 AI 辅助生成"
        sublabel="2024.06 — GitHub CEO 在演讲中确认"
      />

      {/* Part 5: Industry bars — 0.55 to 0.68 */}
      <IndustryBarsScene progress={progress} />

      {/* Part 6: Event cascade — 0.68 to 0.85 */}
      <EventCascade progress={progress} />

      {/* Part 7: Emotional closing — 0.85 to 0.95 */}
      <ChapterClosing
        progress={progress}
        range={[0.85, 0.95]}
        text="700天。从玩具到基础设施。"
        subtext="历史上没有任何技术以这个速度重塑一个行业。"
      />
    </>
  );
}

function TheDateScene({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.08, 0.12, 0.16, 0.18], [0, 1, 1, 0]);
  const scale = useScrollValue(progress, [0.08, 0.14], [0.5, 1]);
  const blur = useScrollValue(progress, [0.08, 0.12], [10, 0]);

  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center">
      <div style={{ transform: `scale(${scale})`, filter: `blur(${blur}px)` }} className="text-center">
        <p className="text-xs font-mono text-white/20 tracking-[0.5em] uppercase mb-6">
          那一天
        </p>
        <p className="text-6xl sm:text-8xl md:text-9xl font-black tabular-nums tracking-tight">
          <span className="text-white/90">2022</span>
          <span className="text-white/20">.</span>
          <span className="text-white/70">11</span>
          <span className="text-white/20">.</span>
          <span className="text-cyan-400/80">30</span>
        </p>
        <p className="mt-6 text-lg text-white/30 font-light">
          ChatGPT 发布。一切从此不同。
        </p>
      </div>
    </div>
  );
}

function CrossChartScene({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.3, 0.34, 0.42, 0.44], [0, 1, 1, 0]);
  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <p className="text-sm text-white/30 font-light mb-2 text-center max-w-lg">
        一条线上升，一条线坠落——
      </p>
      <p className="text-xs text-white/15 font-light mb-8 text-center max-w-md">
        当 AI 工具采用率上升时，Stack Overflow 的命运已经注定
      </p>
      <CrossChart progress={progress} range={[0.32, 0.43]} />
    </div>
  );
}

function IndustryBarsScene({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.55, 0.58, 0.65, 0.68], [0, 1, 1, 0]);
  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <p className="text-lg text-white/50 font-light mb-2 text-center">AI 代码生成渗透率</p>
      <p className="text-xs text-white/15 font-mono mb-8 text-center">没有一个领域幸免</p>
      <ScrollLinkedBars
        progress={progress}
        range={[0.56, 0.66]}
        data={industryData}
        color="#06b6d4"
      />
    </div>
  );
}

function EventCascade({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.68, 0.72, 0.83, 0.86], [0, 1, 1, 0]);
  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <p className="text-xs font-mono tracking-[0.3em] text-cyan-500/30 uppercase mb-8">
        关键事件 · 时间线
      </p>
      <div className="relative space-y-5 max-w-md w-full">
        {/* Vertical line */}
        <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/20 via-cyan-500/10 to-transparent" />
        {keyEvents.map((event, i) => (
          <EventRow key={event.date} event={event} progress={progress} index={i} />
        ))}
      </div>
    </div>
  );
}

function EventRow({ event, progress, index }: { event: typeof keyEvents[0]; progress: MotionValue<number>; index: number }) {
  const start = 0.72 + index * 0.015;
  const opacity = useScrollOpacity(progress, [start, start + 0.012], [0, 1]);
  const x = useScrollValue(progress, [start, start + 0.012], [40, 0]);

  return (
    <div style={{ opacity, transform: `translateX(${x}px)` }} className="flex items-start gap-4 pl-4">
      <div className="w-[10px] h-[10px] rounded-full bg-cyan-500/40 border border-cyan-500/30 shrink-0 mt-1" />
      <div className="flex-1">
        <div className="flex items-baseline gap-3">
          <span className="text-xs font-mono text-cyan-500/50 shrink-0">{event.date}</span>
          <span className="text-sm text-white/70 font-medium">{event.title}</span>
        </div>
        <span className="text-xs text-white/20 ml-0">{event.impact}</span>
      </div>
    </div>
  );
}

function ChapterClosing({ progress, range, text, subtext }: {
  progress: MotionValue<number>;
  range: [number, number];
  text: string;
  subtext: string;
}) {
  const opacity = useScrollOpacity(progress, [range[0], range[0] + 0.03, range[1] - 0.03, range[1]], [0, 1, 1, 0]);
  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <p className="text-2xl sm:text-3xl text-white/60 font-light text-center max-w-xl leading-relaxed">
        {text}
      </p>
      <p className="mt-4 text-sm text-white/20 font-light text-center max-w-md">
        {subtext}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  CHAPTER 3 — THE NEW DEVELOPER                     */
/* ──────────────────────────────────────────────────── */
function Chapter3Content({ progress }: { progress: MotionValue<number> }) {
  return (
    <>
      {/* Salary divide — 0.12 to 0.45 */}
      <SalaryDivide progress={progress} range={[0.12, 0.45]} />

      {/* Narrative pause */}
      <ChapterClosing
        progress={progress}
        range={[0.45, 0.55]}
        text="3倍的薪资鸿沟。"
        subtext="不是天赋的差距，而是工具的差距。"
      />

      {/* Job positions declining — 0.55 to 0.72 */}
      <JobDecline progress={progress} />

      {/* IDE revolution — 0.72 to 0.92 */}
      <IDERevolution progress={progress} />
    </>
  );
}

function JobDecline({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.55, 0.6, 0.7, 0.73], [0, 1, 1, 0]);
  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <p className="text-xs font-mono text-white/15 tracking-[0.3em] uppercase mb-6">
        开发者岗位 · 年度招聘量
      </p>
      <div className="flex items-end gap-1.5 h-44">
        {[920, 980, 890, 1050, 1150, 980, 850, 820].map((v, i) => (
          <JobBar key={i} value={v} year={2018 + i} progress={progress} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <ScrollLinkedCounter
          progress={progress}
          from={0}
          to={29}
          range={[0.6, 0.68]}
          prefix="-"
          suffix="%"
          className="text-4xl font-black text-red-400/80 tabular-nums"
        />
        <p className="text-sm text-white/25 mt-2 font-light">较峰值下降 · 2022 → 2025</p>
        <p className="text-xs text-white/15 mt-1">
          岗位在消失——但薪资在分化。
        </p>
      </div>
    </div>
  );
}

function JobBar({ value, year, progress, index }: { value: number; year: number; progress: MotionValue<number>; index: number }) {
  const [height, setHeight] = useState(0);
  useMotionValueEvent(progress, 'change', (p) => {
    const s = 0.58 + index * 0.01;
    const e = 0.62 + index * 0.01;
    if (p <= s) setHeight(0);
    else if (p >= e) setHeight((value / 1200) * 100);
    else setHeight((p - s) / (e - s) * (value / 1200) * 100);
  });
  const isDecline = year >= 2023;

  return (
    <div className="flex flex-col items-center gap-1.5 w-10 sm:w-14">
      <div className="relative h-36 w-full flex items-end">
        <div
          className={`w-full rounded-t transition-colors duration-300 ${isDecline ? 'bg-red-500/40' : 'bg-cyan-500/25'}`}
          style={{ height: `${height}%` }}
        />
      </div>
      <span className={`text-[9px] font-mono ${isDecline ? 'text-red-400/30' : 'text-white/20'}`}>{year}</span>
    </div>
  );
}

function IDERevolution({ progress }: { progress: MotionValue<number> }) {
  const opacity = useScrollOpacity(progress, [0.72, 0.77, 0.9, 0.93], [0, 1, 1, 0]);

  const ideData = [
    { name: 'VS Code', share2022: 65, share2025: 55, color: '#3b82f6' },
    { name: 'Cursor', share2022: 0, share2025: 18, color: '#06b6d4' },
    { name: 'JetBrains', share2022: 23, share2025: 17, color: '#a855f7' },
    { name: 'Vim', share2022: 6, share2025: 5, color: '#22c55e' },
  ];

  return (
    <div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center px-8">
      <p className="text-xs font-mono text-white/15 tracking-[0.3em] uppercase mb-2">IDE 格局</p>
      <p className="text-sm text-white/30 font-light mb-8">一个从零到 18% 的搅局者</p>
      <div className="w-full max-w-md space-y-4">
        {ideData.map((ide) => (
          <IDEBar key={ide.name} ide={ide} progress={progress} />
        ))}
      </div>
      <p className="mt-8 text-xs text-white/15 font-light text-center max-w-sm">
        Cursor 在两年内从不存在到占据近五分之一的市场份额。<br />
        工具之争，实质上是 AI 能力之争。
      </p>
    </div>
  );
}

function IDEBar({ ide, progress }: { ide: { name: string; share2022: number; share2025: number; color: string }; progress: MotionValue<number> }) {
  const [barWidth, setBarWidth] = useState(ide.share2022);
  useMotionValueEvent(progress, 'change', (p) => {
    if (p <= 0.77) setBarWidth(ide.share2022);
    else if (p >= 0.87) setBarWidth(ide.share2025);
    else setBarWidth(ide.share2022 + (p - 0.77) / 0.1 * (ide.share2025 - ide.share2022));
  });
  const isGrowing = ide.share2025 > ide.share2022;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-white/40 w-20 text-right shrink-0">{ide.name}</span>
      <div className="flex-1 h-7 bg-white/[0.03] rounded overflow-hidden relative">
        <div
          className="h-full rounded transition-all duration-75"
          style={{ width: `${barWidth}%`, backgroundColor: ide.color, opacity: 0.6 }}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-white/50">
          {Math.round(barWidth)}%
        </span>
      </div>
      <span className={`text-[10px] font-mono w-8 ${isGrowing ? 'text-cyan-400/60' : 'text-red-400/40'}`}>
        {isGrowing ? '↑' : '↓'}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  BRANCHING MOMENT — Interactive choice               */
/* ──────────────────────────────────────────────────── */
function BranchingMoment() {
  const [choice, setChoice] = useState<'none' | 'optimist' | 'realist'>('none');

  const optimistView = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl text-center"
    >
      <p className="text-3xl sm:text-4xl font-light text-cyan-400/80 mb-6">
        黎明
      </p>
      <p className="text-lg text-white/50 font-light leading-relaxed">
        AI 正在消除编程的门槛。设计师可以实现原型、产品经理可以写脚本、
        创业者可以独自构建完整产品。
      </p>
      <p className="text-base text-white/40 font-light leading-relaxed mt-4">
        我们正在进入一个<span className="text-white/70">人人都是开发者</span>的时代。
        创造力，而非语法，成为最终的竞争力。
      </p>
      <p className="text-sm text-white/20 mt-8">
        10x 工程师不再罕见——他们只是学会了与 AI 协作的普通人。
      </p>
    </motion.div>
  );

  const realistView = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl text-center"
    >
      <p className="text-3xl sm:text-4xl font-light text-red-400/80 mb-6">
        暮色
      </p>
      <p className="text-lg text-white/50 font-light leading-relaxed">
        初级开发岗位正在消失。AI 生成的代码充斥代码库，
        但没有人真正理解它是如何工作的。技术债务在加速累积。
      </p>
      <p className="text-base text-white/40 font-light leading-relaxed mt-4">
        我们正在培养一代<span className="text-white/70">不会编程的"程序员"</span>。
        当 AI 出错时——它总会出错——谁来修复？
      </p>
      <p className="text-sm text-white/20 mt-8">
        真正的风险不是 AI 取代开发者，而是开发者忘记了怎么开发。
      </p>
    </motion.div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 py-24 relative">
      {/* Background accent */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[800px] h-[800px] rounded-full opacity-[0.02]"
          style={{
            background: choice === 'optimist'
              ? 'radial-gradient(circle, #06b6d4, transparent 70%)'
              : choice === 'realist'
                ? 'radial-gradient(circle, #ef4444, transparent 70%)'
                : 'radial-gradient(circle, #ffffff, transparent 70%)',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-20%' }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        {choice === 'none' ? (
          <>
            <p className="text-xs font-mono tracking-[0.4em] text-white/20 uppercase mb-8">
              选择你的视角
            </p>
            <p className="text-2xl sm:text-3xl text-white/50 font-light mb-12">
              AI 时代的开发者，面对的是黎明还是暮色？
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setChoice('optimist')}
                className="group relative px-10 py-5 rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-lg text-cyan-400/60 group-hover:text-cyan-400/90 transition-colors font-light">
                  黎明 · 乐观者
                </span>
                <p className="text-xs text-white/20 mt-2">人人都是开发者</p>
              </button>
              <button
                onClick={() => setChoice('realist')}
                className="group relative px-10 py-5 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-lg text-red-400/60 group-hover:text-red-400/90 transition-colors font-light">
                  暮色 · 现实者
                </span>
                <p className="text-xs text-white/20 mt-2">被遗忘的手艺</p>
              </button>
            </div>
          </>
        ) : (
          <>
            {choice === 'optimist' ? optimistView : realistView}
            <button
              onClick={() => setChoice('none')}
              className="mt-10 text-xs font-mono text-white/15 hover:text-white/30 transition-colors"
            >
              ← 选择另一个视角
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── */
/*  EPILOGUE                                            */
/* ──────────────────────────────────────────────────── */
function Epilogue() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center relative">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative"
      >
        <p className="text-2xl sm:text-3xl text-white/40 font-extralight max-w-2xl leading-relaxed">
          AI 没有取代开发者。
        </p>
        <p className="text-2xl sm:text-3xl text-white/70 font-light max-w-2xl leading-relaxed mt-3">
          它重新定义了<GlitchText text="「开发者」" className="text-cyan-400/70" />的含义。
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 1.0 }}
        >
          <p className="mt-12 text-base text-white/20 font-light max-w-lg mx-auto leading-relaxed">
            无论你选择哪个视角，有一件事是确定的——
            <br />
            回到过去的路，已经被关上了。
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/"
            className="px-8 py-3.5 rounded-full border border-white/10 text-sm text-white/40 hover:text-white/70 hover:border-white/25 transition-all duration-300 font-mono"
          >
            探索完整数据 →
          </Link>
          <Link
            to="/timeline"
            className="px-8 py-3.5 rounded-full border border-cyan-500/15 text-sm text-cyan-500/50 hover:text-cyan-400/80 hover:border-cyan-500/30 transition-all duration-300 font-mono"
          >
            浏览时间线 →
          </Link>
        </motion.div>

        <p className="mt-24 text-[10px] text-white/8 font-mono tracking-widest">
          AI Code Era — 一个关于编程如何被永远改变的故事
        </p>
      </motion.div>
    </div>
  );
}
