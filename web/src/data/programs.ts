// Colorado dental assistant programs as published on each school's own website.
// Re-verify before each update and bump `checked`. Listing ≠ partnership unless `partner` is true.
export type Program = {
  school: string;
  url: string;
  cities: string[];
  weeks: number | null;
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
    weeks: 12,
    schedule: "Saturdays",
    tuition: "From $3,350",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Colorado Dental Assisting School",
    url: "https://coloradodentalassistingschool.com/",
    cities: ["Aurora (Denver)", "Colorado Springs"],
    weeks: 10,
    schedule: "Saturdays or Tue/Thu evenings",
    tuition: "$3,995 (Colorado Springs)",
    partner: false,
    checked: "2026-09-17",
  },
  {
    school: "Denver Dental Assistant School",
    url: "https://denverdentalassistant.com/",
    cities: ["Denver"],
    weeks: null,
    schedule: "Weekend format (see school)",
    tuition: "$3,250 paid in full",
    partner: false,
    checked: "2026-09-17",
  },
];
