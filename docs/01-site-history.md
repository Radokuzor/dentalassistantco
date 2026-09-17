# 01 — What dentalassistantco.com Was

> Sources: the Wayback Machine CDX index (`data/wayback/cdx-index.json`, 388 unique URLs), archived page snapshots
> (`data/wayback/html`, `data/wayback/text`), and Google results gathered 2026-09-17. Facts below are from those sources.
> Anything marked *(inferred)* is our interpretation.

## TL;DR
From about 2016 until at least June 2026, dentalassistantco.com was the marketing and enrollment site of the
**American Institute of Dental Assisting (AIDA)**, a small private, state-licensed dental-assistant school in
**Colorado Springs, CO**. It sold a **13-week, evenings/weekends dental assisting program** taught in a working dental clinic.
The domain then lapsed and **we bought it. We have no affiliation with AIDA.** The site is being rebuilt as an
independent brand (see `04-relaunch-and-revenue.md`). **Never present the new site as AIDA** or reuse AIDA's copy, photos,
testimonials, or staff names.

## The organization (historical facts)
| Item | Value |
|---|---|
| Name | American Institute of Dental Assisting ("AIDA") |
| Owner/director | Dr. Roger Humphreys, licensed Colorado dentist ("36+ years experience") |
| Regulator | Colorado Department of Higher Education, Private Occupational School Board |
| Addresses | 1920 Vindicator Dr Suite 209, Colorado Springs, CO 80919 (earlier); 218 E Willamette Ave, Colorado Springs, CO 80903 (2026 footer) |
| Phones | (719) 297-5340 (admissions), (719) 633-3711 (footer, 2026) |
| Email | info@dentalassistantco.com |
| Sister campus | AIDA Arizona (Mesa/Phoenix), dentalassistantschoolsaz.com, still operating |
| Social | facebook.com/my13weeksco ("my 13 weeks" was the brand hook) |
| Web vendor | Enrollment Resources (enrollmentresources.com), custom WP theme `er-2015` / `er-2015-child` |

## Audience
- **Primary:** Colorado Springs–area adults, often career changers, parents, or people already working, who want a
  fast, affordable route into healthcare without a 2-year degree. The main message was "keep your job while you train."
- **Secondary:** local dental offices that hire graduates (served by the "Employer Testimonials" and "Job Placement" pages).
- *(inferred)* Mostly women aged 18–35, price- and schedule-sensitive, searching on mobile.

## Offer
- **Dental Assisting Training Program:** 13 weeks, evenings/weekends, hands-on in a real clinic ("Live Patient Clinics"),
  with radiology (analog and digital x-rays) and job-placement help. Tuition reported at **$5,995** (third-party snippet).
  A 2019 PDF "7-Week-Course-Syllabus" suggests an earlier 7-week format.
- **Expanded Duties Dental Assistant (EDDA) Program:** `/programs/expanded-duties-dental-assistant/`, plus an
  `/programs/edda-test/` page from 2024.
