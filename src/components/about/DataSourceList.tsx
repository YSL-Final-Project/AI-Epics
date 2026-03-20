const dataSources = [
  {
    category: '行业报告',
    sources: [
      { name: 'GitHub Octoverse Report', desc: 'AI 编程工具用户数、代码生成占比', url: 'https://github.blog/news-insights/octoverse/' },
      { name: 'Stack Overflow Developer Survey', desc: '开发者调查：语言偏好、AI 使用、薪资', url: 'https://survey.stackoverflow.co/' },
      { name: 'JetBrains Developer Ecosystem Survey', desc: 'IDE 市场份额、开发者生态', url: 'https://www.jetbrains.com/lp/devecosystem-2024/' },
    ],
  },
  {
    category: '指数与排名',
    sources: [
      { name: 'TIOBE Index', desc: '编程语言流行度排名', url: 'https://www.tiobe.com/tiobe-index/' },
      { name: 'PYPL Index', desc: '编程语言流行度 (Google 搜索趋势)', url: 'https://pypl.github.io/PYPL.html' },
    ],
  },
  {
    category: '流量与市场数据',
    sources: [
      { name: 'SimilarWeb', desc: 'Stack Overflow 网站流量数据', url: 'https://www.similarweb.com/' },
      { name: 'Levels.fyi', desc: '开发者薪资公开数据', url: 'https://www.levels.fyi/' },
    ],
  },
  {
    category: '官方数据',
    sources: [
      { name: 'GitHub Copilot 官方', desc: '用户数、代码补全准确率', url: 'https://github.com/features/copilot' },
      { name: 'Cursor 官网', desc: '产品特性与定价', url: 'https://cursor.sh/' },
      { name: 'Anthropic Claude', desc: 'Claude Code 产品信息', url: 'https://www.anthropic.com/' },
    ],
  },
];

export default function DataSourceList() {
  return (
    <div className="space-y-6">
      {dataSources.map(cat => (
        <div key={cat.category}>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">
            {cat.category}
          </h4>
          <div className="space-y-2">
            {cat.sources.map(src => (
              <a
                key={src.name}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
              >
                <span className="text-cyan-500 mt-0.5 shrink-0">↗</span>
                <div>
                  <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {src.name}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{src.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
