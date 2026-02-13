# Reference Video Analysis: Claude "Cowork" Launch

**Source:** https://youtu.be/UAmKyyZ-b9E
**Type:** Product launch video for Claude's "Cowork" feature by Anthropic
**Duration:** 68 seconds
**Format:** 1:1 square (1080×1080), optimized for Twitter/LinkedIn/Instagram

---

## Overall Structure

- **Total Duration:** 68 seconds
- **Pacing:** Slow deliberate start → accelerating middle → high-speed feature montage → clean end card
- **Approach:** "Product-as-Hero" — the UI itself is the narrative, no faces, no voiceover

### Sections

1. **Intro (0s-5s):** The "Why" and the Mode Switch
2. **The Prompt (5s-18s):** Setting the task (Meeting Analysis)
3. **The Interaction (18s-34s):** Claude as proactive collaborator (questions/progress)
4. **The Pivot (35s-46s):** "One more thing" — adding complexity
5. **The Result/Artifacts (47s-60s):** Showing output
6. **Outro (61s-68s):** CTA and Branding

---

## Scene-by-Scene Breakdown

| Timestamp       | Visual Elements                               | Text / Typography                                             | Motion / Transition                                                                                           |
| :-------------- | :-------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------ |
| **00:00-00:02** | Solid beige background                        | "Now available as a research preview" (Serif)                 | Fade in; slight scale-up                                                                                      |
| **00:02-00:05** | Rounded toggle button                         | "Chat" / "Cowork"                                             | Mouse cursor moves (linear to eased); "Cowork" button scales on click; background switches from beige to grid |
| **00:05-00:07** | Grid lines appear. Claude star logo           | "Let's knock something off your list" (Serif, Bold)           | Logo drops in with bouncy spring. Text fades in from below                                                    |
| **00:07-00:13** | Task cards (Create a file, Crunch data, etc.) | "Summarize my meetings..." (Sans-serif)                       | Cards enter with staggered delay. Typing effect is "word-by-word"                                             |
| **00:13-00:19** | Folder picker (Mac OS style)                  | "Meeting Transcripts"                                         | Folder pop-up uses `spring(stiffness: 100, damping: 15)`. Cursor click has subtle radial ripple               |
| **00:19-00:27** | Chat bubble + Selection Menu                  | "How detailed do you want this?" + Options 1-4                | Chat bubble slides up. Selection highlights with soft gray background on hover                                |
| **00:28-00:34** | Progress Checklist                            | "Building plan..." (1. Read recordings, 2. Pull points, etc.) | Checklist items "check off" with green circle animation. Progress bar fills                                   |
| **00:35-00:43** | Secondary chat bubbles                        | "actually one more thing..."                                  | Bubbles slide up. Previous content "pushes" upward (standard scroll behavior)                                 |
| **00:44-00:54** | The "Artifacts" Panel (Right side)            | "Meeting summaries", "Action items", "Team standup deck"      | Screen splits. Right panel slides in from right edge with heavy mass/damping                                  |
| **00:54-01:00** | Full-screen Slide Deck                        | "Product Team Standup"                                        | "Artifact" expands to fill 70% of screen. High-contrast colors (Pink/Purple)                                  |
| **01:01-01:08** | End Card                                      | "What will you try next?"                                     | Smooth fade to beige background. Final Logo animation (Star logo draw-in)                                     |

---

## Typography

- **Headline Font:** High-contrast Serif (similar to Ivar Text or PP Editorial New)
  - Color: Dark Charcoal `#1D1D1B`
- **Body/UI Font:** Clean Sans-Serif (similar to Söhne or Inter)
  - Weight: Medium for labels, Regular for chat text
- **System/Path Text:** Monospace (similar to JetBrains Mono) for file names like `SKILL.md`

---

## Color Palette

| Role                 | Color                   | Hex       |
| -------------------- | ----------------------- | --------- |
| Primary Background   | Warm Paper/Beige        | `#F2EBE3` |
| Foreground Text      | Dark Charcoal           | `#1D1D1B` |
| Accent Red/Logo      | Terracotta              | `#D16A5E` |
| Grid Lines           | Light gray, low opacity | `#E0D8D0` |
| Card Background      | Pure white              | `#FFFFFF` |
| Card Border          | Light grey              | `#E0DDD7` |
| Hover/Selected Card  | Darker beige            | `#ECEBE6` |
| Artifact Pink        | Bright pink             | `#D14D72` |
| Artifact Purple      | Medium purple           | `#8E7AB5` |
| Toggle Inactive Text | Medium grey             | `#757570` |
| Badge Border         | Dark charcoal           | `#1E1E1E` |

---

## Motion Design Patterns (Remotion Implementation)

### The Core Spring

Most UI elements use: `spring(frame, fps, { stiffness: 120, damping: 14, mass: 0.8 })`
Feels "wet" and tactile, not robotic.

