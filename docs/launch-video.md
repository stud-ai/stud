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
