# Stud Website

Marketing website for Stud, built with Next.js and deployed on Vercel.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | App Router framework |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://motion.dev/) | Animations |
| [Radix UI](https://radix-ui.com/) | Accessible primitives |
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

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Tokens, fonts, global styles
│   ├── docs/                 # Documentation pages
│   └── api/                  # API routes
├── components/
│   ├── sections/             # Page sections (Hero, Features, QA, etc.)
│   ├── ui/                   # Shared UI components
│   ├── emails/               # Email templates
│   └── Logo.tsx              # Stud logo component
└── lib/                      # Utilities
```

## Sections

The landing page is composed of these sections (in order):

1. **Announcement Bar** — Top banner
2. **Navigation Header** — Site navigation
3. **Hero Intro** — Headline + CTA
4. **Hero Panel** — Interactive demo with tabs
5. **Support Section** — AI support engineer showcase
6. **QA Section** — Autonomous QA features
7. **Memory Section** — Context awareness
8. **Security Section** — Safety and security
9. **Context Section** — Deep context awareness
10. **Features Section** — Feature highlights
11. **Highlights Section** — Recent updates
12. **Footer** — Links and copyright
