# 06 — Content Plan

Rules: original writing only (the archived AIDA text in `data/wayback/text` is **reference for search intent only**, never
copy it). Every post needs a real byline, a "last updated" date, primary-source citations, a quiz CTA, and 3+ internal links.
Target 1,200–2,200 words for guides.

## Tier 1: Rewrite first (inherited equity, commercial intent)
| # | URL (keep slug) | New angle / H1 |
|---|---|---|
| 1 | /blog/dental-assistant-salary-colorado/ | Dental Assistant Salary in Colorado (2026): pay by city, experience, and credential |
| 2 | /blog/dental-assistant-colorado-licensed/ | Do Dental Assistants Need a License in Colorado? (What the Dental Board actually regulates) |
| 3 | /blog/danb-certification-required-colorado/ | Is DANB Certification Required in Colorado? RHS, ICE, CDA explained |
| 4 | /blog/become-dental-assistant-colorado-without-going-school/ | How to Become a Dental Assistant in Colorado Without School (on-the-job route, pros and cons) |
| 5 | /blog/much-dental-assistant-training-programs-cost/ | How Much Do Dental Assistant Programs Cost in Colorado? (2026 price table) |
| 6 | /blog/how-long-does-it-take-to-become-a-dental-assistant/ | How Long Does It Take to Become a Dental Assistant? (10 weeks to 2 years) |
| 7 | /blog/understanding-the-role-of-expanded-duties-dental-assistants-edda/ | EDDA/EFDA in Colorado: what expanded-duty assistants can do |
| 8 | /blog/can-become-dental-assistant-online/ | Can You Become a Dental Assistant Online? Hybrid programs and the clinical-hours catch |
| 9 | /blog/choose-dental-assisting-school-thats-right/ | How to Choose a Dental Assisting School: a 12-point checklist |
| 10 | /blog/the-growing-demand-for-dental-assistants-in-colorado/ | Colorado Dental Assistant Demand (2026 data) |
| 11 | /blog/dental-assisting-school-hard/ | Is Dental Assisting School Hard? What the coursework really looks like |
| 12 | /blog/highest-paying-dental-assistant-job/ | Highest-Paying Dental Assistant Jobs (orthodontic, oral surgery, EDDA, and more) |

## Tier 2: Remaining rewrites
difference-dental-assistant-expanded-duties-dental-assistant (consolidate with #7 via a 301 if they overlap), additional-responsibilities-edda
(consolidate into #7), dental-assistant-demand-colorado (consolidate into #10), tips-getting-hired-dental-assistant,
a-day-in-the-life-of-a-dental-assistant-what-to-expect, the-difference-between-dental-assistant-and-dental-hygienist-careers,
dental-assisting-vs-medical-assisting-career-path, how-to-balance-work-family-and-dental-assisting-school,
live-patient-clinic-advantages-dental-assisting-education, important-hands-dental-assistant-training, skills-gain-dental-assistant-training,
importance-continuing-education-dental-assistants (consolidate with 3-reasons-new-dental-assistant-needs-pursue-continuing-education),
considering-dental-assistant-career, dental-assistant-perfect-starting-point, dental-assistants-critical-successful-dental-practice,
top-4-dental-assisting-myths-debunked, 5-reasons-love-dental-assisting, innovative-dental-technologies-dental-assistant,
building-patient-rapport-the-importance-of-communication-in-dental-assisting, eco-friendly-practices-how-dental-assistants-can-contribute,
the-role-of-dental-assistants-in-community-health-programs.

> **Consolidation rule:** when two old posts target the same query, keep the stronger URL and 301 the other to it.

## Tier 3: New content that adds SEO value
**Hubs and tools (link magnets)**
- `/requirements/`: Colorado Dental Assistant Requirements (x-ray rule, DANB paths, CPR/BLS, EDDA), with a checker widget
- `/salary/`: Colorado DA Salary Report and calculator (city × experience × credential), updated yearly from BLS OES
- `/programs/dental-assistant/`: Colorado DA Programs Compared (cost, weeks, schedule, radiology included, externship)
- Printable **Colorado DA Career Roadmap** PDF (email-gated)

**City pages** (`/locations/[city]/`): Colorado Springs, Denver, Aurora, Fort Collins, Lakewood, Thornton, Arvada, Westminster,
Pueblo, Greeley, Boulder, Longmont, Loveland, Grand Junction, Castle Rock. Each page needs **unique data**: local
schools, current job count, pay range, major employers, and commute or transit notes. No thin doorway pages.

**New blog posts (2 per week, in this order)**
1. Colorado Dental Assistant X-Ray (Radiography) Requirements, Step by Step
2. DANB RHS Exam: Study Guide, Cost, and Pass Tips
3. Dental Assistant Interview Questions (with sample answers)
4. Dental Assistant Resume Template and Examples
5. Orthodontic Assistant in Colorado: pay, duties, how to start
6. Oral Surgery Assistant: what's different
7. Front Office vs. Chairside Dental Assistant
8. Financial Aid and Payment Plans for Dental Assistant School in Colorado (WIOA, workforce grants, GI Bill)
9. Military Spouse and Veteran Paths to Dental Assisting in Colorado Springs (Fort Carson, Peterson, the Air Force Academy)
10. Dental Assistant to Hygienist: bridge path in Colorado
11. What to Wear: best scrubs and shoes for dental assistants (affiliate)
12. Dental Assistant Certification vs. Certificate: what's the difference?
13. Dental Assistant Jobs With No Experience in Colorado
14. Part-Time Dental Assistant Programs (weekend and evening) in Colorado
15. Dental Assistant Duties List (2026)
16. Infection Control Basics Every New DA Should Know (ICE exam overlap)
17. Is Dental Assisting a Good Career in 2026? Pros, cons, and burnout
18. Temp and Travel Dental Assisting in Colorado (staffing agencies)
19. How Dental Offices Can Hire (and Keep) Great Assistants (employer audience, feeds `/hire/`)
20. Colorado Dental Assistant Salary vs. Cost of Living by City

## Content production workflow
1. Draft in `content/blog/<slug>.mdx` with frontmatter: `title, description, date, updated, author, reviewer, cluster, heroImage, pexelsId, faq[]`.
2. Pull the hero image with `npm run pexels -- "<query>"`, which saves to `public/images/blog/` and records credit.
3. Check facts against the "Sources of truth" list in `AGENTS.md` and add citations.
4. Publish. The sitemap updates and IndexNow pings.
