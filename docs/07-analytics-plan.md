# 07 — Analytics & Tracking Plan

Goal: know exactly who arrives, from where, what they read, where they drop off, and what makes money. Then improve
the site based on that data.

## Stack (four layers)
| Layer | Tool | What it answers | Status |
|---|---|---|---|
| 1. Product analytics | **GA4 via Firebase Analytics** (`G-KW4Q59VD58`) | Traffic, sources, conversions, funnels, audiences | Wired in code (`src/lib/analytics.ts`) |
| 2. First-party event log | **Firestore `events` / `sessions` / `leads`**, written by the `collect` Cloud Function | Raw per-visitor journeys we own; exportable to BigQuery | Wired in code (`functions/src/index.ts`) |
| 3. Real-time alerts and digests | **Telegram bot** | Instant lead and job alerts; daily and weekly KPI digest | Wired in code (server-side only) |
| 4. Behavior | **Microsoft Clarity** (free heatmaps and session recordings) | Why people drop off; rage clicks, dead clicks | Needs a Clarity project ID → `NEXT_PUBLIC_CLARITY_ID` |
| + Search | Google Search Console, Bing Webmaster Tools | Queries, impressions, rankings, index coverage | Owner must verify the domain (DNS TXT) |

Consent: a banner sets Google **Consent Mode v2**. Analytics and Clarity load only after the visitor accepts, except
for the cookieless first-party page-view ping, which stores no personal data.

## Identity model
- `vid`: anonymous visitor ID (random UUID in a first-party cookie, 13 months)
- `sid`: session ID (new after 30 minutes of inactivity)
- First-touch attribution is saved on the first visit: `utm_source/medium/campaign/term/content`, `gclid`, `fbclid`, `msclkid`,
  referrer, and landing page. It's attached to every lead, so each lead shows the post or ad that produced it.
- Raw IPs are **not** stored on events (a salted hash only). Leads store IP, user agent, and consent text as TCPA proof.

## Event taxonomy
| Event | Params | Fired when |
|---|---|---|
| `page_view` | path, title, referrer, utm_*, landing | Every route change |
| `scroll_depth` | percent (25/50/75/90) | Once per page per threshold |
| `engaged_time` | seconds, path | On page hide (visible time only) |
| `cta_click` | cta_id, cta_text, location | Any element with `data-track="cta"` |
| `phone_click` | location | `tel:` link |
| `email_click` | location | `mailto:` link |
| `outbound_click` | url, domain | External link |
| `affiliate_click` | partner, product, path | `data-track="affiliate"` |
| `file_download` | file | PDF/asset links |
| `quiz_start` / `quiz_step` / `quiz_abandon` | step, answer | Find-a-Program quiz |
| `form_start` / `form_error` / `generate_lead` | form_id, field, error | Lead, contact, and employer forms |
| `story_submit` | form_id | Graduate/employer story form on `/stories/` |
| `job_view` / `job_apply_click` / `job_post_submit` | job_id, employer | Job board |
| `newsletter_signup` | location | Email capture |
| `purchase_click` | product | Stripe checkout button |
| `search` | term | Site search |
| `not_found` | path, referrer | 404 page (finds broken inherited links) |
| `web_vitals` | name (LCP/CLS/INP/TTFB), value, rating | Every page |
| `js_error` | message, source | `window.onerror` |
| `rage_click` | selector | 3+ clicks within 600 ms |

**GA4 key events (conversions):** `generate_lead`, `phone_click`, `job_post_submit`, `purchase_click`, `newsletter_signup`, `affiliate_click`.

## Telegram notifications
| Trigger | Message |
|---|---|
| New lead (`leads` doc created) | Name, phone, email, quiz answers, landing page, source/UTM, device |
| New contact message | Name, contact, message |
| New job post / employer request | Office, city, role |
| Daily 8:00 AM Mountain Time | Yesterday's sessions, visitors, top 5 pages, top 5 sources, leads, quiz funnel (start → step → submit), phone clicks, 404s |
| Weekly (Monday) | Week-over-week trends, best-converting pages, pages with high exits |

The token and chat ID live **only** in Cloud Functions secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).

## Firestore collections
```
dac_events/{autoId}     { name, params, vid, sid, path, ts, ua_device, country?, ipHash }
dac_sessions/{sid}      { vid, start, last, pages, landing, referrer, utm, device, events }
dac_leads/{autoId}      { type, fields, quiz, consent:{text, ts, ip, ua, url}, attribution, status }
dac_jobs/{autoId}       { employer, title, city, pay, status, createdAt }
dac_dailyStats/{yyyy-mm-dd}  aggregated by the scheduled function
```
The (default) Firestore database is **shared with another app** (`games`, `shot_content`), so every collection here has a `dac_` prefix. Only Cloud Functions (Admin SDK) touch these collections. **Never deploy Firestore rules from this repo**; the rules belong to the other app.

## How to use the data (monthly review loop)
1. **Search Console:** find queries at positions 5–20, then improve those posts (titles, FAQs, internal links).
2. **GA4 funnel** (landing → quiz_start → generate_lead): fix the step with the largest drop.
3. **Clarity recordings:** watch 10 sessions of visitors who abandoned the quiz.
4. **`not_found` events:** add redirects for old inherited URLs that still get hits.
5. **Leads by landing page:** write more content like the posts that produce leads.
6. **A/B test** one thing per month (hero headline, CTA copy, quiz length) with a simple cookie-based split
   logged as `experiment_id` on events.

## Owner setup checklist
- [x] Blaze plan active; all 5 functions deployed 2026-09-17
- [x] Telegram secrets set (version 1)
- [ ] Rotate the Telegram bot token (it was shared in chat)
- [ ] In GA4, mark the key events above as conversions; link GA4 to Search Console
- [ ] Create a Microsoft Clarity project and set `NEXT_PUBLIC_CLARITY_ID`
- [ ] Verify the domain in Google Search Console and Bing
- [ ] Optional: install the "Stream Firestore to BigQuery" extension and build a Looker Studio dashboard
