# AGENTS.md — Onboarding for AI agents & developers

Read this first. It is the single entry point to the project context.

## What this project is
`dentalassistantco.com` is a **10-year-old expired domain**. From about 2016 to 2026 it belonged to the American Institute of
Dental Assisting (AIDA), a school in Colorado Springs. The current owner bought the domain in Sept 2026 and has **no
affiliation with AIDA**. We are rebuilding it as **DentalAssistantCO**, an independent Colorado dental-assistant career
hub that makes money from school lead gen, a job board and talent pool, affiliates and ads, and its own prep products.

## Hard rules
1. **Never impersonate AIDA.** Don't use their name as our brand, or their logo, copy, testimonials, staff names, photos,
   addresses, or phone numbers. The archived pages are research material only.
2. **Keep inherited URLs alive.** Follow the URL map in `docs/03-seo-plan.md`. Any removed URL must 301 (or 404 for bot-only paths; Firebase Hosting cannot send 410).
3. **Secrets stay server-side.** `.env` and the `*firebase-adminsdk*.json` service key are gitignored. The Telegram token
   and Pexels key must never be sent to the browser (no `NEXT_PUBLIC_` prefix). Firebase *web* config is public by design.
4. **Contact phone:** (512) 766-6445.
5. **Shared Firebase project.** `take-shots-f1a99` also runs another app (Firestore `games`, `shot_content`, with its own rules). Only deploy `--only hosting,functions`, prefix our collections with `dac_`, and never add a `firestore` key to firebase.json.
6. **Compliance:** TCPA consent on lead forms, an FTC affiliate disclosure, and a privacy policy (Colorado Privacy Act).
   Cite primary sources for any regulatory claim.
7. **Keep the visitor on the site.** Never link out to a school, employer, ATS or competing job board. Schools get an
   on-site profile at `/schools/<slug>/` with our own inquiry form; jobs are applied to at `/jobs/<slug>/`.
   `Program.url` exists for our re-verification and must never be rendered as a link.
   **Outbound links exist in exactly two places:** the footer "Official sources" strip and the `/resources/` hub. Every
   external URL is registered in `web/src/data/sources.ts`; page and post bodies cite a source by linking to
   `/resources/#<id>`, never to the source itself. Photo credits are plain text. Any new external link goes in
   `sources.ts` first — if it doesn't belong there, it doesn't belong on the site.
   **One narrow exception:** a job with `official` set (federal or state roles, where the employer's own application is
   legally mandatory) renders a labelled outbound panel. Without it we would be collecting applications that cannot get
   anyone hired. Never set `official` on a private-employer listing just to link out.

## Map of the repo
| Path | Contents |
|---|---|
| `docs/01-site-history.md` | Who AIDA was, audience, offer, nav, homepage layout, full content inventory, timeline |
| `docs/02-comparables.md` | Competitors and models to copy (Zollege schools, directories, DentalPost, etc.) |
| `docs/03-seo-plan.md` | Inherited equity, **URL redirect map**, keyword clusters, technical and off-page plan |
| `docs/04-relaunch-and-revenue.md` | Brand, funnels, revenue streams, launch phases, compliance, Firebase notes |
| `docs/05-ui-plan.md` | Design tokens, **21st.dev component picks**, sitemap, wireframes, quiz spec |
| `docs/06-content-plan.md` | Blog rewrite priority, new posts, city pages, production workflow |
| `docs/07-analytics-plan.md` | GA4, first-party Firestore events and click heatmaps, Telegram alerts, event taxonomy (no Clarity/third-party trackers) |
| `data/wayback/cdx-index.json` | Raw Wayback CDX index (388 unique URLs), the canonical list of old URLs |
| `data/wayback/url-inventory.csv` | Same data as CSV |
| `data/wayback/html/`, `data/wayback/text/` | Archived snapshots of every old content page (raw HTML + stripped text) |
| `data/backlinks.md` | Known referring domains and citations, with actions |
| `scripts/fetch-wayback.mjs`, `scripts/repair-wayback.mjs` | Re-runnable archivers (skip files that already exist). **Don't re-pull unless needed.** |
| `web/` | Next.js static site (App Router, Tailwind v4). `web/content/blog/*.md` = posts, `web/src/data/` = programs, jobs, partners, image credits |
| `web/src/app/schools/[slug]/` | On-site school profiles (facts, format explainer, questions, per-school inquiry form). Data: `web/src/data/programs.ts` |
| `web/src/app/jobs/`, `web/src/components/JobBoard.tsx` | Job board with filters, `JobPosting` schema, on-site applications, talent pool. Data: `web/src/data/jobs.json` |
| `web/src/data/sources.ts` | Registry of every external URL. Rendered only by the footer strip and `/resources/`; bodies link to `/resources/#<id>` |
| `web/src/lib/consent.ts` | Exact TCPA wording for every form. School and job forms name the single organization the lead goes to |
| `scripts/import-jobs.mjs`, `scripts/job-sources.json` | `npm run jobs:import`: pulls Colorado dental assistant roles from USAJOBS + employer-published Lever/Greenhouse boards into `jobs.json`. **Never add Indeed/ZipRecruiter/LinkedIn** |
| `scripts/sync-jobs.mjs` | `npm run jobs:sync`: approved `dac_jobs` in Firestore → `web/src/data/jobs.json` (then rebuild + deploy) |
| `functions/` | Cloud Functions: `collect` (analytics), `lead` (forms), `onLeadCreated` (Telegram), `dailyDigest`, `weeklyDigest` |
| `web/src/app/admin/`, `web/src/components/admin/`, `functions/src/admin.ts` | Password-protected dashboard (/admin/), tabbed: Analytics (`AdminDashboard`, aggregates `dac_events`/`dac_leads`) and Job board (`AdminJobs`). Password = `ADMIN_PASSWORD` secret, shared by both tabs |
| `functions/src/jobs.ts` | `adminJobs` (password-gated create/update/close/reopen/delete/list on `dac_jobs`) and `jobsFeed` (public GET of live listings). Publishing here goes live on `/jobs/` within seconds — `JobBoard` fetches `jobsFeed` at runtime and merges it with the static list, no rebuild needed |
| `scripts/analytics-report.mjs` | `npm run report`: Firestore analytics → `data/analytics/` (gitignored) |
| `scripts/build-firebase-json.mjs` | Generates `firebase.json` (redirect map); runs before every web build |

