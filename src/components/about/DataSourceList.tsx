import { useI18n } from '../../i18n';

export default function DataSourceList() {
  const { t, lang } = useI18n();
  const cats = t.about.dataSourceCategories;

  const dataSources = [
    {
      category: cats.industryReports,
      sources: [
        { name: 'GitHub Octoverse Report', desc: 'AI 编程工具用户数、代码生成占比', descEn: 'AI coding tool user counts, code generation ratio', url: 'https://github.blog/news-insights/octoverse/' },
        { name: 'Stack Overflow Developer Survey', desc: '开发者调查：语言偏好、AI 使用、薪资', descEn: 'Developer survey: language preference, AI usage, salary', url: 'https://survey.stackoverflow.co/' },
        { name: 'JetBrains Developer Ecosystem Survey', desc: 'IDE 市场份额、开发者生态', descEn: 'IDE market share, developer ecosystem', url: 'https://www.jetbrains.com/lp/devecosystem-2024/' },
      ],
    },
    {
      category: cats.indices,
      sources: [
        { name: 'TIOBE Index', desc: '编程语言流行度排名', descEn: 'Programming language popularity ranking', url: 'https://www.tiobe.com/tiobe-index/' },
        { name: 'PYPL Index', desc: '编程语言流行度 (Google 搜索趋势)', descEn: 'Programming language popularity (Google search trends)', url: 'https://pypl.github.io/PYPL.html' },
      ],
    },
    {
      category: cats.traffic,
      sources: [
        { name: 'SimilarWeb', desc: 'Stack Overflow 网站流量数据', descEn: 'Stack Overflow website traffic data', url: 'https://www.similarweb.com/' },
        { name: 'Levels.fyi', desc: '开发者薪资公开数据', descEn: 'Public developer salary data', url: 'https://www.levels.fyi/' },
      ],
    },
    {
      category: cats.official,
      sources: [
        { name: 'GitHub Copilot 官方', nameEn: 'GitHub Copilot Official', desc: '用户数、代码补全准确率', descEn: 'User count, code completion accuracy', url: 'https://github.com/features/copilot' },
        { name: 'Cursor 官网', nameEn: 'Cursor Official', desc: '产品特性与定价', descEn: 'Product features and pricing', url: 'https://cursor.sh/' },
        { name: 'Anthropic Claude', desc: 'Claude Code 产品信息', descEn: 'Claude Code product information', url: 'https://www.anthropic.com/' },
      ],
    },
  ];

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
                    {lang === 'en' && src.nameEn ? src.nameEn : src.name}
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{lang === 'en' ? src.descEn : src.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
