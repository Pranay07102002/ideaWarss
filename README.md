# ⚡ IdeaWatts

A minimal app for collecting and ranking ideas. Open a **thread**, let people
post **ideas**, **upvote** the best ones, and flip to the **leaderboard** to see
the top ideas rise to the top — with subtle animations throughout.

Built with **Next.js (App Router)**, **Supabase** (auth + Postgres), **Tailwind
CSS**, and **Framer Motion**. Designed to deploy on **Vercel** in minutes.

## Features

- Email sign-up / sign-in (Supabase Auth — email + password only)
- Create discussion threads and share their URL with anyone
- Post ideas as comments on a thread
- One-click upvoting (one vote per user per idea) with a spark animation
- Live **Leaderboard** view that reorders ideas by votes in real time
- Public read access so shared links work even before signing in

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** and run the contents of
   [`supabase-schema.sql`](./supabase-schema.sql). This creates the
   `threads`, `ideas`, and `votes` tables with row-level security.
3. (Recommended for a smooth demo) In **Authentication → Providers → Email**,
   turn **off** "Confirm email" so new users can sign in immediately. If you
   leave it on, users must click the confirmation link first.
4. Grab your API keys from **Project Settings → API**:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2. Run locally

```bash
cp .env.local.example .env.local   # then paste your Supabase values
npm install
npm run dev
```

Open http://localhost:3000.

## 3. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the two environment variables (`NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy. That's it — no extra build configuration needed.

> If you keep email confirmation enabled, set your deployed URL under Supabase
> **Authentication → URL Configuration → Site URL** so confirmation links point
> back to your app (e.g. `https://your-app.vercel.app`).

## Project structure

```
app/
  page.tsx                 Home: thread list + create thread
  login/page.tsx           Email auth (sign in / sign up)
  thread/[id]/page.tsx     Thread view (server-fetched data)
  auth/callback/route.ts   Email confirmation handler
components/                Navbar, forms, idea cards, share button
lib/supabase/             Browser / server / middleware clients
supabase-schema.sql        Database schema + RLS policies
```
