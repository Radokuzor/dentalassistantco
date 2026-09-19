// Every external link on the site lives here, and nowhere else.
//
// House rule (AGENTS.md #7): page and post bodies link internally only. When we cite a primary
// source in the copy, the link points at /resources/#<id>; the actual outbound link is rendered
// on /resources/ and in the footer strip. That keeps a reader on the site while the citation
// stays one click from the original — which is what the editorial policy promises.
export type Source = {
  id: string;
  name: string;
  /** Short label for the footer strip. */
  short: string;
  url: string;
  note: string;
  group: "rules" | "pay" | "schools" | "about";
};

export const sources: Source[] = [
  {
    id: "dental-board",
    name: "Colorado Dental Board (DORA)",
    short: "Colorado Dental Board",
    url: "https://dpo.colorado.gov/Dental",
    note: "The state rules for what a dental assistant may and may not do.",
    group: "rules",
  },
  {
    id: "danb-colorado",
    name: "DANB: Colorado radiography requirements",
    short: "DANB Colorado x-ray rules",
    url: "https://www.danb.org/state-requirements/colorado-radiography",
    note: "What Colorado accepts before you can take x-rays.",
    group: "rules",
  },
  {
    id: "danb",
    name: "DANB (Dental Assisting National Board)",
    short: "DANB",
    url: "https://www.danb.org/",
    note: "The RHS, ICE and CDA exams, and what each one covers.",
    group: "rules",
  },
  {
    id: "bls",
    name: "BLS Occupational Outlook: dental assistants",
    short: "BLS pay data",
    url: "https://www.bls.gov/ooh/healthcare/dental-assistants.htm",
    note: "National median pay and the ten-year job outlook.",
    group: "pay",
  },
  {
    id: "bls-oes",
    name: "BLS occupational wage estimates",
    short: "BLS state wages",
    url: "https://www.bls.gov/oes/",
    note: "Official wage figures by state and metro area, including Denver and Colorado Springs.",
    group: "pay",
  },
  {
    id: "cdhe",
    name: "Colorado Department of Higher Education",
    short: "CDHE school approvals",
    url: "https://cdhe.colorado.gov/",
    note: "Check that a private occupational school is approved before you pay a deposit.",
    group: "schools",
  },
  {
    id: "cdhe-transcripts",
    name: "CDHE transcript requests",
    short: "CDHE transcripts",
    url: "https://cdhe.colorado.gov/transcript-requests",
    note: "How to get records from a Colorado school that has closed.",
    group: "schools",
  },
  {
    id: "cdhe-students",
    name: "Colorado student and consumer FAQ",
    short: "Student protections",
    url: "https://highered.colorado.gov/frequently-asked-questions-for-students-and-consumers",
    note: "Your options if a school closed, misled you, or owes you a refund.",
    group: "schools",
  },
  {
    id: "ftc-endorsements",
    name: "FTC Endorsement Guides",
    short: "FTC guides",
    url: "https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking",
    note: "The federal rules our advertising and testimonial disclosures follow.",
    group: "about",
  },
  {
    id: "wcag",
    name: "WCAG 2.2 (W3C)",
    short: "WCAG 2.2",
    url: "https://www.w3.org/TR/WCAG22/",
    note: "The accessibility standard we hold this site to.",
    group: "about",
  },
];

export const sourceById = (id: string) => sources.find((s) => s.id === id);

export const GROUPS: { key: Source["group"]; title: string }[] = [
  { key: "rules", title: "Colorado rules and certification" },
  { key: "pay", title: "Pay and job outlook" },
  { key: "schools", title: "Schools and student protection" },
  { key: "about", title: "How we operate" },
];

/** The handful shown in the footer strip at the bottom of every page. */
export const FOOTER_SOURCE_IDS = ["dental-board", "danb-colorado", "bls", "cdhe"];
