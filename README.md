# Chaz's Stag App

A private Progressive Web App (PWA) for a stag do in Cologne, Germany. Guest-only access, mobile-first design, deployed on Vercel.

## Features

- **Authentication** — guests log in with their name and a shared password; sessions are HMAC-signed cookies, no third-party auth
- **Home** — landing page with a video background
- **Hermit Social** — personalised pub crawl route card per guest; interactive map (Leaflet + CartoDB) with numbered stops and tap-to-navigate links to Google Maps
- **Who's Who** — guest directory with photos, nicknames, and fun facts pulled from Supabase
- **ChazGPT** — floating AI chat widget powered by Claude Haiku via the Vercel AI SDK; personality-driven assistant for stag queries

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| AI | Anthropic Claude Haiku via Vercel AI SDK |
| Maps | Leaflet + CartoDB Positron tiles |
| Deployment | Vercel |

## Project Structure

```
app/
  (protected)/          # Authenticated routes
    page.tsx            # Home
    hermit/             # Route card (map + stop list)
    whos-who/           # Guest directory
    quiz/               # Stub
    contacts/           # Stub
    layout.tsx          # Bottom nav + ChazGPT widget
    ChazGPT.tsx         # AI chat component
  login/                # Login page (video background)
  api/
    auth/               # Login + logout endpoints
    chat/               # ChazGPT streaming endpoint
lib/
  auth.ts               # Session token creation + verification
  supabase.ts           # Supabase client + Guest type
middleware.ts           # Route protection
```

## Database Schema (Supabase)

**`guests`** — guest list used for authentication and Who's Who  
**`pubs`** — 15 venues (14 crawl pubs + 1 final venue); `lat`, `lng`, `is_final_venue`  
**`hermit_rounds`** — 4 rounds (Pairs, First Fours, Second Fours, Sevens)  
**`hermit_assignments`** — maps each guest to a pub per round; `guest_id`, `round_id`, `pub_id`

RLS is enabled on all tables. Read policies allow anon access (auth is handled at application level via session cookies).

## Environment Variables

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SESSION_SECRET=
STAG_PASSWORD=
ANTHROPIC_API_KEY=
```

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## PWA Icons

Icons are generated programmatically using the `canvas` package and the Twemoji beer emoji:

```bash
node generate-icons.mjs
```

Outputs `icon-192.png`, `icon-512.png`, and `apple-touch-icon.png` to `public/icons/`.
