import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Era 2: Simulates GitHub Copilot ghost text.
 * Shows a comment, then ghost text appears line-by-line, then "Tab" accepts it.
 */

const commentLine = '// Sort users by registration date, newest first';
const ghostLines = [
  'function sortUsersByDate(users: User[]): User[] {',
  '  return [...users].sort((a, b) =>',
  '    new Date(b.registeredAt).getTime() -',
  '    new Date(a.registeredAt).getTime()',
  '  );',
  '}',
];

export default function CopilotDemo() {
  const [phase, setPhase] = useState<'typing' | 'ghost' | 'accepted'>('typing');
  const [ghostCount, setGhostCount] = useState(0);
  const [commentLen, setCommentLen] = useState(0);

  useEffect(() => {
    const loop = () => {
      // Phase 1: Type comment
      setPhase('typing');
      setCommentLen(0);
      setGhostCount(0);

      let charIdx = 0;
      const typeTimer = setInterval(() => {
        charIdx++;
        setCommentLen(charIdx);
        if (charIdx >= commentLine.length) {
          clearInterval(typeTimer);
          // Phase 2: Show ghost text
          setTimeout(() => {
            setPhase('ghost');
            let lineIdx = 0;
            const ghostTimer = setInterval(() => {
              lineIdx++;
              setGhostCount(lineIdx);
              if (lineIdx >= ghostLines.length) {
                clearInterval(ghostTimer);
                // Phase 3: Accept with Tab
                setTimeout(() => {
                  setPhase('accepted');
                  // Restart after pause
                  setTimeout(loop, 3000);
                }, 1500);
              }
            }, 300);
          }, 800);
        }
      }, 30);
    };

    loop();
    return () => {}; // timers self-clean on unmount via closure
  }, []);

  return (
    <div className="relative rounded-xl border border-slate-700/50 bg-[#1e1e1e] overflow-hidden shadow-2xl font-mono">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#323233] border-b border-[#3c3c3c]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[#8b8b8b] ml-2">userService.ts</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-sm bg-[#1e1e1e] flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" fill="#8b8b8b"/>
            </svg>
          </div>
          <span className="text-[10px] text-[#8b8b8b]">Copilot</span>
        </div>
      </div>

      {/* Code area */}
      <div className="flex min-h-[300px]">
        {/* Line numbers */}
        <div className="flex flex-col py-4 px-3 bg-[#1e1e1e] text-right select-none border-r border-[#3c3c3c]">
          {Array.from({ length: 2 + ghostLines.length }, (_, i) => (
            <div key={i} className="text-xs text-[#858585] leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Code */}
        <div className="flex-1 p-4">
          <div className="text-sm leading-6">
            {/* Comment line being typed */}
            <div className="text-[#6a9955]">
              {commentLine.slice(0, commentLen)}
              {phase === 'typing' && (
                <motion.span
                  className="inline-block w-[2px] h-[14px] bg-white ml-[1px] align-middle"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.53, repeat: Infinity }}
                />
              )}
            </div>

            {/* Ghost text / Accepted text */}
            {(phase === 'ghost' || phase === 'accepted') && (
              <div className="relative">
                {ghostLines.slice(0, ghostCount).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className={phase === 'accepted' ? 'text-[#d4d4d4]' : 'text-[#d4d4d4]/40'}
                  >
                    {line}
                  </motion.div>
                ))}

                {/* Tab hint */}
                {phase === 'ghost' && ghostCount >= ghostLines.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute -right-2 top-0 flex items-center gap-1"
                  >
                    <span className="px-2 py-0.5 rounded bg-[#3c3c3c] text-[10px] text-[#cccccc] border border-[#555]">
                      Tab →
                    </span>
                  </motion.div>
                )}

                {/* Accepted indicator */}
                {phase === 'accepted' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs"
                  >
                    ✓ Accepted 6 lines
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
