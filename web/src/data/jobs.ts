// The job board. Every listing is applied to ON THIS SITE — we never link out to an ATS.
//
// Source of truth is `jobs.json`, which is written either by hand or by `npm run jobs:sync`
// (pulls approved `dac_jobs` documents out of Firestore so an employer submission from /hire/
// can go live without anyone editing TypeScript). Only publish real, employer-submitted roles:
// inventing a listing would be a fabricated job ad, and it would poison Google for Jobs.
import raw from "./jobs.json";

export type Job = {
  slug: string;
  title: string;
  employer: string;
  city: string;
  /** Free-text grouping used by the board's filter, e.g. "Denver metro", "Pikes Peak". */
  region: string;
  /** What we show, e.g. "$22–$26/hr". Keep it filled in; pay-transparency is the point of the board. */
  pay: string;
  payMin?: number;
  payMax?: number;
  payUnit?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN";
  schedule?: string;
  summary: string;
  responsibilities?: string[];
  requirements?: string[];
  benefits?: string[];
  /** Paid placement. Must be labelled in the UI (FTC). */
  featured?: boolean;
  /** Where the listing came from. "direct" = the practice sent it to us through /hire/. */
  source?: "direct" | "usajobs" | "lever" | "greenhouse";
  /** Human label for the provenance line, e.g. "USAJOBS" or "Peak Dental Services careers page". */
  sourceName?: string;
  /** Set ONLY when the employer's own application is mandatory (federal and state hiring).
   *  Rendered as a labelled panel on the listing — the one place a job page links out. */
  official?: { url: string; label: string; closes?: string };
  street?: string;
  postalCode?: string;
  /** ISO dates. A listing disappears from the board after `validThrough`. */
  posted: string;
  validThrough: string;
};

export const jobs: Job[] = raw as Job[];

/** Listings that haven't expired, featured first, then newest. */
export const activeJobs = (today = new Date().toISOString().slice(0, 10)) =>
  jobs
    .filter((j) => j.validThrough >= today)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.posted.localeCompare(a.posted));

export const jobBySlug = (slug: string) => jobs.find((j) => j.slug === slug);

export const jobFacets = (list: Job[]) => ({
  regions: [...new Set(list.map((j) => j.region))].sort(),
  cities: [...new Set(list.map((j) => j.city))].sort(),
  types: [...new Set(list.map((j) => j.employmentType))].sort(),
});

export const TYPE_LABEL: Record<Job["employmentType"], string> = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  CONTRACTOR: "Contract",
  TEMPORARY: "Temporary",
  INTERN: "Externship",
};

/** "3 days ago" — job boards live or die on freshness signals. */
export function postedAgo(iso: string, now = new Date()) {
  const days = Math.max(0, Math.round((now.getTime() - new Date(`${iso}T12:00:00Z`).getTime()) / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months <= 1 ? "Last month" : `${months} months ago`;
}
