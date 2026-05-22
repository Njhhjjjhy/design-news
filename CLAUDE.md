# Design News

A curated news aggregator and note-taking app for design professionals. Aggregates RSS feeds from design publications, embeds YouTube design channels, and provides an integrated note editor that publishes to a blog.

## Tech Stack

- **Framework:** Next.js 16.1 with App Router, React 19, TypeScript 5 (strict)
- **Styling:** Tailwind CSS 4 with CSS variables (oklch color space), shadcn/ui (new-york style)
- **State:** React Query (`@tanstack/react-query`) for server state, Zustand for client state
- **Animations:** GSAP 3.14 + Framer Motion
- **Rich Text:** Tiptap editor with code highlighting (lowlight)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Geist Sans + Geist Mono (via `next/font`)

## Commands

```bash
npm run dev       # Start dev server (port 3000)
npm run build     # Production build
npm run start     # Production server
npm run lint      # ESLint
```

## Project Structure

```
app/                    # Next.js App Router pages
  api/news/route.ts     # RSS aggregation API (2h cache, 30s timeout)
  api/videos/route.ts   # YouTube video API
  latest/page.tsx       # Main news feed (redirected from /)
  notes/page.tsx        # Note editor
  blog/[slug]/page.tsx  # Published blog posts
  videos/page.tsx       # Design video feed
  studio/               # Studio sub-pages (school, work)
  contact/page.tsx
components/
  ui/                   # shadcn/ui primitives (do not edit directly)
  landing/              # Homepage sections (hero, features, highlights)
  news/                 # News cards, category nav, filter bar
  notes/                # Note editor, metadata, publish modal
  blog/                 # Blog post view
  videos/               # Video cards
  search/               # Global search overlay
  navigation-bar.tsx    # Sticky top nav with search
  providers.tsx         # React Query provider
hooks/                  # Custom hooks (useNewsFilter, useNotes, useSearch, useVideoFilter)
lib/
  api/                  # RSS parser, news aggregator, YouTube fetcher
  storage/              # LocalStorage-based blog/notes persistence
  utils/                # cn(), GSAP animations, markdown-to-html, search
  types.ts              # Shared types (NewsItem, Note, BlogPost, VideoItem, Category)
scripts/                # Utility scripts (YouTube channel ID lookup)
```

## Key Architecture

- **`/` redirects to `/latest`** — the app is functional, not a marketing site
- **RSS aggregation** happens server-side in `api/news/route.ts` with in-memory caching (2h TTL). Each feed has an 8s timeout. Results are deduped by URL.
- **React Query** manages all client data fetching with 5-min stale time and refetch-on-focus
- **Notes/Blog storage** uses localStorage via `lib/storage/` — no database
- **Categories:** UI, UX, AX, VibeCoding, DesignSystems, Prototypes, ComponentLibraries, Interactions
- **Dark mode** supported via `next-themes` and CSS variable swapping (`.dark` class)
- **GSAP animations** on nav (logo spin, button hover, search focus), news cards (staggered entrance), and scroll-triggered fades

## Path Aliases

`@/*` maps to `./*` (project root, not `src/`). Import as `@/components/...`, `@/lib/...`, `@/hooks/...`.

## Conventions

- **Components:** PascalCase exports, kebab-case filenames
- **Hooks:** `use` prefix, camelCase filenames (`useNewsFilter.ts`)
- **shadcn/ui components** live in `components/ui/` — add new ones via `npx shadcn@latest add`, don't hand-edit
- **Import order:** React/Next.js, third-party, internal utils/hooks, components, types
- **Accessibility:** WCAG AAA target — 3px focus rings, skip-to-content link, ARIA labels, keyboard shortcuts (0-8 for category filtering), semantic HTML
- **Responsive:** Mobile-first with breakpoints at `md` (768px), `lg` (1024px), `large` (90rem/1440px)
- **Remote images:** YouTube thumbnails allowed via `next.config.ts` remotePatterns

## Environment Variables

`.env.local` is required. Check `.env.local` for the current keys needed (YouTube API key).


## Obsidian vault

- Path: /Users/riaan/Documents/personal/obsidian-vault
- After each session, write a handoff note to /Users/riaan/Documents/personal/obsidian-vault/sessions/
- Use filename format: YYYY-MM-DD-[project-name]-[topic].md
