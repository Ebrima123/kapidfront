# kapidfront

Next.js 16 + Tailwind v4 + TypeScript frontend for Kapid Painting. One app serves both:

- **Public website**: `/`, `/services`, `/projects`, `/about`, `/contact` (quote form creates CRM leads)
- **Admin dashboard**: `/admin`, the CRM (leads, customers, jobs, estimates, notes) and CMS (site settings, services, projects + gallery, testimonials, FAQs)

Content and data come from the Django API in `kapidback`.

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Start the Django API on port 8000 first, then sign in at http://localhost:3000/admin with a Django staff/superuser account.

## How it fits together

- Public pages read the API on the server with `'use cache'` (tag `cms`, refreshed every minute). If the API is down they fall back to default copy.
- Saving anything under `/admin/content` invalidates the `cms` tag, so edits show on the site immediately.
- The dashboard talks to Django through `/api/backend/*`, which attaches the JWT from httpOnly cookies and refreshes it. Tokens never reach browser JavaScript.
- `src/proxy.ts` redirects signed-out visitors from `/admin/*` to `/admin/login`. Django checks staff permission on every call.
