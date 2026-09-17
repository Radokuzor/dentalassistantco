# 05 — UI Plan (Next.js + Tailwind v4 + shadcn/ui + 21st.dev)

## Design direction
- **Feel:** clinical-clean but warm. It should look like a trustworthy guide, not a school ad.
- **Palette (new brand):** deep teal `#0F766E` / teal-deep `#0B3D3A`, mint `#5EEAD4`, coral CTA `#F97361`, ink `#10201F`, warm paper background `#F7F5EF`. Tokens live in `web/src/app/globals.css`.
- **Type:** "Fraunces" (serif display) for headings, "Figtree" for body (via `next/font`). The signature motif is a Colorado topographic-contour texture plus a "trail map" step path.
- **Imagery:** Pexels photos of dental clinics and assistants, cropped 16:9 and 4:5, with credit in a caption.
- **Mobile first:** a sticky bottom bar on mobile with **Call** and **Find a Program** buttons.

## 21st.dev components (from the MCP catalog, 2026-09-17)
Install with `npx shadcn@latest add "https://21st.dev/r/<author>/<name>?api_key=$API_KEY_21ST"`.
Retrieving code with `get_component` uses the daily 21st.dev quota, so fetch only what we use.

| Use | Component (id) | URL |
|---|---|---|
| Home hero: two columns, stats, image collage | Hero Section (8737) | https://21st.dev/@ravikatiyar162/components/hero-section-9 |
| Hero with form-style CTA (alternative) | Hero Section (8439) | https://21st.dev/@ravikatiyar162/components/hero-section-8 |
| Hero with 3 features below (city pages) | Hero 45 (612) | https://21st.dev/@shadcnblockscom/components/shadcnblocks-com-hero45 |
| **Find-a-Program quiz** | Multi-Step Form (8281), framer-motion progress | https://21st.dev/@ravikatiyar162/components/multi-step-form |
| Quiz alternative with review step | Multiple Form (7817) | https://21st.dev/@dhileepkumargm/components/multiple-form |
| Stories / social proof | Testimonials with Marquee (822) | https://21st.dev/@serafimcloud/components/testimonials-with-marquee |
| Two-row marquee (alternative) | Testimonials Marquee (19852) | https://21st.dev/@shadcnspace/components/marquee-01 |
| Jobs list | Job Listing (8725) | https://21st.dev/@educalvolpz/components/job-listing |
| Jobs filters | Role Filter Chips (22213) | https://21st.dev/@cnippet-dev/components/v-toggle-10 |
| Blog index | Blog Posts, featured and grid (5622) | https://21st.dev/@aymanch-03/components/blog-posts |
| Related posts | Blog 7 (686) | https://21st.dev/@shadcnblockscom/components/blog7 |
| FAQ | shadcn Accordion (696) / FAQ Accordion Card (24919) | https://21st.dev/@shadcn/components/accordion |

## Sitemap and page templates
```
/                               Home (hub)
/find-a-program/                Quiz → matched schools → /thanks/program/
/programs/dental-assistant/     Colorado programs compared (table + cards)
/programs/expanded-duties-dental-assistant/
/requirements/                  Colorado DA rules: license, x-ray, DANB, EDDA
/salary/                        Salary report + calculator
/colorado-needs-dental-assistants/  Demand/outlook
/locations/[city]/              Programmatic city pages
/jobs/ /jobs/[id]/              Job board (JobPosting schema)
/hire/                          Employers: post a job / request candidates
/resources/                     Downloads, prep products, tools
/blog/ /blog/[slug]/ /blog/page/[n]/
/stories/                       Real DA stories
/about-us/ /contact-us/ /privacy-policy/ /terms/ /site-map/
```

## Homepage wireframe
```
┌───────────────────────────────────────────────────────────────┐
│ Logo  Become a DA▾  Schools  Salary  Jobs  Blog   [Find a Program]│
├───────────────────────────────────────────────────────────────┤
│ HERO (21st hero-section-9)                                     │
│ "Become a Dental Assistant in Colorado in as little as 10–13   │
│  weeks. Compare programs, costs & pay — free."                 │
│ [Find my program →]  [See salaries]    ▢▢ image collage        │
│ stats: $3.2k–$6k typical tuition · 10–13 wks · 0 license req.  │
├───────────────────────────────────────────────────────────────┤
│ 4-STEP PATH: Choose program → Train → X-ray qualified → Hired  │
├───────────────────────────────────────────────────────────────┤
│ QUIZ TEASER (first quiz step inline: "When do you want to start?")│
├───────────────────────────────────────────────────────────────┤
│ SCHOOL COMPARISON PREVIEW table (cost / weeks / schedule / city)│
├───────────────────────────────────────────────────────────────┤
│ SALARY BY CITY cards  → /salary/                               │
├───────────────────────────────────────────────────────────────┤
│ LATEST JOBS (3 cards) → /jobs/      | Employer CTA → /hire/    │
├───────────────────────────────────────────────────────────────┤
│ STORIES marquee                                                │
├───────────────────────────────────────────────────────────────┤
│ GUIDES grid (blog-posts)                                       │
├───────────────────────────────────────────────────────────────┤
│ FAQ accordion (FAQPage schema)                                 │
├───────────────────────────────────────────────────────────────┤
│ Footer: links · (512) 766-6445 · independence disclosure       │
└───────────────────────────────────────────────────────────────┘
[mobile sticky bar: 📞 Call | Find a Program]
```

## Quiz steps (`/find-a-program/`)
1. When do you want to start? (ASAP / 1–3 months / 3–6 months / just researching)
2. Which schedule works? (weekends / weeknights / weekdays / online-hybrid)
3. Your ZIP code (auto-suggests nearest city)
4. Budget (under $3k / $3–5k / $5k+ / need financing)
5. Are you 18+ with a high-school diploma or GED? (yes/no)
6. Contact: first name, last name, email, phone, **unchecked TCPA consent** naming partner schools
→ Results page with matched programs and a Telegram alert to the owner.

Each step fires an analytics event (`quiz_step`) so we can see exactly where people drop off.

## Blog post template
Breadcrumbs → H1 → author, reviewer, and updated date → key takeaways box → table of contents → body with an inline
**quiz CTA card** after section 2 → FAQ → related posts → newsletter signup. Ad slots go only in the body, after
section 3 and at the end.
