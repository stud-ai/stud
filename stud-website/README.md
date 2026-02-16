# Stud Website

Marketing website for Stud, built with Next.js and deployed on Vercel.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | App Router framework |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://motion.dev/) | Animations |
| [Radix UI](https://radix-ui.com/) | Accessible primitives |
| [Clerk](https://clerk.com/) | Waitlist + auth infrastructure |
| [Supabase](https://supabase.com/) | Waitlist metadata storage |
| [BotID](https://vercel.com/botid) | Bot protection on waitlist endpoint |
| [Lucide React](https://lucide.dev/) | Icons |
| [Geist](https://vercel.com/font) | Typography |

## Development

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Deployment

Deployed automatically to Vercel. To build locally:

```bash
npm run build
npm start
```

## Quality Checks

```bash
npm run lint
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tokens, fonts, global styles
│   ├── docs/                 # Documentation pages
│   └── api/                  # API routes
├── proxy.ts                  # Clerk proxy/middleware entry
├── instrumentation-client.ts # BotID client initialization
├── components/
│   ├── sections/             # Landing page sections
│   ├── magicui/              # Local Magic UI variants used in hero
│   ├── ui/                   # Shared UI components
│   ├── motion-primitives/    # Animation primitives
│   └── WaitlistModal.tsx     # Waitlist capture modal
└── lib/                      # Utilities
```

## Sections

The landing page is composed of these sections (in order):

1. **Hero Section** — Waitlist-first headline, CTA, video preview
2. **Features Section** — Product capability transition
3. **Hero Panel** — Terminal + tabbed use-case panel
4. **Support Section** — AI support engineer showcase
5. **QA Section** — Autonomous QA features
6. **Memory Section** — Context awareness
7. **Context Section** — Deep codebase context
8. **Security Section** — Permission and safety model
9. **Highlights Section** — Waitlist conversion CTA strip
10. **Footer** — Product/community links
