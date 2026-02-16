# `packages/ui` — Shared UI Component Library

The UI package provides a shared design system and component library used by the desktop app and web interfaces.

## Overview

- **Package name**: `@stud/ui`
- **Framework**: SolidJS
- **Styling**: Tailwind CSS v4
- **Icon set**: Custom file/language icons via SVG sprites

## Directory Structure

```
packages/ui/src/
├── assets/                # Static assets
│   ├── fonts/             # Custom fonts
│   ├── icons/             # SVG icon files
│   └── images/            # Image assets
├── components/            # Reusable components
│   ├── button/            # Button variants
│   ├── dialog/            # Dialog/modal components
│   ├── dropdown/          # Dropdown menus
│   ├── file-icons/        # Language/file-type icon system (SVG sprite)
│   ├── input/             # Text inputs, search bars
│   ├── markdown/          # Markdown renderer
│   ├── terminal/          # Terminal emulator (Ghostty WebGL)
│   ├── tooltip/           # Tooltip component
│   └── ...                # More components
├── context/               # Shared UI contexts
├── hooks/                 # Shared UI hooks
├── i18n/                  # UI-level internationalization
├── pierre/                # Pierre — diff rendering engine
├── styles/                # CSS base styles and utilities
└── theme/                 # Design token definitions
    ├── colors.ts          # Color palette and semantic tokens
    ├── typography.ts      # Font sizes and weights
    └── ...                # Spacing, radius, etc.
```

## Key Features

### Design System

A comprehensive token-based design system with:

- **Color palette**: Semantic colors (text, background, border, primary, etc.) with dark/light mode variants
- **Typography**: `11-regular`, `12-semibold`, `14-medium`, `16-bold`, etc. — predefined type styles
- **Spacing**: Consistent spacing scale
- **Radius**: Border radius tokens

### File Icons

A large SVG sprite system with 100+ file type icons, supporting languages including:

TypeScript, JavaScript, Python, Rust, Lua, Go, C/C++, Java, Swift, Ruby, PHP, HTML, CSS, JSON, YAML, TOML, Markdown, and many more.

### Terminal Component

An embedded terminal emulator powered by [Ghostty](https://ghostty.org/) WebGL rendering, used for displaying command output in the chat interface.

### Markdown Renderer

Full markdown rendering with:

- Syntax-highlighted code blocks (via [Shiki](https://shiki.style/))
- Inline code styling
- Tables, lists, blockquotes
- HTML sanitization (via DOMPurify)

### Diff Viewer (Pierre)

Custom diff rendering engine for displaying file changes:

- Side-by-side and inline diff views
- Syntax highlighting for diffed content
- Collapse/expand support for large diffs
