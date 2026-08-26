# U-Pioneers Accelerator

Real, production-grade rebuild of the U-Pioneers digital accelerator platform: Next.js (App Router) + Supabase (Postgres, Auth, Storage, Row Level Security).

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4)
- **Supabase** — database, authentication, file storage, and authorization (RLS)
- Hosting target: **Vercel** (free tier)

## Local development

```bash
npm install
npm run dev
```

Requires `.env.local` (already present locally, not committed) with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Deploying to Vercel

1. Push this repository to GitHub (private or public, your choice).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Set the **Root Directory** to `u-pioneers-web` if the repo contains more than this app.
4. Add the two environment variables above in the Vercel project settings (Project → Settings → Environment Variables).
5. Deploy. Vercel will build and host it on a free `*.vercel.app` URL.

## Before going live — operational checklist

- **Replace the placeholder BaridiMob/CCP RIP number.** Log in as admin → Settings → update "رقم RIP" with your real account number (it currently holds a placeholder value).
- **Set the organizer WhatsApp number** the same way if it needs to change.
- **Configure custom SMTP for Supabase Auth.** Supabase's default email sender is rate-limited (a few emails/hour) and not meant for production signup volume. Add a provider like Resend or Postmark under Supabase → Authentication → Email settings before real users start registering, or confirmation emails will fail to deliver at scale.
- **Promote your admin account.** The first admin has to be set directly in the database (`update profiles set role = 'admin' where id = ...`) — there's no self-service way to become admin, by design.
- **Custom domain (optional).** Add it in Vercel's project settings once you have one.

## Project structure

- `src/app` — routes (App Router)
- `src/app/actions` — Server Actions (auth, weapons, payments, admin, support)
- `src/lib/dal.ts` — server-only data access layer (auth/role checks live here)
- `src/lib/supabase` — Supabase client factories + generated database types
- `src/proxy.ts` — route protection (Next.js 16 renamed Middleware to Proxy)
- Supabase schema/policies live in the Supabase project itself (see `supabase` MCP project `u-pioneers-accelerator`), not as local migration files.
