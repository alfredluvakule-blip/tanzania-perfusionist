# Tanzania Perfusionists

**Connecting Perfusionists. Preserving Our History. Advancing Cardiac Care.**

A professional platform for perfusionists and cardiac-care teams in Tanzania and beyond: news, research, case reports, an interactive history of perfusion, a media hub, a community, and an admin CMS with an approval workflow.

Stack: Next.js 15 (App Router) · Tailwind CSS · Framer Motion · Supabase (Postgres, Auth, Storage).

## Run locally

```bash
npm install
cp .env.example .env.local   # optional: add Supabase keys
npm run dev                  # http://localhost:3000
```

Without Supabase keys the site still runs and shows built-in reference and sample content (`src/lib/seed.ts`).

## Connect Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
3. Put the project URL and anon key in `.env.local` (or Vercel environment variables).
4. Sign up on the site, then make yourself Super Administrator in the SQL editor:
   ```sql
   update profiles set role = 'super_admin'
   where id = (select id from auth.users where email = 'you@example.com');
   ```
5. Open `/admin`.

## Roles and approval

| Role | Can |
|---|---|
| General Visitor | Read published content, subscribe, contact |
| Registered Member | + submit legacy stories and discussions |
| Contributor | + submit every content type |
| Editor | + review, edit, publish, delete; read messages, subscribers, analytics |
| Super Administrator | + change user roles |

A database trigger forces anything created or edited by a non-editor to `pending_review`, so nothing goes live without an editor. Contributors also tick consent/approval checkboxes (patient consent, anonymisation, photo permission, licences), which editors see in the review queue. Only editors can mark a history milestone as verified.

## Content rules

- Global history milestones and research entries in `seed.ts` are real, documented events and papers with references. Re-check each against the source before launch.
- Tanzanian and African milestones, profiles, news, events and media are **placeholders**, clearly badged in the UI. Replace them with verified, consented content.
- No stock photography is bundled. Cards use generated artwork until images are uploaded with permission.

## Project layout

```
src/app/            pages (12 public pages + search, submit, login, admin, guidelines)
src/components/     Hero, Timeline, MediaGallery, cards, CMS form
src/lib/cms.ts      collection/field config that drives admin + submission forms
src/lib/content.ts  data access (Supabase, with seed fallback)
supabase/           schema.sql (tables, RLS, triggers, storage) and seed.sql
scripts/            generate-seed-sql.mjs (rebuild seed.sql from seed.ts)
```

## Search engines

- `sitemap.xml` and `robots.txt` use the live address automatically (Vercel's production domain, or `NEXT_PUBLIC_SITE_URL` if you set a custom domain).
- Every page has a canonical link, and the homepage includes Organization/WebSite structured data (TaCPA, Kiswahili name).
- Google Search Console: add the site as a **URL prefix** property, choose the **HTML tag** method, put the code in the `GOOGLE_SITE_VERIFICATION` environment variable on Vercel, redeploy, press Verify, then submit `sitemap.xml`.

## Visitor statistics

The site uses Vercel Web Analytics (`<Analytics />` in `src/app/layout.tsx`). Turn it on once in Vercel: open the project, go to the **Analytics** tab and click **Enable**. After the next deploy you can see visitors, page views, top pages, countries, devices and referrers there. It uses no cookies and does not identify individual people.

## Resources (presentations and books)

Put files in `public/resources/presentations/` or `public/resources/books/` and add an entry to `src/lib/resources.ts`. They appear on `/resources` with a Download button. Only add material you wrote or that is free to share.