- **Support:** Student Services, Job Search/Placement, Video Tutorials (2024), Instructors page ("10+ yrs assisting,
  currently working in dentistry").
- **Compliance pages:** Privacy Policy, Student Refund Policy, Transcript/Diploma/Certificate Financial Hold Exemption
  Policy (2025), and enrollment agreement PDFs (2024, 2025).

## Site architecture (WordPress)
- WordPress 4.4 in 2018, upgraded to 6.6.3 by 2025. Uses Yoast-style sitemaps: `sitemap_index.xml`, `page-`, `post-`,
  `programs-`, `locations-`, `testimonials-`, `category-`, and `author-sitemap.xml`.
- Custom post types: **programs**, **locations**, **testimonials**.
- Host moved from `www.` to the bare domain on HTTPS around 2024.

### Main navigation (2026 snapshot, verbatim)
```
Home
Our Programs ▸ Dental Assisting Training Program | Expanded Duties Dental Assisting Program (EDDA)
Why Choose AIDA ▸ Live Patient Clinics | Student Testimonials | Employer Testimonials
About Us ▸ Student Services | Instructors
Job Placement
Apply Online
Blog
Contact Us ▸ Book a Tour
```

### Homepage layout (2026 snapshot)
1. Top bar: "Is Dental Career Training Right For You? Find Out Now!" and a click-to-call phone number
2. Hero: "Colorado Needs More Dental Assistants. Multiple Classes Starting Soon!" with a **Start Here** button
3. "13 Week Dental Assisting Training in a Real Clinic": owner credibility, real patients, evenings/weekends
4. Program card and a "Why Choose AIDA" card
5. Testimonial quote
6. **"I Want Answers!"** lead form (How much is tuition? / Career prospects? / When does it start?) with First, Last,
   Email, Phone, and a TCPA call/text consent checkbox
7. "What our graduates say"
8. "Licensed By: Colorado Department of Higher Education"
9. Footer: address, phone, sitemap links, Facebook

### Conversion funnel
Every form redirected to its own thank-you page: `/thank-you/`, `/thank-you-apply-online/`, `/thank-you-book-tour/`,
`/thank-you-contact-us/`. These are classic conversion-tracking URLs for Google Ads and Facebook pixels.
A 2017 landing page at `/lp/` with `/lp/thankyou.php` shows they ran paid campaigns. Forms used a PHP text captcha.

### Style *(from snapshots)*
Early-2010s enrollment-marketing look: stock clinic photos, a phone number in the header, heavy CTAs, testimonial photos
with student names, and a sidebar lead form on every page. Mostly flat colors. The theme's palette was not recovered, and
we aren't reusing it because this is a new brand.

## Content inventory
### Core pages (Wayback URLs)
`/`, `/about-us/`, `/about-us/dental-assistant-instructors/`, `/apply-online/`, `/blog/`, `/book-tour/`,
`/colorado-needs-dental-assistants/`, `/contact-us/`, `/employer-testimonials/`, `/job-search/`, `/live-patient-clinics/`,
`/locations/colorado-springs/`, `/locations/mesa-arizona-3/`, `/privacy-policy/`, `/programs/dental-assistant/`,
`/programs/expanded-duties-dental-assistant/`, `/programs/edda-test/`, `/site-map/`, `/student-refund-policy/`,
`/student-services/`, `/student-testimonials/` (pages 2–4), `/testimonials/student/`, `/video-tutorials/`,
`/transcriptdiplomacertificate-financial-hold-exemption-policy/`, and the four thank-you pages.

### Blog (≈36 posts, two eras)
**Era 1 (2016–2019, evergreen, short slugs)**
- choose-dental-assisting-school-thats-right
- danb-certification-required-colorado
- dental-assistant-perfect-starting-point
- dental-assistants-critical-successful-dental-practice
- difference-dental-assistant-expanded-duties-dental-assistant
- how-long-does-it-take-to-become-a-dental-assistant
- important-hands-dental-assistant-training
- skills-gain-dental-assistant-training
- tips-getting-hired-dental-assistant
- top-4-dental-assisting-myths-debunked
- 3-reasons-new-dental-assistant-needs-pursue-continuing-education
- 5-reasons-love-dental-assisting
- additional-responsibilities-edda
- become-dental-assistant-colorado-without-going-school
- much-dental-assistant-training-programs-cost
- considering-dental-assistant-career
- dental-assistant-colorado-licensed

**Era 2 (Dec 2024 – Nov 2025, content-marketing push)**
- a-day-in-the-life-of-a-dental-assistant-what-to-expect
- building-patient-rapport-the-importance-of-communication-in-dental-assisting
- can-become-dental-assistant-online
- dental-assistant-demand-colorado
- dental-assistant-salary-colorado
- dental-assisting-school-hard
- dental-assisting-vs-medical-assisting-career-path
- eco-friendly-practices-how-dental-assistants-can-contribute
- highest-paying-dental-assistant-job
- how-to-balance-work-family-and-dental-assisting-school
- importance-continuing-education-dental-assistants
- innovative-dental-technologies-dental-assistant
- live-patient-clinic-advantages-dental-assisting-education
- the-difference-between-dental-assistant-and-dental-hygienist-careers
- the-growing-demand-for-dental-assistants-in-colorado
- the-role-of-dental-assistants-in-community-health-programs
- understanding-the-role-of-expanded-duties-dental-assistants-edda (Nov 2025, latest)

Posts that were still ranking or indexed in Google in Sept 2026 (per `site:` results) include salary-colorado,
danb-certification-required-colorado, become-dental-assistant-colorado-without-going-school,
the-growing-demand-for-dental-assistants-in-colorado, dental-assistant-colorado-licensed, and
understanding-the-role-of-expanded-duties-dental-assistants-edda. **These carry our inherited SEO value.**

## Timeline
| Date | Event |
|---|---|
| 2016 | Theme/uploads begin (2016/01 testimonial photos) |
| 2017-06 | Paid-traffic landing page `/lp/` |
| 2018-02 | First homepage capture (www, WP 4.4) |
| 2019-07 | Full site crawl; Mesa, AZ location page exists |
| 2023-03 | cPanel/webmail subdomains exposed |
| 2023-08 | Sitemaps crawled; blog Era 1 captured |
| 2024-10 | HTTPS bare domain; new pages (refund policy, video tutorials, EDDA test) |
| 2024-12 → 2025-11 | Blog Era 2 |
| 2026-06-08 | Last capture of a live AIDA homepage (© 2026) |
| 2026-08-29 | Only bot-probe captures; domain presumably lapsed |
| 2026-09 | Domain acquired by the current owner |
