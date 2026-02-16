# `packages/script` — Build & Release Scripts

The script package provides internal build utilities for the CI/CD pipeline.

## Overview

- **Package name**: `@stud/script`
- **Purpose**: Version resolution, release channel detection, and Bun version validation
- **Usage**: Used by the build and publish pipelines, not end users

## What It Does

1. **Validates Bun version** — ensures the running Bun version matches the monorepo's `packageManager` field
2. **Resolves release channel** — `latest` for tagged releases, branch name for previews
3. **Computes version** — bumps from the npm registry version or generates preview version strings

## Exports

```ts
import { Script } from "@stud/script"

Script.channel  // "latest" | branch name
Script.version  // semver string (e.g., "0.5.0" or "0.5.0-preview.abc123")
Script.preview  // boolean — true if preview build
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENCODE_CHANNEL` | Override release channel |
| `OPENCODE_BUMP` | Version bump type: `major`, `minor`, `patch` |
| `OPENCODE_VERSION` | Override version string directly |
