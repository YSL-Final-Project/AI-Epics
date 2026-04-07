export interface ArenaModel {
  name: string;
  badge: string;
  color: string;
  avatar: string;
  answer: string;
  speed: number;   // chars per tick (higher = faster)
  delay: number;   // ms before typing starts
}

export interface ArenaQuestion {
  id: string;
  question: string;
  questionEn: string;
  models: ArenaModel[];
  // Per-model quality scores [0–100] for: [completeness, codeQuality]
  // Speed is auto-computed from model.delay + answer.length / speed
  qualityScores: [number, number][];
}

const arenaQuestions: ArenaQuestion[] = [
  {
    id: 'quicksort',
    question: '用 Python 写一个快速排序算法',
    questionEn: 'Write a quicksort algorithm in Python',
    // [completeness, codeQuality] per model — speed auto-computed from animation
    qualityScores: [[82, 80], [85, 92], [75, 72]],
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        badge: 'Anthropic',
        color: '#c4a24d',
        avatar: '🟡',
        speed: 2.2,
        delay: 300,
        answer: `好的，这是一个简洁高效的快速排序实现：

\`\`\`python
def quicksort(arr):
    if len(arr) <= 1:
        return arr

    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]

    return quicksort(left) + middle + quicksort(right)
\`\`\`

**时间复杂度：** 平均 O(n log n)，最坏 O(n²)
**空间复杂度：** O(n)

选择中间元素作为 pivot 可以降低最坏情况出现的概率。如果需要原地排序以节省内存，可以使用 Lomuto 或 Hoare 分区方案。`,
      },
      {
        name: 'GPT-4o',
        badge: 'OpenAI',
        color: '#10a37f',
        avatar: '🟢',
        speed: 2.8,
        delay: 450,
        answer: `以下是 Python 快速排序的实现：

\`\`\`python
def quicksort(arr):
    """原地快速排序（Hoare分区）"""
    def partition(low, high):
        pivot = arr[(low + high) // 2]
        i, j = low - 1, high + 1
        while True:
            i += 1
            while arr[i] < pivot:
                i += 1
            j -= 1
            while arr[j] > pivot:
                j -= 1
            if i >= j:
                return j
            arr[i], arr[j] = arr[j], arr[i]

    def sort(low, high):
        if low < high:
            p = partition(low, high)
            sort(low, p)
            sort(p + 1, high)

    sort(0, len(arr) - 1)
    return arr

# 示例
print(quicksort([3, 6, 8, 10, 1, 2, 1]))
# 输出: [1, 1, 2, 3, 6, 8, 10]
\`\`\`

这个实现使用了 Hoare 分区方案，比 Lomuto 方案平均减少约 3 倍的交换操作。`,
      },
      {
        name: 'Gemini Pro',
        badge: 'Google',
        color: '#4285f4',
        avatar: '🔵',
        speed: 2.0,
        delay: 600,
        answer: `快速排序是最常用的排序算法之一。以下是 Python 实现：

\`\`\`python
import random

def quicksort(arr):
    if len(arr) <= 1:
        return arr

    # 随机选择 pivot 避免最坏情况
    pivot = random.choice(arr)

    less = [x for x in arr if x < pivot]
    equal = [x for x in arr if x == pivot]
    greater = [x for x in arr if x > pivot]

    return quicksort(less) + equal + quicksort(greater)

# 使用示例
data = [38, 27, 43, 3, 9, 82, 10]
sorted_data = quicksort(data)
print(sorted_data)  # [3, 9, 10, 27, 38, 43, 82]
\`\`\`

**要点：**
- 随机 pivot 使平均性能更稳定
- 列表推导式让代码更 Pythonic
- 平均时间复杂度 O(n log n)`,
      },
    ],
  },
  {
    id: 'react-hooks',
    question: '解释什么是 React Hooks，给一个实际例子',
    questionEn: 'Explain React Hooks with a practical example',
    // [completeness, codeQuality]
    qualityScores: [[90, 88], [85, 82], [78, 70]],
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        badge: 'Anthropic',
        color: '#c4a24d',
        avatar: '🟡',
        speed: 2.4,
        delay: 250,
        answer: `**React Hooks** 是 React 16.8 引入的特性，让你在函数组件中使用状态和副作用。

核心 Hooks：
- \`useState\` — 状态管理
- \`useEffect\` — 副作用（数据获取、DOM操作）
- \`useRef\` — 持久引用

实际例子 — 一个带搜索防抖的用户列表：

\`\`\`tsx
function UserSearch() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await fetch(\`/api/users?q=\${query}\`);
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    }, 300); // 300ms 防抖

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading ? <p>搜索中...</p> : users.map(u => <p key={u.id}>{u.name}</p>)}
    </div>
  );
}
\`\`\`

关键点：\`useEffect\` 的 cleanup 函数会在下次执行前清除定时器，实现防抖。`,
      },
      {
        name: 'GPT-4o',
        badge: 'OpenAI',
        color: '#10a37f',
        avatar: '🟢',
        speed: 2.6,
        delay: 400,
        answer: `## React Hooks 简介

Hooks 让你无需写 class 就能使用 React 的完整特性。它解决了三个问题：

1. **组件间复用状态逻辑** → 自定义 Hook
2. **复杂组件难以理解** → 按功能拆分 Effect
3. **class 的 this 问题** → 函数组件更直观

### 实际例子：Dark Mode 切换

\`\`\`tsx
// 自定义 Hook
function useDarkMode() {
  const [dark, setDark] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark] as const;
}

// 使用
function App() {
  const [dark, setDark] = useDarkMode();
  return <button onClick={() => setDark(!dark)}>
    {dark ? '☀️' : '🌙'}
  </button>;
}
\`\`\`

自定义 Hook 以 \`use\` 开头，可以在多个组件中复用。`,
      },
      {
        name: 'Gemini Pro',
        badge: 'Google',
        color: '#4285f4',
        avatar: '🔵',
        speed: 1.8,
        delay: 550,
        answer: `**React Hooks** 是 React 的核心 API，用于在函数组件中管理状态和生命周期。

| Hook | 用途 |
|------|------|
| useState | 组件内状态 |
| useEffect | 副作用管理 |
| useContext | 跨组件数据共享 |
| useMemo | 计算缓存 |
| useCallback | 函数缓存 |

### 计数器 + 文档标题同步

\`\`\`tsx
function Counter() {
  const [count, setCount] = useState(0);

  // 每次 count 变化，更新页面标题
  useEffect(() => {
    document.title = \`点击了 \${count} 次\`;

    return () => {
      document.title = 'React App'; // 清理
    };
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
\`\`\`

**规则：** Hooks 只能在组件顶层调用，不能在条件/循环中使用。`,
      },
    ],
  },
  {
    id: 'sql-optimize',
    question: '帮我优化这段慢查询 SQL',
    questionEn: 'Help me optimize this slow SQL query',
    // [completeness, codeQuality]
    qualityScores: [[80, 78], [92, 90], [72, 65]],
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        badge: 'Anthropic',
        color: '#c4a24d',
        avatar: '🟡',
        speed: 2.0,
        delay: 350,
        answer: `分析你的慢查询，以下是优化建议：

**原查询问题：**
\`\`\`sql
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > '2024-01-01'
ORDER BY o.total DESC
LIMIT 100;
\`\`\`

**优化后：**
\`\`\`sql
SELECT o.id, o.total, o.created_at,
       u.name, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > '2024-01-01'
ORDER BY o.total DESC
LIMIT 100;
\`\`\`

**关键优化：**

1. **避免 SELECT *** — 只查需要的列，减少 I/O
2. **添加复合索引：**
\`\`\`sql
CREATE INDEX idx_orders_date_total
ON orders(created_at, total DESC);
\`\`\`
3. **确保 JOIN 列有索引** — user_id 应为外键索引
4. 如果数据量大，考虑**分区表**按月分区 created_at

优化后预计查询时间从 2.3s → 50ms。`,
      },
      {
        name: 'GPT-4o',
        badge: 'OpenAI',
        color: '#10a37f',
        avatar: '🟢',
        speed: 2.5,
        delay: 300,
        answer: `让我帮你分析和优化。先看执行计划：

\`\`\`sql
EXPLAIN ANALYZE
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > '2024-01-01'
ORDER BY o.total DESC LIMIT 100;
\`\`\`

**发现的问题：**
- Full table scan on orders (Seq Scan)
- Sort on disk (external merge sort)
- Nested loop join without index

**优化方案：**

\`\`\`sql
-- 1. 覆盖索引（最关键）
CREATE INDEX idx_orders_covering
ON orders(created_at, total DESC)
INCLUDE (user_id);

-- 2. 优化查询
SELECT o.id, o.total, o.created_at,
       u.name, u.email
FROM orders o
INNER JOIN users u ON o.user_id = u.id
WHERE o.created_at >= '2024-01-01'
ORDER BY o.total DESC
LIMIT 100;
\`\`\`

**效果对比：**
| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| 扫描行数 | 5M | 12K |
| 排序 | 磁盘 | 索引 |
| 耗时 | 2.3s | 35ms |`,
      },
      {
        name: 'Gemini Pro',
        badge: 'Google',
        color: '#4285f4',
        avatar: '🔵',
        speed: 1.9,
        delay: 500,
        answer: `SQL 优化的核心是**减少扫描行数**和**避免文件排序**。

**你的查询存在以下问题：**

1. \`SELECT *\` 读取所有列
2. 缺少合适的索引
3. ORDER BY 触发了 filesort

**建议的索引策略：**

\`\`\`sql
-- 最优索引
ALTER TABLE orders
ADD INDEX idx_created_total (created_at, total);

-- 确保外键索引
ALTER TABLE orders
ADD INDEX idx_user_id (user_id);
\`\`\`

**重写查询：**

\`\`\`sql
SELECT o.id, o.total, o.created_at,
       u.name, u.email
FROM orders o
INNER JOIN users u USING (user_id)
WHERE o.created_at >= '2024-01-01'
ORDER BY o.total DESC
LIMIT 100;
\`\`\`

**额外建议：**
- 定期 ANALYZE TABLE 更新统计信息
- 考虑 created_at 的时间分区
- 对于热点查询，可使用 Redis 缓存结果`,
      },
    ],
  },
];

export default arenaQuestions;
