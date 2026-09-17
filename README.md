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

## First deploy checklist
1. `npm i -g firebase-tools` then `firebase login`
2. Upgrade project **take-shots-f1a99** to the **Blaze** plan (required for Functions) and set a budget alert.
3. Create a Firestore database (Native mode, e.g. `nam5`).
4. **Rotate the Telegram bot token** in @BotFather (the old one was shared in chat), then:
   ```bash
   firebase functions:secrets:set TELEGRAM_BOT_TOKEN
   firebase functions:secrets:set TELEGRAM_CHAT_ID      # 5739671114
   ```
5. `npm run deploy`
6. Firebase Console → Hosting → **Add custom domain** `dentalassistantco.com` (and `www` redirecting to apex), then add the DNS records at the registrar.
7. Submit a test through `/find-a-program/` and confirm the Telegram alert arrives.
8. Google Search Console: verify the domain, submit `https://dentalassistantco.com/sitemap.xml`. Do the same in Bing Webmaster Tools.
9. GA4 (`G-KW4Q59VD58`): mark `generate_lead`, `phone_click`, `job_post_submit`, `purchase_click`, `affiliate_click` as key events.
10. Optional: create a Microsoft Clarity project and set `NEXT_PUBLIC_CLARITY_ID` in `web/.env.production`.

## Secrets
`.env` (root, gitignored) holds `PEXELS_API_KEY`, `TELEGRAM_*`, and the path to the Admin SDK key.
Never commit `*firebase-adminsdk*.json`, and never expose server secrets with a `NEXT_PUBLIC_` prefix.
