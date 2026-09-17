// Colorado dental assistant programs as published on each school's own website.
// Re-verify before each update and bump `checked`. Listing ≠ partnership unless `partner` is true.
export type Program = {
  school: string;
  url: string;
  cities: string[];
  /** "short" = private occupational school (weeks); "college" = career/technical college certificate (months). */
  kind: "short" | "college";
  length: string;
  schedule: string;
  tuition: string;
  partner: boolean;
  checked: string;
};

export const programs: Program[] = [
  {
    school: "Colorado Springs Dental Assistant School",
    url: "https://coloradospringsdentalassistant.com/",
    cities: ["Colorado Springs"],
    kind: "short",
    length: "12 weeks",
    schedule: "Saturdays",
    tuition: "From $3,350",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Colorado Dental Assisting School",
    url: "https://coloradodentalassistingschool.com/",
    cities: ["Aurora (Denver)", "Colorado Springs"],
    kind: "short",
    length: "10 weeks",
    schedule: "Saturdays or Tue/Thu evenings",
    tuition: "$3,995 (Colorado Springs)",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Denver Dental Assistant School",
    url: "https://denverdentalassistant.com/",
    cities: ["Denver"],
    kind: "short",
    length: "See school",
    schedule: "Weekend format (see school)",
    tuition: "$3,250 paid in full",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Academy for Dental Assisting Careers",
    url: "https://www.academyfordentalassistingcareers.com/",
    cities: ["Longmont", "Greeley"],
    kind: "short",
    length: "8 weeks",
    schedule: "Hybrid online + hands-on in dental practices",
    tuition: "Ask the school",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Pima Medical Institute (Dental Assistant certificate)",
    url: "https://pmi.edu/on-campus-programs/certificate/dental-assistant/",
    cities: ["Denver", "Aurora", "Colorado Springs"],
    kind: "college",
    length: "About 9 months",
    schedule: "Campus-based, includes externship",
    tuition: "Ask the school (financial aid available)",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Concorde Career College (Dental Assistant)",
    url: "https://www.concorde.edu/dental-programs/dental-assistant/denver",
    cities: ["Denver"],
    kind: "college",
    length: "As little as 8–9 months",
    schedule: "Campus-based (Denver campus, formerly Aurora)",
    tuition: "Ask the school (financial aid available)",
    partner: false,
    checked: "2026-09-17",
  },
];
