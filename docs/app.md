# `packages/app` — Desktop Application UI

The app package contains the frontend interface for Stud, built with SolidJS. It renders inside the Tauri webview (desktop) or standalone browser (web mode).

## Overview

- **Package name**: `@stud/app`
- **Framework**: SolidJS
- **Styling**: Tailwind CSS v4
- **Build tool**: Vite

## Directory Structure

```
packages/app/src/
├── app.tsx                # Root app component — routing and layout
├── entry.tsx              # Entry point — wraps app with providers
├── index.ts               # Public exports
├── index.css              # Global styles (Tailwind entry)
├── addons/                # Optional addon integrations
├── components/            # Reusable UI components
│   ├── chat/              # Chat interface components
│   ├── dialog/            # Modal dialogs
│   ├── header/            # App header and navigation
│   ├── sidebar/           # Session sidebar
│   └── ...                # Other UI components
├── context/               # SolidJS context providers
│   ├── session.tsx         # Session state management
│   ├── server.tsx          # Server connection context
│   ├── config.tsx          # Configuration context
│   ├── theme.tsx           # Theme management
│   └── ...                 # Other contexts
├── hooks/                 # Custom SolidJS hooks
├── i18n/                  # Internationalization
│   ├── en.ts              # English (default)
│   ├── es.ts              # Spanish
│   ├── fr.ts              # French
│   ├── de.ts              # German
│   ├── ja.ts              # Japanese
│   ├── ko.ts              # Korean
│   ├── zh.ts              # Chinese
│   ├── br.ts              # Brazilian Portuguese
│   └── ...                # More languages
├── pages/                 # Route-based page components
└── utils/                 # Frontend utility functions
```

## Key Features

### Chat Interface

- Rich text message rendering with markdown support
- Streaming AI responses with real-time tool call visualization
- File diff previews with syntax highlighting
- Message branching (multiple response variants)
- Session history management

### Multi-Language Support

Full i18n for 10+ languages. All user-facing strings are externalized in `i18n/` locale files.

### Theme System

- Automatic dark/light mode detection
- Custom theme support
- Consistent design tokens (colors, typography, spacing)

### Platform Abstraction

The app is platform-agnostic — it uses a `Platform` interface to abstract native capabilities:

```ts
interface Platform {
  platform: "desktop" | "web"
  os?: "macos" | "windows" | "linux"
  fetch: typeof fetch
  openLink(url: string): void
  storage(name: string): AsyncStorage
  notify(title: string, description?: string): Promise<void>
  // ... etc
}
```

This allows the same codebase to run in both the Tauri desktop shell and standard browsers.