## Infrastructure
- Firebase project: `take-shots-f1a99` (web config in `web/src/lib/firebase.ts`; GA4 measurement ID `G-KW4Q59VD58`)
- Hosting: Firebase Hosting serving the static export in `web/out`; `/api/collect` and `/api/lead` rewrite to Functions. Functions need the **Blaze** plan.
- Images: Pexels API (`PEXELS_API_KEY` in `.env`), fetched at build/authoring time and credited.
- **Hosting decision (2026-09-17): Vercel serves dentalassistantco.com** via `vercel.json` (it proxies `/api/*` to Functions). Firebase Hosting (take-shots-f1a99.web.app) is only a backup. Keep the redirect maps in `vercel.json` and `scripts/build-firebase-json.mjs` in sync.
- Functions: Node 22 runtime, firebase-admin 13 (v14 needs local Node 22). The origin allowlist in `functions/src/index.ts` includes `dentalassistantco*.vercel.app`.
- Alerts: Telegram bot (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` as Functions secrets)

## Sources of truth for Colorado facts
- Colorado Dental Board (DORA) rules: https://dpo.colorado.gov/Dental
- DANB Colorado requirements: https://www.danb.org/state-requirements/colorado-radiography
- BLS dental assistants (OOH and OES): https://www.bls.gov/ooh/healthcare/dental-assistants.htm
- CDHE private occupational schools list: https://cdhe.colorado.gov/
Facts gathered 2026-09-17 (re-verify before publishing):
- Colorado does **not** license or register dental assistants. The Dental Board regulates the *tasks* they may do.
- Taking x-rays requires DANB RHS/CDA, a Board-approved training module, or an accredited program's radiology course.
- Colorado DA programs cost about $3,250–$5,995 and take 10–13 weeks (Zollege schools, Colorado Dental Assisting School, and AIDA historically).
- BLS national median pay for DAs was $48,070 (May 2025). Colorado averages cited by job sites are around $21–23/hr.

## Status log
- 2026-09-17: Research done, docs written, Wayback archive saved, and the Next.js + Functions scaffold with analytics created.
- 2026-09-17: Wayback download saved 65 pages. **29 snapshots are still the host's bot-check placeholder** because archive.org was
  "Temporarily Offline" during the repair pass. Re-run `npm run wayback:repair` later.
- 2026-09-17: Built pages: home, find-a-program (quiz), programs, EDDA, demand, Colorado Springs, jobs (empty), hire,
  resources, partners (empty, so no lead sharing yet), about, contact, privacy, terms, site-map, blog (3 rewritten posts).
  Not deployed yet; see the README deploy checklist.
- 2026-09-17: **Deployed.** Hosting and all 5 functions are live; an end-to-end test lead passed and was deleted. Custom domains were added in Firebase
  but are waiting on Cloudflare DNS changes (www currently CNAMEs to Vercel).
- 2026-09-17: Gap pass against the Wayback inventory and backlinks. Added `/requirements/`, `/locations/denver/`, `/former-aida-students/`,
  `/editorial-policy/`, `/advertising-disclosure/`, `/accessibility/`; added Pima, Concorde and Academy for Dental Assisting Careers
  to `programs.ts` (field `weeks` → `length` + `kind`); rewrote 10 legacy posts (13 total) and 301-consolidated 3 duplicates.
  18 legacy posts still 302 to `/blog/` (Tier 2 in `docs/06-content-plan.md`).
- 2026-09-17: Rewrote all 13 posts in a plainer editorial voice. Added the testimonials system: `web/src/data/stories.json`
  (currently empty), `<Stories>` on the homepage, `/stories/` (noindex while empty) with a "story" submission form that stores
  publish consent, and a `story` lead type in Functions. **Only add real, permissioned stories. Never write testimonials**
  (FTC 16 CFR 465). Once `stories.json` has entries, the old testimonial URLs 301 to `/stories/` automatically.
- 2026-09-18: **Kept the traffic in-house.** Every school now has its own profile at `/schools/<slug>/` (verified facts,
  what the format means, questions to ask, and a per-school inquiry form) instead of an outbound link; the comparison
  table, city guides, homepage table and one blog post now link to those profiles. Built the real job board: filterable
  `/jobs/`, detail pages at `/jobs/<slug>/` with `JobPosting` schema and `directApply`, an on-site application form, and a
  talent pool. New lead types `school_inquiry`, `job_application`, `talent_pool` in Functions, each with consent naming the
  single organization the lead goes to (`web/src/lib/consent.ts`). `npm run jobs:sync` publishes approved `dac_jobs`.
  **`jobs.json` is empty and must stay that way until a real Colorado practice submits an opening** — never seed the board
  with invented listings. While it's empty the static export builds one placeholder page, `/jobs/none-open/` (noindex, not
  in the sitemap), because Next can't export a dynamic route with zero params.
- 2026-09-18: **All outbound links moved to the footer.** New `web/src/data/sources.ts` registry; the footer carries an
  "Official sources" strip (4 links) and `/resources/` is the full citation hub with `#id` anchors. Every page body and
  blog post now cites sources via `/resources/#<id>`, and Pexels photo credits are plain text. Verified: every page in
  `web/out` has exactly the 4 footer outbound links, and only `/resources/` has more.
- 2026-09-19: **Job importer added** (`npm run jobs:import`), pulling only sources that permit republication: USAJOBS
  (public domain, needs a free `USAJOBS_API_KEY` + `USAJOBS_EMAIL` in `.env`) and employer-published Lever/Greenhouse
  board APIs listed in `scripts/job-sources.json`. Imported listings are replaced on every run, so vanishing from the
  feed is how they expire; direct listings are never touched. Applications are still captured on-site; `onLeadCreated`
  looks up `forwardTo` on the `dac_jobs` doc and puts it in the Telegram alert. Federal/state listings carry `official`
  and render a mandatory-application panel with `directApply: false`.
  **Measured 2026-09-18/19: this is a trickle, not a board.** Dental practices are small businesses and are almost never
  on Lever/Greenhouse (Colorado Coalition for the Homeless has a dental team but no DA openings; the Peak Dental Services
  Lever board 404s). Federal DA roles at Evans Army Community Hospital/Fort Carson are real but open for about a week at
  a time. The ~200+ live Colorado DA jobs are on Indeed/ZipRecruiter/practice sites, which we will not ingest. Use the
  importer for freshness and credibility; fill the board through `/hire/` outreach.
- 2026-09-19: **Admin can publish jobs directly, live within seconds.** New `/admin/` "Job board" tab
  (`AdminJobs.tsx`) posts to `functions/src/jobs.ts`'s `adminJobs` (password-gated: create, update,
  close, reopen, delete, list), which writes straight to `dac_jobs` in Firestore — that's the
  persistence. A public, unauthenticated `jobsFeed` function reads back everything `status:
  "approved"` and not yet past `validThrough`. `JobBoard` (`/jobs/`) fetches that feed at runtime and
  merges it with whatever was baked in at the last build, so a job you publish shows up on the live
  site within seconds — no redeploy required. A job that only exists in the live feed (not yet in a
  build) doesn't have a static `/jobs/<slug>/` page yet, so its card expands in place instead of
  linking out; `JobDetails.tsx` was factored out of the old `/jobs/[slug]/` page so both the static
  page and the inline expand render the identical facts/apply-form UI. Running `npm run jobs:sync` +
  rebuild later upgrades a live-only job into a real static page with `JobPosting` schema — worth
  doing for Google for Jobs, not required to be live or appliable-to.
  Applications still land as `job_application` leads; `onLeadCreated` looks up `forwardTo` on the
  `dac_jobs` doc for the Telegram alert. **No automatic email-to-employer yet** — forwarding the
  application from the Telegram alert is still a manual step until an email provider (Resend/
  SendGrid) is wired in.
