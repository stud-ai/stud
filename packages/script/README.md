# @stud/script

Internal build script utilities for the Stud monorepo.

## Overview

Provides version resolution, release channel detection, and Bun version validation used by the build and publish pipelines.

## What It Does

1. **Validates Bun version** — ensures the running Bun version matches the monorepo's `packageManager` field
2. **Resolves release channel** — `latest` for tagged releases, branch name for previews
3. **Computes version** — bumps from the npm registry version or generates preview version strings

## Exports

```ts
import { Script } from "@stud/script"

Script.channel  // "latest" | branch name
Script.version  // semver string
Script.preview  // boolean
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENCODE_CHANNEL` | Override release channel |
| `OPENCODE_BUMP` | Version bump type: `major`, `minor`, `patch` |
| `OPENCODE_VERSION` | Override version string directly |
