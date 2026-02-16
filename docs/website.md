# `stud-website/` — Marketing Website

The marketing website for Stud, hosted at [trystud.me](https://trystud.me).

## Overview

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Auth**: Clerk (waitlist / user accounts)
- **Database**: Supabase (waitlist signups)
- **Hosting**: Vercel (inferred from Next.js structure)

## Directory Structure

```
stud-website/src/
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Homepage / landing page
│   ├── layout.tsx         # Root layout
│   ├── api/               # API routes
│   │   └── clerk-webhook/ # Clerk webhook handler
│   └── ...                # Other pages
├── components/            # React components
│   ├── hero/              # Hero section
│   ├── features/          # Feature showcase
│   ├── waitlist/           # Waitlist signup form
│   └── ...                # More sections
├── lib/                   # Library utilities
│   └── supabase.ts        # Supabase client configuration
└── middleware.ts          # Next.js middleware (auth, redirects)
```

## Key Features

- **Animated landing page** with feature showcases
- **Waitlist form** with email validation and duplicate detection
- **Clerk integration** for user authentication
- **Supabase** for storing waitlist signups
- **Social card** with custom Open Graph images
- **SEO optimized** with meta tags and structured data

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous API key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook verification secret |

> All sensitive values are loaded from environment variables — none are committed to the repo.
