# `stud-website/` — Marketing Website

The marketing website for Stud, hosted at [trystud.me](https://trystud.me).

## Overview

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Clerk (waitlist + webhook sync)
- **Database**: Supabase (waitlist signups)
- **Bot Protection**: Vercel BotID
- **Hosting**: Vercel

## Directory Structure

```
stud-website/src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Homepage / landing page
│   ├── layout.tsx         # Root layout
│   ├── api/               # API routes
│   │   ├── join-waitlist/ # Waitlist endpoint (Clerk + Supabase)
│   │   ├── waitlist-metadata/
│   │   └── clerk-webhook/ # Clerk webhook handler
│   └── ...                # Other pages
├── components/            # React components
│   ├── sections/          # Homepage sections
│   ├── magicui/           # Localized Magic UI variants
│   ├── motion-primitives/ # Animation building blocks
│   └── WaitlistModal.tsx
│   └── ...                # More sections
├── lib/                   # Library utilities
│   └── supabase.ts        # Supabase client configuration
├── proxy.ts               # Clerk proxy entry
└── instrumentation-client.ts # BotID client setup
```

## Key Features

- **Animated landing page** with feature showcases
- **Waitlist form** with email validation and duplicate detection
- **Clerk + Supabase** integration for waitlist lifecycle
- **BotID-protected** waitlist submissions
- **Social card** with custom Open Graph images
- **SEO optimized** with meta tags and structured data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key |
| `CLERK_SECRET_KEY` | Clerk backend API key |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification secret |
| `NEXT_PUBLIC_CLARITY_ID` | Microsoft Clarity project ID |
| `NEXT_PUBLIC_WAITLIST_VIDEO_URL` | Optional YouTube URL override |

> All sensitive values are loaded from environment variables — none are committed to the repo.
