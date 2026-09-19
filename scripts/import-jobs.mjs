// Imports Colorado dental assistant listings from sources that allow republication, and merges
// them into web/src/data/jobs.json alongside the listings employers sent us directly.
//
//   npm run jobs:import          # fetch, merge, write
//   npm run jobs:import -- --dry # print what would change, write nothing
//
// Sources are configured in scripts/job-sources.json. Direct listings (source "direct", or no
// source at all) are never touched; imported ones are replaced wholesale on every run, which is
// also how a listing expires: gone from the feed means gone from the board.
//
// Reality check (verified 2026-09-18): open ATS boards carry very few Colorado dental assistant
// roles, and federal postings are sporadic and open for about a week. This keeps the board honest
// and fresh, but it will not fill it — direct employer outreach through /hire/ does that.
import fs from "node:fs";

const OUT = "web/src/data/jobs.json";
const dry = process.argv.includes("--dry");
const cfg = JSON.parse(fs.readFileSync("scripts/job-sources.json", "utf8"));
const titleRe = new RegExp(cfg.titleMatch, "i");
const today = new Date().toISOString().slice(0, 10);
const iso = (d) => new Date(d).toISOString().slice(0, 10);
const plusDays = (from, days) => new Date(new Date(from).getTime() + days * 86_400_000).toISOString().slice(0, 10);

// .env is gitignored; read it without adding a dependency.
const env = { ...process.env };
if (fs.existsSync(".env")) {
  for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const slugify = (s) =>
  String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70);

const clean = (html = "") =>
  String(html)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_m, c) => String.fromCharCode(c))
    .replace(/\s+/g, " ")
    .trim();

const firstSentences = (text, max = 300) => {
  const t = clean(text);
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")) + "…";
};

const isColorado = (s = "") => /\b(CO|Colorado)\b/i.test(s) && !/Colorado Springs, TX/i.test(s);

const REGION = (city = "") =>
  /denver|aurora|lakewood|arvada|westminster|thornton|littleton|centennial|broomfield|golden/i.test(city)
    ? "Denver metro"
    : /colorado springs|fountain|monument|fort carson|peterson|schriever/i.test(city)
      ? "Pikes Peak"
      : /fort collins|greeley|loveland|longmont|boulder/i.test(city)
        ? "Northern Colorado"
        : /pueblo|trinidad|canon city|florence/i.test(city)
          ? "Southern Colorado"
          : "Colorado";

const problems = [];

// ---------- USAJOBS (public domain; federal applications must go through USAJOBS) ----------

