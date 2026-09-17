# 04 — Relaunch & Revenue Plan

## Brand
- **Name:** DentalAssistantCO (spoken as "Dental Assistant Colorado")
- **Promise:** *"The independent guide to becoming, and hiring, a dental assistant in Colorado."*
- **Contact:** (512) 766-6445, the owner-supplied number. It's a Texas area code; consider adding a 719/720 tracking
  number later for local trust and call attribution.
- **Required disclosure (footer and About page):** independent, not a school, and not affiliated with the American
  Institute of Dental Assisting.
- **Voice:** straight talk, plain numbers, no hype. Written for a busy adult on a phone.

## Two audiences, two funnels
| Audience | Need | Funnel | Money |
|---|---|---|---|
| **Future DAs** (career changers, parents, grads) | "How do I get into this, what does it cost, what will I earn?" | Blog/city page → quiz `/find-a-program/` → matched schools → email nurture | Lead fees, affiliates, prep products, ads |
| **Colorado dental offices** | "I need an assistant now" | `/hire/` → post a job or request candidates | Job-post fees, talent-pool access, placement or referral fees |

## Revenue streams (build order)
1. **School lead generation (primary).** Quiz captures zip, schedule preference, start timeframe, and budget. Leads go to
   Firestore and trigger an instant Telegram alert. Sell exclusive leads to partner schools per lead, or charge a monthly
   "featured school" fee. Pitch list: every school in `02-comparables.md`. Validate pricing with the schools; vocational
   pay-per-lead is often quoted in the tens of dollars per lead, higher for exclusive leads.
2. **Job board (`/jobs/`).** Free listings at launch to seed supply (also scrape-free: offices submit their own). Then paid
   featured posts, 30-day posts, and employer subscriptions. Output `JobPosting` schema so listings show in Google for Jobs.
3. **Talent pool / "Hire a DA."** Job seekers opt in with a profile. Offices pay to unlock contacts, or pay a placement
   fee. Alternatively, refer offices to a staffing partner for a referral fee.
4. **Own digital products.**
   - *Colorado Radiology (RHS) Prep Pack:* practice questions and a study guide
   - *Dental Terminology Flashcards* and *Chairside Instrument Guide* (printable PDF)
   - *DA Interview and Resume Kit*, with an optional paid resume review
   Sell through Stripe Checkout or Payment Links and deliver files from Firebase Storage.
5. **Affiliates.** Online DA programs, DANB prep, scrubs, loupes, and study books (Amazon Associates to start). Disclose on
   every page that has affiliate links, per FTC rules.
6. **Display ads.** AdSense at launch, only on blog posts and never on the quiz or forms. Move to a premium network
   (Ezoic / Journey / Raptive) once traffic meets their thresholds; check current requirements.
7. **Creative extras (later).**
   - Sponsored "Employer Spotlight" profiles for Colorado practices
   - Newsletter sponsorships ("Colorado DA Weekly")
   - Paid featured placement in the yearly **Colorado DA Salary Report**
   - Externship-matching marketplace (schools pay to find externship offices)
   - Free community (Discord or Facebook group) that feeds the email list

## Launch phases
| Phase | Scope | Exit criteria |
|---|---|---|
| **0: Foundation (week 1)** | Next.js app, Firebase Hosting/App Hosting, redirects, analytics, lead form and Telegram alerts, core pages, legal pages | Site live on the domain; Search Console verified; a test lead reaches Telegram |
| **1: Content (weeks 2–4)** | 12 priority rewrites, hubs, programs comparison, 3 city pages | ≥ 25 indexed URLs; first organic leads |
| **2: Marketplace (weeks 4–8)** | Jobs board, employer posting, talent pool, remaining city pages | 10 live jobs; 3 school conversations |
| **3: Monetize (weeks 8–12)** | First paid school partner, Stripe products, AdSense, affiliate links | First $ |
| **4: Scale (3–12 months)** | 2 posts/week, salary report, outreach, email nurture, A/B tests | Month-over-month growth in leads and revenue |

## Compliance must-haves
- **Selling leads:** the form must name, or link to a list of, the partner schools that may contact the person. Collect
  **TCPA-compliant** call/text consent with an unchecked checkbox, and store consent text, timestamp, IP, and page URL with
  each lead.
- **Privacy:** privacy policy covering the Colorado Privacy Act and CCPA, a cookie/analytics consent banner, and a
  "do not sell/share" link, since selling leads counts as a sale.
- **Email:** CAN-SPAM (physical mailing address and unsubscribe link).
- **Health claims:** state rules as rules with citations (Colorado Dental Board, DANB), and date-stamp them.
- **Photos:** Pexels images with credit; no photos of real AIDA students or staff.

## Firebase and infrastructure notes
- Project: `take-shots-f1a99` (shared project name; consider a dedicated project later).
- Next.js SSR on Firebase and Cloud Functions both need the **Blaze (pay-as-you-go)** plan. Expected cost at launch
  traffic is roughly $0–$10/month; set a budget alert.
- Secrets (Telegram token, Pexels key) live in Cloud Functions secrets / `.env`, **never in client code**.
- The Telegram bot token was shared in plain text in chat. **Rotate it with @BotFather** after setup and update the secret.
