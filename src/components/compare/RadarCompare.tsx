import { useState } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const languages = [
  {
    name: 'Python',
    color: '#3776AB',
    metrics: { popularity: 98, salary: 85, aiCompat: 95, learnCurve: 90, community: 92 },
  },
  {
    name: 'JavaScript',
    color: '#F7DF1E',
    metrics: { popularity: 88, salary: 78, aiCompat: 85, learnCurve: 75, community: 95 },
  },
  {
    name: 'TypeScript',
    color: '#3178C6',
    metrics: { popularity: 82, salary: 88, aiCompat: 90, learnCurve: 65, community: 80 },
  },
  {
    name: 'Rust',
    color: '#CE422B',
    metrics: { popularity: 55, salary: 95, aiCompat: 60, learnCurve: 35, community: 70 },
  },
  {
    name: 'Go',
    color: '#00ADD8',
    metrics: { popularity: 60, salary: 92, aiCompat: 70, learnCurve: 72, community: 65 },
  },
  {
    name: 'Java',
    color: '#ED8B00',
    metrics: { popularity: 65, salary: 82, aiCompat: 80, learnCurve: 55, community: 85 },
  },
];

const dimensions = [
  { key: 'popularity', label: '流行度' },
  { key: 'salary', label: '薪资水平' },
  { key: 'aiCompat', label: 'AI 兼容性' },
  { key: 'learnCurve', label: '学习曲线' },
  { key: 'community', label: '社区规模' },
];

export default function RadarCompare() {
  const [selected, setSelected] = useState<string[]>(['Python', 'TypeScript', 'Rust']);
  const { theme } = useTheme();

  const radarData = dimensions.map(dim => {
    const point: Record<string, string | number> = { dimension: dim.label };
    selected.forEach(langName => {
      const lang = languages.find(l => l.name === langName);
      if (lang) point[langName] = lang.metrics[dim.key as keyof typeof lang.metrics];
    });
    return point;
  });

  const toggleLanguage = (name: string) => {
    setSelected(prev => {
      if (prev.includes(name)) {
        if (prev.length <= 1) return prev;
        return prev.filter(n => n !== name);
      }
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };

  return (
    <div>
      {/* Language selector */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {languages.map(lang => (
          <button
            key={lang.name}
            onClick={() => toggleLanguage(lang.name)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border-2 ${
              selected.includes(lang.name)
                ? 'text-white shadow-md'
                : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-600 opacity-60 hover:opacity-100'
            }`}
            style={selected.includes(lang.name) ? { backgroundColor: lang.color, borderColor: lang.color } : {}}
          >
            {lang.name}
          </button>
        ))}
        <span className="text-xs text-slate-400 self-center ml-2">选择 1-3 种语言</span>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={radarData}>
          <PolarGrid stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b', fontSize: 12 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: theme === 'dark' ? '#64748b' : '#94a3b8', fontSize: 10 }} />
          {selected.map(langName => {
            const lang = languages.find(l => l.name === langName)!;
            return (
              <Radar
                key={langName}
                name={langName}
                dataKey={langName}
                stroke={lang.color}
                fill={lang.color}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            );
          })}
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
              borderColor: theme === 'dark' ? '#475569' : '#e2e8f0',
              borderRadius: '8px',
              color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
