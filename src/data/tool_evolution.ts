export interface ToolInfo {
  name: string;
  year: number;
  description: { en: string; zh: string };
  color: string;
}

export interface CodeDemoLine {
  type: 'human' | 'ai' | 'comment' | 'system';
  text: string;
  delay?: number;
}

export interface EraData {
  id: number;
  key: string;
  yearRange: string;
  icon: string;
  tools: ToolInfo[];
  codeDemo: CodeDemoLine[];
  stats: { label: { en: string; zh: string }; value: string }[];
}

const eras: EraData[] = [
  {
    id: 1,
    key: 'autocomplete',
    yearRange: '2018–2021',
    icon: '⌨️',
    tools: [
      { name: 'TabNine', year: 2018, description: { en: 'Deep-learning autocomplete for all languages', zh: '基于深度学习的全语言自动补全' }, color: '#6366f1' },
      { name: 'Kite', year: 2019, description: { en: 'AI-powered Python completions', zh: 'AI 驱动的 Python 代码补全' }, color: '#22d3ee' },
      { name: 'IntelliSense', year: 2020, description: { en: 'VS Code ML-enhanced suggestions', zh: 'VS Code ML 增强建议' }, color: '#3b82f6' },
    ],
    codeDemo: [
      { type: 'comment', text: '// Developer types code, AI suggests the next token' },
      { type: 'human', text: 'function calculate' },
      { type: 'ai', text: 'Total(items) {', delay: 400 },
      { type: 'human', text: '  return items.re' },
      { type: 'ai', text: 'duce((sum, item) => sum + item.price, 0);', delay: 300 },
      { type: 'human', text: '}' },
    ],
    stats: [
      { label: { en: 'Completion scope', zh: '补全范围' }, value: '1 line' },
      { label: { en: 'AI code contribution', zh: 'AI 代码贡献' }, value: '<10%' },
      { label: { en: 'Human role', zh: '人类角色' }, value: '🚗 Driver' },
    ],
  },
  {
    id: 2,
    key: 'copilot',
    yearRange: '2021–2023',
    icon: '🤖',
    tools: [
      { name: 'GitHub Copilot', year: 2021, description: { en: 'AI pair programmer powered by Codex', zh: 'Codex 驱动的 AI 结对编程' }, color: '#6366f1' },
      { name: 'CodeWhisperer', year: 2022, description: { en: 'Amazon\'s AI coding companion', zh: 'Amazon 的 AI 编码伴侣' }, color: '#f59e0b' },
      { name: 'Codeium', year: 2022, description: { en: 'Free AI code acceleration', zh: '免费 AI 代码加速' }, color: '#10b981' },
    ],
    codeDemo: [
      { type: 'comment', text: '// Developer writes intent, AI generates implementation' },
      { type: 'human', text: '// Sort users by registration date, newest first' },
      { type: 'ai', text: 'function sortUsersByDate(users: User[]): User[] {', delay: 600 },
      { type: 'ai', text: '  return [...users].sort((a, b) =>', delay: 200 },
      { type: 'ai', text: '    new Date(b.registeredAt).getTime() -', delay: 150 },
      { type: 'ai', text: '    new Date(a.registeredAt).getTime()', delay: 150 },
      { type: 'ai', text: '  );', delay: 100 },
      { type: 'ai', text: '}', delay: 100 },
    ],
    stats: [
      { label: { en: 'Completion scope', zh: '补全范围' }, value: '10–30 lines' },
      { label: { en: 'Code acceptance rate', zh: '代码采纳率' }, value: '46%' },
      { label: { en: 'Human role', zh: '人类角色' }, value: '🧑‍✈️ Pilot' },
    ],
  },
  {
    id: 3,
    key: 'chat',
    yearRange: '2023–2024',
    icon: '💬',
    tools: [
      { name: 'ChatGPT', year: 2022, description: { en: 'Conversational AI that writes & explains code', zh: '对话式 AI，能写代码也能解释代码' }, color: '#10b981' },
      { name: 'Claude', year: 2023, description: { en: 'Long-context AI with strong reasoning', zh: '长上下文 + 强推理的 AI' }, color: '#d4a574' },
      { name: 'Cursor Chat', year: 2023, description: { en: 'AI chat integrated in IDE', zh: 'IDE 内置 AI 对话' }, color: '#8b5cf6' },
    ],
    codeDemo: [
      { type: 'system', text: '> User:' },
      { type: 'human', text: 'This API returns 500 when the user has no profile.' },
      { type: 'human', text: 'Can you fix the null reference error?' },
      { type: 'system', text: '> Assistant:', delay: 800 },
      { type: 'ai', text: 'The issue is in `getProfile()` — it assumes', delay: 400 },
      { type: 'ai', text: '`user.profile` always exists. Here\'s the fix:', delay: 300 },
      { type: 'ai', text: '  const profile = user.profile ?? defaultProfile;', delay: 200 },
      { type: 'comment', text: '// AI explains, suggests, and teaches — not just writes' },
    ],
    stats: [
      { label: { en: 'Interaction mode', zh: '交互模式' }, value: 'Natural language' },
      { label: { en: 'SO traffic drop', zh: 'SO 流量下降' }, value: '-55%' },
      { label: { en: 'Human role', zh: '人类角色' }, value: '❓ Questioner' },
    ],
  },
  {
    id: 4,
    key: 'agent',
    yearRange: '2024–2025',
    icon: '🧠',
    tools: [
      { name: 'Claude Code', year: 2025, description: { en: 'Autonomous coding agent in your terminal', zh: '终端里的自主编码 Agent' }, color: '#d4a574' },
      { name: 'Cursor Composer', year: 2024, description: { en: 'Multi-file AI editing agent', zh: '多文件 AI 编辑 Agent' }, color: '#8b5cf6' },
      { name: 'Devin', year: 2024, description: { en: 'First autonomous AI software engineer', zh: '首个自主 AI 软件工程师' }, color: '#06b6d4' },
      { name: 'Windsurf', year: 2024, description: { en: 'Agentic IDE with flow state', zh: '具有 Flow 状态的 Agent IDE' }, color: '#22c55e' },
    ],
    codeDemo: [
      { type: 'system', text: '$ claude "Add dark mode support to the dashboard"' },
      { type: 'ai', text: '● Reading src/components/Dashboard.tsx...', delay: 600 },
      { type: 'ai', text: '● Reading src/styles/theme.ts...', delay: 400 },
      { type: 'ai', text: '● Editing 4 files to add dark mode...', delay: 500 },
      { type: 'ai', text: '● Running npm test... 47 passed, 0 failed', delay: 700 },
      { type: 'ai', text: '● Creating commit: "feat: add dark mode"', delay: 300 },
      { type: 'ai', text: '✓ Done. Dark mode toggle added to header.', delay: 200 },
      { type: 'comment', text: '// Human gives goal, AI plans + executes + verifies' },
    ],
    stats: [
      { label: { en: 'Autonomy level', zh: '自主程度' }, value: 'Full workflow' },
      { label: { en: 'AI code on GitHub', zh: 'GitHub AI 代码占比' }, value: '40%+' },
      { label: { en: 'Human role', zh: '人类角色' }, value: '🔍 Reviewer' },
    ],
  },
];

export default eras;
