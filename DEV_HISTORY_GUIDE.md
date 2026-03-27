# Dev History Page 维护指南

## 这是什么？

`/dev-history` 页面展示项目从第一个 commit 到现在的成长历程。每次有新功能合并到 main 时，需要同步更新这个页面的数据。

## 数据在哪里？

文件路径：`src/pages/DevHistoryPage.tsx`

页面顶部的 `commits` 数组就是所有数据来源，每个条目代表一个里程碑：

```typescript
{
  hash: 'd2da8ef',           // git commit hash（前 7 位）
  date: 'Mar 19 · 21:23',    // 提交时间（显示用）
  dateShort: '3/19 PM',      // 图表 X 轴标签
  label: '01',               // 序号
  title: 'The Big Bang',     // 英文标题
  titleZh: '大爆炸',          // 中文标题
  desc: 'Complete AI...',    // 英文描述（1-2 句话）
  descZh: '一次提交完成...',  // 中文描述
  tags: ['Design System'],   // 技术标签（2-4 个）
  milestone: true,           // 是否在图表中标注为里程碑
  lines: 10792,              // 截止到此 commit 的总代码行数
  components: 36,            // src/components/ 下 .tsx 文件数
  pages: 6,                  // src/pages/ 下文件数
  dataFiles: 12,             // src/data/ 下文件数
  totalFiles: 74,            // src/ 下总文件数
  color: '#06b6d4',          // 时间轴节点颜色
  highlight: true,           // 是否高亮显示（重要节点设为 true）
}
```

## 如何添加新条目

### 1. 获取统计数据

在项目根目录运行：

```bash
# 总代码行数（.ts + .tsx + .css 文件）
find src -name '*.tsx' -o -name '*.ts' -o -name '*.css' | xargs cat | wc -l

# 组件数
find src/components -name '*.tsx' | wc -l

# 页面数
find src/pages -name '*.tsx' | wc -l

# 数据文件数
find src/data -type f | wc -l

# 总文件数
find src -type f | wc -l

# 最近 commit hash
git log --oneline -1
```

### 2. 在 commits 数组末尾添加条目

打开 `src/pages/DevHistoryPage.tsx`，在 `commits` 数组最后一个 `},` 之后、`];` 之前添加新条目。

**注意：**
- `label` 序号递增（上一个是 `'14'`，下一个就是 `'15'`）
- `milestone` 和 `highlight`：重要功能设为 `true`，小修小补设为 `false`
- `color` 从以下色板中选一个没在相邻节点用过的：
  - 青色 `#06b6d4` / 紫色 `#8b5cf6` / 绿色 `#10b981` / 琥珀 `#f59e0b`
  - 粉色 `#ec4899` / 蓝色 `#3b82f6` / 橙色 `#f97316` / 红色 `#ef4444`

### 3. 更新页面副标题

搜索页面中的提交次数和天数描述，更新为最新数字：

```typescript
// 搜索这段文字，更新数字
'15 次提交 · 8 天 · 从一个空白模板到完整的数据可视化项目'
'15 commits · 8 days · From a blank template to a full data visualization project'
```

### 4. 验证

```bash
npm run build
```

确保 build 通过，没有 TypeScript 错误。

## 工作流

当你在自己的 feature 分支上开发完一个新页面/功能后：

1. 在你的 feature 分支中同时更新 `DevHistoryPage.tsx`
2. 提交时把 DevHistoryPage 的改动和你的功能一起提交
3. 创建 PR 合并到 main

这样每个 feature 合并后，dev-history 页面自动就是最新的。

## 示例

假设你刚完成了一个新的 "Timeline" 页面，commit hash 是 `abc1234`：

```typescript
{
  hash: 'abc1234',
  date: 'Mar 28 · 14:00',
  dateShort: '3/28',
  label: '15',
  title: 'Interactive Timeline',
  titleZh: '交互式时间线',
  desc: 'New /timeline page with drag-to-explore historical events.',
  descZh: '新增 /timeline 页面，拖拽探索历史事件。',
  tags: ['Timeline', 'Drag', 'Canvas'],
  milestone: true,
  lines: 20500,    // ← 运行统计命令获取
  components: 70,
  pages: 10,
  dataFiles: 14,
  totalFiles: 118,
  color: '#3b82f6',
  highlight: true,
},
```
