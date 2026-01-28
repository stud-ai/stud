# Stud UI Redesign - Bezi-Inspired Design System

This document outlines a comprehensive UI redesign for Stud, inspired by Bezi's clean, modern interface. The goal is to create a focused, distraction-free AI coding experience optimized for Roblox development.

---

## Table of Contents

1. [Design Analysis](#design-analysis)
2. [Layout Structure](#layout-structure)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Components](#components)
6. [Implementation Plan](#implementation-plan)

---

## Design Analysis

### Reference Images Overview

#### Image 1: Full Layout with Sidebar

![Reference: Full Layout]

**Key Elements:**

- **Left Sidebar** (~240px width):
  - Project dropdown with name and chevron
  - Settings gear icon + connection status indicator (colored dot)
  - Navigation links: "Home", "Project Rules"
  - "Threads" section with collapsible list and + button
  - "Pages" section with tree structure
  - Footer with project team name and version info

- **Center Content Area**:
  - Document/page viewer (for non-chat content)
  - Clean typography with headings, paragraphs, tables

- **Right Chat Panel** (~400px width):
  - Thread selector dropdown
  - Chat messages with context tags
  - "Inspected directory" dropdown
  - Inline code diffs with stats (+24 -0)
  - "Edited X Files" collapsible with batch actions
  - Floating input with context chips

#### Image 2: Chat-Focused View (No Sidebar)

![Reference: Chat Focused]

**Key Elements:**

- **Minimal Header**:
  - Checkbox/select icon (left)
  - Project dropdown
  - Settings + status indicator
  - Breadcrumb: "Threads / [Thread Name]"
  - User avatar (right, purple circle)

- **Chat Area** (centered, max-width ~700px):
  - User messages with colored avatar circle
  - Message content in subtle rounded container
  - "Stop" button aligned right within message
  - "Thinking..." state with minimal styling

- **Floating Input Bar** (bottom):
  - Context chips row above input (@mentions, file references)
  - Text input with placeholder "Ask me about your project..."
  - Send/stop button
  - "Agent beta" toggle with dropdown
  - "New Chat" button

- **Footer**:
  - Version info (left)
  - Status icons (right)

#### Image 3: Chat with Inline Code Diff

![Reference: Code Diff]

**Key Elements:**

- **Inline Diff Block**:
  - File path with icon prefix
  - Change stats: "+120 -0" (green/red)
  - Status indicator: "Generating..."
  - Accept (checkmark) / Reject (X) buttons
  - Syntax highlighted code with line numbers
  - Green background for additions
  - Red background for deletions

- **Edited Files Bar**:
  - Collapsible "Edited 1 File" section
  - "Reject all" link (red text)
  - "Accept all" button (green filled)

#### Image 4: Split Diff View

![Reference: Split View]

**Key Elements:**

- **Header**:
  - Project dropdown
  - Thread title (centered)
  - "New Task" button
  - User initial avatar

- **Split Panel Layout**:
  - Left: Primary diff view with full controls
  - Right: Secondary file view with close button
  - Both panels have independent scroll

- **Floating Action Pill** (bottom right):
  - Change stats "+11 -16"
  - Accept/Reject buttons
  - Copy button
  - Rounded pill shape with shadow

#### Image 5: Structured Response Content

![Reference: Structured Content]

**Key Elements:**

- **Response Formatting**:
  - Bold section headings ("Assets:", "Scene Objects:")
  - Code blocks with header bar containing:
    - Expand button
    - Copy button
  - Tree-like file hierarchy display
  - Monospace font for paths/code

---

## Layout Structure

### Primary Layout Modes

```
┌─────────────────────────────────────────────────────────────────┐
│                           HEADER                                 │
│  [≡] [Project ▼]  [⚙️🟢]     Threads / Thread Name      [Avatar] │
├─────────┬───────────────────────────────────────────────────────┤
│         │                                                        │
│   S     │                                                        │
│   I     │                    CHAT AREA                           │
│   D     │                 (centered, 700px max)                  │
│   E     │                                                        │
│   B     │  ┌──────────────────────────────────────────────┐     │
│   A     │  │  [Avatar] User message content...            │     │
│   R     │  └──────────────────────────────────────────────┘     │
│         │                                                        │
│  240px  │  AI response with inline diffs...                     │
│         │                                                        │
│ (opt.)  │  ┌──────────────────────────────────────────────┐     │
│         │  │  📄 file.lua        +24 -0    [✓] [✗]        │     │
│         │  │  1  local function example()                  │     │
│         │  │  2+   print("hello")                          │     │
│         │  └──────────────────────────────────────────────┘     │
│         │                                                        │
├─────────┴───────────────────────────────────────────────────────┤
│                        EDITED FILES BAR                          │
│           ∨ Edited 3 Files           [Reject all] [Accept all]  │
├─────────────────────────────────────────────────────────────────┤
│  [@Context] [📄 File.lua]                                        │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Ask me about your project...                        [→] │    │
│  └─────────────────────────────────────────────────────────┘    │
│  [🤖 Agent ▼]                                      [New Thread] │
├─────────────────────────────────────────────────────────────────┤
│  Stud v1.0.0  |  Plugin v0.1.0            [🔗] [⚙️] [❓]        │
└─────────────────────────────────────────────────────────────────┘
```

### Layout Variants

1. **Chat Only** (default): Sidebar hidden, chat centered
2. **Chat + Sidebar**: Sidebar visible, chat shifted right
3. **Split Diff View**: Two diff panels side by side, input at bottom

---

## Color System

### Base Palette

```css
:root {
  /* Backgrounds */
  --bg-base: #1a1a1a; /* Main background */
  --bg-surface: #242424; /* Cards, panels */
  --bg-elevated: #2a2a2a; /* Dropdowns, popovers */
  --bg-inset: #151515; /* Input fields, code blocks */

  /* Borders */
  --border-subtle: #333333; /* Default borders */
  --border-muted: #2a2a2a; /* Very subtle borders */
  --border-strong: #444444; /* Emphasized borders */

  /* Text */
  --text-primary: #e8e8e8; /* Primary text */
  --text-secondary: #a0a0a0; /* Secondary text */
  --text-muted: #666666; /* Disabled, hints */
  --text-inverse: #1a1a1a; /* Text on light backgrounds */

  /* Accent Colors */
  --accent-purple: #8b5cf6; /* User messages, primary actions */
  --accent-purple-muted: #6d4aad;
  --accent-blue: #3b82f6; /* Links, info */
  --accent-green: #22c55e; /* Success, additions */
  --accent-green-bg: rgba(34, 197, 94, 0.15);
  --accent-red: #ef4444; /* Errors, deletions */
  --accent-red-bg: rgba(239, 68, 68, 0.15);
  --accent-yellow: #eab308; /* Warnings */
  --accent-orange: #f97316; /* Status indicator */

  /* Status Indicators */
  --status-connected: #22c55e; /* Green dot */
  --status-connecting: #eab308; /* Yellow dot */
  --status-disconnected: #ef4444; /* Red dot */
}
```

### Dark Theme Application

| Element             | Background          | Text               | Border            |
| ------------------- | ------------------- | ------------------ | ----------------- |
| Page                | `--bg-base`         | -                  | -                 |
| Sidebar             | `--bg-surface`      | `--text-primary`   | `--border-subtle` |
| Chat message (user) | `--bg-surface`      | `--text-primary`   | none              |
| Chat message (AI)   | transparent         | `--text-primary`   | none              |
| Code block          | `--bg-inset`        | `--text-primary`   | `--border-subtle` |
| Input field         | `--bg-inset`        | `--text-primary`   | `--border-subtle` |
| Button (primary)    | `--accent-purple`   | `--text-inverse`   | none              |
| Button (ghost)      | transparent         | `--text-secondary` | none              |
| Diff addition       | `--accent-green-bg` | `--accent-green`   | none              |
| Diff deletion       | `--accent-red-bg`   | `--accent-red`     | none              |

---

## Typography

### Font Stack

```css
:root {
  --font-sans: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
}
```

### Type Scale

| Name         | Size | Weight | Line Height | Usage             |
| ------------ | ---- | ------ | ----------- | ----------------- |
| `heading-xl` | 24px | 600    | 1.3         | Page titles       |
| `heading-lg` | 20px | 600    | 1.3         | Section headers   |
| `heading-md` | 16px | 600    | 1.4         | Card titles       |
| `heading-sm` | 14px | 600    | 1.4         | Subsections       |
| `body`       | 14px | 400    | 1.6         | Main content      |
| `body-sm`    | 13px | 400    | 1.5         | Secondary content |
| `caption`    | 12px | 400    | 1.4         | Labels, hints     |
| `code`       | 13px | 400    | 1.5         | Code blocks       |

---

## Components

### 1. Header Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ [≡] [🎮 Project Name ▼] [⚙️🟢]  Threads / Thread Name  [👤]    │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Height: 48px
- Background: `--bg-surface`
- Border bottom: 1px `--border-subtle`
- Padding: 0 16px

**Elements:**

- Menu toggle (hamburger icon) - toggles sidebar
- Project dropdown - shows current project, opens project list
- Settings + status - gear icon with colored dot overlay
- Breadcrumb - "Threads / [Thread Name]" with / as separator
- User avatar - circular, 32px, purple background with initial

### 2. Sidebar

```
┌─────────────────────┐
│ 🏠 Home             │
│ 📋 Project Rules    │
├─────────────────────┤
│ Threads         [+] │
│ ├─ Thread 1    ●    │
│ ├─ Thread 2         │
│ └─ Thread 3         │
├─────────────────────┤
│ Pages        [📁][+]│
│ ├─ 📄 Page 1        │
│ ├─ 📁 Folder        │
│ │  ├─ 📄 Subpage    │
│ │  └─ 📄 Subpage    │
│ └─ 📄 Page 2        │
├─────────────────────┤
│ Project Name        │
│ v1.0.0 | Plugin 0.1 │
└─────────────────────┘
```

**Specifications:**

- Width: 240px (collapsible to 0)
- Background: `--bg-surface`
- Border right: 1px `--border-subtle`
- Sections separated by 1px border

**Behavior:**

- Toggle with hamburger menu or keyboard shortcut
- Smooth slide animation (200ms ease)
- Active thread indicated with dot or highlight

### 3. User Message Bubble

```
┌─────────────────────────────────────────────────────────────────┐
│ [🟣] I want to add a throw to my PlayerInteraction.cs script.  │
│      If the player is holding an object and presses L, the     │
│      object they're holding should be unparented...            │
│                                                         [Stop] │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Max width: 700px
- Background: `--bg-surface`
- Border radius: 12px
- Padding: 16px
- Avatar: 32px purple circle, left-aligned

**Elements:**

- Avatar circle with user initial or icon
- Message text with proper line height
- Optional "Stop" button (during generation)

### 4. AI Response

```
I'll add throwing functionality to your script. The throw system
will unparent the held object, apply forward force, and snap it
to nearby sockets when it lands.

┌─────────────────────────────────────────────────────────────────┐
│ 📄 /Assets/Scripts/PlayerInt...  +120 -0  [Generating...] [✓][✗]│
├─────────────────────────────────────────────────────────────────┤
│  1   1  using UnityEngine;                                      │
│  2+     using System.Collections;                               │
│  3   2                                                          │
│  4   3  public class PlayerInteraction : MonoBehaviour          │
│  5   4  {                                                       │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- No background (transparent)
- Text uses `--text-primary`
- Markdown rendering for formatting
- Inline code diffs (see below)

### 5. Inline Code Diff

```
┌─────────────────────────────────────────────────────────────────┐
│ 📄 /path/to/file.lua            +24 -0         [✓] [✗]         │
├─────────────────────────────────────────────────────────────────┤
│  1   local function example()                                   │
│  2+    print("new line")                    ← green background │
│  3     return true                                              │
│  4-    old code here                        ← red background   │
└─────────────────────────────────────────────────────────────────┘
```

**Header Specifications:**

- Background: `--bg-elevated`
- Border radius: 8px 8px 0 0
- Padding: 8px 12px
- Height: 40px

**Header Elements:**

- File icon (based on extension)
- File path (truncated with ellipsis if needed)
- Change stats: "+N" in green, "-N" in red
- Status text: "Generating..." or empty
- Accept button: checkmark icon, green on hover
- Reject button: X icon, red on hover

**Code Area Specifications:**

- Background: `--bg-inset`
- Border radius: 0 0 8px 8px
- Font: `--font-mono`, 13px
- Line numbers: `--text-muted`, right-aligned, 40px width
- Max height: 300px (scrollable)

**Line Highlighting:**

- Addition: `--accent-green-bg` background, green line number prefix "+"
- Deletion: `--accent-red-bg` background, red line number prefix "-"
- Unchanged: no background

### 6. Edited Files Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ ∨ Edited 3 Files                      [Reject all] [Accept all] │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Position: sticky, above input bar
- Background: `--bg-surface`
- Border: 1px `--border-subtle`
- Border radius: 8px
- Padding: 8px 16px
- Height: 44px

**Elements:**

- Collapse chevron (rotates on expand)
- "Edited N Files" text
- "Reject all" link: `--accent-red` text, no background
- "Accept all" button: `--accent-green` background, white text

**Expanded State:**

- Shows list of edited files with individual accept/reject

### 7. Floating Input Bar

```
┌─────────────────────────────────────────────────────────────────┐
│ [@Roblox] [📄 PlayerScript.lua] [📄 GameManager.lua]            │
├─────────────────────────────────────────────────────────────────┤
│ Ask me about your project...                               [→] │
├─────────────────────────────────────────────────────────────────┤
│ [🤖 Agent ▼]                                       [New Thread] │
└─────────────────────────────────────────────────────────────────┘
```

**Container Specifications:**

- Position: fixed bottom
- Max width: 700px (centered)
- Background: `--bg-surface`
- Border: 1px `--border-subtle`
- Border radius: 12px
- Margin bottom: 16px
- Box shadow: 0 4px 12px rgba(0,0,0,0.3)

**Context Chips Row:**

- Padding: 8px 12px
- Border bottom: 1px `--border-muted`
- Chips: pill-shaped, `--bg-elevated` background

**Input Row:**

- Padding: 12px
- Input: full width, no border, transparent background
- Send button: 32px circle, `--accent-purple` when active

**Actions Row:**

- Padding: 8px 12px
- Border top: 1px `--border-muted`
- Agent toggle: dropdown with "beta" badge
- New Thread button: ghost button style

### 8. Context Chip

```
[@Context]  [📄 FileName.lua]  [🎮 Instance]
```

**Specifications:**

- Background: `--bg-elevated`
- Border: 1px `--border-subtle`
- Border radius: 16px (pill)
- Padding: 4px 10px
- Font size: 12px
- Icon: 14px, `--text-secondary`
- Text: `--text-primary`

**Variants:**

- `@mention`: @ prefix, purple icon
- `file`: document icon, blue icon
- `instance`: game controller icon, orange icon

### 9. Status Footer

```
┌─────────────────────────────────────────────────────────────────┐
│ Stud v1.0.0  |  Plugin v0.1.0  🟢           [🔗] [⚙️] [❓]     │
└─────────────────────────────────────────────────────────────────┘
```

**Specifications:**

- Height: 32px
- Background: `--bg-base`
- Border top: 1px `--border-subtle`
- Padding: 0 16px
- Font size: 12px
- Text: `--text-muted`

---

## Implementation Plan

### Phase 1: Foundation (Week 1)

1. **Color System Update**
   - Update CSS variables in theme files
   - Apply new color palette globally
   - Test contrast ratios for accessibility

2. **Typography Update**
   - Add Inter font (or similar)
   - Update type scale
   - Apply to all text elements

3. **Layout Restructure**
   - Create new centered chat layout
   - Implement max-width container
   - Set up CSS Grid/Flexbox structure

### Phase 2: Core Components (Week 2)

1. **Header Bar**
   - Simplify current header
   - Add breadcrumb navigation
   - Implement project dropdown

2. **Message Components**
   - Restyle user message bubbles
   - Update AI response styling
   - Add avatar support

3. **Input Bar**
   - Create floating input component
   - Add context chips
   - Implement actions row

### Phase 3: Diff System (Week 3)

1. **Inline Code Diffs**
   - Create new diff component
   - Add accept/reject buttons
   - Implement syntax highlighting

2. **Edited Files Bar**
   - Create collapsible component
   - Add batch actions
   - Implement file list view

### Phase 4: Sidebar & Polish (Week 4)

1. **Collapsible Sidebar**
   - Create sidebar component
   - Add threads list
   - Implement collapse animation

2. **Status Footer**
   - Create footer component
   - Add version info
   - Implement status icons

3. **Final Polish**
   - Animations and transitions
   - Hover states
   - Focus states for accessibility
   - Mobile responsiveness

---

## File Structure Changes

```
packages/ui/src/
├── components/
│   ├── chat/
│   │   ├── message-bubble.tsx      # User message component
│   │   ├── ai-response.tsx         # AI response component
│   │   ├── inline-diff.tsx         # Code diff component
│   │   └── edited-files-bar.tsx    # Batch actions bar
│   ├── input/
│   │   ├── floating-input.tsx      # Main input component
│   │   ├── context-chip.tsx        # File/mention chips
│   │   └── agent-toggle.tsx        # Agent mode toggle
│   ├── layout/
│   │   ├── header-bar.tsx          # Top navigation
│   │   ├── sidebar.tsx             # Left sidebar
│   │   ├── chat-container.tsx      # Centered chat area
│   │   └── status-footer.tsx       # Bottom status bar
│   └── ...
├── styles/
│   ├── theme.css                   # CSS variables
│   ├── typography.css              # Font styles
│   └── components/
│       ├── chat.css
│       ├── input.css
│       └── layout.css
└── ...
```

---

## Migration Notes

### Breaking Changes

- Layout structure significantly changed
- Some existing components may need to be deprecated
- CSS class names will change

### Backward Compatibility

- Existing tool renderers should still work
- Message content rendering unchanged
- Keyboard shortcuts preserved

### Testing Requirements

- Visual regression testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Responsive design testing
- Accessibility audit (WCAG 2.1 AA)

---

## Appendix: Component Mapping

| Current Component    | New Component        | Notes                |
| -------------------- | -------------------- | -------------------- |
| `prompt-input.tsx`   | `floating-input.tsx` | Complete rewrite     |
| `session.tsx` layout | `chat-container.tsx` | Extract from page    |
| `message-part.tsx`   | Split into multiple  | Separate user/AI     |
| File tabs            | Inline diffs         | Major paradigm shift |
| Status popover       | `status-footer.tsx`  | Always visible       |

---

_Document created: January 2026_
_Last updated: January 2026_
_Author: Stud Development Team_
