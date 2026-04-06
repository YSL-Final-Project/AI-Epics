import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Era 1: Simulates IDE autocomplete dropdown.
 * User types, AI shows a dropdown of single-line completions.
 */

const typingSequence = [
  { typed: 'f', suggestions: ['function', 'for', 'finally', 'false'] },
  { typed: 'fu', suggestions: ['function', 'Function.prototype'] },
  { typed: 'fun', suggestions: ['function'] },
  { typed: 'function calc', suggestions: ['calculateTotal', 'calculateTax', 'calculateDiscount'] },
  { typed: 'function calculateTotal(', suggestions: ['items)', 'items: Item[])', 'items, tax)'] },
];

export default function AutocompleteDemo() {
  const [step, setStep] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(s => (s + 1) % typingSequence.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blink = setInterval(() => setCursorVisible(v => !v), 530);
    return () => clearInterval(blink);
  }, []);

  const current = typingSequence[step];

  return (
    <div className="relative rounded-xl border border-slate-700/50 bg-[#1e1e1e] overflow-hidden shadow-2xl font-mono">
      {/* VS Code-like title bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-[#323233] border-b border-[#3c3c3c]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-xs text-[#8b8b8b] ml-2">utils.ts — Visual Studio Code</span>
      </div>

      {/* Line numbers + code area */}
      <div className="flex min-h-[280px]">
        {/* Line numbers */}
        <div className="flex flex-col py-4 px-3 bg-[#1e1e1e] text-right select-none border-r border-[#3c3c3c]">
          {[1, 2, 3, 4, 5].map(n => (
            <div key={n} className="text-xs text-[#858585] leading-6">{n}</div>
          ))}
        </div>

        {/* Code content */}
        <div className="flex-1 p-4 relative">
          <div className="text-sm leading-6">
            <div className="text-[#c586c0]">
              <span className="text-[#569cd6]">const</span>{' '}
              <span className="text-[#4fc1ff]">items</span>{' '}
              <span className="text-[#d4d4d4]">=</span>{' '}
              <span className="text-[#ce9178]">getCartItems</span>
              <span className="text-[#ffd700]">()</span>
              <span className="text-[#d4d4d4]">;</span>
            </div>
            <div className="h-6" />
            {/* Active typing line */}
            <div className="relative">
              <span className="text-[#d4d4d4]">{current.typed}</span>
              {cursorVisible && (
                <span className="inline-block w-[2px] h-[14px] bg-white ml-[1px] align-middle" />
              )}
            </div>

            {/* Autocomplete dropdown */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="absolute left-4 mt-1 bg-[#252526] border border-[#454545] rounded shadow-xl z-10 min-w-[260px]"
              >
                {current.suggestions.map((s, i) => (
                  <div
                    key={s}
                    className={`px-3 py-1 text-xs flex items-center gap-2 ${
                      i === 0
                        ? 'bg-[#04395e] text-white'
                        : 'text-[#d4d4d4] hover:bg-[#2a2d2e]'
                    }`}
                  >
                    <span className="text-[#75beff] text-[10px]">⬡</span>
                    <span>{s}</span>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
