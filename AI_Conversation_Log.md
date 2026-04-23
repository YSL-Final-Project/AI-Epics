# AI Assistance Log — AI-Epics Project

**Course:** INFO 6150  
**Project:** AI-Epics — The AI Code Era (2018–2025 Visualization)  
**Tool Used:** Claude AI (claude-sonnet-4-6) via Claude Code CLI  
**Date:** April 2026

---

## Complete Prompt Log

### Interaction 1

**Prompt:**
> 帮我看看这页的pptx文件，将里面的内容全部改成英文

**Translation:** "Help me look at the PPTX file and translate all content to English."

**Follow-up:**
> 3

*(Selected `AI-Epics_Demo_Deck.pptx` from the list of three detected PPTX files.)*

**What Claude did:**
- Scanned the project directory and found three `.pptx` files
- Used Node.js + `adm-zip` to unzip and parse the PPTX (which is a ZIP of XML files)
- Extracted all Chinese text from `<a:t>` tags across 10 slides
- Built a complete translation map (Chinese → English), sorted by string length to prevent partial replacements
- Replaced all 124 text occurrences while preserving the original XML structure and formatting
- Verified zero remaining Chinese characters in the output
- Saved the result as `AI-Epics_Demo_Deck_EN.pptx`

---

### Interaction 2

**Prompt:**
> index.ts的作用是什么

**Translation:** "What is the role of index.ts?"

**What Claude did:**
- Located the relevant `index.ts` file at `AI-Epics/src/types/index.ts` (ignoring `node_modules`)
- Read and analyzed the full file (209 lines)
- Explained that it serves as the **central TypeScript type definition file** for the entire project
- Summarized all interface groups: Timeline, AI Adoption, Stack Overflow, Code Generation, Developer Salary, IDE Market, Interactive Lab, and Page Preview
- Explained why a single `index.ts` is used as a unified export entry point

---

## Conversation Links

> **Note:** Claude Code runs locally as a CLI tool and does not expose conversation IDs automatically.
> To find the actual conversation link, go to [https://claude.ai](https://claude.ai), open your conversation history,
> and copy the URL from your browser's address bar. It will follow the format below.

| Interaction | Link |
|---|---|
| PPTX Translation | `https://claude.ai/chat/[your-conversation-id]` |
| index.ts Explanation | `https://claude.ai/chat/[your-conversation-id]` |

---

## Usage Context

### Why I used AI for Interaction 1 (PPTX Translation)
The project presentation deck (`AI-Epics_Demo_Deck.pptx`) contained a large amount of Chinese text across 10 slides. Manually translating and replacing each text box would have been extremely time-consuming and error-prone, especially since PPTX files store text inside deeply nested XML structures. I used Claude to automate the extraction, translation, and replacement process programmatically using Node.js, which allowed me to process all 124 text items accurately in one pass without touching the slide layouts or formatting.

### Why I used AI for Interaction 2 (index.ts Explanation)
While working on the AI-Epics codebase, I encountered the `src/types/index.ts` file and wanted to quickly understand its purpose and how it fits into the overall project architecture. Rather than manually tracing every import across the codebase, I asked Claude to read and explain the file. This helped me understand the TypeScript data model structure — specifically how all interfaces (Timeline, Salary, IDE Market, etc.) are centrally defined and exported from a single entry point.

---

## Self-Assessment

### Reflection on AI-Assisted Learning

**1. Accelerated Exploration of Unfamiliar File Formats**

Before this project, I had not worked with PPTX files programmatically. Claude explained that a `.pptx` file is actually a ZIP archive containing XML files, and demonstrated how to use `adm-zip` in Node.js to parse and modify it. This was a practical lesson in file format internals that I would not have discovered as quickly on my own.

**2. Understanding TypeScript Project Architecture**

The explanation of `src/types/index.ts` helped me see the value of centralizing type definitions in a TypeScript project. Claude connected the "why" (single import path, compile-time safety, easier maintenance) to the actual code, which deepened my understanding of TypeScript best practices in real projects.

**3. Problem-Solving with Debugging Iterations**

The PPTX translation task required multiple iterations — the first pass produced 105 replacements but left residual Chinese text because shorter strings (e.g., `成员 A`) were being replaced before longer compound strings (e.g., `成员 A — 叙事线`). Claude diagnosed this ordering problem, rewrote the script to sort translations by key length descending, and achieved a complete 124-replacement run with zero residual Chinese. Watching this debugging process helped me understand the importance of replacement ordering when doing string substitution.

**4. Limitations I Observed**

- Claude Code CLI does not have a built-in Python environment in this Windows setup, which required falling back to a Node.js approach. Recognizing when to switch tools is an important engineering skill.
- Conversation IDs are not automatically accessible in the CLI, so manual tracking of conversation links is necessary for documentation purposes.

**Overall:** Using Claude AI as a coding assistant significantly reduced the time spent on repetitive or format-specific tasks, allowing me to focus on higher-level project goals. The interactions were most valuable not just for the output produced, but for the explanations provided alongside the code — which built my understanding of the underlying systems.

---

*Generated with Claude Code (claude-sonnet-4-6) — April 2026*
