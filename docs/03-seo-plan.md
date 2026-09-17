# 03 — SEO Plan

## What we inherited
- **About 10 years of domain age** and an exact-match name: "dental assistant CO" reads as "dental assistant Colorado".
- **Indexed, topically tight URLs:** about 36 blog posts and about 15 core pages, all about becoming a dental assistant in Colorado.
- **Authority links:** Colorado Dept. of Higher Education PDFs (.gov), a staffing-agency roundup, research.com rankings, and directories.
  See `data/backlinks.md`.
- **Risk:** Google's *expired domain abuse* spam policy (March 2024) targets bought domains repurposed for unrelated or low-value
  content. We stay safe by **keeping the same topic** (dental-assistant careers in Colorado), writing genuinely useful
  original content, and being transparent that this is a new, independent site.

## Guiding rules
1. **Keep every URL that has equity.** Rebuild it at the same path with new, original, better content, or 301 it to the
   closest topical match. Never let an old URL 404 silently.
2. **Never reuse AIDA's copy.** Rewrite each post from scratch at the same slug, covering the same search intent.
3. **Transparency:** a site-wide footer note says *"DentalAssistantCO is an independent resource and is not affiliated with the
   American Institute of Dental Assisting."* The About page explains the change of ownership.
4. **Trailing slashes on** (`trailingSlash: true`) to match the old WordPress URLs exactly.
5. **Canonical host:** `https://dentalassistantco.com/`. 301 `www.` and `http://` to it.

## URL map (implemented)
The source of truth is **`scripts/build-firebase-json.mjs`**, which regenerates `firebase.json` on every web build.
Firebase Hosting can't return HTTP 410, so retired URLs either 301 to the closest page or return 404.

| Old URL | Behavior | Destination / new content |
|---|---|---|
| `/` | keep | Hub homepage |
| `/blog/<slug>/` (≈34 legacy posts) | keep slug | Rewritten post. **Until rewritten: temporary 302 → `/blog/`** (generated automatically) |
| `/blog/`, `/blog/page/2/`, `/blog/page/3/` | keep | Paginated index (pages 2–3 always built) |
| `/programs/dental-assistant/` | keep | Colorado programs comparison |
| `/programs/expanded-duties-dental-assistant/` | keep | EDDA guide |
| `/colorado-needs-dental-assistants/` | keep | Demand page |
| `/locations/colorado-springs/` | keep | City page (template for other cities) |
| `/about-us/`, `/contact-us/`, `/privacy-policy/`, `/site-map/` | keep | Our versions |
| `/programs/edda-test/` | 301 | `/programs/expanded-duties-dental-assistant/` |
| `/job-search/` | 301 | `/jobs/` |
| `/apply-online/`, `/book-tour/`, `/lp/` | 301 | `/find-a-program/` |
| `/why-choose-aida/`, `/student-testimonials/**`, `/testimonials/**` | 301 | `/programs/dental-assistant/` (switch testimonials to `/stories/` once that page exists) |
| `/live-patient-clinics/` | 301 | `/blog/live-patient-clinic-advantages-dental-assisting-education/` |
| `/blog/dental-assistant-demand-colorado/` | 301 | `/blog/the-growing-demand-for-dental-assistants-in-colorado/` (consolidated) |
| `/blog/additional-responsibilities-edda/`, `/blog/difference-dental-assistant-expanded-duties-dental-assistant/` | 301 | `/blog/understanding-the-role-of-expanded-duties-dental-assistants-edda/` (consolidated) |
| `/employer-testimonials/` | 301 | `/hire/` |
| `/about-us/dental-assistant-instructors/` | 301 | `/about-us/` |
| `/student-services/`, `/student-refund-policy/`, `/transcriptdiplomacertificate-financial-hold-exemption-policy/` | 301 | `/former-aida-students/` (not-AIDA notice + CDHE transcript/complaint instructions) |
| `/video-tutorials/` | 301 | `/resources/` |
| `/thank-you*/`, `/locations/mesa-arizona-3/` | 301 | `/` |
| `/feed/` | 301 | `/feed.xml` |
| `/sitemap_index.xml`, `/*-sitemap.xml` | 301 | `/sitemap.xml` |
| `/blog/category/**`, `/blog/author/**` | 301 | `/blog/` |
| `/wp-admin/`, `/wp-login.php`, `/wp-content/**`, `/wp-json/**` | 404 | — (bot noise) |
| New: `/find-a-program/`, `/jobs/`, `/hire/`, `/resources/`, `/partners/`, `/terms/`, `/thanks/*` (noindex) | new | — |
| New: `/requirements/`, `/locations/denver/` (Princess Dental Staffing backlink target), `/former-aida-students/` (CDHE-backlink visitors), `/editorial-policy/`, `/advertising-disclosure/`, `/accessibility/` | new | — |

