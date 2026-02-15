# Stud Launch Video

Animated launch video for Stud, built with [Remotion](https://remotion.dev/).

## Development

```bash
# Install dependencies
bun install

# Open Remotion Studio (live preview)
bun run studio

# Render final video
bun run render

# Render with H.264 codec
bun run build
```

Output is saved to `out/stud-launch.mp4`.

## Scenes

The video is composed of these scenes:

| Scene | Description |
|-------|-------------|
| `Hook` | Opening hook |
| `Interaction` | Live interaction demo |
| `Explorer` | Instance explorer showcase |
| `Features` | Feature highlights |
| `Models` | Multi-model support |
| `Switch` | Provider switching |
| `Result` | Result showcase |
| `Trust` | Trust and security |
| `CTA` | Call to action / closing |

## Project Structure

```
src/
├── Video.tsx          # Main composition (scene sequencing)
├── Root.tsx           # Remotion root
├── index.ts           # Entry point
├── constants.ts       # Timing, colors, typography tokens
├── fonts.ts           # Font loading
├── scenes/            # Individual scenes
├── components/        # Shared components
└── assets/            # Images and media
```
