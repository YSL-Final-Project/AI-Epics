import { useState } from 'react';
import toolsData from '../../data/ai_tools_compare.json';
import type { AIToolInfo } from '../../types';

const tools = toolsData as AIToolInfo[];

export default function ToolCompareTable() {
  const [selectedTools, setSelectedTools] = useState<string[]>(tools.map(t => t.name));

  const toggleTool = (name: string) => {
    setSelectedTools(prev => {
      if (prev.includes(name)) {
        if (prev.length <= 2) return prev;
        return prev.filter(n => n !== name);
      }
      return [...prev, name];
    });
  };

  const visibleTools = tools.filter(t => selectedTools.includes(t.name));

  return (
    <div>
      {/* Checkbox filter */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {tools.map(tool => (
          <label
            key={tool.name}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${
              selectedTools.includes(tool.name)
                ? 'bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'
                : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 opacity-60'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedTools.includes(tool.name)}
              onChange={() => toggleTool(tool.name)}
              className="accent-cyan-500"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
          </label>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">维度</th>
              {visibleTools.map(tool => (
                <th key={tool.name} className="text-left py-3 px-4 text-slate-900 dark:text-white font-semibold">
                  {tool.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">定价</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4 text-slate-900 dark:text-slate-200">{t.pricing}</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">支持语言数</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4 text-slate-900 dark:text-slate-200">{t.languages}+</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">准确率</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${t.accuracy}%` }} />
                    </div>
                    <span className="text-slate-900 dark:text-slate-200">{t.accuracy}%</span>
                  </div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">上下文窗口</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4 text-slate-900 dark:text-slate-200">{t.contextWindow}</td>
              ))}
            </tr>
            <tr className="border-b border-slate-100 dark:border-slate-800">
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">IDE 支持</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {t.ideSupport.map(ide => (
                      <span key={ide} className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {ide}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-slate-600 dark:text-slate-400">发布时间</td>
              {visibleTools.map(t => (
                <td key={t.name} className="py-3 px-4 text-slate-900 dark:text-slate-200">{t.releaseDate}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
