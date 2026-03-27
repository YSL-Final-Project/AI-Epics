# AI-Epics Development Guide

## Git Branching Strategy

**One feature = one branch.** i18n changes can be bundled with the page they serve.

```
main (protected)
 ├── feature/story-page       → Story narrative page
 ├── feature/data-explorer    → Data Explorer page
 ├── feature/compare-page     → Compare / LLM Arena page
 ├── feature/lab-page         → Lab experiments page
 ├── feature/dev-history      → Dev History timeline page
 └── fix/some-bug             → Bug fixes
```

### Workflow

1. **Branch from `main`**: `git checkout main && git pull && git checkout -b feature/xxx`
2. **Keep commits focused**: each commit should be one logical change
3. **Push and create PR**: `git push -u origin feature/xxx` then create PR on GitHub
4. **Add reviewers**: always add @YangjunyaoPo and @Caboose-Chengkun-Liao as reviewers
5. **Merge to `main`**: after approval, merge via GitHub PR (squash or merge commit)
6. **Delete branch**: after merge, delete the remote branch

### Naming Conventions

- Feature branches: `feature/<page-or-feature-name>`
- Bug fixes: `fix/<brief-description>`
- Hotfixes: `hotfix/<brief-description>`

### Commit Messages

Use conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `perf:` performance improvement
- `refactor:` code restructuring
- `docs:` documentation only

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS (dark mode: class strategy)
- Framer Motion (animations)
- Recharts (data visualization)
- React Router v6
- i18n: custom lightweight system (`src/i18n/`)

## Project Structure

```
src/
├── components/       # Reusable components, organized by feature
│   ├── layout/       # Navbar, Footer, PageTransition
│   ├── story/        # Story page components
│   ├── dataExplorer/ # Data Explorer tabs
│   └── shared/       # Cross-page shared components
├── pages/            # Route-level page components
├── data/             # JSON data files
├── i18n/             # Internationalization (en.ts, zh.ts)
└── assets/           # Static assets
```
