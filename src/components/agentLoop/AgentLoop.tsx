import { useState, useCallback, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n';
import agentLoopSteps from '../../data/agent_loop_steps';

const TOTAL_STEPS = agentLoopSteps.length;
const SPEEDS = [0.5, 1, 2] as const;
const ACCENT = '#d4a853';

/* 鈹€鈹€ Render text with |code| badges 鈹€鈹€ */
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/\|([^|]+)\|/);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#2a2520] text-[#d4a853] text-[0.85em] font-mono border border-[#3a3530]">
            {part}
          </code>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
   Step-specific visualizations
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

function TerminalVis({ lines, color = '#10b981' }: { lines: string[]; color?: string }) {
  return (
    <div className="rounded-xl p-4 font-mono text-sm border border-gray-700/40 bg-[#0d0d1a] min-h-[180px] flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-[#10b981]" />
        <span className="text-gray-600 text-[10px] tracking-wider">claude-code</span>
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-1">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className="text-gray-400 text-xs"
          >
            {i === 0 && <span style={{ color }} className="mr-1">$</span>}
            {i > 0 && <span className="text-gray-600 mr-1">{'>'}</span>}
            {line}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Step 2: Three-phase wrapping animation */
function MessageCreationVis({ lang }: { lang: 'en' | 'zh' }) {
  const [phase, setPhase] = useState(0);
  const inputText = lang === 'zh'
    ? '查找 src/ 中所有 TODO 注释并创建摘要'
    : '"Find all TODO comments in src/ and create a summary"';

  useEffect(() => {
    setPhase(0);
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [lang]);

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[220px] flex flex-col">
      {/* Inner code area */}
      <div className="flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="raw"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-gray-300 text-center"
            >
              {inputText}
            </motion.div>
          )}
          {phase === 1 && (
            <motion.div
              key="wrapping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-gray-500 text-center"
            >
              {'{ wrapping... }'}
            </motion.div>
          )}
          {phase === 2 && (
            <motion.pre
              key="json"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="font-mono text-xs leading-relaxed"
            >
              <span className="text-gray-500">{'{'}</span>{'\n'}
              <span className="text-gray-500">{'    '}</span><span className="text-[#06b6d4]">"role"</span><span className="text-gray-500">: </span><span className="text-[#10b981]">"user"</span><span className="text-gray-500">,</span>{'\n'}
              <span className="text-gray-500">{'    '}</span><span className="text-[#06b6d4]">"content"</span><span className="text-gray-500">: [</span>{'\n'}
              <span className="text-gray-500">{'        {'}</span>{'\n'}
              <span className="text-gray-500">{'            '}</span><span className="text-[#06b6d4]">"type"</span><span className="text-gray-500">: </span><span className="text-[#10b981]">"text"</span><span className="text-gray-500">,</span>{'\n'}
              <span className="text-gray-500">{'            '}</span><span className="text-[#06b6d4]">"text"</span><span className="text-gray-500">: </span><span className="text-[#d4a853]">"Find all TODO..."</span>{'\n'}
              <span className="text-gray-500">{'        }'}</span>{'\n'}
              <span className="text-gray-500">{'    ]'}</span>{'\n'}
              <span className="text-gray-500">{'}'}</span>
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Step 3: Chat history with animated new message */
function HistoryAppendVis({ lang }: { lang: 'en' | 'zh' }) {
  const { t } = useI18n();
  const copy = t.agentLoop.visuals;
  const history = lang === 'zh'
    ? [
        { role: 'user', text: copy.historySetupUser },
        { role: 'assistant', text: copy.historySetupAssistant },
        { role: 'user', text: copy.historyDatabaseUser },
      ]
    : [
        { role: 'user', text: copy.historySetupUser },
        { role: 'assistant', text: copy.historySetupAssistant },
        { role: 'user', text: copy.historyDatabaseUser },
      ];
  const newMsg = copy.historyNewMessage;
  return (
    <div className="rounded-xl p-4 font-mono text-sm border border-gray-700/40 bg-[#0d0d1a] min-h-[180px] flex flex-col justify-center space-y-2 px-6">
      {history.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: i * 0.1 }}
          className="px-3 py-2 rounded-lg bg-[#1a1a2e] border border-gray-700/30 text-xs text-gray-400"
        >
          <span className={msg.role === 'user' ? 'text-[#06b6d4]' : 'text-[#10b981]'}>
            [{msg.role}]
          </span>
          <span className="ml-2">{msg.text}</span>
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
        className="px-3 py-2 rounded-lg border text-xs"
        style={{ backgroundColor: `${ACCENT}15`, borderColor: `${ACCENT}40` }}
      >
        <span className="text-[#06b6d4]">[user]</span>
        <span className="ml-2 text-white font-semibold">{newMsg}</span>
        <span
          className="ml-2 text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}20` }}
        >
          {copy.newBadge}
        </span>
      </motion.div>
    </div>
  );
}

/* Step 4: Four elements converging from corners */
function SystemAssemblyVis() {
  const items = [
    { label: 'CLAUDE.md', color: '#06b6d4' },
    { label: 'Tools', color: '#ef4444' },
    { label: 'Memory', color: '#10b981' },
    { label: 'Context', color: '#ec4899' },
  ];
  const positions = [
    { x: -80, y: -50 }, // top-left
    { x: 80, y: -50 },  // top-right
    { x: -80, y: 50 },  // bottom-left
    { x: 80, y: 50 },   // bottom-right
  ];

  return (
    <div className="rounded-xl p-4 font-mono text-sm border border-gray-700/40 bg-[#0d0d1a] min-h-[180px] flex items-center justify-center relative overflow-hidden">
      <div className="relative w-full h-[160px] flex items-center justify-center">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ x: positions[i].x, y: positions[i].y, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, y: i < 2 ? -20 : 20, opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + i * 0.15,
              duration: 0.8,
              type: 'spring',
              stiffness: 120,
              damping: 15,
            }}
            className="absolute px-4 py-2 rounded-lg border text-xs font-semibold"
            style={{
              borderColor: `${item.color}50`,
              backgroundColor: `${item.color}15`,
              color: item.color,
              left: `calc(50% + ${i % 2 === 0 ? -60 : 20}px)`,
              top: `calc(50% + ${i < 2 ? -20 : 20}px)`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {item.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Step 5: API Streaming — dot teleports between machines, SSE lines appear */
function ApiStreamingVis({ lang }: { lang: 'en' | 'zh' }) {
  const [lines, setLines] = useState<string[]>([]);
  const [dotVisible, setDotVisible] = useState(false);
  const [dotX, setDotX] = useState(0); // 0 = left edge, 1 = right edge
  const [isAnimating, setIsAnimating] = useState(false);
  const [showThinking, setShowThinking] = useState(false);
  const runIdRef = useRef(0);
  const sseTokens = ["I'll", ' search', ' for', ' TODOs', ' in', ' src/'];

  useEffect(() => {
    setLines([]);
    setDotVisible(false);
    setDotX(0);
    setIsAnimating(false);
    setShowThinking(false);
    const myId = ++runIdRef.current;
    const cancelled = () => runIdRef.current !== myId;

    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => { cancelled() ? reject('cancelled') : resolve(); }, ms);
      });

    const run = async () => {
      try {
        // 鈹€鈹€鈹€ Sending phase: dot goes left鈫抮ight 3 times 鈹€鈹€鈹€
        for (let i = 0; i < 3; i++) {
          if (cancelled()) return;
          setDotX(0);
          setDotVisible(true);
          setIsAnimating(true);
          await wait(80);
          setDotX(1);
          await wait(600);
          setDotVisible(false);
          setIsAnimating(false);
          await wait(200);
        }

        // 鈹€鈹€鈹€ Thinking phase 鈹€鈹€鈹€
        setShowThinking(true);
        await wait(1000);
        setShowThinking(false);

        // 鈹€鈹€鈹€ Streaming phase: dot goes right鈫抣eft, each arrival outputs an SSE line 鈹€鈹€鈹€
        for (let i = 0; i < sseTokens.length; i++) {
          if (cancelled()) return;
          setDotX(1);
          setDotVisible(true);
          setIsAnimating(true);
          await wait(80);
          setDotX(0);
          await wait(600);
          setDotVisible(false);
          setIsAnimating(false);
          const token = sseTokens[i];
          setLines(prev => [...prev, `data: {"type":"content_block_delta","delta":{"text":"${token}"}}`]);
          await wait(200);
        }
      } catch {
        // cancelled 鈥?silently stop
      }
    };

    run();

    return () => { runIdRef.current++; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[220px] flex flex-col p-5 gap-4">
      {/* Machine boxes + animated dot */}
      <div className="flex items-center justify-center gap-4">
        {/* Your Machine */}
        <div className="px-5 py-4 rounded-lg border border-[#06b6d4]/30 bg-[#06b6d4]/5 font-mono text-xs text-[#06b6d4] text-center min-w-[120px]">
          {lang === 'zh' ? '你的机器' : 'Your Machine'}
        </div>

        {/* Dot track */}
        <div className="relative w-[120px] h-6 flex items-center">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-gray-700/40" />
          {dotVisible && (
            <motion.div
              className="absolute w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
              initial={false}
              animate={{ left: dotX === 0 ? '0%' : 'calc(100% - 10px)' }}
              transition={isAnimating ? { duration: 0.5, ease: 'easeInOut' } : { duration: 0 }}
            />
          )}
        </div>

        {/* Claude API */}
        <div className="px-5 py-4 rounded-lg border font-mono text-xs text-center min-w-[120px]" style={{ borderColor: `${ACCENT}40`, backgroundColor: `${ACCENT}08` }}>
          <span style={{ color: ACCENT }}>Claude API</span>
          {showThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] mt-1"
              style={{ color: `${ACCENT}80` }}
            >
              <motion.span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle"
                style={{ backgroundColor: ACCENT }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              thinking
            </motion.div>
          )}
        </div>
      </div>

      {/* SSE output lines */}
      {lines.length > 0 && (
        <div className="font-mono text-[11px] leading-relaxed space-y-0.5 max-h-[120px] overflow-y-auto scrollbar-hide">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="text-gray-500"
            >
              {line}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Step 6: Token Parsing 鈥?raw tokens appear word by word, then rendered version appears */
function TokenParsingVis({ lang }: { lang: 'en' | 'zh' }) {
  const rawTokens = lang === 'zh'
    ? ['我会', '搜索', ' `TODO`', ' 注释', ' 在', ' **src/**', ' 中']
    : ["I'll", " search", " for", " `TODO`", " comments", " in", " **src/**"];
  const [visibleCount, setVisibleCount] = useState(0);
  const [showRendered, setShowRendered] = useState(false);

  useEffect(() => {
    setVisibleCount(0);
    setShowRendered(false);

    const timers: ReturnType<typeof setTimeout>[] = [];
    rawTokens.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), 300 + i * 250));
    });
    // Show rendered after all tokens
    timers.push(setTimeout(() => setShowRendered(true), 300 + rawTokens.length * 250 + 400));

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const renderedEn = (
    <span className="text-[#e8e4df] text-sm">
      I'll search for{' '}
      <code className="px-1.5 py-0.5 rounded bg-[#2a2520] text-[#d4a853] text-[0.85em] font-mono border border-[#3a3530]">TODO</code>
      {' '}comments in <strong>src/</strong>
    </span>
  );
  const renderedZh = (
    <span className="text-[#e8e4df] text-sm">
      鎴戜細鎼滅储{' '}
      <code className="px-1.5 py-0.5 rounded bg-[#2a2520] text-[#d4a853] text-[0.85em] font-mono border border-[#3a3530]">TODO</code>
      {' '}注释在 <strong>src/</strong> 中
    </span>
  );

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[180px] flex flex-col p-5 gap-4">
      {/* Raw tokens */}
      <div>
        <div className="font-mono text-[10px] text-gray-600 mb-2 tracking-wider">Raw tokens:</div>
        <div className="font-mono text-sm text-gray-400 min-h-[1.5em]">
          {rawTokens.slice(0, visibleCount).map((token, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.15 }}
            >
              {token}
            </motion.span>
          ))}
          {visibleCount > 0 && visibleCount < rawTokens.length && (
            <motion.span
              className="inline-block w-[2px] h-[14px] ml-0.5 align-middle"
              style={{ backgroundColor: ACCENT }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Rendered result */}
      <AnimatePresence>
        {showRendered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="rounded-lg border border-gray-700/30 bg-[#1a1a2e] p-4"
          >
            <div className="font-mono text-[10px] text-gray-600 mb-2 tracking-wider">Rendered:</div>
            {lang === 'zh' ? renderedZh : renderedEn}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Step 7: Tool Detection — green flash → gold border + detected label → permission check */
function ToolDetectionVis({ lang }: { lang: 'en' | 'zh' }) {
  // Phase 0: text + tool_use with green border flash
  // Phase 1: gold border + "Tool call detected: bash"
  // Phase 2: "Permission check: allowed (pre-approved pattern)"
  const [phase, setPhase] = useState(0);
  const runIdRef = useRef(0);

  useEffect(() => {
    setPhase(0);
    const myId = ++runIdRef.current;
    const t1 = setTimeout(() => { if (runIdRef.current === myId) setPhase(1); }, 800);
    const t2 = setTimeout(() => { if (runIdRef.current === myId) setPhase(2); }, 2200);
    return () => { runIdRef.current++; clearTimeout(t1); clearTimeout(t2); };
  }, [lang]);

  const toolBlock = (
    <div className="font-mono text-sm leading-relaxed">
      <span className="text-gray-500">tool_use:</span>{'\n'}
      <span className="text-gray-500">{'  '}</span><span className="text-gray-400">name: </span><span className="text-[#10b981]">"bash"</span>{'\n'}
      <span className="text-gray-500">{'  '}</span><span className="text-gray-400">input: </span><span className="text-[#06b6d4]">"grep -r TODO src/"</span>
    </div>
  );

  const borderColor = phase === 0 ? '#10b981' : ACCENT;

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[220px] flex flex-col p-5">
      {/* Response block */}
      <div className="rounded-lg border border-gray-700/30 bg-[#111118] p-4 space-y-3">
        {/* AI text lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="font-mono text-sm text-gray-500 space-y-1"
        >
          <div>{lang === 'zh' ? "我来搜索 TODO 注释..." : "I'll search for TODO comments..."}</div>
          <div>{lang === 'zh' ? '让我使用 bash 工具来查找。' : 'Let me use the bash tool to find them.'}</div>
        </motion.div>

        {/* tool_use block with animated border */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="rounded-lg p-4 whitespace-pre"
          style={{
            border: `1px solid ${borderColor}`,
            backgroundColor: phase === 0 ? '#10b98108' : `${ACCENT}08`,
            boxShadow: phase === 0 ? '0 0 12px #10b98120' : `0 0 12px ${ACCENT}20`,
            transition: 'border-color 0.4s, background-color 0.4s, box-shadow 0.4s',
          }}
        >
          {toolBlock}
        </motion.div>

        {/* Status line below tool block */}
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="detected"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm"
              style={{ color: ACCENT }}
            >
              Tool call detected: bash
            </motion.div>
          )}
          {phase === 2 && (
            <motion.div
              key="permission"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm text-gray-500"
            >
              Permission check: <span className="text-[#10b981]">allowed</span> (pre-approved pattern)
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* Step 11: Await Next Input — terminal prompt with blinking cursor */
function AwaitInputVis({ lang }: { lang: 'en' | 'zh' }) {
  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[200px] flex flex-col items-center justify-center p-5 gap-4">
      {/* Mini terminal */}
      <div className="rounded-lg border border-gray-700/30 bg-[#111118] p-4 w-full max-w-[400px]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="text-gray-600 text-[10px] tracking-wider font-mono">claude-code</span>
        </div>
        <div className="font-mono text-sm text-[#d4a853]">
          ${' '}
          <motion.span
            className="inline-block w-[7px] h-[14px] align-middle"
            style={{ backgroundColor: '#d4a853' }}
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Caption */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-gray-500 text-sm font-mono"
      >
        {lang === 'zh' ? '循环等待你的下一条消息' : 'The loop waits for your next message'}
      </motion.div>
    </div>
  );
}

/* Step 9: Response Rendering 鈥?markdown output line by line */
/* Step 10: Post-Sampling Hooks 鈥?three cards appear one by one */
function PostSamplingHooksVis({ lang }: { lang: 'en' | 'zh' }) {
  const cards = lang === 'zh'
    ? [
        { icon: '📦', name: 'Auto-compact', desc: '上下文在限制内，跳过', active: false },
        { icon: '🧠', name: 'Memory', desc: '提取：TODO 追踪模式', active: true },
        { icon: '💤', name: 'Dream mode', desc: '未启用，跳过', active: false },
      ]
    : [
        { icon: '📦', name: 'Auto-compact', desc: 'Context within limits - skipped', active: false },
        { icon: '🧠', name: 'Memory', desc: 'Extracted: TODO tracking pattern', active: true },
        { icon: '💤', name: 'Dream mode', desc: 'Not enabled - skipped', active: false },
      ];

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[200px] flex flex-col p-5">
      <div className="flex items-start justify-center gap-4 flex-wrap">
        {cards.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.5, duration: 0.4, ease: 'easeOut' }}
            className="rounded-lg border p-4 text-center w-[170px] h-[140px] flex flex-col items-center justify-center gap-2"
            style={{
              borderColor: card.active ? `${ACCENT}50` : '#2a2a3a',
              backgroundColor: card.active ? `${ACCENT}08` : '#111118',
            }}
          >
            <span className="text-2xl">{card.icon}</span>
            <span
              className="font-mono text-xs font-semibold"
              style={{ color: card.active ? ACCENT : '#6a6a7a' }}
            >
              {card.name}
            </span>
            <span className="text-[11px] text-gray-500 leading-snug">{card.desc}</span>
            {card.active && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.5 + 0.3, type: 'spring', stiffness: 300 }}
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ACCENT }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResponseRenderVis({ lang }: { lang: 'en' | 'zh' }) {
  const lines: { type: 'h1' | 'p' | 'li'; content: React.ReactNode }[] = lang === 'zh'
    ? [
        { type: 'h1', content: <span className="text-[#d4a853] font-bold text-base">TODO 鎽樿</span> },
        { type: 'p', content: <span>在代码库中找到 <strong className="text-gray-300">16 条</strong> TODO 注释：</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/query.ts:42</code> - 添加重试逻辑</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/tools.ts:108</code> - 验证输入</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/context.ts:15</code> - 缓存系统提示词</span> },
      ]
    : [
        { type: 'h1', content: <span className="text-[#d4a853] font-bold text-base">TODO Summary</span> },
        { type: 'p', content: <span>Found <strong className="text-gray-300">16 TODO comments</strong> across the codebase:</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/query.ts:42</code> - Add retry logic</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/tools.ts:108</code> - Validate input</span> },
        { type: 'li', content: <span><code className="px-1 py-0.5 rounded bg-[#2a2520] text-[#06b6d4] text-[0.85em] border border-[#3a3530]">src/context.ts:15</code> - Cache system prompt</span> },
      ];

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[200px] flex flex-col p-5">
      <div className="rounded-lg border border-gray-700/30 bg-[#111118] p-5 font-mono text-sm space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.35, duration: 0.25 }}
            className={`text-gray-400 ${line.type === 'li' ? 'pl-4' : ''}`}
          >
            {line.type === 'li' && <span className="text-gray-600 mr-1">-</span>}
            {line.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Step 8: Tool Execution Loop — command → results → loop back */
function ToolExecutionLoopVis({ lang, trips }: { lang: 'en' | 'zh'; trips: number }) {
  const phase = trips < 5 ? 0 : trips < 10 ? 1 : 2;

  const resultLines = lang === 'zh'
    ? [
        'src/query.ts:42: // TODO: 添加重试逻辑',
        'src/tools.ts:108: // TODO: 验证输入',
      ]
    : [
        'src/query.ts:42: // TODO: add retry logic',
        'src/tools.ts:108: // TODO: validate input',
      ];
  const moreResults = lang === 'zh' ? '... 还有 14 条结果' : '... 14 more results';

  return (
    <div className="rounded-xl border border-gray-700/40 bg-[#0d0d1a] min-h-[220px] flex flex-col p-5">
      <div className="rounded-lg border border-gray-700/30 bg-[#111118] p-4 font-mono text-sm space-y-2">
        {/* Command */}
        <div className="text-gray-400">
          <span className="text-[#10b981] mr-1">$</span>
          grep -r "TODO" src/
        </div>

        {/* Results 鈥?phase 1+ */}
        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="space-y-1"
            >
              {resultLines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.2 }}
                  className="text-gray-500 text-xs"
                >
                  {line}
                </motion.div>
              ))}
              <div className="text-gray-600 text-xs">{moreResults}</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status line */}
        <AnimatePresence mode="wait">
          {phase === 1 && (
            <motion.div
              key="wrapped"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="text-center text-gray-500 text-sm pt-2"
            >
              Result wrapped as <code className="px-1.5 py-0.5 rounded bg-[#2a2520] text-[#d4a853] text-[0.85em] border border-[#3a3530]">tool_result</code> message
            </motion.div>
          )}
          {phase === 2 && (
            <motion.div
              key="loop"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center text-sm pt-2 flex items-center justify-center gap-2"
            >
              <span style={{ color: ACCENT }}>{'->'} Loop back to API</span>
              <span
                className="px-2 py-0.5 rounded text-[11px] font-mono border"
                style={{ borderColor: `${ACCENT}40`, color: ACCENT, backgroundColor: `${ACCENT}15` }}
              >
                Iteration 2
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
   Pipeline Navigation (circles + connecting line)
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

function PipelineNav({
  current,
  onSelect,
  lang,
  loopTrips = 0,
}: {
  current: number;
  onSelect: (id: number) => void;
  lang: 'en' | 'zh';
  loopTrips?: number;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [arcPath, setArcPath] = useState('');
  const [dotPos, setDotPos] = useState<{ x: number; y: number } | null>(null);

  const showArc = current === 8 && loopTrips > 0;

  // Compute arc path from step 8 circle 鈫?step 5 circle (semicircle below)
  useLayoutEffect(() => {
    if (!showArc) { setArcPath(''); setDotPos(null); return; }
    const wrapper = wrapperRef.current;
    const c5 = circleRefs.current[5];
    const c8 = circleRefs.current[8];
    if (!wrapper || !c5 || !c8) return;

    const wr = wrapper.getBoundingClientRect();
    const r5 = c5.getBoundingClientRect();
    const r8 = c8.getBoundingClientRect();

    const x5 = r5.left + r5.width / 2 - wr.left;
    const y5 = r5.bottom - wr.top + 2;
    const x8 = r8.left + r8.width / 2 - wr.left;
    const y8 = r8.bottom - wr.top + 2;
    const midX = (x5 + x8) / 2;
    const curveDepth = 40;

    setArcPath(`M ${x8} ${y8} Q ${midX} ${Math.max(y5, y8) + curveDepth} ${x5} ${y5}`);
    setDotPos({ x: x5, y: y5 + 6 });
  }, [showArc]);

  return (
    <div ref={wrapperRef} className="relative py-6">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-start justify-center gap-0 min-w-max px-4">
          {agentLoopSteps.map((s, i) => {
            const isActive = s.id === current;
            const isPast = s.id < current;
            return (
              <div key={s.id} className="flex items-start">
                {/* Node */}
                <button
                  onClick={() => onSelect(s.id)}
                  className="flex flex-col items-center gap-1.5 group relative"
                >
                  <div
                    ref={el => { if (s.id === 5 || s.id === 8) circleRefs.current[s.id] = el; }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 border-2"
                    style={{
                      borderColor: isActive ? ACCENT : isPast ? `${ACCENT}60` : '#3a3a4a',
                      backgroundColor: isActive ? `${ACCENT}20` : 'transparent',
                      color: isActive ? ACCENT : isPast ? `${ACCENT}90` : '#5a5a6a',
                      boxShadow: isActive ? `0 0 12px ${ACCENT}30` : 'none',
                    }}
                  >
                    {s.id}
                  </div>
                  <span
                    className="text-[10px] transition-colors duration-300 whitespace-nowrap"
                    style={{
                      color: isActive ? ACCENT : isPast ? '#8a8580' : '#4a4a5a',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {s.shortLabel[lang]}
                  </span>
                </button>

                {/* Connecting line */}
                {i < TOTAL_STEPS - 1 && (
                  <div className="flex items-center h-9 px-1">
                    <div
                      className="w-4 sm:w-6 h-[1px] transition-colors duration-300"
                      style={{ backgroundColor: isPast ? `${ACCENT}40` : '#2a2a3a' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Arc overlay: dashed path + animated dot from step 8 鈫?step 5 */}
      {showArc && arcPath && (
        <svg
          className="absolute top-0 left-0 w-full pointer-events-none"
          style={{ height: '100%', overflow: 'visible' }}
        >
          {/* Dashed arc */}
          <path
            d={arcPath}
            stroke={`${ACCENT}35`}
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Animated dot traveling along the arc */}
          <circle r={3.5} fill={ACCENT} opacity={0.9}>
            <animateMotion dur="0.9s" repeatCount="indefinite" path={arcPath} />
          </circle>
        </svg>
      )}

      {/* Small indicator dot below step 5 */}
      {showArc && dotPos && (
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: ACCENT, left: dotPos.x - 3, top: dotPos.y }}
        />
      )}
    </div>
  );
}

/* 鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲
   Main Component
   鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲 */

export default function AgentLoop() {
  const { lang, t } = useI18n();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1);

  /* 鈹€鈹€ Step 8 loop trip counter 鈹€鈹€ */
  const [loopTrips, setLoopTrips] = useState(0);
  const loopTripsRef = useRef(0);
  const loopRunIdRef = useRef(0);

  useEffect(() => {
    if (currentStep !== 8) { setLoopTrips(0); loopTripsRef.current = 0; return; }
    const myId = ++loopRunIdRef.current;
    let count = 0;
    const interval = setInterval(() => {
      if (loopRunIdRef.current !== myId) { clearInterval(interval); return; }
      count++;
      setLoopTrips(count);
      loopTripsRef.current = count;
      if (count >= 16) clearInterval(interval); // stop counting, dot keeps animating via SVG repeatCount
    }, 800);
    return () => { loopRunIdRef.current++; clearInterval(interval); };
  }, [currentStep]);

  /* 鈹€鈹€ Per-step minimum dwell time (ms at 1x speed) 鈹€鈹€ */
  const STEP_DWELL: Record<number, number> = {
    1: 2500,
    2: 5000,   // 3 phases 脳 1.2s + reading
    3: 3500,   // history + new message spring
    4: 3500,   // 4 elements converge
    5: 10000,  // sending 3脳 + thinking + streaming 6脳
    6: 4000,   // tokens + rendered
    7: 4500,   // green flash 鈫?gold 鈫?permission
    8: 3000,   // extra dwell after loopTrips gate passes
    9: 3500,   // 5 lines 脳 350ms + reading
    10: 3500,  // 3 cards 脳 500ms + reading
    11: 3500,  // terminal prompt + reading
  };

  /* 鈹€鈹€ Playback: single useEffect drives auto-advance 鈹€鈹€ */
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= TOTAL_STEPS) { setIsPlaying(false); return; }

    // Step 8: block until loop animation is done
    if (currentStep === 8 && loopTrips < 14) return; // re-runs when loopTrips changes

    const dwell = (STEP_DWELL[currentStep] ?? 2500) / speed;
    const timer = setTimeout(() => {
      setCurrentStep(prev => (prev < TOTAL_STEPS ? prev + 1 : prev));
    }, dwell);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isPlaying, speed, loopTrips]);

  /* 鈹€鈹€ Manual controls 鈹€鈹€ */
  const nextStep = useCallback(() => {
    setCurrentStep(prev => (prev < TOTAL_STEPS ? prev + 1 : prev));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => (prev > 1 ? prev - 1 : prev));
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      if (!prev && currentStep === TOTAL_STEPS) { setCurrentStep(1); }
      return !prev;
    });
  }, [currentStep]);

  const changeSpeed = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  const step = agentLoopSteps[currentStep - 1];

  /* 鈹€鈹€ Pick visualization for current step 鈹€鈹€ */
  const visualization = useMemo(() => {
    switch (currentStep) {
      case 2: return <MessageCreationVis lang={lang} />;
      case 3: return <HistoryAppendVis lang={lang} />;
      case 4: return <SystemAssemblyVis />;
      case 5: return <ApiStreamingVis lang={lang} />;
      case 6: return <TokenParsingVis lang={lang} />;
      case 7: return <ToolDetectionVis lang={lang} />;
      case 8: return <ToolExecutionLoopVis lang={lang} trips={loopTrips} />;
      case 9: return <ResponseRenderVis lang={lang} />;
      case 10: return <PostSamplingHooksVis lang={lang} />;
      case 11: return <AwaitInputVis lang={lang} />;
      default: {
        const lines = step.terminal[lang].split('\n');
        const color = currentStep === 1 ? '#10b981' : currentStep <= 6 ? '#06b6d4' : currentStep <= 8 ? '#f59e0b' : '#10b981';
        return <TerminalVis lines={lines} color={color} />;
      }
    }
  }, [currentStep, lang, step.terminal, loopTrips]);

  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <span className="inline-block font-mono text-xs mb-3 tracking-[0.25em] uppercase" style={{ color: ACCENT }}>
            Agent Loop
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#e8e4df] mb-3" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>
            {t.agentLoop.title}
          </h2>
          <p className="text-[#8a8580] max-w-xl mx-auto text-sm leading-relaxed">
            {t.agentLoop.subtitle}
          </p>
        </div>

        {/* Pipeline Navigation */}
        <PipelineNav current={currentStep} onSelect={setCurrentStep} lang={lang} loopTrips={loopTrips} />

        {/* Step Card */}
        <div className="rounded-2xl border border-gray-700/40 overflow-hidden bg-[#141420]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="p-5 sm:p-6"
            >
              {/* Title row */}
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-[#e8e4df] flex items-center gap-2.5">
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0"
                    style={{ backgroundColor: `${ACCENT}25`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
                  >
                    {step.id}
                  </span>
                  {step.name[lang]}
                </h3>
                <a
                  href="https://github.com/anthropics/claude-code"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-mono shrink-0 px-2.5 py-1.5 rounded-lg border transition-colors"
                  style={{ borderColor: `${ACCENT}30`, color: `${ACCENT}cc` }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {step.sourceFile}
                </a>
              </div>

              {/* Description */}
              <div className="text-gray-400 text-sm mb-5">
                <RichText text={step.description[lang]} />
              </div>

              {/* Visualization area */}
              {visualization}

              {/* Detail footnote */}
              <div className="mt-5 pt-4 border-t border-gray-700/20">
                <p className="text-gray-500 text-xs leading-relaxed">
                  <RichText text={step.detail[lang]} />
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* 鈹€鈹€ Controls 鈹€鈹€ */}
          <div className="flex items-center justify-between px-5 sm:px-6 pb-5 pt-0">
            <div className="flex items-center gap-1.5">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                aria-label={t.agentLoop.previousStep}
                className="p-2 rounded-lg bg-gray-700/20 hover:bg-gray-700/40 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? t.agentLoop.pauseSimulation : t.agentLoop.playSimulation}
                className="p-2 rounded-full transition-colors text-[#141420]"
                style={{ backgroundColor: ACCENT }}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 9v6m4-6v6" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep === TOTAL_STEPS}
                aria-label={t.agentLoop.nextStep}
                className="p-2 rounded-lg bg-gray-700/20 hover:bg-gray-700/40 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-gray-500 text-xs font-mono">
                {currentStep} / {TOTAL_STEPS}
              </span>
              <div className="flex items-center gap-1">
                {SPEEDS.map(s => (
                  <button
                    key={s}
                    onClick={() => changeSpeed(s)}
                    className="px-2 py-0.5 text-[10px] rounded font-mono transition-colors"
                    style={
                      speed === s
                        ? { backgroundColor: `${ACCENT}30`, color: ACCENT }
                        : { color: '#5a5a6a' }
                    }
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}




