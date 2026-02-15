# @stud/ui

Shared UI component library for Stud, built with SolidJS and Tailwind CSS 4.

## Overview

This package contains all reusable UI primitives used across the desktop app. It includes form controls, layout components, markdown rendering, theming, syntax highlighting, internationalization, and more.

## Exports

| Export | Description |
|--------|-------------|
| `@stud/ui/*` | UI components (`*.tsx`) |
| `@stud/ui/hooks` | Custom SolidJS hooks |
| `@stud/ui/context` | Shared context providers |
| `@stud/ui/styles` | Base CSS stylesheet |
| `@stud/ui/styles/tailwind` | Tailwind CSS layer |
| `@stud/ui/theme` | Theme tokens and utilities |
| `@stud/ui/theme/context` | Theme context provider |
| `@stud/ui/i18n/*` | Internationalization strings |
| `@stud/ui/pierre` | Diff rendering utilities |
| `@stud/ui/icons/provider` | AI provider icons |
| `@stud/ui/icons/file-type` | File type icons |
| `@stud/ui/fonts/*` | Bundled font assets |
| `@stud/ui/audio/*` | Audio assets |

## Key Dependencies

- [Kobalte](https://kobalte.dev/) — accessible SolidJS UI primitives
- [Shiki](https://shiki.style/) — syntax highlighting
- [Marked](https://marked.js.org/) — markdown rendering
- [KaTeX](https://katex.org/) — math rendering
- [Virtua](https://github.com/inokawa/virtua) — virtual scrolling

## Development

```bash
# Start Vite dev server
bun run dev

# Typecheck
bun run typecheck

# Regenerate Tailwind utilities
bun run generate:tailwind
```