## Keyword clusters (priority order)
Search volumes are **not measured yet**. Validate in Google Search Console after launch, or with Keyword Planner/Ahrefs.
1. **Become a DA in Colorado:** how to become a dental assistant in Colorado; become a DA without school; how long does it take; is DA school hard
2. **Requirements and credentials:** do dental assistants need a license in Colorado (no; the Board regulates tasks);
   Colorado dental assistant x-ray/radiology requirements (DANB RHS or a Board-approved module); DANB certification in Colorado; EDDA/EFDA in Colorado
3. **Schools and cost (commercial, where the lead money is):** dental assistant schools in Colorado Springs/Denver/Aurora; cost of a DA program; online DA programs; best/cheapest DA school in Colorado
4. **Salary and jobs:** dental assistant salary in Colorado (by city); highest-paying DA jobs; dental assistant jobs in Colorado Springs
5. **Career comparison:** DA vs. dental hygienist; DA vs. medical assistant; day in the life

## On-page and technical checklist
- Static generation for all content; LCP < 1.5s and CLS < 0.05 on mobile.
- Unique `<title>` (≤ 60 chars) and meta description for every page; one H1; breadcrumb navigation.
- JSON-LD schema: `Organization`, `WebSite` (with SearchAction), `BreadcrumbList`, `Article` (author and dates), `FAQPage`
  (only for visible FAQs), `JobPosting` (jobs), `Course`/`EducationalOccupationalProgram` (school listings, clearly
  attributed to each school), and `HowTo` for step guides.
- Author pages with real bylines and credentials (E-E-A-T). Recruit a Colorado RDH or DA as reviewer ("Medically reviewed by").
- Cite primary sources: Colorado Dental Board (DORA) rules, DANB state pages, BLS OES. Show "Last updated" dates.
- Internal linking: every blog post links to its cluster hub and to `/find-a-program/`.
- `sitemap.xml`, `robots.txt`, RSS feed, and IndexNow ping on publish.
- Images from Pexels are downloaded, resized to WebP, given descriptive alt text, and credited to the photographer.

## Off-page
1. **Reclaim links:** email Princess Dental Staffing and research.com to say the page is now an independent Colorado DA guide
   and offer the updated comparison page as the resource to cite.
2. **Link magnets:** a Colorado DA Salary Report (updated yearly from BLS data), a Colorado school cost comparison, and a
   radiology requirement explainer. Pitch them to Colorado community colleges, workforce centers (e.g., Pikes Peak
   Workforce Center), and high-school career counselors.
3. **Local presence:** we have no physical Colorado office, so **don't create a Google Business Profile** with a fake
   address. Use a service-area business profile only if the owner has a real, eligible business location.
4. **Social:** Pinterest and TikTok "day in the life" or salary clips that link to the relevant posts.

## 90-day SEO timeline
| Week | Work |
|---|---|
| 0–1 | Launch with the redirect map, Search Console and Bing Webmaster set up, sitemap submitted |
| 1–3 | Publish rewrites of the 12 highest-equity posts (listed in `06-content-plan.md`) and the hub pages |
| 3–6 | City pages (10), school comparison page, salary report, jobs board |
| 6–12 | Remaining rewrites, 2 new posts/week, link reclamation and outreach; monthly Search Console review |
