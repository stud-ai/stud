# Stud Launch Video — Production Plan

**Format:** 1080×1080 (1:1 square, Twitter-optimized)
**FPS:** 60
**Duration:** ~60 seconds (~3600 frames)
**Framework:** Remotion (React)
**Project Path:** `/Users/shauryagupta/Downloads/stud/launch-video/`

---

## Scene-by-Scene Storyboard

### Scene 1: Hook (0s–3s) — 180 frames

**What:** Centered serif text on warm beige. Sets the "broken" premise.

| Element        | Detail                                                                                                            |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| Background     | Solid `#f8f8f6` (Stud warm white)                                                                                 |
| Text           | "Roblox coding is still stuck in 2012."                                                                           |
| Font           | Kalice (serif display), ~4.5% frame height, `#1a1817`                                                             |
| Position       | Dead center (51% from top)                                                                                        |
| Animation      | Fade in with slight scale-up (0.97 → 1.0) over 40 frames. Text appears word-by-word with gradient wipe left→right |
| Transition out | Fade to 0 over 20 frames                                                                                          |

---

### Scene 2: The Switch (3s–6s) — 180 frames

**What:** Toggle switches from "Roblox Studio" to "Stud". Background shifts to grid.

| Element          | Detail                                                                                |
| ---------------- | ------------------------------------------------------------------------------------- |
| Toggle container | Capsule pill, `#f2f2eb` bg, 1px `#e7e5e4` border, centered                            |
| Active pill      | White `#fff`, rounded 8px, behind active text                                         |
| "Roblox Studio"  | Active (black), then deactivates (grey `#757570`)                                     |
| "Stud"           | Inactive (grey), then activates (black) with white pill sliding right                 |
| Cursor           | macOS pointer enters from bottom-right, arcs to "Stud" button                         |
| Click effect     | Button scales 0.95 → 1.05 → 1.0. Radial ripple on click point                         |
| Background       | On click: beige transitions to `#f8f8f6` + subtle grid lines (`#e7e5e4`, 0.3 opacity) |
| Logo             | Stud durian logo drops in with bouncy spring after toggle. Centers above headline     |
| Headline         | "Let's build something." — Kalice serif bold, fades in from below                     |

---

### Scene 3: Feature Cards + Prompt (6s–16s) — 600 frames

**What:** 3×2 grid of Stud feature cards appears. User types a Luau coding prompt.

| Element      | Detail                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------- |
| Container    | Centered card, 80% frame width, `#f5f4f0` bg, 48px radius, 1px border, soft shadow                              |
| Cards        | 3×2 grid, 20px gaps. Each: white bg, 24px radius, 1px `#e7e5e4` border                                          |
| Card content | Icon box (left) + label (right). Icons: thin-line style                                                         |
| Card 1       | 📝 "Write Luau scripts"                                                                                         |
| Card 2       | 🔧 "Edit instances"                                                                                             |
| Card 3       | 🔍 "Search Toolbox"                                                                                             |
| Card 4       | 📊 "Query DataStores"                                                                                           |
| Card 5       | 🛡️ "Review permissions"                                                                                         |
| Card 6       | 💬 "Send a message" (highlighted, darker beige bg)                                                              |
| Entrance     | Cards stagger in: delay `i * 3` frames, spring(120, 14, 0.8)                                                    |
| Cursor       | Arcs to "Send a message" card, clicks                                                                           |
| Typing       | Input field appears. Word-by-word typing: "Build a sword combat system with damage, effects, and a leaderboard" |
| Font         | Geist Pixel (sans) for card labels, Geist Mono for typed prompt                                                 |

---

### Scene 4: The Interaction (16s–30s) — 840 frames

**What:** Stud responds like a collaborator. Asks a question, shows progress.

**Part A: Clarifying Question (16s–22s)**