async function fromUsajobs() {
  const u = cfg.usajobs;
  if (!u?.enabled) return [];
  if (!env.USAJOBS_API_KEY || !env.USAJOBS_EMAIL) {
    problems.push("USAJOBS skipped: set USAJOBS_API_KEY and USAJOBS_EMAIL in .env (free key from developer.usajobs.gov).");
    return [];
  }
  const out = [];
  for (const location of u.locations) {
    const qs = new URLSearchParams({ Keyword: u.keyword, LocationName: location, ResultsPerPage: "100" });
    if (u.jobCategoryCode) qs.set("JobCategoryCode", u.jobCategoryCode);
    const res = await fetch(`https://data.usajobs.gov/api/Search?${qs}`, {
      headers: { Host: "data.usajobs.gov", "User-Agent": env.USAJOBS_EMAIL, "Authorization-Key": env.USAJOBS_API_KEY },
    });
    if (!res.ok) {
      problems.push(`USAJOBS ${location}: HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    for (const item of data.SearchResult?.SearchResultItems ?? []) {
      const d = item.MatchedObjectDescriptor ?? {};
      const place = d.PositionLocation?.[0];
      const city = (place?.CityName ?? "").split(",")[0].trim();
      if (!titleRe.test(d.PositionTitle ?? "") || !isColorado(place?.CountrySubDivisionCode ?? place?.LocationName ?? "")) continue;
      const rem = d.PositionRemuneration?.[0] ?? {};
      const perYear = /year/i.test(rem.RateIntervalCode ?? "");
      const min = Number(rem.MinimumRange) || undefined;
      const max = Number(rem.MaximumRange) || undefined;
      const closes = d.ApplicationCloseDate ? iso(d.ApplicationCloseDate) : undefined;
      out.push({
        slug: slugify(`${d.PositionTitle}-${city}-${d.PositionID}`),
        title: d.PositionTitle,
        employer: d.OrganizationName || d.DepartmentName,
        city: city || "Colorado",
        region: REGION(city),
        pay: min && max ? `$${min.toLocaleString()}–$${max.toLocaleString()}${perYear ? "/yr" : ""}` : "See announcement",
        payMin: min,
        payMax: max,
        payUnit: perYear ? "YEAR" : "HOUR",
        employmentType: /part.?time/i.test(d.PositionSchedule?.[0]?.Name ?? "") ? "PART_TIME" : "FULL_TIME",
        schedule: d.PositionSchedule?.[0]?.Name,
        summary: firstSentences(d.UserArea?.Details?.JobSummary || d.QualificationSummary || d.PositionTitle),
        requirements: d.QualificationSummary ? [firstSentences(d.QualificationSummary, 600)] : undefined,
        posted: d.PublicationStartDate ? iso(d.PublicationStartDate) : today,
        validThrough: closes ?? plusDays(today, 30),
        source: "usajobs",
        sourceName: "USAJOBS",
        official: { url: d.PositionURI, label: "Official USAJOBS announcement", closes },
      });
    }
  }
  return out;
}

// ---------- Lever (employer-published board API) ----------

async function fromLever() {
  const out = [];
  for (const board of cfg.lever ?? []) {
    const res = await fetch(`https://api.lever.co/v0/postings/${board.slug}?mode=json`);
    if (!res.ok) {
      problems.push(`Lever ${board.slug}: HTTP ${res.status} (board may have moved or closed)`);
      continue;
    }
    for (const p of await res.json()) {
      const location = p.categories?.location ?? "";
      if (!titleRe.test(p.text ?? "") || !isColorado(location)) continue;
      const city = location.split(",")[0].trim();
      const r = p.salaryRange;
      const unit = { "per-year-salary": "YEAR", "per-hour-wage": "HOUR" }[r?.interval] ?? "HOUR";
      const posted = p.createdAt ? iso(p.createdAt) : today;
      out.push({
        slug: slugify(`${p.text}-${board.name}-${city}`),
        title: p.text,
        employer: board.name,
        city: city || "Colorado",
        region: REGION(city),
        pay: r?.min ? `$${r.min.toLocaleString()}–$${r.max.toLocaleString()}${unit === "YEAR" ? "/yr" : "/hr"}` : "Not published",
        payMin: r?.min,
        payMax: r?.max,
        payUnit: unit,
        employmentType: /part.?time/i.test(p.categories?.commitment ?? "") ? "PART_TIME" : "FULL_TIME",
        schedule: p.categories?.commitment,
        summary: firstSentences(p.descriptionPlain || p.openingPlain || p.text),
        requirements: (p.lists ?? []).find((l) => /qualification|requirement/i.test(l.text))?.content
          ? clean((p.lists ?? []).find((l) => /qualification|requirement/i.test(l.text)).content).split(/(?<=\.)\s+/).slice(0, 8)
          : undefined,
        posted,
        validThrough: plusDays(posted, 60),
        source: "lever",
        sourceName: `${board.name} careers page`,
      });
    }
  }
  return out;
}

// ---------- Greenhouse (employer-published board API) ----------

async function fromGreenhouse() {
  const out = [];
  for (const board of cfg.greenhouse ?? []) {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board.slug}/jobs?content=true`);
    if (!res.ok) {
      problems.push(`Greenhouse ${board.slug}: HTTP ${res.status}`);
      continue;
    }
    const data = await res.json();
    for (const j of data.jobs ?? []) {
      const location = j.location?.name ?? "";
      if (!titleRe.test(j.title ?? "") || !isColorado(location)) continue;
      const city = location.split(",")[0].trim();
      const posted = j.updated_at ? iso(j.updated_at) : today;
      out.push({
        slug: slugify(`${j.title}-${board.name}-${city}`),
        title: j.title,
        employer: board.name,
        city: city || "Colorado",
        region: REGION(city),
        pay: "Not published",
        employmentType: "FULL_TIME",
        summary: firstSentences(j.content ? decodeURIComponent(j.content.replace(/\+/g, " ")) : j.title),
        posted,
        validThrough: plusDays(posted, 60),
        source: "greenhouse",
        sourceName: `${board.name} careers page`,
      });
    }
  }
  return out;
}

// ---------- merge ----------

const existing = JSON.parse(fs.readFileSync(OUT, "utf8"));
const direct = existing.filter((j) => !j.source || j.source === "direct");

const imported = (await Promise.all([fromUsajobs(), fromLever(), fromGreenhouse()])).flat();

const seen = new Set(direct.map((j) => j.slug));
const kept = [];
for (const j of imported) {
  if (seen.has(j.slug)) continue; // a direct listing always wins over an imported duplicate
  seen.add(j.slug);
  kept.push(Object.fromEntries(Object.entries(j).filter(([, v]) => v !== undefined && v !== "")));
}

const merged = [...direct, ...kept].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.posted.localeCompare(a.posted));
const json = JSON.stringify(merged, null, 2) + "\n";
const before = fs.readFileSync(OUT, "utf8");

for (const p of problems) console.warn(`  ! ${p}`);
const bySource = kept.reduce((m, j) => ({ ...m, [j.source]: (m[j.source] ?? 0) + 1 }), {});
console.log(`${direct.length} direct + ${kept.length} imported ${JSON.stringify(bySource)} = ${merged.length} listings`);

if (dry) console.log(json === before ? "No change." : `Would rewrite ${OUT}.`);
else if (json === before) console.log(`${OUT} already up to date.`);
else {
  fs.writeFileSync(OUT, json);
  console.log(`Wrote ${OUT}. Now: npm run build, then deploy.`);
}
