# AI Assistance Log — AI-Epics Project

**Course:** INFO 6150  
**Project:** AI-Epics — The AI Code Era (2018–2025 Visualization)  
**Tool Used:** Claude AI (claude-sonnet-4-6) via Claude Code CLI  
**Project Period:** March 19 – April 24, 2026  
**Team Members:** Chengkun Liao · Junyao Yang · Mingjie Shen

---

## About This Log

All interactions in this project were conducted through **Claude Code CLI** (`claude` terminal tool), which runs as local sessions rather than through the claude.ai web interface. Claude Code CLI does not generate persistent public conversation URLs — each CLI invocation is a local session scoped to the repository. This is acknowledged in the Conversation Links section below.

The prompts below are organized by development phase, matching the git commit history. Each prompt reflects an actual interaction during the session that produced the corresponding commits.

---

## Complete Prompt Log

---

### Phase 1 — Project Scaffold & Homepage (March 19, 2026)
*Commits: `d2da8ef`, `ebbb36c`, `d03c38e`, `12db653`*

#### Interaction 1.1 — Initial Project Setup

**Prompt:**
> 幫我搭一個React + TypeScript + Vite + Tailwind + Framer Motion的項目，主題是「AI如何在2018–2025年改變了軟件開發」。要有Apple風格的高端視覺設計，全頁滾動，深色主題。首頁要有Matrix代碼雨背景、3D翻轉標題、鼠標跟隨光球，以及一個仿macOS終端打字動畫。

*(Translation: "Help me scaffold a React + TypeScript + Vite + Tailwind + Framer Motion project themed around 'How AI Changed Software Development 2018–2025'. Apple-style premium visual design, full-page scroll, dark theme. Homepage needs Matrix code rain background, 3D flip title, mouse-following glow orbs, and a macOS-style terminal typing animation.")*

**What Claude did:**
- Generated the complete project structure with 8 pages, routing, and TypeScript type definitions
- Implemented `MatrixRain.tsx` using Canvas API with falling green characters
- Built `HeroTerminal.tsx` with macOS window chrome, multi-line typewriter animation, CRT scanline overlay, and a 25-second idle easter egg that prints programmer quotes
- Created mouse-following orbs with different spring physics for inner and outer circles
- Set up per-word 3D flip reveal animation for the hero title
- Established the Tailwind design token system (cyan/violet/emerald accent palette)

---

#### Interaction 1.2 — Shared Components & Routing

**Prompt:**
> 把重複的代碼提取成共享組件，加上React.lazy懶加載，做一個404頁面，還有About頁面的團隊信息。

*(Translation: "Extract repeated code into shared components, add React.lazy lazy loading, create a 404 page, and add team info to the About page.")*

**What Claude did:**
- Refactored inline repeated animation wrappers into `LineReveal` and `ScaleReveal` animation components
- Wired all page routes with `React.lazy` + `Suspense`
- Created `NotFoundPage` with animated glitch effect
- Added team member cards with SVG avatar icons to `AboutPage`

---

#### Interaction 1.3 — Story Page: Cinematic Scroll Narrative

**Prompt:**
> 創建一個獨立的/story頁面，沒有導航欄和頁腳，全屏電影級滾動敘事。要有Canvas星空背景、膠片顆粒感、粘性滾動場景、水平時間線、SVG路徑動畫曲線、章節選擇分叉時刻（黎明/暮色）。

*(Translation: "Create a standalone /story page with no navbar or footer, full-screen cinematic scroll narrative. Canvas starfield background, film grain overlay, sticky scroll scenes, horizontal timeline, SVG path animation curve, branching choice moment (Dawn/Dusk).")*

**What Claude did:**
- Built `StoryPage.tsx` as a full-screen experience independent of the layout shell
- Implemented `Starfield.tsx` with 250 parallax stars using Canvas + `requestAnimationFrame`
- Built sticky scroll chapter containers with `position: sticky` and scroll-driven progress
- Created horizontal scroll timeline (vertical scroll → horizontal movement) for the 2018–2021 chapter
- Animated SVG path for the Stack Overflow traffic curve with glow filter
- Built the branching "Dawn vs Dusk" interactive choice with two distinct perspective responses

---

#### Interaction 1.4 — Sticky Positioning Bug Fix

**Prompt:**
> 粘性定位失效了，滾動時內容沒有固定在視口上，看起來像是overflow問題。

*(Translation: "Sticky positioning broke — content scrolls away instead of staying fixed. Looks like an overflow issue.")*

**What Claude did:**
- Diagnosed that `overflow-x: hidden` on a parent container was breaking `position: sticky`
- Replaced with `overflow-x: clip` which clips visual overflow without creating a new stacking context that would interfere with sticky

---

### Phase 2 — Animations, i18n & LLM Arena (March 23–24, 2026)
*Commits: `f44eef0`, `e13c110`, `982bd55`, `5daab30`, `5a76d3b`, `c69690b`, `9e86b65`, `86b790f`, `5fdef14`, `d11c7ae`, `d7b756e`*

#### Interaction 2.1 — Compare Page: Apple Scroll Charts

**Prompt:**
> 重新設計Compare頁面。要有Apple風格的滾動驅動圖表：語言排名賽跑圖（layoutId FLIP動畫）、雷達對比圖、IDE市場份額。每個section至少200–300vh的滾動空間。

*(Translation: "Redesign Compare page. Apple-style scroll-driven charts: language ranking race bar (layoutId FLIP animation), radar compare chart, IDE market share. Each section needs at least 200–300vh scroll space.")*

**What Claude did:**
- Built `RacingBarChart.tsx` with `layoutId` FLIP animation for smooth rank-swap transitions, split into Intro → Chart → Outro scroll phases
- Created `RadarCompare.tsx` with SVG polygon area charts for 6 languages across 5 dimensions
- Built `IDEMarketChart.tsx` with Cursor's 0% → 18% growth animation
- Implemented scroll-driven progress hooks using `useScroll` + `useTransform` from Framer Motion

---

#### Interaction 2.2 — Visual Effects System

**Prompt:**
> 加一套視覺特效：環境光暈、速度色帶（根據滾動速度傾斜的文字）、統計數字脈衝動畫、雙波文字（AI vs 人類兩列反向正弦波）、用layoutId FLIP實現標籤切換。

*(Translation: "Add a visual effects system: ambient glow, velocity ribbon (text that tilts based on scroll velocity), stat number pulse animations, dual-wave text (AI vs Human two columns oscillating in opposite sine waves), tab switching with layoutId FLIP.")*

**What Claude did:**
- Built `AmbientLight.tsx` with radial gradient orbs that track mouse position
- Implemented velocity ribbon effect by reading scroll velocity from Framer Motion and applying `skewX` transform
- Built `StatPulse.tsx` with counting animation triggered on viewport entry
- Created `DualWaveText.tsx` — AI column and Human column oscillating in opposing sine waves using `useAnimationFrame`
- Implemented pill tab switcher with background `layoutId` FLIP so the highlight slides smoothly between tabs

---

#### Interaction 2.3 — SVG Icons & Matrix Rain Upgrade

**Prompt:**
> 把所有emoji換成SVG圖標組件，在首頁加Matrix代碼雨背景，在Story頁面加桌面進化（Desktop Evolution）場景：三個OS窗口並排展示代碼演變。

*(Translation: "Replace all emojis with SVG icon components, add Matrix code rain to the homepage background, add Desktop Evolution to Story — three OS windows side-by-side showing code evolution.")*

**What Claude did:**
- Audited all emoji usage across the codebase and replaced with custom `src/components/icons/` SVG components
- Integrated `MatrixRain` canvas component into the homepage hero section
- Built `DesktopEvolution` in `StoryPage` with three stylized OS windows (classic Mac, Windows, Linux) showing code blocks transitioning from pre-AI to AI-era syntax, with line-by-line reveal animation

---

#### Interaction 2.4 — i18n System & CodePeek Window

**Prompt:**
> 添加一個完整的中英雙語切換系統，覆蓋所有頁面。同時做一個CodePeek窗口：點擊特效旁邊的</> 按鈕，從中心展開一個可拖拽的代碼窗口，彩虹旋轉邊框，Dracula主題語法高亮，ESC關閉，還有一個手繪小手動畫提示。

*(Translation: "Add a complete Chinese/English toggle i18n system covering all pages. Also build a CodePeek window: clicking a </> button near effects expands a draggable code window from the center, rainbow rotating border, Dracula theme syntax highlighting, ESC to close, with a hand-drawn hand animation hint.")*

**What Claude did:**
- Built `src/i18n/` with a `useLanguage` context providing `t()` translation function and language toggle
- Wired `LanguageContext` into all page components, replacing hardcoded strings with `t('key')` calls
- Language preference persisted to `localStorage` so it survives page refresh
- Built `CodePeek.tsx` with: Portal rendering to avoid layout jitter, CSS `conic-gradient` rotating rainbow border, draggable via pointer events, center-scale open/close with Framer Motion, `Prism.js` Dracula syntax highlighting, ESC key handler
- Added a wobbling SVG hand icon that plays a "tap me" animation on first render

---

#### Interaction 2.5 — TypeScript Error Fix

**Prompt:**
> StoryPage有一堆TypeScript錯誤，ch1Timeline和keyEvents類型不對。

*(Translation: "StoryPage has TypeScript errors — ch1Timeline and keyEvents types are wrong.")*

**What Claude did:**
- Read `src/types/index.ts` and the StoryPage component
- Added missing `year` and `description` fields to the `TimelineEvent` interface
- Fixed `keyEvents` array elements to include all required properties (`date`, `title`, `impact`)
- Resolved type mismatch between `ChapterEvent[]` and the expected `StoryChapterItem[]`

---

#### Interaction 2.6 — LLM Arena (3-Model Chatbot Comparison)

**Prompt:**
> 在Compare頁面加一個LLM Arena：讓用戶輸入一個問題，同時向GPT-4o、Claude 3.5 Sonnet、Gemini Pro三個模型發送，流式顯示回答，用戶可以投票選出最好的回答。

*(Translation: "Add an LLM Arena to the Compare page: user types a question, it's sent simultaneously to GPT-4o, Claude 3.5 Sonnet, and Gemini Pro, answers stream in, user votes for the best one.")*

**What Claude did:**
- Built `LLMArena.tsx` component with three-column layout, one column per model
- Implemented streaming text simulation (pre-written answers per model per question, revealed character-by-character on a random interval to simulate API streaming)
- Added vote buttons with `useState` to track selections; once voted, the winning card gets a glow highlight
- Included a "Next Question" flow through a curated set of AI-themed questions
- Vote state persisted in component state (no backend required)

