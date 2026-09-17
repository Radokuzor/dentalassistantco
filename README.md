# DentalAssistantCO (dentalassistantco.com)

An independent Colorado dental-assistant career hub, rebuilt on an expired 10-year-old domain.
**New here? Start with [AGENTS.md](AGENTS.md).** It covers context, rules, and the docs map.

## Stack
- `web/`: Next.js 15 (App Router, static export), Tailwind v4, Fraunces + Figtree fonts
- `functions/`: Firebase Cloud Functions v2 (analytics collector, lead intake, Telegram alerts and digests)
- Firebase Hosting (`firebase.json` is **generated**; edit `scripts/build-firebase-json.mjs` instead)
- Firestore (locked down; only Functions write)

## Local development
```bash
npm --prefix web install
npm --prefix functions install
npm run dev                         # http://localhost:3000 (form posts need the deployed functions or emulators)
npm run build                       # static site → web/out, functions → functions/lib
```
Add images: `npm --prefix web run pexels -- "<query>" <name> [index]` (downloads the photo and records credit).
Add a post: create `web/content/blog/<legacy-or-new-slug>.md` (see an existing post for the frontmatter).

## Deploying
- **Website → Vercel** (the domain's host, decided 2026-09-17). Vercel builds from GitHub `main` using `vercel.json`,
  which also carries the redirect map and proxies `/api/collect` and `/api/lead` to Cloud Functions.
  When you change redirects, keep `vercel.json` and `scripts/build-firebase-json.mjs` in sync.
- **Backend → Firebase** (project `take-shots-f1a99`):
  ```bash
  npx firebase-tools deploy --only functions   # NEVER deploy firestore: the database is shared with another app
  ```
  Functions (us-central1, Node 22): `collect`, `lead`, `onLeadCreated`, `dailyDigest`, `weeklyDigest`.
- Backup copy of the site: https://take-shots-f1a99.web.app (`npm --prefix web run build && npx firebase-tools deploy --only hosting`).

## Remaining go-live steps (owner)
1. **Domain on Vercel:** in the Vercel project → Settings → Domains, add `dentalassistantco.com` and `www.dentalassistantco.com`.
   Set the **apex as primary** and have www redirect to it (the site's canonical URLs use the apex). Add the DNS records
   Vercel shows in Cloudflare, set to *DNS only* (grey cloud). Keep the existing `google-site-verification` TXT record.
2. Rotate the Telegram bot token in @BotFather, then `npx firebase-tools functions:secrets:set TELEGRAM_BOT_TOKEN` and redeploy functions.
3. Google Search Console: add a **Domain** property for `dentalassistantco.com` and click Verify (the TXT is already in DNS), then submit `/sitemap.xml`. Do the same in Bing Webmaster Tools (it can import from Search Console).
4. GA4 (`G-KW4Q59VD58`): mark `generate_lead`, `phone_click`, `job_post_submit`, `purchase_click`, `affiliate_click` as key events.
5. Microsoft Clarity (free): create a project and set `NEXT_PUBLIC_CLARITY_ID` in `web/.env.production`, then rebuild and redeploy.

## Secrets
`.env` (root, gitignored) holds `PEXELS_API_KEY`, `TELEGRAM_*`, and the path to the Admin SDK key.
Never commit `*firebase-adminsdk*.json`, and never expose server secrets with a `NEXT_PUBLIC_` prefix.
