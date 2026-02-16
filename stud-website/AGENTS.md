## Project Summary
A waitlist-focused marketing site for Stud (https://trystud.me).

## Tech Stack
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS 4, custom globals.css tokens
- Components: React, lucide-react, framer-motion

## Architecture
- `src/app/page.tsx`: Main entry point assembling all sections.
- `src/components/sections/`: Section components for each page block.
- `src/components/WaitlistModal.tsx`: Waitlist capture flow and submission UX.
- `src/app/api/join-waitlist/route.ts`: Waitlist endpoint (BotID + Clerk + Supabase).
- `src/proxy.ts`: Clerk proxy entry.
- `src/instrumentation-client.ts`: BotID client initialization.
- `src/app/globals.css`: Fonts, colors, and global token styles.
- `public/assets/`: Local images and logos.
- `public/fonts/`: Local Geist and Geist Mono font files.

## Sections
- Hero section (waitlist + video)
- Features transition
- Hero panel (terminal + tabs)
- Support section
- QA section
- Memory section
- Context section
- Security section
- Highlights section
- Footer

## Running the Project
```bash
npm install
npm run dev
```
