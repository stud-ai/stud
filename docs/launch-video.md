# `launch-video/` — Launch Video

A programmatic launch video for Stud, built with [Remotion](https://www.remotion.dev/).

## Overview

- **Framework**: Remotion (React-based video rendering)
- **Resolution**: 1920×1080
- **Duration**: ~24 seconds
- **Output**: MP4 video

## Directory Structure

```
launch-video/
├── src/                   # Video scenes and composition
│   ├── Root.tsx           # Root composition
│   ├── scenes/            # Individual video scenes
│   └── ...                # Shared components, styles
├── public/                # Static assets (screenshots, images)
├── out/                   # Rendered output
├── PLAN.md                # Scene planning document
├── remotion.config.ts     # Remotion configuration
└── package.json
```

## Development

```bash
# Install dependencies
cd launch-video
bun install

# Preview in browser
bun run start

# Render final video
bun run build
```

## Purpose

This video demonstrates the Stud workflow — showing AI-powered Roblox development with live Studio integration, code editing, and natural language interaction.

## Launch Video Parity Gap Analysis (2026-02-20)

### Scope

- Product gaps only (exclude marketing-only copy mismatches)
- Source of truth for claims: `launch-video/src/scenes/*.tsx`

### Scene-to-Feature Matrix

| Video claim | Current state | Gap | Planned files |
|---|---|---|---|
| New-session launcher with 3x2 quick actions | New session view only shows project/worktree metadata | Missing launcher cards and quick intent entry points | `packages/app/src/components/session/session-new-view.tsx`, `packages/app/src/i18n/en.ts` |
| Explorer updates in real time while tools run | Explorer tree is fetched once and manually reopened to reflect updates | Missing event-driven live refresh behavior | `packages/app/src/components/instance-tree.tsx`, `packages/app/src/components/session/session-left-sidebar.tsx` |
| Sidebar “Live Changes” stream with action statuses and sync recency | No dedicated Explorer-side activity stream for Roblox operations | Missing dedicated panel for Roblox action feed and summary badges | `packages/app/src/components/session/session-live-changes.tsx`, `packages/app/src/components/session/session-left-sidebar.tsx`, `packages/app/src/components/session/index.ts`, `packages/app/src/i18n/en.ts` |
| Playtest/verification pass tool flow | No dedicated `roblox_playtest_run` tool and no `/playtest/run` plugin endpoint | Missing end-to-end playtest API + tool + UI rendering | `packages/core/src/tool/roblox/playtest.ts`, `packages/core/src/tool/roblox/index.ts`, `packages/core/src/tool/registry.ts`, `packages/core/src/tool/roblox/playtest.test.ts`, `studio-plugin/Stud.server.lua`, `packages/ui/src/components/message-part.tsx`, `packages/ui/src/i18n/en.ts`, `packages/ui/src/components/session-turn.tsx` |
| Roblox tool status text in steps reflects current tool IDs | `session-turn` still includes old/nonexistent Roblox tool IDs in status mapping | Status mapping drift for modern `roblox_*` tools | `packages/ui/src/components/session-turn.tsx`, `packages/ui/src/i18n/en.ts` |

### Rollout Plan

#### Phase 1 — Docs + New Session Launcher

- Add this parity section and implementation matrix.
- Add new-session quick action cards:
  - Write scripts
  - Edit instances
  - Search toolbox
  - Query datastores
  - Review permissions
  - Send message
- Wire card clicks to prefill prompt via existing send-message event path (no auto-submit).

#### Phase 2 — Explorer Live Refresh + Live Changes Panel

- Add event-driven debounced refetch in instance tree when Roblox mutating tool events complete/error.
- Add manual Explorer refresh control in sidebar header.
- Add `SessionLiveChanges` panel to summarize recent Roblox operations, statuses, and sync recency.
- Add playtest pass badge behavior when playtest metadata indicates success.

#### Phase 3 — Playtest Backend + Tool + UI

- Add new Studio plugin endpoint `POST /playtest/run`.
- Add new core tool `roblox_playtest_run` using bridge + plugin endpoint.
- Register/export tool in Roblox tool index and tool registry.
- Render playtest action card with check-level pass/fail details in UI.
- Ensure outdated plugin fallback messaging when endpoint is unavailable.

### Public API Additions

#### `POST /playtest/run` (Studio plugin)

Request:

```ts
type PlaytestRunRequest = {
  suite: string
  checks: Array<
    | { id: string; label: string; type: "instance_exists"; path: string }
    | { id: string; label: string; type: "property_equals"; path: string; property: string; expected: string }
    | { id: string; label: string; type: "script_compiles"; path: string }
  >
}
```

Response:

```ts
type PlaytestRunResponse = {
  suite: string
  passed: boolean
  totals: { total: number; passed: number; failed: number }
  checks: Array<{
    id: string
    label: string
    passed: boolean
    detail: string
    durationMs: number
  }>
}
```

#### New Core Tool

```ts
id: "roblox_playtest_run"
input: PlaytestRunRequest
metadata: PlaytestRunResponse & { source: "studio-plugin" }
```

### Acceptance Criteria

1. New session screen shows a 3x2 launcher and clicking each card prefills prompt text.
2. Explorer supports explicit refresh and also auto-refreshes after Roblox mutating tool events.
3. Explorer sidebar includes a live changes stream of recent `roblox_*` operations with status chips and action count.
4. Playtest tool is callable from core, executes through plugin endpoint, and returns structured check-level results.
5. Tool output UI renders playtest results as a checklist with clear pass/fail indicators.
6. Status text in session steps correctly maps current Roblox tool IDs.

### Test Scenarios

1. Unit: validate `roblox_playtest_run` schema and metadata shape.
2. Plugin functional: call `/playtest/run` through bridge and verify deterministic pass/fail for each check type.
3. UI rendering: verify playtest card renders checklist and pass/fail states.
4. Explorer sync: verify tree refreshes from Roblox mutating events and panel updates action feed.
5. New-session launcher: verify each quick action prefills prompt as expected.