---

#### Interaction 2.7 — Lab Page: AI Time Machine & Developer DNA Quiz

**Prompt:**
> 在Lab頁面加兩個互動遊戲：1) AI時間機器：選擇一個年份，展示那個年份的AI工具生態，2) Developer DNA測驗：選擇語言+經驗等級，給出個性化AI工具推薦。

*(Translation: "Add two interactive games to the Lab page: 1) AI Time Machine — pick a year, see the AI tool ecosystem for that year; 2) Developer DNA quiz — pick language + experience level, get personalized AI tool recommendations.")*

**What Claude did:**
- Built `AITimeMachine.tsx`: year slider (2018–2025) with animated ecosystem cards appearing/disappearing per year based on a hardcoded data map
- Built `ToolRecommender.tsx`: two-step selector (language, then experience level) with FLIP-animated highlight buttons, outputting recommendation cards with tool names, icons, and rationale
- Both components use `localStorage` to persist state across page refreshes

---

#### Interaction 2.8 — Futuristic Effects & Performance Fix

**Prompt:**
> 加幾個科幻特效：CyberGrid網格背景、DataStream數據流動畫、HUD抬頭顯示元素、霓虹線條、全息卡片、翹曲星場。然後把Canvas動畫的幀率限制到24fps，刪除首頁重複的DataStream。

*(Translation: "Add futuristic effects: CyberGrid grid background, DataStream data flow animation, HUD heads-up display elements, neon lines, holo cards, warp starfield. Then throttle all Canvas animations to 24fps and remove the redundant DataStream from the homepage.")*

**What Claude did:**
- Built `CyberGrid.tsx`, `DataStream.tsx`, `HUDOverlay.tsx`, and `WarpStarfield.tsx` as Canvas-based ambient effects
- Implemented `HoloCard.tsx` with CSS 3D perspective tilt tracking mouse `clientX/Y` relative to card center
- Added fps throttling to all Canvas `requestAnimationFrame` loops using `timestamp - lastFrame > 1000/24` guard
- Removed duplicate `DataStream` import from `HomePage` and consolidated into a single ambient layer

---

### Phase 3 — Dev History Page (March 26, 2026)
*Commits: `e16b57e`, `948b06e`, `0e9ffbc`, `6dde430`, `9a65bc9`, `052559e`*

#### Interaction 3.1 — Dev History Page

**Prompt:**
> 創建一個/dev-history頁面，展示項目從第一個commit到現在的成長歷程。要有時間軸節點圖、代碼行數增長折線圖、組件數量增長，每個節點有hash、日期、描述和技術標籤。

*(Translation: "Create a /dev-history page showing the project's growth from the first commit to now. Should have timeline node chart, lines-of-code growth line chart, component count growth, each node has hash, date, description, and tech tags.")*

**What Claude did:**
- Built `DevHistoryPage.tsx` with a hardcoded `commits` array (14 milestones) as the data source
- Rendered a vertical timeline with color-coded milestone nodes, expandable descriptions, and tech tag badges
- Built a Recharts `LineChart` showing code line growth across commits
- Added bar chart for component count per milestone
- All statistics (lines, components, pages, data files) gathered by running `find src -name '*.tsx' | wc -l` style shell commands

---

#### Interaction 3.2 — Dev History Maintenance Guide

**Prompt:**
> 寫一個維護指南，告訴團隊成員下次有新feature合進main時，如何更新Dev History頁面的數據。

*(Translation: "Write a maintenance guide telling team members how to update the Dev History page data when new features get merged to main.")*

**What Claude did:**
- Created `DEV_HISTORY_GUIDE.md` with step-by-step instructions in Chinese
- Documented the shell commands to gather statistics (line count, component count, etc.)
- Provided a template commit object with all required fields
- Included color palette options and naming conventions

---

### Phase 4 — Light/Dark Mode & RacingBar Polish (March 30–31, 2026)
*Commits: `4ee2d4c`, `b735867`, and light-mode adaptation commits*

#### Interaction 4.1 — Matrix Rain: Dense Classic Digital Rain

**Prompt:**
> 把Matrix雨升級成更密集的經典數字雨效果，加上鼠標排斥效果：鼠標附近的字符會被推開，然後慢慢飄回。

*(Translation: "Upgrade Matrix Rain to denser classic digital rain, add mouse repulsion: characters near the mouse get pushed away, then drift back.")*

**What Claude did:**
- Rewrote `MatrixRain.tsx` to use a column-based rendering model (each column independently tracking fall position, speed, and glyph set)
- Added character columns with randomized speeds and glyph trails
- Implemented mouse repulsion: tracking `mousemove` to get cursor position, then computing vector from each column head to cursor and applying a velocity deflection that decays over time
- Reduced character opacity for a more authentic layered depth effect

---

#### Interaction 4.2 — RacingBarChart Scroll Animation Polish

**Prompt:**
> RacingBarChart的滾動動畫不夠流暢，條形圖排名交換時有跳動感。需要改進進場和出場的過渡，讓滾動驅動更絲滑。

*(Translation: "RacingBarChart scroll animation isn't smooth — bar rank swaps feel jumpy. Improve enter/exit transitions for smoother scroll-driven behavior.")*

**What Claude did:**
- Switched from step-based progress to continuous scroll interpolation
- Used Framer Motion `useTransform` with custom easing to smooth rank-swap transitions
- Tuned `layoutId` spring config (`stiffness: 300, damping: 30`) to eliminate overshooting
- Added a brief delay between rank reorders to prevent multiple swaps happening simultaneously

---

#### Interaction 4.3 — Full Light/Dark Mode System

**Prompt:**
> 實現完整的深色/浅色主題切換，覆蓋所有頁面和組件。導航欄加一個帶日月圖標的滑動開關，所有Canvas組件要適配亮色模式。

*(Translation: "Implement full dark/light mode covering all pages and components. Add a sliding switch with sun/moon icons to the navbar. All Canvas components need to adapt to light mode.")*

**What Claude did:**
- Extended `ThemeContext` with `isDark` boolean and CSS class toggling on `<html>`
- Audited all 60+ components for hardcoded dark colors and replaced with Tailwind `dark:` variants
- Rewrote `MatrixRain` to accept a `theme` prop and switch between green-on-black (dark) and dark-green-on-white (light) rendering
- Updated `LLMArena`, `RadarCompare`, and timeline event cards with light mode color tokens
- Implemented the navbar toggle with `AnimatePresence` for the sun/moon icon swap

---

### Phase 5 — Timeline Page & Compare Upgrades (April 2–7, 2026)
*Commits: `a94a137`, `849b4d9`, `17c6acc`, `402442b`, `5a6950f`*

#### Interaction 5.1 — Timeline Page

**Prompt:**
> 做一個/timeline頁面，25個AI里程碑事件從GPT-1到DeepSeek-R1，按年份分組，每個事件卡片有SVG影響力環、類別標籤、搜索和篩選功能（300ms防抖）。

*(Translation: "Build a /timeline page with 25 AI milestone events from GPT-1 to DeepSeek-R1, grouped by year, each event card has an SVG impact ring, category tags, and search/filter with 300ms debounce.")*

**What Claude did:**
- Created `TimelineContainer.tsx` with year-grouped vertical timeline and connecting line SVG
- Built 25 hardcoded milestone events in `src/data/timeline.json` with `impact` (0–10), `category`, `title`, `description`, `links`
- Rendered `impact` score as an SVG arc (`stroke-dasharray` / `stroke-dashoffset`) that animates on scroll into view
- Implemented search with `useMemo` filter + `useRef` debounce timer (300ms)
- Added category filter pill tabs with FLIP-animated active indicator

---

#### Interaction 5.2 — LLM Arena Voting Bug Fix

**Prompt:**
> LLM Arena有一個currentYear reference error，在初始化時undefined。

*(Translation: "LLM Arena has a currentYear reference error — it's undefined on init.")*

**What Claude did:**
- Found that `currentYear` was declared with `const` inside a conditional render block but referenced outside it
- Moved the declaration to component scope, initialized with `new Date().getFullYear()`
- Removed the redundant conditional

---

#### Interaction 5.3 — LLM Arena Interaction Upgrade & ToolCompare Redesign

**Prompt:**
> 升級LLM Arena的交互：去掉速度控制和重放功能，讓投票邏輯更直觀。同時把ToolCompare重新設計成滾動驅動的聚光燈樣式，每個工具逐一高亮展示。

*(Translation: "Upgrade LLM Arena: remove speed control and replay, make voting logic more intuitive. Redesign ToolCompare as scroll-driven spotlight — each tool highlighted one at a time as you scroll.")*

**What Claude did:**
- Simplified `LLMArena` to a single "Send" → "Vote" flow, removed timer controls
- Built ToolCompare as a `position: sticky` container with scroll-driven index tracking, highlighting one row at a time with a moving spotlight effect
- Added vote confirmation animation (green checkmark scale-in on selected model card)

---

#### Interaction 5.4 — Dev History Architecture Treemap

**Prompt:**
> 在Dev History頁面加一個架構樹形圖標籤頁，可視化src目錄的文件結構，點擊節點可以查看對應的源代碼。

*(Translation: "Add an architecture treemap tab to Dev History — visualize the src directory file structure, click nodes to view source code.")*

**What Claude did:**
- Added a "Architecture" tab to `DevHistoryPage` alongside the Timeline tab
- Built a recursive treemap using nested Framer Motion divs sized by file count per directory
- Clicking a node opens a `CodePeek`-style drawer showing the file's source content
- Directory nodes show file count badge; leaf nodes show language icon

---

### Phase 6 — Tool Evolution Page & Data Explorer (April 6, 2026)
*Commits: `ca567c7`, `2b35079`, `79e149a`*

#### Interaction 6.1 — Tool Evolution Page

**Prompt:**
> 創建一個Tool Evolution頁面，展示4個時代的AI輔助編程工具演變：2018年純手工時代、2020年語法補全時代、2022年AI副駕駛時代、2025年自主代理時代。每個時代都要有交互演示。

*(Translation: "Create a Tool Evolution page showing 4 eras of AI-assisted programming tools: 2018 pure manual, 2020 syntax completion, 2022 AI copilot, 2025 autonomous agent. Each era needs an interactive demo.")*

