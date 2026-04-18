# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: DevisEvent

A mobile-first web app for generating event business quotes (devis). Users can create quotes, manage clients, upload a logo and a stamp (tampon), and export the final quote as a PDF.

## Tech Stack

- **Frontend**: React + Vite, Tailwind CSS — hosted on Vercel
- **Backend**: Supabase Cloud (PostgreSQL + Auth + Storage + RLS) — no backend server to run or deploy
- **PDF generation**: html2canvas + jsPDF
- **Supabase client**: `supabase-js` (called directly from React components)

## Dev Setup

```bash
npm install
# Create .env.local with your Supabase project keys (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
# Keys are found in your Supabase project: Settings > API
npm run dev
```

Build for production:
```bash
npm run build
```

## Architecture

There is **no dedicated backend server**. The React frontend communicates directly with Supabase Cloud via `supabase-js`. The backend lives permanently in the Supabase cloud — cloning the repo does not affect it.

```
User (browser/mobile)
  ↓ web browser
Frontend — React + Vite
  Pages: login, profile, new quote, PDF preview
  Style: Tailwind CSS
  PDF: html2canvas + jsPDF
  ↓ supabase-js
Backend — Supabase Cloud
  PostgreSQL DB + Auth + Storage + Row Level Security
```

## Database Schema

Three main tables:
- `clients` — event organizer/client details
- `quotes` — quote header (client ref, event info, org_id)
- `quote_items` — line items / services (prestations) linked to a quote

Data isolation is enforced at the database level via RLS (not in application code):
```sql
CREATE POLICY 'user_policy' ON quotes FOR ALL USING (org_id = auth.uid());
```

## Supabase Storage

Logo and stamp files are stored in the `business-assets` bucket:
```js
supabase.storage.from('business-assets').upload('logo.png', file)
```

## Authentication

Email + password via Supabase Auth:
```js
supabase.auth.signInWithPassword({ email, password })
```

## .env.local (never commit)

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Never commit `.env.local` — it contains Supabase secret keys that grant full database access.

## Supabase Free Tier

The project goes into **sleep mode after 7 days of inactivity** on the free plan. To wake it: log into supabase.com dashboard and click "Restore project".

## Team Roles

- Frontend dev: React UI, forms, responsive design
- Backend dev: Supabase tables, RLS policies, Storage buckets
- Fullstack / Integration + PDF (this branch — Jaspe): React ↔ Supabase wiring, API calls, PDF generation with html2canvas + jsPDF

Branch workflow: each member works on their own branch → merge to `develop` when validated → merge to `main` for final release.
