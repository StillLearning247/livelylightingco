# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LivelyLightingCo is a business website + headless CMS for a Govee permanent outdoor lighting installation company (Austin, TX area). React SPA with a custom admin panel, deployed on Netlify, backed by Supabase.

## Commands

```bash
npm run dev          # Vite dev server at localhost:5173
npm run build        # Production build → dist/
npm run preview      # Preview production build locally
npm run lint         # ESLint

# Playwright E2E tests (requires ADMIN_EMAIL, ADMIN_PASSWORD env vars)
npx playwright test                              # Run all tests
npx playwright test tests/debug-login.spec.ts    # Run a single test
npx playwright show-report                       # View HTML report
```

## Architecture

**Stack:** React 18 + TypeScript, Vite 5, Tailwind CSS 3, Supabase (PostgreSQL + Auth + Edge Functions), Cloudinary (images), Netlify (hosting)

### Critical Pattern: Supabase REST API over JS Client

All data fetching uses **direct `fetch()` calls to the Supabase REST API** instead of the Supabase JS client's `.from().select()` methods. This is intentional — the JS client was observed to hang. Only `supabase.auth.*` methods use the JS client. Follow this pattern for any new data operations.

### Critical Pattern: Auth Token from localStorage

Auth tokens are read directly from `localStorage` (key pattern `sb-*-auth-token`) via helper functions in the hooks, not via `supabase.auth.getSession()`. This avoids the same hanging issue.

### Routing

- `/` — Home (Hero, Gallery, Testimonials, Difference sections)
- `/about` — CMS-driven About page
- `/contact` — Consultation form (calls Supabase edge functions)
- `/admin` — Protected admin dashboard (gallery, content editor, testimonials, promos)

Navbar and Footer auto-hide on `/admin` routes. `AdminRoute` component guards admin routes by checking the `admins` table via REST.

### Data Layer

Custom hooks in `src/hooks/` encapsulate all data access:
- `useContent` / `usePageContent` / `useAllContent` — site_content table
- `useGallery` / `useAdminGallery` — gallery_images table + Cloudinary
- `useTestimonials` / `useAdminTestimonials` — testimonials table
- `useActivePromo` / `useAdminPromos` — scheduled_promos table

Each entity has a public read hook and an admin hook with CRUD mutations. All return `{ data, loading, error }`.

### CMS Content Model

The `site_content` table stores content keyed by `(page, section)`. Content is HTML from the TipTap rich text editor. The `EditableArea` component wraps CMS-editable content on public pages — when an admin is logged in, double-clicking navigates to the admin editor. Every CMS field has a hardcoded fallback so the site works without database content.

### Auth Flow

- `AdminProvider` (React Context) provides `{ admin, refresh, signOut }` globally
- Sign-in uses `supabase.auth.signInWithPassword()` with `onAuthStateChange` listener
- Sign-out clears localStorage directly, then calls `supabase.auth.signOut()` fire-and-forget
- Admin membership checked against the `admins` table (not just Supabase auth)

### Edge Functions (`supabase/functions/`)

Written in Deno (TypeScript). Deployed to Supabase:
- `send-email` — Sends contact form submissions via SendGrid
- `create-lead` — Legacy vCita CRM integration (likely removable)

Both handle CORS preflight and validate a honeypot field for spam protection.

### Image Pipeline

Gallery images stored on Cloudinary (cloud: `dydz0lw6e`). Each image has web and hi-res variants. Rendered via `@cloudinary/react` `AdvancedImage` with auto format/quality. Admin uploads use Cloudinary's unsigned upload widget.

## Database Schema

Key tables (all have RLS; public read, admin-only write via `is_admin()` function):
- `site_content` — `(page, section)` unique pairs with HTML content
- `gallery_images` — Cloudinary IDs, display_order, is_active
- `testimonials` — name, location, quote, rating, display_order
- `scheduled_promos` — date-range promos with priority
- `admins` — maps `auth.users` to admin role

## Environment Variables

Frontend vars must be `VITE_` prefixed:
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase connection
- `VITE_CLOUDINARY_UPLOAD_PRESET` — Unsigned upload preset

Edge function secrets (set in Supabase dashboard):
- `SENDGRID_API_KEY`, `NOTIFICATION_EMAIL`, `FROM_EMAIL`

## Deployment

Netlify auto-deploys from `main`. SPA redirects configured in `netlify.toml`. Strict CSP headers allow Cloudinary, Supabase, Google Analytics, Microsoft Clarity, YouTube, Google Fonts. Assets cached 1 year (immutable); `index.html` never cached.
