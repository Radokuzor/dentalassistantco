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
| `functions/` | Cloud Functions: `collect` (analytics), `lead` (forms), `onLeadCreated` (Telegram), `dailyDigest`, `weeklyDigest` |
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
