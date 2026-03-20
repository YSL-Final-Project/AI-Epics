import {
  BarChart, Bar, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ZAxis
} from 'recharts';
import ideData from '../../data/ide_market.json';
import type { IDEMarketData } from '../../types';
import { useTheme } from '../../context/ThemeContext';

const data = ideData as IDEMarketData;

const IDE_COLORS: Record<string, string> = {
  vscode: '#007ACC',
  jetbrains: '#FF318C',
  vim: '#019733',
  cursor: '#7C3AED',
};

export default function IDEMarketChart() {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
    borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
    borderRadius: '8px',
    color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
  };

  return (
    <div className="space-y-10">
      {/* Stacked Bar: Market Share */}
      <div className="overflow-x-auto">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          IDE 市场占有率变化 (2019-2025)
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data.marketShare}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="year" tick={{ fill: textColor, fontSize: 12 }} />
            <YAxis tick={{ fill: textColor, fontSize: 12 }} unit="%" />
            <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, '']} />
            <Legend />
            <Bar dataKey="vscode" stackId="a" fill={IDE_COLORS.vscode} name="VS Code" />
            <Bar dataKey="jetbrains" stackId="a" fill={IDE_COLORS.jetbrains} name="JetBrains" />
            <Bar dataKey="vim" stackId="a" fill={IDE_COLORS.vim} name="Vim/Neovim" />
            <Bar dataKey="cursor" stackId="a" fill={IDE_COLORS.cursor} name="Cursor" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bubble Chart: Ecosystem */}
      <div className="overflow-x-auto">
        <h4 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
          IDE 插件生态 vs AI 集成程度
        </h4>
        <ResponsiveContainer width="100%" height={350}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis type="number" dataKey="aiIntegration" name="AI 集成度"
              tick={{ fill: textColor, fontSize: 12 }} unit="%" domain={[30, 100]} />
            <YAxis type="number" dataKey="plugins" name="插件数量"
              tick={{ fill: textColor, fontSize: 12 }} />
            <ZAxis type="number" dataKey="marketShare" range={[100, 800]} name="市场份额" />
            <Tooltip
              contentStyle={tooltipStyle}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">{d.name}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">插件数: {d.plugins.toLocaleString()}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">AI 集成度: {d.aiIntegration}%</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">市场份额: {d.marketShare}%</p>
                  </div>
                );
              }}
            />
            <Scatter data={data.ecosystem} fill="#06b6d4" />
          </ScatterChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-400 text-center mt-2">气泡大小 = 市场份额</p>
      </div>
    </div>
  );
}
