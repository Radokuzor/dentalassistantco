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
```bash
npm --prefix web run build
npx firebase-tools deploy --only hosting,functions   # NEVER deploy firestore: the database is shared with another app
```
- Firebase Hosting: https://take-shots-f1a99.web.app (live since 2026-09-17)
- Cloud Functions (us-central1, Node 22): `collect`, `lead`, `onLeadCreated`, `dailyDigest`, `weeklyDigest`
- `vercel.json` can also host the static site on Vercel. It proxies `/api/*` to the same functions.
  **Pick one host for the domain** (see DNS below).

## Remaining go-live steps (owner)
1. **Cloudflare DNS for dentalassistantco.com.** If Firebase Hosting serves the domain (set records to *DNS only* / grey cloud):
   - Replace the apex `@` records with `A @ 199.36.158.100`
   - Add `TXT @ hosting-site=take-shots-f1a99` (keep the existing `google-site-verification=K3Uu…` TXT)
   - Change `www` from the Vercel CNAME to `CNAME www take-shots-f1a99.web.app`
   - Remove the apex→www redirect and remove the domain from the Vercel project
   If Vercel serves the domain instead, keep Vercel's records and delete the custom domains from Firebase Hosting.
2. Rotate the Telegram bot token in @BotFather, then `npx firebase-tools functions:secrets:set TELEGRAM_BOT_TOKEN` and redeploy functions.
3. Google Search Console: add a **Domain** property for `dentalassistantco.com` and click Verify (the TXT is already in DNS), then submit `/sitemap.xml`. Do the same in Bing Webmaster Tools (it can import from Search Console).
4. GA4 (`G-KW4Q59VD58`): mark `generate_lead`, `phone_click`, `job_post_submit`, `purchase_click`, `affiliate_click` as key events.
5. Microsoft Clarity (free): create a project and set `NEXT_PUBLIC_CLARITY_ID` in `web/.env.production`, then rebuild and redeploy.

## Secrets
`.env` (root, gitignored) holds `PEXELS_API_KEY`, `TELEGRAM_*`, and the path to the Admin SDK key.
Never commit `*firebase-adminsdk*.json`, and never expose server secrets with a `NEXT_PUBLIC_` prefix.
