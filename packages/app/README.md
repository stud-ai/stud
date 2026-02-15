# @stud/app

The desktop application UI for Stud, built with SolidJS and Tailwind CSS 4.

## Overview

This package provides the full UI that runs inside the Tauri desktop shell. It includes the chat interface, session management, instance explorer, terminal emulator, and all interactive components.

## Development

```bash
# Start Vite dev server (web only, no native shell)
bun run dev

# Start with Tauri (full native app) — run from repo root
bun run dev
```

The Vite dev server runs on `http://localhost:1420`.

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Vite dev server |
| `bun run build` | Production build to `dist/` |
| `bun run typecheck` | Typecheck with `tsgo` |

## E2E Testing

Uses Playwright. The Vite dev server starts automatically via `webServer`.

```bash
# Install browsers
bunx playwright install

# Run all E2E tests
bun run test:e2e:local

# Run specific tests
bun run test:e2e:local -- --grep "settings"

# Interactive UI mode
bun run test:e2e:ui

# View report
bun run test:e2e:report
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PLAYWRIGHT_SERVER_HOST` | `localhost` | Backend host |
| `PLAYWRIGHT_SERVER_PORT` | `4096` | Backend port |
| `PLAYWRIGHT_PORT` | `3000` | Vite dev server port |
| `PLAYWRIGHT_BASE_URL` | `http://localhost:<port>` | Override base URL |
