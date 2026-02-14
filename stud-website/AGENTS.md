## Project Summary
A Stud website inspired by PlayerZero (https://playerzero.ai/).

## Tech Stack
- Framework: Next.js 15 (App Router)
- Styling: Tailwind CSS 4, custom globals.css tokens
- Components: React, lucide-react

## Architecture
- `src/app/page.tsx`: Main entry point assembling all sections.
- `src/components/sections/`: Section components for each page block.
- `src/components/Logo.tsx`: Reusable PlayerZero logo.
- `src/app/globals.css`: Fonts, colors, and global token styles.
- `public/assets/`: Local images and logos.
- `public/fonts/`: Local Geist and Geist Mono font files.

## Sections
- Announcement bar
- Navigation header
- Hero intro + stage row
- Hero visual + tabs
- An always-on AI support engineer
- Autonomous QA on every commit
- Memory statement
- Safe and secure
- Wide and deep context awareness
- Recent highlights
- Footer

## Running the Project
```bash
npm install
npm run dev
```