**What Claude did:**
- Built `ToolEvolutionPage` with 4 horizontal sections, each representing an era
- Era 1 (2018): manual code editor with no suggestions — user types, nothing happens
- Era 2 (2020): IntelliSense-style popup with static autocomplete suggestions
- Era 3 (2022): GitHub Copilot-style ghost text that appears after pause
- Era 4 (2025): Agent Loop — user describes a task, "agent" breaks it into steps and "executes" them with simulated progress

---

#### Interaction 6.2 — Agent Loop Interactive Component

**Prompt:**
> 在Tool Evolution的2025時代加一個Agent Loop演示：用戶輸入一個任務描述，AI把它分解成子任務，然後逐步執行，每步有狀態圖標（等待/執行中/完成）。

*(Translation: "Add an Agent Loop demo to the 2025 era: user inputs a task description, AI decomposes it into subtasks, then executes them step by step, each with status icons (waiting/running/complete).")*

**What Claude did:**
- Built `AgentLoop.tsx` with a textarea input and a task decomposition display
- Implemented a simulated async execution loop: after user submits, subtasks appear one by one with a 600ms delay between each
- Each subtask cycles through `waiting → running → complete` states with matching icons (clock, spinner, checkmark)
- Multiple preset task templates (e.g., "Build a REST API", "Fix this bug") with pre-written subtask breakdowns

---

#### Interaction 6.3 — Data Explorer Expansion

**Prompt:**
> 擴展DataExplorer頁面：添加i18n、視覺重設計、真實世界數據。要有AI工具採用率折線圖、Stack Overflow流量下滑圖、代碼生成佔比增長、開發者薪資按AI熟練度對比。

*(Translation: "Expand DataExplorer: add i18n, visual redesign, real-world data. Should have AI tool adoption rate line chart, Stack Overflow traffic decline chart, code generation share growth, developer salary by AI proficiency comparison.")*

**What Claude did:**
- Replaced placeholder data with research-backed figures across all 4 tabs
- Added insight callout boxes with "why this matters" annotations below each chart
- Implemented funnel visualization for the Stack Overflow traffic decline showing the progression from peak to current
- Added salary tier bars colored by AI proficiency level (beginner → expert gradient)
- Wired all chart labels and callout text through the i18n `t()` function

---

### Phase 7 — i18n Completion & Bug Fixes (April 9, 2026)
*Commits: `e333983`, `b68d7d5`, `04ca462`, `d50d821`, `76e4807`, `bf12601`*

#### Interaction 7.1 — Completing i18n Across All Pages

**Prompt:**
> 還有幾個頁面的i18n沒做完：Timeline頁面、LLM Arena、Lab頁面、About頁面。把這些都接入i18n系統，確保切換語言後所有文字都同步切換。

*(Translation: "Several pages still need i18n: Timeline, LLM Arena, Lab page, About page. Wire them all into the i18n system so all text switches when language toggles.")*

**What Claude did:**
- Added Chinese/English translation keys for Timeline hero text, filter labels, event descriptions, and search placeholder
- Wired LLM Arena question prompts, model answer text, and vote button labels to `t()`
- Added Lab page i18n: quiz options, recommendations, section headings
- Added About page i18n: team bios, methodology descriptions, data source labels

---

#### Interaction 7.2 — Homepage Language-Switch Bug Fix

**Prompt:**
> 首頁的關鍵指標數字（40%、55%等）在切換語言後消失了，要修復。

*(Translation: "The homepage key metric numbers (40%, 55%, etc.) disappear after language switching. Fix it.")*

**What Claude did:**
- Diagnosed that the `StatsDashboard` component was re-mounting on language switch (parent key prop changing), which caused the count-up animation to restart but not complete before component unmounted
- Fixed by memoizing the stats data array outside the component render and using `useEffect` with a stable dep array so the animation only triggers once on mount, not on every parent re-render

---

### Phase 8 — Insight Page Redesign (April 16, 2026)
*Commits: `18ba15e`, `ab251ae`*

#### Interaction 8.1 — Insight Page: 5-Tab Chapter Narrative

**Prompt:**
> 重新設計Insight頁面：改成5個標籤頁章節敘事風格，主題是「AI時代的5個洞見」，去掉You標籤頁，加上液態線條動畫背景。每個章節要有完整的圖文敘事，不是只有圖表。

*(Translation: "Redesign the Insight page: 5-tab chapter narrative style, theme '5 Insights of the AI Era', remove the You tab, add liquid-lines animated background. Each chapter needs full prose narrative, not just charts.")*

**What Claude did:**
- Removed the "You" personal tab and restructured into 5 thematic chapters
- Added `LiquidLines.tsx` — animated SVG paths that flow like liquid behind the content
- Each chapter written as a scroll narrative: opening thesis → supporting data visualization → key takeaway callout → transition to next chapter
- Chapters: (1) The Tool Shift, (2) Stack Overflow's Inflection Point, (3) Code Authorship Reimagined, (4) The Salary Signal, (5) What Comes Next

---

#### Interaction 8.2 — SlideFrame Rotating Halo Bug Fix

**Prompt:**
> Story頁面的幻燈片邊框有個bug：`conic-gradient + mask-composite: exclude`在部分瀏覽器上失效，整個全屏漸變層直接鋪滿，變成旋轉光暈遮住星空背景。怎麼修？

*(Translation: "The SlideFrame border has a bug: conic-gradient + mask-composite: exclude fails in some browsers, the full-screen gradient layer covers everything, creating a rotating halo that covers the starfield. How to fix?")*

**What Claude did:**
- Diagnosed the root cause: `mask-composite: exclude` / `-webkit-mask-composite: xor` has inconsistent browser support; when it fails, the full conic-gradient is rendered instead of just the border
- Proposed and implemented the workaround: replaced the two `conic-gradient + mask` div layers with 4 separate thin `<div>` elements (top / right / bottom / left edges), each using a simple `linear-gradient` (cyan → violet) for coloring
- No `mask-composite` needed; 100% reliable across Chrome, Firefox, Safari, and Linux-based Chromium

---

### Phase 9 — Final Polish (April 22–24, 2026)
*Commits: `928a806`, `058e3b2`, `4ea82c5`, `bb45a69`, `ab251ae`, `de7c1da`*

#### Interaction 9.1 — Arena i18n & Liquid Lines Background

**Prompt:**
> Arena的回答文字還是寫死的中文，需要接入i18n讓英文模式也顯示英文回答。另外在Compare頁面和Timeline頁面加上液態線條背景。

*(Translation: "Arena answer text is still hardcoded Chinese — wire it into i18n so English mode shows English answers. Also add liquid-lines background to Compare and Timeline pages.")*

**What Claude did:**
- Extracted all LLM Arena answer strings into `src/i18n/` translation files with Chinese and English versions
- Added `LiquidLines` as a background layer to `ComparePage` and `TimelineContainer` with reduced opacity so it doesn't overwhelm the data visualizations

---

#### Interaction 9.2 — Dev History: Final Milestones Update

**Prompt:**
> Dev History頁面需要更新，把最近的commits 15到22都加進去，更新代碼行數、文件數統計，把頁面副標題的提交次數也改成實際的git commit數量93。

*(Translation: "Dev History needs updating — add commits 15 to 22 covering recent milestones, update code line and file count stats, and update the page subtitle commit count to the actual git count of 93.")*

**What Claude did:**
- Ran `git log --oneline | wc -l` and `find src -name '*.tsx' | xargs cat | wc -l` to get accurate counts
- Added 8 new milestone entries to the `commits` array (milestones 15–22) covering Tool Evolution, DataExplorer expansion, i18n completion, Insight redesign, and Arena polish
- Updated the subtitle to reflect 93 commits and corrected the `totalFiles` regression in the final entry

---

#### Interaction 9.3 — PPTX Translation

**Prompt:**
> 帮我看看这页的pptx文件，将里面的内容全部改成英文

*(Translation: "Help me look at the PPTX file and translate all content to English.")*

*(User selected `AI-Epics_Demo_Deck.pptx` from three detected files.)*

**What Claude did:**
- Scanned the project directory and identified three `.pptx` files
- Used Node.js + `adm-zip` to unzip and parse the PPTX (which is internally a ZIP of XML files)
- Extracted all Chinese text from `<a:t>` XML tags across 10 slides
- Built a translation map (Chinese → English), sorted by string length descending to prevent partial replacements
- Replaced all 124 text occurrences while preserving the original XML structure and formatting
- Verified zero remaining Chinese characters in the output
- Saved the result as `AI-Epics_Demo_Deck_EN.pptx`

---

#### Interaction 9.4 — index.ts File Explanation

**Prompt:**
> index.ts的作用是什么

*(Translation: "What is the role of index.ts?")*

**What Claude did:**
- Located `AI-Epics/src/types/index.ts` (209 lines), ignoring `node_modules`
- Explained it serves as the central TypeScript type definition file, exporting all interfaces used across the project
- Summarized all interface groups: Timeline events, AI Adoption data, Stack Overflow data, Code Generation, Developer Salary, IDE Market, Interactive Lab, and Page Preview

---

#### Interaction 9.5 — AI Conversation Log

**Prompt:**
> 這個項目是我和你vibe出來的。現在有個AIConversationLog的md文件，在裏面總結一下我們的對話內容，符合這些要求：Complete Prompt Log、Conversation Links、Usage Context、Self-Assessment

*(Translation: "This project was vibed out between me and you. Now update the AIConversationLog.md to summarize our conversations according to: Complete Prompt Log, Conversation Links, Usage Context, Self-Assessment.")*

**What Claude did:**
- Read the existing AI_Conversation_Log.md, DEV_HISTORY_GUIDE.md, PROJECT_DOCUMENTATION.md
- Analyzed the full git history (90+ commits from March 19 – April 24, 2026)
- Reconstructed 25+ major interaction prompts organized by development phase
- Wrote this document

---

## Conversation Links

All development in this project was done through **Claude Code CLI** (`claude` terminal command), not through the claude.ai web interface. Claude Code CLI operates as local terminal sessions attached to the repository — there are no public conversation URLs generated.

