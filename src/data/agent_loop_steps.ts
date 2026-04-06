export interface AgentLoopStep {
  id: number;
  name: { en: string; zh: string };
  shortLabel: { en: string; zh: string };
  description: { en: string; zh: string };
  detail: { en: string; zh: string };
  sourceFile: string;
  terminal: { en: string; zh: string };
}

const agentLoopSteps: AgentLoopStep[] = [
  {
    id: 1,
    name: { en: 'User Input', zh: '用户输入' },
    shortLabel: { en: 'Input', zh: '输入' },
    description: {
      en: 'User types a message or pipes input through |stdin|',
      zh: '用户输入消息或通过 |stdin| 管道输入',
    },
    detail: {
      en: "Keyboard input comes from Ink's |TextInput| component. In non-interactive mode, it reads from piped |stdin| instead.",
      zh: "键盘输入来自 Ink 的 |TextInput| 组件。在非交互模式下，它会读取管道传入的 |stdin|。",
    },
    sourceFile: 'src/components/TextInput.tsx',
    terminal: {
      en: 'Find all TODO comments in src/ and create a summary',
      zh: '查找 src/ 中所有 TODO 注释并创建摘要',
    },
  },
  {
    id: 2,
    name: { en: 'Message Creation', zh: '消息创建' },
    shortLabel: { en: 'Message', zh: '消息' },
    description: {
      en: "|createUserMessage()| wraps the text into Anthropic's message format",
      zh: '|createUserMessage()| 将文本包装为 Anthropic 消息格式',
    },
    detail: {
      en: 'The raw text is wrapped into the Anthropic API message structure with role, content type, and text fields.',
      zh: '原始文本被包装为 Anthropic API 消息结构，包含角色、内容类型和文本字段。',
    },
    sourceFile: 'src/utils/messages.ts',
    terminal: {
      en: 'Creating message payload...',
      zh: '创建消息负载...',
    },
  },
  {
    id: 3,
    name: { en: 'History Append', zh: '历史追加' },
    shortLabel: { en: 'History', zh: '历史' },
    description: {
      en: 'Message gets pushed onto the in-memory conversation array',
      zh: '消息被推入内存中的对话数组',
    },
    detail: {
      en: "The conversation history is just an array that grows over the session. It's what the context window manager trims later.",
      zh: '对话历史只是一个在会话期间不断增长的数组。上下文窗口管理器稍后会对其进行裁剪。',
    },
    sourceFile: 'src/services/history.ts',
    terminal: {
      en: 'Appending to conversation history...',
      zh: '追加到对话历史...',
    },
  },
  {
    id: 4,
    name: { en: 'System Prompt Assembly', zh: '系统提示组装' },
    shortLabel: { en: 'System', zh: '系统' },
    description: {
      en: 'Assemble system prompt from |CLAUDE.md|, tool defs, context, and memory',
      zh: '从 |CLAUDE.md|、工具定义、上下文和记忆组装系统提示',
    },
    detail: {
      en: 'Merges project instructions (|CLAUDE.md|), available tool definitions, directory context, and any persistent memory into one system prompt.',
      zh: '将项目指令（|CLAUDE.md|）、可用工具定义、目录上下文和持久记忆合并为一个系统提示。',
    },
    sourceFile: 'src/context.ts',
    terminal: {
      en: 'Assembling system prompt...',
      zh: '组装系统提示...',
    },
  },
  {
    id: 5,
    name: { en: 'API Streaming', zh: 'API 流式传输' },
    shortLabel: { en: 'API', zh: 'API' },
    description: {
      en: 'Streaming API call to Anthropic with the complete context',
      zh: '使用完整上下文向 Anthropic 发起流式 API 调用',
    },
    detail: {
      en: 'A streaming POST request is sent to |api.anthropic.com/v1/messages| with the full message history and system prompt.',
      zh: '向 |api.anthropic.com/v1/messages| 发送流式 POST 请求，包含完整的消息历史和系统提示。',
    },
    sourceFile: 'src/services/api/index.ts',
    terminal: {
      en: 'POST api.anthropic.com/v1/messages\nstream: true | model: claude-opus-4-6',
      zh: 'POST api.anthropic.com/v1/messages\nstream: true | model: claude-opus-4-6',
    },
  },
  {
    id: 6,
    name: { en: 'Token Parsing', zh: 'Token 解析' },
    shortLabel: { en: 'Tokens', zh: 'Token' },
    description: {
      en: 'Response tokens are parsed and accumulated in real-time',
      zh: '响应 token 被实时解析和累积',
    },
    detail: {
      en: 'Each |content_block_delta| event is parsed and the text is accumulated into the response buffer for rendering.',
      zh: '每个 |content_block_delta| 事件被解析，文本累积到响应缓冲区以供渲染。',
    },
    sourceFile: 'src/QueryEngine.ts',
    terminal: {
      en: 'content_block_delta: text\ntokens: 142 | latency: 1.2s',
      zh: 'content_block_delta: text\ntokens: 142 | latency: 1.2s',
    },
  },
  {
    id: 7,
    name: { en: 'Tool Detection', zh: '工具检测' },
    shortLabel: { en: 'Tools?', zh: '工具?' },
    description: {
      en: 'Detect |tool_use| blocks and prepare for execution',
      zh: '检测 |tool_use| 块并准备执行',
    },
    detail: {
      en: 'When the model emits a |tool_use| content block, the agent identifies which tool to call and extracts its parameters.',
      zh: '当模型输出 |tool_use| 内容块时，代理识别要调用的工具并提取参数。',
    },
    sourceFile: 'src/tools.ts',
    terminal: {
      en: 'tool_use detected: Glob\npattern: "src/**/*.ts"',
      zh: 'tool_use 检测到: Glob\npattern: "src/**/*.ts"',
    },
  },
  {
    id: 8,
    name: { en: 'Tool Execution Loop', zh: '工具执行循环' },
    shortLabel: { en: 'Loop', zh: '循环' },
    description: {
      en: 'Execute tools in sequence, feeding results back to the API',
      zh: '按顺序执行工具，将结果反馈给 API',
    },
    detail: {
      en: 'Each tool runs, its result is appended to the conversation, and the loop continues until no more |tool_use| blocks are returned.',
      zh: '每个工具运行后，结果追加到对话中，循环持续直到不再返回 |tool_use| 块。',
    },
    sourceFile: 'src/QueryEngine.ts',
    terminal: {
      en: '[1/3] Glob: 24 files matched\n[2/3] Read: src/index.ts\n[3/3] Done. Feeding results back...',
      zh: '[1/3] Glob: 24 个文件匹配\n[2/3] Read: src/index.ts\n[3/3] 完成。结果反馈中...',
    },
  },
  {
    id: 9,
    name: { en: 'Response Rendering', zh: '响应渲染' },
    shortLabel: { en: 'Render', zh: '渲染' },
    description: {
      en: 'AI response is rendered in the terminal UI',
      zh: 'AI 响应在终端 UI 中渲染',
    },
    detail: {
      en: 'Markdown is parsed and rendered with syntax highlighting. Code blocks, lists, and other elements are formatted for the terminal.',
      zh: 'Markdown 被解析并以语法高亮渲染。代码块、列表等元素被格式化为终端输出。',
    },
    sourceFile: 'src/components/ResponseRenderer.tsx',
    terminal: {
      en: 'Rendering markdown blocks...\nResponse complete. 3 code blocks rendered.',
      zh: '渲染 markdown 块...\n响应完成。已渲染 3 个代码块。',
    },
  },
  {
    id: 10,
    name: { en: 'Post-Sampling Hooks', zh: '后采样钩子' },
    shortLabel: { en: 'Hooks', zh: '钩子' },
    description: {
      en: 'Execute any configured post-sampling hooks',
      zh: '执行任何已配置的后采样钩子',
    },
    detail: {
      en: 'Hooks defined in |settings.json| run after each model response — useful for logging, notifications, or custom workflows.',
      zh: '在 |settings.json| 中定义的钩子在每次模型响应后运行——用于日志记录、通知或自定义工作流。',
    },
    sourceFile: 'src/hooks/index.ts',
    terminal: {
      en: 'Running post-sampling hooks...\nhook: auto-commit (skipped)',
      zh: '运行后采样钩子...\nhook: auto-commit (已跳过)',
    },
  },
  {
    id: 11,
    name: { en: 'Await Next Input', zh: '等待下一次输入' },
    shortLabel: { en: 'Await', zh: '等待' },
    description: {
      en: 'Return to idle state, waiting for the next user message',
      zh: '返回空闲状态，等待下一个用户消息',
    },
    detail: {
      en: 'The loop is complete. Claude Code returns to the input prompt, ready for the next instruction or follow-up.',
      zh: '循环完成。Claude Code 返回输入提示符，准备接收下一条指令或后续操作。',
    },
    sourceFile: 'src/main.tsx',
    terminal: {
      en: 'Ready for next input...',
      zh: '准备接收下一次输入...',
    },
  },
];

export default agentLoopSteps;
