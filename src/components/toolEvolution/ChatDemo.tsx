import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Era 3: Simulates a chat interface (ChatGPT / Claude style).
 * User message appears, then AI responds with thinking + code + explanation.
 */

interface Message {
  role: 'user' | 'assistant';
  parts: { type: 'text' | 'code' | 'thinking'; content: string }[];
  delay: number;
}

const conversation: Message[] = [
  {
    role: 'user',
    parts: [{ type: 'text', content: 'This API returns 500 when the user has no profile. Can you fix the null reference error?' }],
    delay: 0,
  },
  {
    role: 'assistant',
    parts: [
      { type: 'thinking', content: 'Analyzing the error...' },
      { type: 'text', content: 'The issue is in `getProfile()` — it assumes `user.profile` always exists. Here\'s the fix:' },
      { type: 'code', content: 'const profile = user.profile ?? defaultProfile;\nreturn formatResponse(profile);' },
      { type: 'text', content: 'This uses nullish coalescing to fall back to a default profile when none exists, preventing the 500 error.' },
    ],
    delay: 1200,
  },
];

export default function ChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState(0);
  const [visibleParts, setVisibleParts] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Show user message
    timers.push(setTimeout(() => setVisibleMessages(1), 500));

    // Show assistant thinking
    timers.push(setTimeout(() => {
      setVisibleMessages(2);
      setIsThinking(true);
    }, 1700));

    // Show assistant parts one by one
    const baseDelay = 2800;
    conversation[1].parts.forEach((_, i) => {
      timers.push(setTimeout(() => {
        if (i === 0) setIsThinking(false);
        setVisibleParts(i + 1);
      }, baseDelay + i * 900));
    });

    // Reset loop
    const totalTime = baseDelay + conversation[1].parts.length * 900 + 4000;
    timers.push(setTimeout(() => {
      setVisibleMessages(0);
      setVisibleParts(0);
      setIsThinking(false);
    }, totalTime));

    const loopTimer = setInterval(() => {
      setVisibleMessages(0);
      setVisibleParts(0);
      setIsThinking(false);

      timers.push(setTimeout(() => setVisibleMessages(1), 500));
      timers.push(setTimeout(() => { setVisibleMessages(2); setIsThinking(true); }, 1700));
      conversation[1].parts.forEach((_, i) => {
        timers.push(setTimeout(() => {
          if (i === 0) setIsThinking(false);
          setVisibleParts(i + 1);
        }, 2800 + i * 900));
      });
    }, totalTime);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loopTimer);
    };
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleMessages, visibleParts]);

  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#0d0d0d] overflow-hidden shadow-2xl">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">AI</div>
          <span className="text-sm font-medium text-[#e0e0e0]">Assistant</span>
        </div>
        <span className="text-[10px] text-[#666] font-mono">gpt-4 / claude-3</span>
      </div>

      {/* Messages */}
      <div ref={containerRef} className="p-4 space-y-4 min-h-[280px] max-h-[320px] overflow-y-auto">
        <AnimatePresence>
          {/* User message */}
          {visibleMessages >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-end"
            >
              <div className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-[#2563eb] text-white text-sm">
                {conversation[0].parts[0].content}
              </div>
            </motion.div>
          )}

          {/* Assistant message */}
          {visibleMessages >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[85%] space-y-2">
                {/* Thinking indicator */}
                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1a1a1a] text-[#888] text-sm"
                  >
                    <motion.div
                      className="flex gap-1"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#888]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#888]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#888]" />
                    </motion.div>
                    Thinking...
                  </motion.div>
                )}

                {/* Response parts */}
                {conversation[1].parts.slice(0, visibleParts).map((part, i) => {
                  if (part.type === 'thinking') return null;
                  if (part.type === 'code') {
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-lg overflow-hidden border border-[#333]"
                      >
                        <div className="px-3 py-1 bg-[#2a2a2a] text-[10px] text-[#888] font-mono">typescript</div>
                        <pre className="px-4 py-3 bg-[#161616] text-xs text-[#d4d4d4] font-mono overflow-x-auto">
                          {part.content}
                        </pre>
                      </motion.div>
                    );
                  }
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-2.5 rounded-2xl rounded-bl-sm bg-[#1a1a1a] text-[#e0e0e0] text-sm"
                    >
                      {part.content}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-[#2a2a2a] bg-[#111]">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#333]">
          <span className="text-sm text-[#555] flex-1">Send a message...</span>
          <div className="w-7 h-7 rounded-md bg-[#333] flex items-center justify-center">
            <span className="text-[#888] text-xs">↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}