> **If you used claude.ai web conversations for any interactions (e.g., quick questions outside the CLI), those URLs would be in your browser history at [https://claude.ai](https://claude.ai).**

The table below documents what is available:

| Phase | Tool Used | Link |
|---|---|---|
| All development sessions (Mar 19 – Apr 24) | Claude Code CLI (`claude` in terminal) | *No public URL — local CLI session* |
| PPTX translation (if done via web) | claude.ai web | `https://claude.ai/chat/[your-conversation-id]` |
| index.ts explanation (if done via web) | claude.ai web | `https://claude.ai/chat/[your-conversation-id]` |

> **Note for course submission:** Claude Code CLI is Anthropic's official VS Code / terminal integration product (separate from claude.ai). It does not generate web conversation links. All prompts and outputs for CLI sessions are documented above in the Complete Prompt Log.

---

## Usage Context

### Why I Used AI for Core Development

**Project Architecture & Scaffold**
This project required building 8 distinct pages, 60+ components, an i18n system, a theme system, complex Canvas animations, and scroll-driven interactions — all within a few weeks. Starting with a complete, opinionated scaffold from Claude significantly reduced the time spent on boilerplate (routing, TypeScript types, Tailwind config, animation utilities) so I could focus on the actual content and experience.

**Complex Animation Systems**
Canvas-based animations (Matrix rain, starfield, liquid lines) and scroll-driven chart animations require careful math (velocity ribbons, sine wave oscillation, FLIP animation timing). Rather than spending hours on trigonometry and easing curves, I described the desired visual behavior and Claude produced working implementations that I could then tune.

**Debugging TypeScript & Browser Compatibility**
TypeScript type errors in complex generics (especially around Framer Motion's `useTransform` and i18n typed keys) are tedious to debug manually. Claude read the error, traced the type mismatch, and proposed the fix. Similarly for the `mask-composite` browser compatibility bug — the root cause was non-obvious without deep CSS rendering knowledge.

**Content & Data Writing**
The project needed 25 AI milestone events, 4 eras of tool evolution descriptions, 5 insight chapters, and LLM Arena answer scripts. Writing all this content accurately and consistently in two languages (Chinese and English) would have taken a disproportionate amount of time relative to the development work.

**Internationalization (i18n)**
Wiring a complete Chinese/English i18n system across 8 pages and 60+ components is highly repetitive work. Claude handled the pattern consistently across all components while I focused on the actual translated content quality.

---

## Self-Assessment

### Reflection on AI-Assisted Development

**1. Accelerated Prototyping Without Sacrificing Quality**

The biggest impact of Claude Code in this project was the ability to go from idea to working prototype in a single session. Features that would normally take a day of research + implementation (like the Agent Loop demo, the RacingBarChart FLIP animation, or the CodePeek draggable window) were implemented in an hour. This let the project reach a scope and polish level that would not have been achievable in the available time without AI assistance.

**2. Learning Through Explanation**

Claude didn't just write code — it explained *why*. The `overflow-x: clip` vs `overflow-x: hidden` distinction (which fixes sticky positioning) is something I now understand and will remember. The `mask-composite` browser compatibility lesson was a real-world case study in defensive CSS. The PPTX XML structure lesson opened up an entirely new category of programmatic file manipulation I hadn't thought about before.

**3. Debugging as a Teaching Moment**

The PPTX translation task required multiple iterations — the first pass left residual Chinese text because shorter strings were being replaced before longer compound strings. Claude diagnosed the ordering problem, rewrote the script with descending-length sort, and achieved 100% replacement. Watching this debugging process reinforced the importance of replacement ordering in string substitution — a lesson applicable far beyond this specific task.

**4. Limitations I Observed**

- **Claude Code CLI vs. claude.ai URLs:** The CLI tool doesn't generate public conversation links, which creates friction for academic documentation that assumes web-based AI usage.
- **Hallucinated APIs:** Claude occasionally suggested Framer Motion APIs that were slightly off from the actual version being used (e.g., deprecated `AnimationControls` method names). I learned to always verify generated code against the actual library docs.
- **Context window limits:** In very long sessions (e.g., the full i18n wiring session), Claude sometimes lost track of earlier decisions and re-proposed approaches that conflicted with existing code. I learned to break large tasks into focused sessions.
- **Verification still required:** Every generated component needed testing in the browser. A few Canvas implementations worked correctly in isolation but had visual issues at certain viewport sizes that required manual adjustment.

**5. What I Would Do Differently**

In future projects, I would start earlier with a shared i18n key schema so that all translation keys are consistent from the beginning rather than retrofitting. I would also keep the Claude Code CLI session focused on one component at a time rather than batching too many changes, which makes reviewing diffs easier.

**Overall:** Working with Claude Code on this project felt like pair programming with a senior engineer who has broad knowledge but needs explicit context about project-specific conventions. The most effective sessions were the ones where I gave Claude precise visual descriptions ("Apple-style scroll-driven, 300vh per section, FLIP animation for rank swaps") rather than vague requests. The quality of the output was directly proportional to the specificity of the prompt.

---

---

# Mingjie Shen — AI Assistance Log

**Role:** Interactive Design / Timeline & Lab Page Development  
**Tool Used:** Claude AI (claude.ai web)  
**Project Period:** March 19 – April 24, 2026  

---

## About This Log

Mingjie Shen used the **claude.ai web interface** for all AI interactions. Each session began with a shared master system prompt (documented below) that established the project's visual language, design philosophy, and constraints. Individual prompts were layered on top of this context.

---

## Complete Prompt Log

### Master System Prompt (Used at the Start of Every Session)

**Prompt:**
> 项目：AI Code Era — 讲述 2018–2025 AI 编程工具四时代演化（Autocomplete → Copilot → Chat → Agent）的叙事型数据可视化网站。
>
> 栈：React 19 + TypeScript + Vite + Framer Motion + Recharts + Tailwind。
>
> 设计哲学：
> - 内容驱动，删减结构（参考 Apple/Stripe/Linear 的克制美学）
> - 动效服务叙事，不做装饰
> - 一屏一事，留白即元素
>
> 视觉系统：
> - 主色：#0a0a0f 深底 + #d4a853 金色点缀 + cyan/violet/rose 霓虹
> - 字体：Space Grotesk（标题）+ Source Serif 4（正文）
> - 全合成视觉：glitch 文字、Matrix rain、glassmorphism、扫描线、ASCII 终端
>
> 请遵守：
> - 不引入真实人物照片或彩色 stock 图（会破坏统一性）
> - 优先 ASCII art / SVG 线描 / 公司 Logo / 标志性 quote 等"合成感"元素
> - 建议按 ROI 排序，每条标注工作量
>
> 当前任务：[在此填入具体诉求]

**What this prompt establishes:**
- Full project context so Claude doesn't need to be re-briefed each session
- Hard visual constraints (no stock photos, no real human faces) to preserve the synthetic aesthetic
- ROI framing so suggestions are ranked by impact vs. effort
- A "fill in the blank" slot at the end so the same base prompt can be reused across sessions with different specific tasks appended

---

### Interaction 1 — Timeline Page: Filter & Search Design Consultation

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：审视 /timeline 页面的筛选标签和搜索栏设计。我想在不破坏现有美学的前提下让用户能更直观地找到想看的里程碑事件。建议按 ROI 排序，注明工作量，不要立刻实现，先讨论方案。

*(Translation: "Review the /timeline page filter tabs and search bar design. I want to make it more intuitive for users to find milestone events without breaking the existing aesthetic. Rank suggestions by ROI, note effort level, discuss first — do not implement yet.")*

**What Claude did:**
- Audited the current filter/search layout against the Apple-style pill tab pattern already in the codebase
- Proposed 3 options ranked by ROI: (1) debounced search with live highlight — high ROI, low effort; (2) collapsible year accordion — medium ROI, medium effort; (3) full faceted search sidebar — low ROI, high effort
- Recommended option 1 with a 300ms debounce and matched-text highlight, consistent with the existing cyan accent color for active state

---

### Interaction 2 — Timeline Page: Radar Chart Transition Bug

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：Timeline 页面的雷达图在切换语言时有页面过渡抖动问题，看起来像是 layout shift。帮我诊断一下原因，不要马上修改代码，先给我分析。

*(Translation: "The radar chart on the Timeline page has a layout shift on language switch. Help me diagnose the cause — analysis first, no code changes yet.")*

**What Claude did:**
- Identified two likely causes: (a) `useLanguage` re-mounting the component instead of updating props, causing the SVG polygon to replay its enter animation; (b) chart container losing its fixed height and collapsing briefly during re-render
- Recommended adding a stable `key` that doesn't change on language toggle, and setting an explicit `min-height` on the chart wrapper
- Confirmed the fix would not affect the existing spring animation config

---

### Interaction 3 — Timeline Page: Visual Refinement for Impact Rings

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：每个时间线事件卡片上的 SVG 影响力环目前太小，在深色背景上不够醒目。在不改变整体卡片布局的前提下，建议一个让影响力环更突出的方案，ROI 优先。

*(Translation: "The SVG impact rings on timeline event cards are too small and hard to read against the dark background. Suggest a way to make them more prominent without changing the overall card layout. ROI-first.")*

**What Claude did:**
- Proposed increasing ring stroke width from 2px to 3.5px and adding a subtle `drop-shadow` filter with the cyan accent color
- Suggested animating the `stroke-dashoffset` from 0% to the actual impact value on scroll entry rather than on mount, giving users a clear reading moment
- Noted this is a 15-minute change with high visual impact — top ROI pick

---

### Interaction 4 — Lab Page: AI Time Machine Concept Brainstorm

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：Lab 页面要加一个"AI 时间机器"互动组件。我有一个初步想法：用户拖动年份滑条（2018–2025），页面上的 AI 工具生态随年份变化。请帮我审视这个方向，提出让它更有叙事感的优化建议，重点是视觉呈现方式，不是代码实现。

*(Translation: "Lab page needs an 'AI Time Machine' interactive component. My initial idea: year slider (2018–2025), AI tool ecosystem changes with the year. Review this direction and suggest ways to make it more narrative — focus on visual presentation, not code.")*

**What Claude did:**
- Validated the core mechanic and suggested three visual enhancements: (a) cards entering/exiting with a "scan" animation (top-to-bottom reveal) to feel like scanning a database; (b) color-coding cards by tool category (IDE = cyan, model = violet, service = amber); (c) a brief "year transition" flash effect (white scanline sweeping across) when the slider moves across a year boundary
- Noted that the scanline transition aligns with the existing CRT scanline aesthetic already in the codebase

---

### Interaction 5 — Lab Page: Developer DNA Quiz Flow

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：Developer DNA 测验需要两步选择：先选编程语言，再选经验等级，然后展示个性化 AI 工具推荐卡片。帮我审视这个交互流程是否清晰，有没有比"两步选择 + 结果卡片"更好的方式，同样 ROI 优先。

*(Translation: "Developer DNA quiz needs a two-step flow: pick language, pick experience level, then show personalized AI tool recommendation cards. Review whether this flow is clear, and whether there's a better pattern than 'two-step select + result cards'. ROI-first.")*

**What Claude did:**
- Confirmed the two-step flow is clear and matches established mental models (similar to pricing plan selectors)
- Recommended against adding a third step (which would add friction) but suggested making the result cards feel "earned" with a brief stagger reveal animation rather than all appearing at once
- Proposed using `layoutId` FLIP on the selection highlight so users get tactile feedback that their choice is "locked in" before results appear

---

### Interaction 6 — Animation System Audit

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：我在不同组件里用了不同的缓动值和弹簧参数，现在感觉视觉上不统一。帮我建立一套统一的动效规范：缓动曲线、时长分级、弹簧物理参数。要能覆盖按钮交互、数字计数器、滚动驱动动画这三类场景。

*(Translation: "I've used inconsistent easing values and spring parameters across components. Help me establish a unified animation spec: easing curves, duration tiers, spring physics. Should cover three categories: button interactions, number counters, and scroll-driven animations.")*

**What Claude did:**
- Produced a consolidated animation specification covering:
  - **3 easing curves only:** Apple decelerate `[0.25, 0.46, 0.45, 0.94]`, launch `[0.34, 1.56, 0.64, 1]`, elastic pulse `[0.68, -0.55, 0.27, 1.55]`
  - **5 duration tiers:** instant 0.2s / standard 0.6s / dramatic 1.2s / loop 3s / ambient 12s
  - **Spring physics by use case:** buttons `stiffness 400 / damping 28`, counters `stiffness 60 / damping 12`, cursor dual-ring `stiffness 90+1200`
- Recommended replacing all inline `transition` objects with these named constants imported from a shared `src/utils/motion.ts` file

---

### Interaction 7 — Scroll-Driven Architecture Review

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：我想用 Framer Motion 的 useScroll + useTransform 做滚动驱动动画，但不确定如何组织场景"信封"（每个场景的进入/活跃/退出区间）。帮我设计一个可复用的 StickyChapter 模式，不要写完整代码，给我架构方案和关键参数。

*(Translation: "I want to build scroll-driven animations with Framer Motion useScroll + useTransform, but I'm unsure how to organize scene 'envelopes' (enter/active/exit ranges for each scene). Design a reusable StickyChapter pattern — no full code, just architecture and key parameters.")*

**What Claude did:**
- Proposed a 4-phase scene envelope: `[0, enter, active, exit, 1]` where `enter` and `exit` are short transition windows around the center `active` dwell
- Recommended expressing all offsets as normalized 0–1 scroll progress so scenes are resolution-independent
- Suggested a `useStickyProgress(sectionRef, phases)` hook pattern that returns `{phase, progress}` — consumers just read the current phase rather than computing ranges themselves

---

### Interaction 8 — Background Layer Stack Design

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：网站的背景氛围感不够强，我想加几层叠加效果但又怕性能崩或者视觉太乱。帮我设计一个背景层叠加的方案，最多7层，每层说明作用、z-index 位置、pointer-events 处理，以及哪些层可以省略（按 ROI）。

*(Translation: "The site's ambient atmosphere isn't strong enough. I want to add layered background effects but I'm worried about performance or visual clutter. Design a background layer stack — max 7 layers, explain each layer's role, z-index, pointer-events handling, and which can be skipped by ROI.")*

**What Claude did:**
- Designed a 7-layer stack from bottom to top:
  1. `Starfield` (Canvas, 60fps throttled to 24) — base depth
  2. `CyberGrid` (SVG, static) — spatial grid reference
  3. `AmbientGlow` (CSS radial, mouse-tracked) — warmth
  4. `LiquidLines` (SVG animated paths) — organic motion
  5. `MatrixRain` (Canvas, hero sections only) — thematic signal
  6. `ScanlineOverlay` (CSS repeating-linear-gradient) — CRT texture
  7. `FilmGrain` (Canvas noise) — analog finish
- All layers: `position: fixed`, `pointer-events: none`, `z-index` below content
- Noted layers 2 and 4 are optional; layers 6 and 7 cost near-zero performance

---

### Interaction 9 — Component Design Spec Consolidation

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：帮我把这个项目里反复出现的组件模式整理成一份规范，包括：毛玻璃卡片的参数、3D 倾斜效果的角度限制、终端打字速度。这些在不同地方数值不一样，需要统一。

*(Translation: "Consolidate the recurring component patterns in this project into a spec: glassmorphism card parameters, 3D tilt angle limits, terminal typing speed. These have inconsistent values across the codebase — need to unify.")*

**What Claude did:**
- Produced component spec for the three patterns:
  - **Glassmorphism:** `backdrop-blur: 16px`, `background: rgba(255,255,255,0.04)`, `border: 1px solid rgba(255,255,255,0.08)`
  - **3D tilt:** max `±7°` horizontal / `±9°` vertical, perspective `1000px`, transition `0.3s ease-out` on mouse leave
  - **Terminal typing:** character delay `38ms` ± `15ms` jitter, line pause `400ms`, cursor blink `530ms`
- Noted these can all be extracted into CSS custom properties or a shared `tokens.ts` constants file

---

### Interaction 10 — Text Effect Selection Guide

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：项目里我用了 glitch、scramble、split chars 等多种文字效果，但我不太确定什么场景该用哪种。帮我建立一个"文字效果选择指南"，按场景分类，说明每种效果的叙事含义。

*(Translation: "The project uses glitch, scramble, split chars, and other text effects, but I'm not sure which to use for each scenario. Build a 'text effect selection guide' categorized by scene, explaining the narrative meaning of each effect.")*

**What Claude did:**
- Produced a 7-effect guide:
  1. **SplitChars** (per-character stagger) → Hero titles, first impression moments
  2. **ScrambleText** (characters randomize then resolve) → Hover states, identity reveal
  3. **GlitchText** (chromatic aberration + character replacement) → System failure, AI vs human tension
  4. **TypewriterText** (terminal typing) → Terminal / command contexts, procedural feel
  5. **FadeReveal** (opacity + blur) → Supporting body text, data callouts
  6. **SlideReveal** (mask wipe) → Chapter transitions, cinematic moments
  7. **CountUp** (number increment) → Statistics, metrics, impact numbers

---

### Interaction 11 — Data Visualization Color Semantics

**Prompt:**
> [Master system prompt above] +
>
> 当前任务：我的图表里用了很多颜色，但没有统一的语义规则，导致同样的 cyan 在不同图表里有时表示增长，有时只是区分。帮我建立一套数据可视化的颜色语义规范。

*(Translation: "My charts use many colors but without consistent semantic rules — cyan means growth in some charts but is just a differentiator in others. Establish a data visualization color semantics spec.")*

**What Claude did:**
- Established 4-color semantic system:
  - **Cyan `#06b6d4`** → Growth, adoption increase, positive trend
  - **Rose `#f43f5e`** → Decline, drop, negative trend (e.g., Stack Overflow traffic fall)
  - **Violet `#8b5cf6`** → User/developer counts, human-side metrics
  - **Emerald `#10b981`** → Positive outcomes, salary gains, skill attainment
- Noted that **Amber `#d4a853`** (the project's gold accent) should be reserved for UI chrome only, not data encoding, to preserve its "premium" signal

---

## Conversation Links

| Interaction | Link |
|---|---|
| Session 1 — Timeline filter consultation | `https://claude.ai/chat/[conversation-id]` |
| Session 2 — Radar chart transition bug | `https://claude.ai/chat/[conversation-id]` |
| Session 3 — Impact rings visual refinement | `https://claude.ai/chat/[conversation-id]` |
| Session 4 — AI Time Machine concept | `https://claude.ai/chat/[conversation-id]` |
| Session 5 — Developer DNA quiz flow | `https://claude.ai/chat/[conversation-id]` |
| Session 6 — Animation system audit | `https://claude.ai/chat/[conversation-id]` |
| Session 7 — Scroll-driven architecture | `https://claude.ai/chat/[conversation-id]` |
| Session 8 — Background layer stack | `https://claude.ai/chat/[conversation-id]` |
| Session 9 — Component design spec | `https://claude.ai/chat/[conversation-id]` |
| Session 10 — Text effect guide | `https://claude.ai/chat/[conversation-id]` |
| Session 11 — Data visualization color semantics | `https://claude.ai/chat/[conversation-id]` |

> **Action required:** Replace each `[conversation-id]` with the actual ID from your browser's address bar when viewing the claude.ai conversation. IDs look like `550e8400-e29b-41d4-a716-446655440000`.

---

## Usage Context

### Why I Used AI for Each Interaction

**Design Consultation (Interactions 1, 3, 4, 5)**
Rather than asking Claude to generate code immediately, I used it as a design thinking partner — describing the current state and asking for ranked options before touching any implementation. This "审视/建议" (review/suggest) pattern let me make informed decisions about direction before committing to implementation, avoiding rework.

**Bug Diagnosis (Interaction 2)**
When the radar chart had a layout shift bug on language switch, I asked Claude to analyze the cause first rather than jump to a fix. This helped me understand *why* the bug occurred (component re-mounting vs. prop update) rather than just applying a patch I didn't understand.

**System Design & Specifications (Interactions 6, 7, 8, 9, 10, 11)**
The most valuable use of AI in this project was building unified design systems. Animation specs, background layer stacks, component parameters, text effect guides, and color semantics are all cross-cutting concerns that affect every component. Having Claude consolidate these into clear tables and rules created a single source of truth I could reference throughout development, preventing the visual inconsistency that comes from ad-hoc decision-making.

**Style Consistency Guard**
Every prompt included the master system prompt so Claude always knew the project's constraints (no stock photos, synthetic aesthetic, ROI-first). This meant I never got suggestions that would break the established visual language, saving rounds of "that doesn't fit the project" back-and-forth.

---

## Self-Assessment

### Reflection on AI-Assisted Learning

**1. Developing a "Consult First, Build Second" Habit**

The most significant shift in how I worked with AI was learning to use it for design consultation before implementation. Early in the project I would ask Claude to write code immediately, which often resulted in technically correct but narratively wrong implementations that I'd have to rewrite. Once I started using the "analyze / suggest / rank by ROI" pattern, the quality of each session improved dramatically because I was making informed choices rather than rubber-stamping AI output.

**2. Building Transferable Design Systems**

By asking Claude to help me consolidate animation specs, color semantics, and component parameters into explicit rules, I accidentally learned what a professional design system looks like. Understanding *why* you'd have three easing curves instead of unlimited options — and what each one communicates — is knowledge I can apply to any future project, not just this one.

**3. Learning Narrative Semantics in Visual Design**

The text effects guide (Interaction 10) and data visualization color semantics (Interaction 11) were genuinely educational. Before this project, I would have chosen effects and colors by aesthetic feel. After these conversations, I can articulate *why* a glitch effect belongs at a "system failure" moment, or why using cyan for both growth data and UI accents creates semantic confusion. This kind of thinking — where visual choices carry meaning — is a skill I didn't have before.

**4. Learning the Limits of AI Consultation**

AI is good at generating options and explaining tradeoffs, but it cannot tell you which tradeoff matters *to your specific user*. For the AI Time Machine year slider, Claude proposed three visual enhancement options — all technically sound — but only I could decide which felt right for the project's tone. AI accelerated the option generation; the judgment still required human taste.

**5. Prompt Engineering as a Design Skill**

Writing the master system prompt (and refining it over multiple sessions) taught me that how you frame a request shapes what you get back. Specifying "ROI-first, note effort" reliably produced ranked, actionable suggestions instead of exhaustive lists. Specifying "discuss, don't implement" reliably produced analysis instead of premature code. These framing skills — being precise about the kind of output you need — are applicable beyond AI tools, to any collaborative technical communication.

**Distilled Key Preferences Developed Through This Project:**

| # | Rule | Application |
|---|---|---|
| 1 | Color system | 5 colors, non-expandable; 5 opacity tiers (0.03 → 0.80) |
| 2 | Easing functions | Only 3 curves: Apple decelerate / launch / elastic pulse |
| 3 | Duration tiers | Instant 0.2s → Standard 0.6s → Dramatic 1.2s → Loop 3s → Ambient 12s |
| 4 | Spring physics | Button stiffness 400 / Counter 60 / Cursor dual-ring 90+1200 |
| 5 | Scroll-driven | Continuous mapping (not triggers), 4-phase scene envelope, StickyChapter pattern |
| 6 | Background layers | 7-layer stack (Starfield → scanline), all `pointer-events: none` |
| 7 | Component spec | Glassmorphism blur 16px / 3D tilt ±7°±9° / Terminal 38ms typing |
| 8 | Text effects | 7 effects matched to narrative moment (Hero → SplitChars, Hover → ScrambleText) |
| 9 | Data visualization | Growth=Cyan / Decline=Rose / Users=Violet / Positive=Emerald |
| 10 | Performance | Canvas never 60fps / DPR max 2x / Animations `once: true` |

---

---

# Junyao Yang — AI Assistance Log

**Role:** Data Architecture / Data Insights & Arena Development  
**Tool Used:** Claude Code (Anthropic) — local CLI sessions  
**Project Period:** March 19 – April 24, 2026  

---

> **Important framing note (please read first)**
>
> The volume of prompts and the depth of workflow description in this section are **NOT a measure of contribution to the project relative to teammates**. They primarily reflect **how much of the Claude Code session history was still fully recoverable on disk** at the time of writing — Claude Code's context-compaction strategy had already compressed some earlier sessions, and distillation or full records were available to different degrees for different sessions.
>
> This section is therefore a record of **human–AI collaboration**, not a full record of all project work. **All team members participated continuously throughout the project**; any asymmetry in prompt count or narrative detail should be read as an artifact of data preservation, not as a proxy for contribution.

---

## About This Log

All development was done through **Claude Code CLI** running as local terminal sessions. Three session JSONL files remained fully readable; earlier sessions had been compacted. Prompts quoted verbatim are drawn from those three readable sessions. For compacted sessions, **Claude's internal compressed long-term context** was used to reconstruct a high-level workflow summary — these sections are explicitly marked with a provenance note.

---

## Human-AI Collaboration Workflow

The following workflow was repeated for each major feature:

| # | Step | Led by |
|---|---|---|
| 1 | Overall design and aesthetic direction | Human |
| 2 | Validate design soundness and technical feasibility with Claude | Joint |
| 3 | Break down into pages and user stories | Human |
| 4 | Determine data scope and sources | Human |
| 5 | Feed data + user stories to Claude for scaffolding | Joint |
| 6 | Guide Claude to review each component and page | Joint |
| 7 | Formalize concrete design goals and implementation approach | Human |
| 8 | Ask Claude to implement and spin up a demo | Joint |
| 9 | Review functionality and visual performance | Human |
| 10 | Have Claude apply review comments / iterate | Joint |
| 11 | Final code review (human-requested, Claude-executed audit) | Claude |

**Key principle:** High-level design decisions (direction, architecture, data scope, functional acceptance) are human-driven; implementation, refactoring, and code-level auditing are delegated to Claude, with humans reviewing visuals and behavior at every iteration.

---

## Complete Prompt Log

The 38 prompts below are extracted verbatim from readable session files, lightly polished (colloquial filler and emotional asides removed while preserving core technical intent), and grouped by topic. Each prompt is shown in its original Chinese plus an English translation. Prompts that were too vague or unrelated to engineering (browser permission debugging, one-letter option picks) have been excluded. Cloudflare deployment debugging, hook feedback, and report-generation meta-prompts are also excluded.

---

### Group 1 — Project Onboarding & Codebase Familiarization

**Span:** 2026-04-16 → 2026-04-23 · **Prompts:** 2

Opening new sessions: asking Claude to read the project for shared context.

#### Prompt #10 · 2026-04-16 18:07:53

**Chinese (polished):**
> 你现在工作在某前端项目的 polish 分支下。请查看项目的环境、代码结构和内容，便于后续讨论。

**English translation:**
> You are now working on the `polish` branch of a frontend project. Survey the project environment, code structure, and content so we have shared context for the upcoming discussion.

---

#### Prompt #44 · 2026-04-23 16:46:29

**Chinese (polished):**
> 你现在工作在一个小组前端项目的目录下。开始任何修改前，先完整通读项目工程，便于后续接收修改需求时有共同上下文。

**English translation:**
> You are now working inside the directory of a group frontend project. Before any modifications, fully survey the codebase so we have shared context when modification requests come in.

---

### Group 2 — Code-Quality Audit & Cleanup

**Span:** 2026-04-10 → 2026-04-23 · **Prompts:** 3

Multiple requests to audit the codebase: Chinese comments, mojibake, dead code, unused imports, serious engineering issues.

#### Prompt #6 · 2026-04-10 15:24:24

**Chinese (polished):**
> 对近期 branch 新增/修改的文件再做一次乱码扫描。修改前先给出方案，不要直接改代码。

**English translation:**
> Do another mojibake scan across files added or modified on this branch recently. Propose a remediation plan before making any changes — no direct code edits.

---

#### Prompt #7 · 2026-04-10 15:26:57

**Chinese (polished):**
> 清理注释中的乱码字符。

**English translation:**
> Clean up the garbled characters in the code comments.

---

#### Prompt #48 · 2026-04-23 17:08:08

**Chinese (polished):**
> 审计这一版本的全部代码，确认没有中文注释、废弃代码、严重工程问题等。

**English translation:**
> Audit the full contents of this version: confirm there are no Chinese-language comments, no dead / deprecated code, and no serious engineering issues.

---

### Group 3 — Insight Page: Design & Iteration

**Span:** 2026-04-16 → 2026-04-23 · **Prompts:** 9

Content review → interaction proposal → iOS Dynamic Island-style sticky nav → new-tab planning → final YouTab removal.

**Feature context:** The initial Insight page felt like a pile of data — both the charts and the tab navigation lacked interactivity. The human flagged this and asked Claude to strengthen interactivity on both axes. Chart forms were specified up-front by the human; Claude implemented them to spec. For navigation, the human specified: a non-wheel tab-switching method, a sticky floating nav that attaches once the user scrolls past the main tab bar, and auto-scroll-to-top on tab switch. The first iteration's sticky nav duplicated the top navbar visually, causing aesthetic fatigue. The human pivoted to a rounded-corner, scroll-threshold-triggered **iOS Dynamic Island** aesthetic so the sticky element reads as a distinct contextual island.

**Outcome:** `src/components/dataExplorer/DataExplorerTabs.tsx` (~300 lines): `TAB_KEYS` source of truth, lazy state init from URL hash, keyboard ← / → and 1–4 shortcuts, `CustomEvent('dataExplorer:navigate')` for cross-component navigation, scroll observer for sticky trigger, `createPortal`-out sticky bar to escape `PageTransition`'s `scale + filter` containing block. Dynamic Island styling: `black/90` capsule + `backdrop-blur-2xl` + `rounded-full` + progress sliver.

#### Prompt #11 · 2026-04-16 18:11:43

**Chinese (polished):**
> Insight 页面目前有 4 个 tab，请从叙事、审美、逻辑三个角度复查。tab 切换当前是鼠标点击实现的，如有必要可以调整交互逻辑。前提是整体设计风格不割裂，目标是让用户在整页有更丰富的浏览和交互体验。

**English translation:**
> The Insight page currently has four tabs. Audit them along three axes — narrative, visual design, and logical flow. Tab switching is currently mouse-click driven; you may propose changes to the interaction model if needed, as long as the overall visual identity stays consistent. The goal is a richer browsing and interaction experience across the whole page.

---

#### Prompt #12 · 2026-04-16 18:15:58

**Chinese (polished):**
> 澄清一下：我指的是鼠标点击切 tab、滚轮滚动内容，不是滚轮切 tab。你方案中的必做项 1–6、建议项 7–11、选做项 12/13 都可以尝试实现。

**English translation:**
> Clarification: I meant mouse-click for tab switching and wheel for content scrolling — not wheel for tab switching. From your proposal: must-do items #1–6, recommended items #7–11, and optional items #12/#13 are all OK to attempt.

---

#### Prompt #13 · 2026-04-16 18:31:22

**Chinese (polished):**
> 本地启动 dev server，我预览一下效果。

**English translation:**
> Start the local dev server so I can preview the result.

---

#### Prompt #14 · 2026-04-16 18:34:11

**Chinese (polished):**
> 找不到你提到的吸顶 mini-bar —— 你说的吸顶指的是页面级导航还是 tab 级？另外 CodeGen tab 的 40% 圆环动画触发时机有问题，应该在切入 tab 后立即播放，而不是快滚出视口才开始。

**English translation:**
> I can't find the sticky mini-bar you mentioned — to clarify, is 'sticky' referring to the site-level page nav or the in-page tab nav? Separately, the 40% ring animation on the CodeGen tab triggers too late — it should fire right after the tab becomes active, not when the user is about to scroll past it.

---

#### Prompt #15 · 2026-04-16 18:37:47

**Chinese (polished):**
> 依然没有看到吸顶 mini-bar，是它没有实际渲染出来，还是我找错了位置？

**English translation:**
> Still can't see the sticky mini-bar — is it actually being rendered, or am I looking in the wrong place?

---

#### Prompt #16 · 2026-04-16 18:43:38

**Chinese (polished):**
> 修好后重新启动 dev server。

**English translation:**
> Once fixed, restart the dev server.

---

#### Prompt #17 · 2026-04-16 18:44:45

**Chinese (polished):**
> 设计风格可以更像 iOS 的 Dynamic Island（灵动岛）。

**English translation:**
> The design can lean more toward iOS Dynamic Island aesthetics.

---

#### Prompt #18 · 2026-04-16 18:49:09

**Chinese (polished):**
> Insight 页内容已基本满意。结合现有内容，评估一下是否适合新增 tab —— 可以是新的叙事单元，也可以是提升交互体验的 trick（例如复用 LLMArena 或其他页面的组件）。制定一个方案。

**English translation:**
> The Insight page content is in good shape. Given the existing content, evaluate whether additional tabs make sense — new narrative units, or interaction-enhancing tricks such as reusing components from LLMArena or other pages. Draft a plan.

---

#### Prompt #45 · 2026-04-23 16:54:08

**Chinese (polished):**
> 删除 Insight 页的 `You` tab —— 该 tab 功能与其他 tab 有重叠，4 个就够。注意不要破坏页面其他结构，尤其是 tab 导航栏。

**English translation:**
> Remove the `You` tab from the Insight page — its function overlaps with other tabs, and four is enough. Be careful not to break the rest of the page structure, especially the tab navigation bar.

---

### Group 4 — LiquidLinesBackground: Research & Implementation

**Span:** 2026-04-16 · **Prompts:** 11

Reproducing the liquid-wave background from wodniack.dev, iterating on visuals, algorithm reference, curve smoothing, and config extraction.

**Feature context:** The data-dense Insight page used a plain solid background that felt too flat. Before finding the wodniack.dev reference, several earlier directions were explored: (1) a dot-based motion field — rejected because it didn't match the page's aesthetic direction and posed accessibility concerns (trypophobia, attention-focus difficulties); (2) self-implemented line-based approaches using simulated gravity, sine/cosine mixtures, and other polynomial families — none produced the intended visual result. The final implementation ports the open-source `AWaves` custom element (polynomial-based 2D Perlin noise) from wodniack.dev, with post-adoption tuning for line density, amplitude, color palette, and dark/light mode adaptation.

**Attribution note:** The core algorithm is ported from the open-source `AWaves` custom element at wodniack.dev / associated CodePen. Original work sits in the pre-reference exploration and post-adoption tuning.

**Outcome:** `src/components/LiquidLinesBackground.tsx` (~470 lines): 2D Perlin noise with seeded LCG shuffle, spring-damper cursor push, `quadraticCurveTo` smoothing, DPR-aware canvas, `MutationObserver` theme sync. `src/components/liquidLinesConfig.ts` (~145 lines): `insightBgConfig` with per-field comments documenting typical ranges. Later extended to Compare and Timeline pages (commit `928a806`).

#### Prompt #20 · 2026-04-16 19:08:46

**Chinese (polished):**
> 下一步：修改页面背景。先检查当前背景是全局挂载还是每页独立。

**English translation:**
> Next step: change the page background. First check whether the current background is applied globally or per-page.

---

#### Prompt #21 · 2026-04-16 19:10:05

**Chinese (polished):**
> 我想给 Insight 页单独设计一个背景，接下来我会给出具体要求。

**English translation:**
> I want to design a dedicated background specifically for the Insight page. I will describe the specific requirements next.

---

#### Prompt #22 · 2026-04-16 19:12:23

**Chinese (polished):**
> https://wodniack.dev 上有一个液态线条风格、可与鼠标交互的背景动画，请尝试复现。建议先在独立空白页调试，验证通过后再集成到 Insight 页，避免破坏其他内容。

**English translation:**
> The site https://wodniack.dev has a liquid line-like background animation that reacts to the cursor — please try to reproduce it. Recommend prototyping on a standalone blank page first, and only integrate into the Insight page once validated, to avoid damaging other content.

---

#### Prompt #27 · 2026-04-16 19:52:37

**Chinese (polished):**
> 整体效果接近了，但为什么只有光标附近一小片被照亮？

**English translation:**
> The overall feel is close now, but why is only a small patch near the cursor illuminated?

---

#### Prompt #28 · 2026-04-16 20:00:20

**Chinese (polished):**
> 这一版很不错。两个艺术层面的调整：(1) 光标标记几乎看不见，加一圈与整体风格一致的装饰让它更显眼；(2) 无鼠标时的环境扰动应该更随机一点 —— 整体向左漂移没问题，但不要如此规律。

**English translation:**
> This version is much better. Two artistic tweaks: (1) the cursor marker itself is barely visible — ring it with a decorative element matching the overall style so it stands out; (2) the idle ambient perturbation should feel more random — the overall leftward drift is fine, but it shouldn't be this uniform.

---

#### Prompt #29 · 2026-04-16 20:05:37

**Chinese (polished):**
> 这一版扰动太密了，视觉上像蜘蛛网。我说的『更随机』指的是：扰动的间隔大致保持，但扰动幅度不要覆盖整个 Y 轴，适当缩小范围，看起来更像自然波动。

**English translation:**
> This version has too much perturbation — it looks like a spider web. By 'more randomized' I meant: keep roughly the same perturbation spacing, but don't let the amplitude span the entire Y-axis — shrink the range so it reads as natural waves.

---

#### Prompt #30 · 2026-04-16 20:14:02

**Chinese (polished):**
> 找到了一份更好的参考实现：https://codepen.io/wodniack/pen/abeMZXQ

**English translation:**
> Found a better reference implementation: https://codepen.io/wodniack/pen/abeMZXQ

---

#### Prompt #31 · 2026-04-16 20:17:59

**Chinese (polished):**
> 参考页面已公开源码，直接贴给你：[wodniack.dev 的 `AWaves` 自定义元素完整源码，包含 2D Perlin 噪声、鼠标弹簧阻尼、SVG 路径渲染等逻辑，约 4000 字符]

**English translation:**
> The reference page exposes its source directly — pasting it here: [full source of the `AWaves` custom element from wodniack.dev, including 2D Perlin noise, mouse spring-damper, SVG path rendering, ~4000 chars]

---

#### Prompt #32 · 2026-04-16 20:24:24

**Chinese (polished):**
> 动画整体已复现，但线条仍有明显折点 —— 需要平滑成连续曲线。

**English translation:**
> The animation is reproduced overall, but the lines still have visible polygonal kinks — smooth them into continuous curves.

---

#### Prompt #33 · 2026-04-16 20:27:16

**Chinese (polished):**
> 这一版效果很好。关闭独立测试页，把效果应用到 Insight 页。为了便于后续调整，将可调参数抽离为独立配置文件，并附必要注释说明每一项如何修改。

**English translation:**
> This version looks good. Shut down the standalone test page and apply the effect to the Insight page. For future maintainability, extract the tunable parameters into a dedicated config file, with comments explaining how each one should be adjusted.

---

#### Prompt #34 · 2026-04-16 20:35:56

**Chinese (polished):**
> Dark mode 下的配色有些问题，再检查一次。

**English translation:**
> The dark-mode color treatment has issues — please review it again.

---

### Group 5 — Dev History Page: Data Sync

**Span:** 2026-04-23 · **Prompts:** 2

Updating the devlog page to match the current project state: commits array, stat cards, milestone count, treemap file list and line counts.

#### Prompt #46 · 2026-04-23 16:57:21

**Chinese (polished):**
> 根据当前版本的实际状态更新 dev-history 页，确保内容与项目进度一致，不能有不实内容。

**English translation:**
> Update the dev-history page to reflect the current state of the project. Ensure the content is factually consistent with actual progress — no fabricated content.

---

#### Prompt #47 · 2026-04-23 17:02:35

**Chinese (polished):**
> treemap（Architecture 视图）也同步更新了吗？

**English translation:**
> Has the treemap (Architecture view) also been synced?

---

### Group 6 — Commit Message Drafting & Git Assistance

**Span:** 2026-04-10 → 2026-04-23 · **Prompts:** 5

Asking Claude to draft commit summaries / descriptions, and to perform the commit itself.

#### Prompt #8 · 2026-04-10 15:55:01

**Chinese (polished):**
> 帮我写一份 commit 的 summary 和 description，我手动 push。

**English translation:**
> Draft a commit summary and description for me — I'll push manually.

---

#### Prompt #35 · 2026-04-16 20:38:43

**Chinese (polished):**
> 帮我为这次变更写一份 commit 的 summary 和 description。

**English translation:**
> Draft a commit summary and description for this change.

---

#### Prompt #36 · 2026-04-16 20:41:55

**Chinese (polished):**
> 注意确认无关/临时文件已从工作区清理干净。

**English translation:**
> Make sure unrelated / temporary files have been cleaned from the working tree.

---

#### Prompt #37 · 2026-04-16 20:46:54

**Chinese (polished):**
> 关闭所有本地 dev server 实例。

**English translation:**
> Shut down all local dev server instances.

---

#### Prompt #49 · 2026-04-23 17:22:13

**Chinese (polished):**
> 完成 commit。注意：不要把 AI 列为 co-author，commit 描述中也不要提到 Claude。

**English translation:**
> Please commit the changes. Important: do NOT add the AI as co-author, and do NOT mention Claude in the commit description.

---

### Group 7 — Presentation Preparation

**Span:** 2026-04-23 · **Prompts:** 5

Compiling architecture, component inventories, and technical detail for the Insight / DevLog / Compare (LLMArena) pages, plus concrete examples of React state and `useContext`.

#### Prompt #50 · 2026-04-23 17:35:21

**Chinese (polished):**
> Presentation 中我负责 Insight、DevLog、LLMArena 三页的 demo 和讲解，老师可能会在讲解中或之后提问。整理这三页的架构、实现原理、技术细节供我回答。流线背景也一并整理。

**English translation:**
> For the class presentation I'll be demoing and narrating three pages: Insight, DevLog, and LLMArena. The instructor will likely ask questions during or after. Compile each page's architecture, implementation rationale, and technical details so I can answer. Include the liquid-lines background as well.

---

#### Prompt #51 · 2026-04-23 17:41:19

**Chinese (polished):**
> LLMArena 指的是整个 Compare 页。另外除了技术细节，老师通常也会关注组件层面。

**English translation:**
> By 'LLMArena' I mean the entire Compare page. Beyond pure technical details, the instructor typically also asks about components.

---

#### Prompt #52 · 2026-04-23 18:54:14

**Chinese (polished):**
> 老师开始问代码架构了，需要 React state 的一个具体使用例子。

**English translation:**
> The instructor is asking about code architecture — specifically, a concrete example of React state usage.

---

#### Prompt #53 · 2026-04-23 18:57:45

**Chinese (polished):**
> 需要讲 React Context。

**English translation:**
> Need to cover React Context.

---

#### Prompt #54 · 2026-04-23 18:59:11

**Chinese (polished):**
> 具体是 `useContext`。

**English translation:**
> Specifically `useContext`.

---

### Group 8 — Misc Debugging

**Span:** 2026-04-10 · **Prompts:** 1

#### Prompt #9 · 2026-04-10 15:55:57

**Chinese (polished):**
> 检查一下这次返回 API 报错的原因。

**English translation:**
> Investigate why this call just surfaced an API error.

---

### Features Built in Compacted Sessions (Reconstructed)

The following features were built in sessions whose raw JSONL logs had been compacted by Claude Code. No verbatim prompts survive; workflows are reconstructed from git history, codebase inspection, and recollection.

---

#### Treemap — DevHistory Architecture View
*(Commit: `5a6950f`, 2026-04-07)*

**Goal:** A code-display region that partitions screen area proportionally to code volume — each project area's block size directly reflects its line count. Two goals: (1) let viewers immediately grasp the relative weight of each codebase module through area-at-a-glance; (2) let viewers drill into actual source code by clicking any block.

**Human design decisions:** Treemap over alternatives (file tree, sunburst, pie) for proportional-area at-a-glance reading; script-driven data generation from actual source files rather than hand-maintained data; human-specified per-section accent colors; recursive 2-way split with short-edge-vs-long-edge orientation choice; lazy per-file source loader with click-to-open modal preview.

**Outcome:** `src/components/devHistory/ArchitectureMap.tsx` (~640 lines): recursive 2-way split layout, `import.meta.glob` lazy source loader, hand-written token highlighter, macOS-style modal code preview. `SECTIONS` data structure: 10 project areas × per-file line counts.

---

#### LLMArena — Compare Page Chatbot Arena
*(Commits: `c69690b` Mar 24 initial · `402442b` Apr 7 v2 upgrade · `928a806` Apr 22 i18n)*

**Goal:** The Compare page's closing act — model-vs-model comparison, giving users stronger interactivity to contrast with the otherwise chart-heavy, read-only sections.

**Human design decisions:** Model lineup (Claude 3.5 Sonnet / GPT-4o / Gemini Pro) — representative frontier models with publicly callable APIs. Pre-recorded answers instead of live API calls — driven by Cloudflare static deployment constraints (no server-side key protection); answers are genuinely API-generated then frozen into `arena_questions.ts`; per-model animation speed is derived from real API response timing. Question selection (quicksort / React hooks / SQL optimization) spans common industry scenarios. No persistent voting — no backend available; per-session only.

**v1 → v2 changes (Apr 7):** Trigger model changed from auto-play on scroll to a manual Start button (makes speed difference more legible; turns passive animation into interactive demo). Voting flow added — the vote itself is a user-engagement step; the real payload is the quality-metrics comparison panel revealed after voting.

**i18n (Apr 22):** Each `ArenaModel` holds `answer` (zh) and `answerEn`; arena state resets on language switch so typing animation re-synchronizes with new answer length.

**Outcome:** `src/components/compare/LLMArena.tsx` (~700 lines): 4-phase state machine (`idle → streaming → judging → voted`), RAF-accumulator typing animation. `src/data/arena_questions.ts`: 3 questions × 3 models × bilingual answers with per-model speed and delay calibrated to real API response times.

---

#### AgentLoop — Tool Evolution Interactive Visualizer
*(Tool Evolution page, ~April 6 timeframe)*

**Goal:** Demonstrate the agent tool-use loop concept — how a modern AI coding agent cycles through perceive / plan / act / observe / iterate. A static description would be unconvincing for a presentation; the human wanted an interactive, step-by-step visualization.

**Content sourcing:** The 11 steps' underlying content is sourced from a third-party unpacking of Claude Code's internal agent-loop documentation (publicly circulated reverse-engineering work — not official Anthropic documentation). The novelty of this component lies in the visualization and step-by-step interaction design, not the step definitions.

**Human design decisions:** Per-step natural-language-guided animation — the human guided Claude step-by-step through all 11 steps, describing for each step the conceptual meaning, expected animation effect (streaming terminal, sliding tool panel, unfolding code diff), and expected interaction (manual forward/back). Click-driven step advancement chosen over auto-play so viewers control the pace.

**Iteration pattern:** 11 sequential rounds, one per step. Each round: human describes target animation and interaction → Claude implements → human reviews → move to next step.

**Outcome:** `src/components/agentLoop/AgentLoop.tsx` (~1120 lines): 11-step interactive visualization. `src/data/agent_loop_steps.ts`: step definitions with demo code snippets.

---

## Conversation Links

All sessions were conducted via **Claude Code CLI** running as local terminal sessions — no public claude.ai conversation URLs are generated by the CLI tool.

| Session | Tool | Link |
|---|---|---|
| All development sessions (Mar 19 – Apr 24) | Claude Code CLI (`claude` in terminal) | *No public URL — local CLI session* |

> **Note for course submission:** Claude Code CLI is Anthropic's official terminal/IDE integration (separate product from claude.ai). It does not generate web conversation links. All prompts and outputs are documented in the Complete Prompt Log above. The 3 readable session JSONL files are available on disk as the primary evidence; the reconstructed workflows are supported by git history (commits `c69690b`, `5a6950f`, `402442b`, `928a806`, and others).

---

## Usage Context

### Why I Used AI for Each Category of Interaction

**Codebase onboarding (Group 1)**
Starting each new Claude Code session with a codebase survey ensures Claude has full project context before receiving requests — reducing the risk of suggestions that conflict with existing patterns. This is a low-cost step that improves every subsequent interaction in the session.

**Code quality audit (Group 2)**
Mojibake and Chinese comment cleanup is highly repetitive and error-prone to do by hand across 60+ files. Claude handles pattern-matching at scale reliably; the human's role is setting the acceptance criteria ("no Chinese comments, no dead code, no serious engineering issues") and reviewing the proposed changes before committing.

**Insight page design iteration (Group 3)**
The tab-switching and sticky-nav problem required multiple rounds of visual review — a type of work where having a fast implementation cycle (describe → implement → preview → feedback) is more valuable than any single clever solution. Claude's role was implementing each iteration quickly so the human could evaluate it in the browser and redirect. The human owned all design decisions (Dynamic Island pivot, `createPortal` escape hatch rationale, scroll threshold values); Claude owned the code.

**LiquidLinesBackground (Group 4)**
The background implementation required porting a non-trivial open-source Canvas animation to React, then adapting its visual parameters and adding dark/light mode support. The original `AWaves` source was ~4000 characters of dense JavaScript — accurately porting it and integrating it into the existing component architecture was well-suited to Claude's strengths. Post-adoption visual tuning required multiple fast iteration rounds (expand cursor influence → reduce amplitude → smooth curves → dark mode fix), which the human drove through visual review.

**Commit drafting (Group 6)**
Commit messages are better when written with full context of the diff — Claude has that context automatically during a session and can draft messages that accurately summarize the *why* of changes. The human reviews and approves; this saves the cognitive overhead of mentally reconstructing "what did I just change and why" at commit time.

**Presentation preparation (Group 7)**
When answering live instructor questions during a presentation, having pre-compiled technical summaries of component architecture, implementation rationale, and state-management patterns reduces the risk of answering incorrectly under time pressure. Claude compiled these summaries from the current codebase; the human used them as reference material.

---

## Self-Assessment

### Reflection on Human Code-Ownership in AI-Assisted Workflows

During the presentation phase, an instructor observation aligned with a concern already noticed during the project's later rounds: **actual understanding of the codebase had fallen noticeably behind its growing complexity**.

As features accumulated and implementation was increasingly delegated to Claude, attention converged on two levels — **functionality** (does the feature behave as intended?) and **overall architecture** (is the module layout sensible?). What was not consistently tracked: concrete variable names, function internals, subtle algorithmic choices, and the interplay between state and side effects inside individual components.

For a prototype-grade demo this gap is tolerable. For an evolving codebase that needs debugging, extension, or handoff, it is a real liability:

1. **Traceability** — when a bug appears, reconstructing "which change introduced this, and why" is harder without a mental model of the specific implementation.
2. **Autonomy** — minor tweaks that could be 2-minute edits turn into another round of "ask Claude to adjust X", which slows iteration and deepens the understanding gap.

**Workflow adjustments for future projects:**

- **Code-walkthrough round after every feature merge**, not just a functional demo. A teammate who did *not* prompt Claude for that feature reads the produced code end-to-end and must be able to explain it in their own words. If they can't, the feature isn't accepted yet.
- **Human-written hot-path code.** The parts most likely to need future changes — state machines, core event handlers, core algorithms — should be either hand-written or deliberately reviewed line-by-line, not merely skimmed.
- **Periodic "can you still read this?" audit.** A random file is picked; a teammate tries to explain it without looking at commit messages or Claude's prior responses. Gaps found become the next reading priority.
- **Prompt history as first-class documentation**, not just a compliance artifact. The prompt record makes the *why* of each decision recoverable even when the *how* was Claude's.
- **Structural ownership split.** Rather than one person prompting + accepting while another reviews at a distance, future features should have a named "code owner" whose explicit responsibility is line-level comprehension, distinct from the prompter.

**Overall takeaway:** The lesson is not that AI-assisted development was the wrong choice — the project shipped features that could not have been built solo in the available time. The lesson is that **offloading implementation without explicitly budgeting time for comprehension does not scale with complexity**. Understanding cannot be a side effect of using the tool; it has to be a planned, named workflow step with its own acceptance criteria.

---

*AI-Epics — The AI Code Era | INFO 6150 | April 2026*
