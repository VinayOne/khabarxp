# khabarxp.in — Frontend (Next.js 16 + Headless WordPress)

The new public-facing frontend for [khabarxp.in](https://khabarxp.in/) — a Hindi news aggregator. The WordPress admin and WP Automatic RSS-ingest plugin stay where they are; this app replaces the public theme with a fast, server-rendered Next.js frontend that talks to the WordPress REST API.

## Architecture

```
┌────────────────────────────────────────┐
│  khabarxp.in (WordPress backend)       │
│  • /wp-admin  (admin panel)            │
│  • /wp-json   (REST API)               │
│  • WP Automatic (RSS ingestion)        │
│  • 6,332+ posts in DB                  │
└──────────────┬─────────────────────────┘
               │ WP REST API (HTTPS)
               ▼
┌────────────────────────────────────────┐
│  Next.js 16 (this repo)                │
│  • App Router + ISR (revalidate 60s)   │
│  • Image optimization                  │
│  • Sitemap, RSS, structured data       │
│  • Hindi-first UI (Noto Sans Devanagari)│
│  • AdSense-ready ad slots              │
│  • WP comments via REST API            │
└──────────────┬─────────────────────────┘
               │
               ▼
        Cloudflare CDN / Edge cache
```

## Stack

- **Next.js 16** (App Router, RSC, Turbopack)
- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **WordPress REST API** (no GraphQL needed for our subset of features)
- **Hindi (Devanagari)** typography via `next/font/google`

## Local Development

```bash
# Install deps
npm install

# Copy env template, fill in values
cp .env.example .env.local

# Start dev server (Turbopack)
npm run dev
# → http://localhost:3000
```

`.env.local` defaults already point at the live khabarxp.in WP API. No extra setup needed for the MVP.

## Build & Deploy

```bash
# Production build
npm run build

# Run production server
npm start
```

The app is designed to deploy via [Coolify](https://coolify.io/) on the same Contabo VPS as the WordPress backend. A Caddy reverse-proxy in front routes `/wp-admin/*`, `/wp-login.php`, and `/wp-content/*` to WordPress and everything else to this Next.js app.

## Project Structure

```
khabarxp-frontend/
├── app/
│   ├── layout.tsx           # Root layout, Hindi font, AdSense/GA hooks
│   ├── page.tsx             # Homepage
│   ├── globals.css          # Tailwind + article-content styles
│   ├── not-found.tsx        # 404 page
│   ├── category/[slug]/     # Category page (paginated)
│   ├── post/[slug]/         # Single post + WP comments
│   ├── search/              # Search results
│   ├── sitemap.ts           # Auto-generated sitemap
│   ├── rss.xml/route.ts     # Auto-generated RSS feed
│   └── api/revalidate/      # On-demand revalidation webhook
├── components/
│   ├── Header.tsx           # Logo + category nav + search
│   ├── Footer.tsx           # Categories + about + legal
│   ├── PostCard.tsx         # 4-size post card (hero/large/medium/small)
│   ├── AdSlot.tsx           # AdSense placeholder (renders real ad when env set)
│   └── Comments.tsx         # WP comments (client component)
├── lib/
│   ├── types.ts             # TypeScript types + category config + SITE constants
│   └── wp.ts                # WordPress REST API client
├── public/                  # Static assets
├── .env.example             # Environment template
├── .env.local               # Local env (gitignored)
├── next.config.ts           # Image domains, security headers
└── package.json
```

## Updating Categories

Categories are hardcoded in `lib/types.ts` (`CATEGORIES`). To add a new one:

1. Add an entry in `CATEGORIES` with id, slug, hindi label, emoji.
2. Push to GitHub.
3. Redeploy.

The category count in the nav is fetched live from the WP API.

## AdSense Integration (Phase 4)

`AdSlot` is already wired up. To enable real AdSense:

1. Apply for AdSense (separate workflow, after site has traffic).
2. Once approved, add the publisher ID to your Coolify env:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   ```
3. Redeploy. The placeholder boxes become real `<ins class="adsbygoogle">` units.

Ad slot positions:
- `homepage-top-banner` — top of homepage
- `homepage-mid` — after hero section
- `homepage-bottom` — bottom of homepage
- `category-{slug}-top` / `-bottom` — category pages
- `post-top` / `post-mid` — single post page

## On-Demand Revalidation

When WP Automatic publishes a new post, Next.js's 60s ISR cache means the new post might take up to a minute to appear. To make it instant:

1. Set `REVALIDATE_SECRET` in the Next.js env (Coolify).
2. From a small WP plugin or a server-side hook, POST to `https://khabarxp.in/api/revalidate` with body `{ "secret": "...", "slug": "/post/new-article-slug" }`.

For now, 60s revalidation is fine — auto-aggregated content rarely needs second-by-second freshness.

## Roadmap

- ✅ Phase 1: Next.js frontend that consumes WP REST API
- ⏭️ Phase 2: Caddy reverse proxy in front, point khabarxp.in to Vercel/Coolify
- ⏭️ Phase 3: LLM rewriting worker (rewrite RSS content before publish to WP)
- ⏭️ Phase 4: Apply for AdSense, replace ad placeholders with real units
- ⏭️ Phase 5: Social sharing, newsletter signup, push notifications

## Notes

- **WordPress stays.** This project does not move the CMS — it only replaces the public theme. `/wp-admin` still works exactly as it does today.
- **Hindi content.** All typography, fonts, and meta tags are configured for Hindi (Devanagari). The site lang is `hi`.
- **Performance.** ISR with revalidate=60s, Cloudflare in front, image optimization via `next/image` — expect sub-second TTFB.
- **SEO.** Sitemap auto-generated, RSS feed auto-generated, OpenGraph + Twitter card meta on every page, JSON-LD via Next.js metadata API.

## License

Private — © Vinay Kumar Munda. All rights reserved.
