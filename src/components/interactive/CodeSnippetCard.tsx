import type { CodeSnippet } from '../../types';

interface CodeSnippetCardProps {
  snippet: CodeSnippet;
}

export default function CodeSnippetCard({ snippet }: CodeSnippetCardProps) {
  return (
    <div className="rounded-2xl overflow-hidden terminal-glow">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-200/90 dark:bg-[#1a1a2e] border-b border-slate-300/30 dark:border-white/5">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-1">
            {snippet.language}
          </span>
        </div>
        <span className="text-xs text-slate-400/50 font-mono">#{snippet.id}</span>
      </div>
      {/* Code */}
      <pre className="p-5 bg-slate-50 dark:bg-[#0d1117] overflow-x-auto">
        <code className="text-[13px] text-emerald-600 dark:text-emerald-400 font-mono whitespace-pre leading-relaxed">
          {snippet.code}
        </code>
      </pre>
    </div>
  );
}
