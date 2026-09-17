# Known Backlinks & Citations — dentalassistantco.com

Collected 2026-09-17 from Google search and manual research. No paid backlink tool (Ahrefs/Semrush/Moz) has been run yet;
when one is, export to `data/backlinks-<tool>-<date>.csv` and add a summary row here.

| Referring page | Type | Links to | Value | Action |
|---|---|---|---|---|
| https://cdhe.colorado.gov/sites/highered/files/2025.07.25%20In%20State.pdf | .gov state list of private occupational schools | dentalassistantco.com (as AIDA's site) | Very high authority | Keep the domain resolving (home returns 200). The listing refers to AIDA, so don't ask for edits that misstate who we are. |
| https://cdhe.colorado.gov/sites/highered/files/Acc%20Passed%20Category%2003%2028%202025.pdf | .gov (CDHE) | AIDA mention | High | Same as above |
| https://www.princessdentalstaffing.com/blog/dental-assistant/schools-denver-colorado | Dental staffing blog, "schools in Denver" roundup | AIDA / dentalassistantco.com | Relevant, medium | Outreach: offer an updated Colorado school guide as a replacement resource |
| https://research.com/rankings/trade-schools/dental-assistant/most-affordable-dental-assistant-trade-schools-in-colorado-springs-co | Rankings site | AIDA listing | Medium | Monitor |
| https://research.com/rankings/trade-schools/dental-assistant/best-dental-assistant-trade-schools-in-colorado-springs-co | Rankings site | AIDA listing | Medium | Monitor |
| https://www.usadentalfinder.com/colorado/colorado-springs/el-paso-1/american-institute-of-dental-assisting-colorado-springs/ | Directory | AIDA NAP | Low–medium | None (belongs to AIDA) |
| https://reviews.birdeye.com/american-institute-of-dental-assisting-176980076250379 | Review aggregator | AIDA | Low | None |
| https://www.facebook.com/my13weeksco/ | AIDA Colorado Facebook page (not ours) | dentalassistantco.com | Social | None; not ours |
| https://www.linkedin.com/company/american-institute-of-dental-assisting-colorado | AIDA LinkedIn (not ours) | — | Social | None; not ours |
| https://www.indeed.com/cmp/American-Institute-of-Dental-Assisting/locations/CO/Colorado%20Springs | Employer profile (not ours) | — | Low | None |
| http://enrollmentresources.com | Former web agency (footer credit "Website by") | — | — | Former vendor of the "er-2015" WordPress theme |

## Other properties in the old AIDA network (not ours; don't imitate)
- dentalassistantschoolsaz.com: AIDA Arizona (Mesa/Phoenix), still active
- facebook.com/my13weeks: AIDA Arizona

## Old infrastructure found in the Wayback index
- `cpanel.dentalassistantco.com` and `webmail.dentalassistantco.com` (2023): the old cPanel host. Don't recreate these subdomains.
- `/wp-login.php` and `/wp-admin/` (2025): WordPress. Expect bot traffic to these paths; return 404/410.
- `/wp-content/themes/er-2015/inc/form-json.php` (probed 2026-08-29): bot scan. Return 404.