| Element      | Detail                                                                                    |
| ------------ | ----------------------------------------------------------------------------------------- |
| Chat bubble  | Stud responds: "What combat style? Classic sword fighter or modern ability-based?"        |
| Bubble style | White bg, 16px radius, left-aligned with small Stud logo avatar                           |
| Options      | 4 selection chips appear below: "Classic Sword", "Ability-Based", "Hybrid", "Surprise me" |
| Cursor       | Arcs to "Classic Sword", clicks. Chip gets emerald `#10b981` border on select             |

**Part B: Progress Checklist (22s–30s)**

| Element         | Detail                                                                                                                                                           |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Checklist       | Stud shows work steps, revealed one by one with horizontal wipe                                                                                                  |
| Items           | 1. "Reading your codebase..." 2. "Generating SwordSystem.luau..." 3. "Adding damage handler..." 4. "Connecting to StarterPack..." 5. "Setting up leaderboard..." |
| Check animation | Each item: emerald dot appears → text wipes in → after 1s, dot becomes ✓ checkmark                                                                               |
| Font            | Kalice italic for the "Building plan..." header, Geist Pixel for items                                                                                           |
| Accent          | Emerald `#10b981` for checkmarks and dots (replaces Claude's terracotta)                                                                                         |

---

### Scene 5: The Result (30s–48s) — 1080 frames

**What:** Split screen showing generated code + instance tree. The "Aha" moment.

**Part A: Code Panel Slides In (30s–38s)**

| Element       | Detail                                                                          |
| ------------- | ------------------------------------------------------------------------------- |
| Layout        | Screen splits. Right panel slides in from right edge with heavy spring          |
| Left side     | Chat continues, content pushes up                                               |
| Right panel   | Code editor card, dark bg `#1a1817`, Geist Mono font                            |
| Code          | Real Luau snippet showing SwordSystem with damage logic, syntax-highlighted     |
| Syntax colors | Keywords: emerald `#10b981`, strings: amber `#f59e0b`, comments: grey `#6b7280` |
| File tab      | "SwordSystem.luau" with Lua icon                                                |

**Part B: Instance Tree (38s–44s)**

| Element    | Detail                                                                                         |
| ---------- | ---------------------------------------------------------------------------------------------- |
| Panel      | Below or replacing code, shows Roblox instance tree                                            |
| Tree items | ServerScriptService > SwordSystem, StarterPack > ClassicSword, ReplicatedStorage > SwordConfig |
| Style      | Indented list with Roblox-style icons (script, tool, module)                                   |
| Animation  | Items appear staggered from top, spring entrance                                               |

**Part C: "27+ Tools" Counter (44s–48s)**

| Element   | Detail                                                       |
| --------- | ------------------------------------------------------------ |
| Element   | Badge/counter that pops in: "27+ specialized Roblox tools"   |
| Style     | Pill badge, emerald bg, white text, Raster font (pixel/tech) |
| Animation | Scale-up spring with slight overshoot                        |

---

### Scene 6: Trust Build (48s–54s) — 360 frames

**What:** Open source credibility. Terminal with real commands.

| Element       | Detail                                                                              |
| ------------- | ----------------------------------------------------------------------------------- |
| Background    | Fade back to clean beige + grid                                                     |
| Terminal card | Dark `#1a1817` rounded card, monospace font                                         |
| Commands      | `$ git clone https://github.com/stud-ai/stud.git` → `$ bun install` → `$ bun run dev`  |
| Typing        | Character-by-character typing with blinking cursor                                  |
| Badges        | Appear below terminal: "MIT Licensed" pill + "Open Source" pill + GitHub star count |
| Badge style   | Pill-shaped, 1px dark border, Geist Pixel uppercase, generous letter-spacing        |

---

### Scene 7: CTA / End Card (54s–60s) — 360 frames

**What:** Clean end card driving to waitlist.

| Element    | Detail                                                                                      |
| ---------- | ------------------------------------------------------------------------------------------- |
| Background | Clean `#f8f8f6`, no grid                                                                    |
| Badge      | Pill: "OPEN SOURCE AI CODING ASSISTANT" — Raster font, all-caps, with Stud durian icon left |
| Headline   | "Ship your next Roblox update with Stud." — Kalice serif, large, sentence case              |
| URL        | "stud.dev" — Geist Mono, medium weight, emerald `#10b981`                                   |
| Layout     | All center-aligned vertically. Badge → 32px gap → Headline → 24px gap → URL                 |
| Animation  | Badge fades in first, headline fades in from below 10 frames later, URL last                |
| Logo       | Small Stud logo fades in at very end, bottom center                                         |

---

## Assets Inventory

### Already Have ✅

| Asset              | Location                                                       | Usage                   |
| ------------------ | -------------------------------------------------------------- | ----------------------- |
| Stud logo (PNG)    | `stud-website/public/assets/logo_transparent_bg.png`           | Logo animations, avatar |
| App icon (PNG)     | `assetstuff/icon.png`                                          | Smaller icon uses       |
| Logo SVG component | `stud-website/src/components/Logo.tsx`                         | Vector logo reference   |
| Kalice font        | `stud-website/public/fonts/Kalice-Regular.woff2`               | Display serif headlines |
| Raster font        | `stud-website/public/fonts/Raster-Regular.woff2`               | Pixel/tech badges       |
| Geist Pixel font   | `stud-website/public/fonts/GeistPixel-Regular.woff2`           | Body sans text          |
| Geist Mono font    | `stud-website/public/fonts/GeistMono-Regular.woff2` + Variable | Code/mono text          |
| Brand colors       | `stud-website/src/app/globals.css`                             | Full color system       |
| Marketing copy     | `packages/app/src/i18n/en.ts` + website sections               | Taglines, features      |
| Reference analysis | `launch-video/reference/REFERENCE_ANALYSIS.md`                 | Style guide             |
| Reference frames   | `launch-video/reference/frames/` (6 key frames)                | Visual reference        |

### Need to Create 🔨

| Asset                         | What                                                                                                 | How                                                             |
| ----------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------- |
| **macOS Cursor SVG**          | Black pointer with white outline + drop shadow. ~48-64px tall. Separate layer for Remotion animation | Create as SVG in code or find royalty-free macOS cursor SVG     |
| **Click Ripple Component**    | Animated radial circle on click. Emerald `#10b981`, fades out + scales up                            | Build as React component with Remotion spring                   |
| **Grid Background Component** | Subtle square grid pattern over beige bg. Lines `#e7e5e4` at 0.3 opacity                             | Build as SVG pattern or CSS in Remotion                         |
| **Card Icons (6)**            | Thin-line icons for feature cards: pencil, wrench, magnifier, database, shield, chat                 | Use Lucide React icons (already in project) or build simple SVG |
| **Roblox Instance Icons**     | Small icons for Script, Tool, ModuleScript in instance tree                                          | Simple colored squares matching Roblox Studio style             |
| **Syntax Highlighting**       | Luau code snippet with colored tokens                                                                | Hardcoded styled spans in React                                 |
| **Typing Cursor**             | Blinking `                                                                                           | ` cursor for terminal and chat typing                           | CSS animation or Remotion interpolate |

### User Needs to Provide 🎵

| Asset                | What                                                        | Notes                                                                 |
| -------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| **Background Music** | Lo-fi / indie pop track, ~90-100 BPM, 4/4 beat, 60+ seconds | Needs to be royalty-free for Twitter. Head-nod energy, not aggressive |
| **Click SFX**        | Muffled "thuck" mouse click sound                           | Can find royalty-free if user doesn't have                            |
| **Typing SFX**       | Soft mechanical keyboard sounds                             | Can find royalty-free if user doesn't have                            |
| **Success SFX**      | Subtle "ding" or "pop"                                      | Can find royalty-free if user doesn't have                            |

---

## Remotion Project Structure

```
launch-video/
├── reference/
│   ├── REFERENCE_ANALYSIS.md
│   └── frames/ (6 key frames)
├── src/
│   ├── Root.tsx                    # Main composition
│   ├── Video.tsx                   # Main video component wiring all scenes
│   ├── constants.ts                # Colors, fonts, timing, springs
│   ├── scenes/
│   │   ├── Hook.tsx                # Scene 1: Opening text
│   │   ├── Switch.tsx              # Scene 2: Toggle + logo reveal
│   │   ├── Features.tsx            # Scene 3: Card grid + prompt typing
│   │   ├── Interaction.tsx         # Scene 4: Chat + progress checklist
│   │   ├── Result.tsx              # Scene 5: Code panel + instance tree
│   │   ├── Trust.tsx               # Scene 6: Terminal + open source
│   │   └── CTA.tsx                 # Scene 7: End card
│   ├── components/
│   │   ├── Cursor.tsx              # Animated macOS cursor with arc movement
│   │   ├── ClickRipple.tsx         # Radial ripple on click
│   │   ├── GridBackground.tsx      # Subtle grid pattern overlay
│   │   ├── TypeWriter.tsx          # Word-by-word or char-by-char typing
│   │   ├── Toggle.tsx              # Capsule toggle switch
│   │   ├── Card.tsx                # Feature card component
│   │   ├── ChatBubble.tsx          # Chat message bubble
│   │   ├── Checklist.tsx           # Progress checklist with checkmarks
│   │   ├── CodePanel.tsx           # Syntax-highlighted code block
│   │   ├── InstanceTree.tsx        # Roblox instance tree
│   │   ├── Terminal.tsx            # Terminal card with typing
│   │   ├── Badge.tsx               # Pill badge component
│   │   └── Logo.tsx                # Animated Stud logo
│   └── assets/
│       ├── fonts/                  # Symlinked or copied from stud-website
│       └── logo.png                # Copied from stud-website
├── public/
│   └── music.mp3                   # Background track (user provides)
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

---

## Component Architecture

### Shared Spring Config

```ts
// All UI motion uses this spring — matches the Claude reference
const SPRING = { stiffness: 120, damping: 14, mass: 0.8 }

// Lighter spring for small elements
const SPRING_LIGHT = { stiffness: 200, damping: 20, mass: 0.5 }

// Heavy spring for panels
const SPRING_HEAVY = { stiffness: 80, damping: 18, mass: 1.2 }
```

### Cursor Component

- Renders macOS pointer SVG as absolutely positioned layer
- Props: `positions: Array<{x, y, frame}>` — keyframed positions
- Movement interpolated with Bezier curves (slight arc, not straight lines)
- Optional `clicks: Array<{frame}>` — triggers ClickRipple at cursor position

### GridBackground Component

- SVG pattern of light grey lines on beige
- Props: `opacity` (animated), `spacing` (grid cell size)
- Fades in when toggling from beige to grid mode

### TypeWriter Component

- Props: `text`, `mode: 'word' | 'char'`, `startFrame`, `speed`
- Word mode: reveals one word at a time (matches reference)
- Char mode: one character at a time (for terminal)
- Blinking cursor at end

---

## Timing Map (at 60fps)

| Scene       | Start Frame | End Frame | Duration | Seconds |
| ----------- | ----------- | --------- | -------- | ------- |
| Hook        | 0           | 180       | 180      | 0-3s    |
| Switch      | 180         | 360       | 180      | 3-6s    |
| Features    | 360         | 960       | 600      | 6-16s   |
| Interaction | 960         | 1800      | 840      | 16-30s  |
| Result      | 1800        | 2880      | 1080     | 30-48s  |
| Trust       | 2880        | 3240      | 360      | 48-54s  |
| CTA         | 3240        | 3600      | 360      | 54-60s  |
| **Total**   | 0           | 3600      | 3600     | **60s** |

---

## Build Order

1. Initialize Remotion project + install deps
2. Set up `constants.ts` (colors, fonts, springs, timing)
3. Build shared components: `GridBackground`, `Cursor`, `ClickRipple`, `TypeWriter`, `Badge`, `Logo`
4. Build scenes in order: Hook → Switch → Features → Interaction → Result → Trust → CTA
5. Wire all scenes in `Video.tsx` using `<Sequence>` components
6. Configure `Root.tsx` with 1080×1080, 60fps, 3600 frames
7. Preview and iterate
8. Add music/SFX (when user provides)
9. Final render to MP4