### Staggered Entrances

Task cards use index-based delay: `delay: i * 3` frames

### Cursor as Character

- Separate animated layer
- Movement uses slight arc (Bezier curve), NOT straight lines — feels like a real human hand
- Click has subtle radial ripple effect
- Standard macOS-style black pointer with white outline and soft drop shadow

### Micro-interactions

- Buttons scale down to `0.95` on click frame
- Scale to `1.05` then settle to `1.0` on release

### Transitions

- Scene transitions use content pushing/scrolling, not hard cuts
- Panel slides use heavy mass/damping springs
- Fade-ins with slight scale-up for text reveals
- Horizontal wipe/fade for progress text reveals

---

## Rhythm & Sound

- **Music:** Lo-fi, rhythmic "office pop" — constant 4/4 beat
- **Tempo:** ~90-100 BPM
- **SFX:**
  - Clicks: muffled high-end "thuck" synced to every mouse click
  - Typing: soft mechanical keyboard sounds, pitch-shifted to be melodic
  - Success: subtle "ding" or "pop" on checklist completion

---

## UI Component Styles

### Main Container Card

- Background: Light off-white/beige `#F5F4F0`
- Border Radius: ~48px
- Border: 1px light-grey stroke
- Shadow: Large, soft-spread drop shadow, low opacity
- Padding: ~40px internal

### Task Cards (3×2 grid)

- Background: White `#FFFFFF`
- Border Radius: ~24px
- Border: 1px solid `#E0DDD7`
- Shadow: Very subtle, tight
- Internal Padding: ~24px horizontal, ~20px vertical
- Icon: nested in smaller white rounded box (~8px radius) with light grey border
- Gap between cards: ~20px

### Toggle / Mode Switch

- Container: Capsule-shaped (full rounded corners)
- Background: `#F2F2EB`
- Border: 1px `#E6E6DF`
- Active pill: White `#FFFFFF`, ~8-10px radius
- Active text: Black `#000000`
- Inactive text: Grey `#757570`

### End Card

- Badge: pill-shaped, thin border, all-caps sans-serif with generous letter-spacing
- Headline: Large serif, sentence case
- Gap between badge and headline: ~32-40px
- Everything center-aligned

---

## Viral Elements

1. **Hook:** Mode switch toggle — signals paradigm shift immediately
2. **Relatability:** Universal pain point prompt (meetings → Roblox coding for us)
3. **"Aha" Moment:** At ~0:45 when checklist auto-completes — shows agentic behavior
4. **CTA:** Question-based ("What will you try next?") encouraging engagement
5. **Product-as-hero:** No faces, the UI tells the story
6. **Pacing escalation:** Starts slow/deliberate, builds momentum

---

## Mapping to Stud Launch Video

| Reference Element         | Stud Adaptation                           |
| ------------------------- | ----------------------------------------- |
| 1:1 square format         | **1080×1080 square** for Twitter          |
| Beige `#F2EBE3` bg        | Our `#f8f8f6` bg — nearly identical       |
| Serif headlines           | Kalice (our display serif)                |
| Sans body text            | Geist Pixel (our body sans)               |
| Mono for code             | Geist Mono                                |
| "Chat → Cowork" toggle    | "Roblox Studio → Stud" toggle             |
| Meeting analysis prompt   | Luau coding prompt                        |
| 6 task cards in grid      | Stud feature cards (AI chat, tools, etc.) |
| Progress checklist        | AI task execution progress                |
| Artifacts panel           | Generated code / instance tree panel      |
| "What will you try next?" | "Ship your next Roblox update with Stud." |
| Claude star logo          | Stud durian pixel-art logo                |
| Terracotta accent         | Emerald `#10b981` accent                  |
| ~68 seconds               | ~55-65 seconds                            |
| Spring(120, 14, 0.8)      | Match exactly                             |
| Cursor-as-character       | Replicate cursor component                |

---

## Technical Specs for Remotion

- **Resolution:** 1080×1080 (1:1 square)
- **FPS:** 60
- **Duration:** ~55-65 seconds (~3300-3900 frames at 60fps)
- **Format:** MP4 (H.264)
- **Key Remotion patterns:**
  - `<Layout />` component for grid background
  - `<Cursor />` component with interpolated x,y arc movement
  - Heavy use of `<Sequence>` for panel timing
  - `spring()` for all UI motion
  - Staggered delays for card entrances

---

## Key Frames Reference

Selected frames saved in `./frames/` directory:

- `frame_001.jpg` — Opening text on beige
- `frame_005.jpg` — Toggle UI (Chat/Cowork switch)
- `frame_010.jpg` — Task cards grid with cursor
- `frame_030.jpg` — Progress/checklist building
- `frame_050.jpg` — Artifacts panel / file list
- `frame_065.jpg` — End card with CTA
