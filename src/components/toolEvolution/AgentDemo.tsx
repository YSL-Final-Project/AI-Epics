import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Era 4: Simulates an autonomous agent running in terminal.
 * Shows the agent reading files, editing code, running tests, creating commits.
 */

interface Step {
  icon: string;
  text: string;
  type: 'command' | 'read' | 'edit' | 'run' | 'success' | 'info';
  delay: number;
}

const agentSteps: Step[] = [
  { icon: '$', text: 'claude "Add dark mode support to the dashboard"', type: 'command', delay: 0 },
  { icon: '●', text: 'Reading project structure...', type: 'info', delay: 800 },
  { icon: '📖', text: 'Read src/components/Dashboard.tsx (142 lines)', type: 'read', delay: 600 },
  { icon: '📖', text: 'Read src/styles/theme.ts (38 lines)', type: 'read', delay: 400 },
  { icon: '📖', text: 'Read src/context/ThemeContext.tsx (25 lines)', type: 'read', delay: 300 },
  { icon: '●', text: 'Planning changes across 4 files...', type: 'info', delay: 700 },
  { icon: '✏️', text: 'Edit src/styles/theme.ts (+18 lines)', type: 'edit', delay: 500 },
  { icon: '✏️', text: 'Edit src/components/Dashboard.tsx (+12 lines)', type: 'edit', delay: 400 },
  { icon: '✏️', text: 'Edit src/components/Header.tsx (+8 lines)', type: 'edit', delay: 350 },
  { icon: '✏️', text: 'Edit src/App.tsx (+3 lines)', type: 'edit', delay: 300 },
  { icon: '▶', text: 'Running npm test...', type: 'run', delay: 900 },
  { icon: '✓', text: '47 passed, 0 failed (2.3s)', type: 'success', delay: 800 },
  { icon: '▶', text: 'Running npm run build...', type: 'run', delay: 600 },
  { icon: '✓', text: 'Build succeeded (4.1s)', type: 'success', delay: 700 },
  { icon: '●', text: 'Creating commit: "feat: add dark mode toggle to dashboard"', type: 'info', delay: 500 },
  { icon: '✓', text: 'Done. 4 files changed, 41 insertions, dark mode toggle added to header.', type: 'success', delay: 0 },
];

const typeColors: Record<Step['type'], string> = {
  command: 'text-amber-300',
  read: 'text-blue-400',
  edit: 'text-violet-400',
  run: 'text-yellow-400',
  success: 'text-emerald-400',
  info: 'text-slate-400',
};

export default function AgentDemo() {
  const [visibleSteps, setVisibleSteps] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let stepIdx = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function showNext() {
      if (stepIdx >= agentSteps.length) {
        // Reset after pause
        timers.push(setTimeout(() => {
          setVisibleSteps(0);
          stepIdx = 0;
          timers.push(setTimeout(showNext, 600));
        }, 4000));
        return;
      }
      const delay = stepIdx === 0 ? 500 : agentSteps[stepIdx].delay;
      timers.push(setTimeout(() => {
        stepIdx++;
        setVisibleSteps(stepIdx);
        showNext();
      }, delay));
    }

    showNext();
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: 'smooth' });
  }, [visibleSteps]);

  return (
    <div className="rounded-xl border border-slate-700/50 bg-[#0a0a0a] overflow-hidden shadow-2xl font-mono">
      {/* Terminal header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1c1c1c] border-b border-[#333]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs text-[#8b8b8b] ml-2">Terminal — claude-code</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${visibleSteps < agentSteps.length ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[10px] text-[#8b8b8b]">
            {visibleSteps < agentSteps.length ? 'Running...' : 'Complete'}
          </span>
        </div>
      </div>

      {/* Terminal output */}
      <div ref={containerRef} className="p-4 min-h-[300px] max-h-[340px] overflow-y-auto space-y-1">
        {agentSteps.slice(0, visibleSteps).map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
            className={`text-sm ${typeColors[step.type]} flex items-start gap-2`}
          >
            <span className="shrink-0 w-5 text-center">{step.icon}</span>
            <span className={step.type === 'command' ? 'font-bold' : ''}>{step.text}</span>
          </motion.div>
        ))}

        {/* Blinking cursor */}
        {visibleSteps < agentSteps.length && (
          <div className="flex items-center gap-2 text-sm">
            <span className="w-5" />
            <motion.span
              className="inline-block w-2 h-4 bg-emerald-400/80"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
