// Colorado dental assistant programs as published on each school's own website.
// Re-verify before each update and bump `checked`. Listing ≠ partnership unless `partner` is true.
//
// `url` is the school's own site. It is kept for OUR re-verification only and is deliberately
// NOT rendered as a link anywhere on the site — every school gets an on-site profile at
// /schools/<slug>/ so visitors never have to leave to read the details or ask a question.
// `summary` must only restate facts already in the fields below; never invent school claims.
export type Program = {
  slug: string;
  school: string;
  url: string;
  cities: string[];
  /** "short" = private occupational school (weeks); "college" = career/technical college certificate (months). */
  kind: "short" | "college";
  length: string;
  schedule: string;
  tuition: string;
  /** Lowest published tuition in dollars, for sorting and "from" ranges. 0 = not published. */
  tuitionFrom: number;
  summary: string;
  partner: boolean;
  checked: string;
};

export const programs: Program[] = [
  {
    slug: "colorado-springs-dental-assistant-school",
    school: "Colorado Springs Dental Assistant School",
    url: "https://coloradospringsdentalassistant.com/",
    cities: ["Colorado Springs"],
    kind: "short",
    length: "12 weeks",
    schedule: "Saturdays",
    tuition: "From $3,350",
    tuitionFrom: 3350,
    summary:
      "A 12-week Saturday program in Colorado Springs, priced from $3,350 — the format aimed at people keeping a weekday job while they train.",
    partner: false,
    checked: "2026-09-17",
  },
  {
    slug: "colorado-dental-assisting-school",
    school: "Colorado Dental Assisting School",
    url: "https://coloradodentalassistingschool.com/",
    cities: ["Aurora (Denver)", "Colorado Springs"],
    kind: "short",
    length: "10 weeks",
    schedule: "Saturdays or Tue/Thu evenings",
    tuition: "$3,995 (Colorado Springs)",
    tuitionFrom: 3995,
    summary:
      "A 10-week program with campuses in Aurora and Colorado Springs, offered either on Saturdays or on Tuesday/Thursday evenings.",
    partner: false,
    checked: "2026-09-17",
  },
  {
    slug: "denver-dental-assistant-school",
    school: "Denver Dental Assistant School",
    url: "https://denverdentalassistant.com/",
    cities: ["Denver"],
    kind: "short",
    length: "See school",
    schedule: "Weekend format (see school)",
    tuition: "$3,250 paid in full",
    tuitionFrom: 3250,
    summary:
      "A weekend-format Denver program with the lowest published pay-in-full price we found in Colorado, at $3,250.",
    partner: false,
    checked: "2026-09-17",
  },
  {
    slug: "academy-for-dental-assisting-careers",
    school: "Academy for Dental Assisting Careers",
    url: "https://www.academyfordentalassistingcareers.com/",
    cities: ["Longmont", "Greeley"],
    kind: "short",
    length: "8 weeks",
    schedule: "Hybrid online + hands-on in dental practices",
    tuition: "Ask the school",
    tuitionFrom: 0,
    summary:
      "The shortest program on our list at 8 weeks, run as a hybrid: coursework online, hands-on training inside working dental practices in Longmont and Greeley.",
    partner: false,
    checked: "2026-09-17",
  },
  {
    slug: "pima-medical-institute",
    school: "Pima Medical Institute (Dental Assistant certificate)",
    url: "https://pmi.edu/on-campus-programs/certificate/dental-assistant/",
    cities: ["Denver", "Aurora", "Colorado Springs"],
    kind: "college",
    length: "About 9 months",
    schedule: "Campus-based, includes externship",
    tuition: "Ask the school (financial aid available)",
    tuitionFrom: 0,
    summary:
      "A roughly nine-month campus certificate with an externship built in, offered at Denver, Aurora and Colorado Springs campuses. Financial aid is available, which the short private programs generally can't offer.",
    partner: false,
    checked: "2026-09-17",
  },
  {
    slug: "concorde-career-college",
    school: "Concorde Career College (Dental Assistant)",
    url: "https://www.concorde.edu/dental-programs/dental-assistant/denver",
    cities: ["Denver"],
    kind: "college",
    length: "As little as 8–9 months",
    schedule: "Campus-based (Denver campus, formerly Aurora)",
    tuition: "Ask the school (financial aid available)",
    tuitionFrom: 0,
    summary:
      "A career-college certificate in as little as 8–9 months at the Denver campus (formerly Aurora), with financial aid available to those who qualify.",
    partner: false,
    checked: "2026-09-17",
  },
];

export const programBySlug = (slug: string) => programs.find((p) => p.slug === slug);

/** Other programs worth showing next to this one: same city first, then same format. */
export const relatedPrograms = (p: Program, limit = 3) =>
  programs
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({
      program: o,
      score: (o.cities.some((c) => p.cities.some((c2) => c2.split(" ")[0] === c.split(" ")[0])) ? 2 : 0) + (o.kind === p.kind ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.program);
