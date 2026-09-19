// Pulls approved job listings out of Firestore into web/src/data/jobs.json, so an opening an
// employer submitted through /hire/ can go live without anyone editing TypeScript.
//
//   npm run jobs:sync            # write web/src/data/jobs.json from dac_jobs (status: "approved")
//   npm run jobs:sync -- --dry   # print what would change and write nothing
//
// The board is static (Next.js export), so a sync must be followed by a build + deploy.
// Uses the Admin SDK key in the repo root (see .env GOOGLE_APPLICATION_CREDENTIALS).
//
// A `dac_jobs` document looks like the Job type in web/src/data/jobs.ts, plus:
//   status: "pending" | "approved" | "rejected"   — only "approved" is published
//   leadId: string                                — the dac_leads doc it came from, if any
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(new URL("../functions/package.json", import.meta.url));
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const OUT = "web/src/data/jobs.json";
const dry = process.argv.includes("--dry");

const keyFile = fs.readdirSync(".").find((f) => /firebase-adminsdk.*\.json$/.test(f));
if (!keyFile) throw new Error("Run from the repo root; the firebase-adminsdk JSON key was not found.");
initializeApp({ credential: cert(JSON.parse(fs.readFileSync(keyFile, "utf8"))) });
const db = getFirestore();

const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);

const asDate = (v) => {
  if (!v) return undefined;
  if (typeof v === "string") return v.slice(0, 10);
  if (typeof v.toDate === "function") return v.toDate().toISOString().slice(0, 10);
  return undefined;
};

const list = (v) => (Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : undefined);

const REQUIRED = ["title", "employer", "city", "pay", "summary"];
const TYPES = new Set(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"]);

const snap = await db.collection("dac_jobs").where("status", "==", "approved").get();
const seen = new Set();
const problems = [];

const jobs = snap.docs
  .map((doc) => {
    const d = doc.data();
    const missing = REQUIRED.filter((k) => !String(d[k] ?? "").trim());
    const posted = asDate(d.posted) ?? asDate(d.createdAt);
    const validThrough = asDate(d.validThrough) ?? (posted && new Date(new Date(posted).getTime() + 60 * 86_400_000).toISOString().slice(0, 10));
    if (missing.length || !posted || !validThrough) {
      problems.push(`${doc.id}: missing ${[...missing, ...(posted ? [] : ["posted"]), ...(validThrough ? [] : ["validThrough"])].join(", ")}`);
      return null;
    }
    let slug = slugify(d.slug || `${d.title}-${d.employer}-${d.city}`);
    while (seen.has(slug)) slug = `${slug}-2`;
    seen.add(slug);
    return {
      slug,
      title: String(d.title).trim(),
      employer: String(d.employer).trim(),
      city: String(d.city).trim(),
      region: String(d.region || d.city).trim(),
      pay: String(d.pay).trim(),
      payMin: Number(d.payMin) || undefined,
      payMax: Number(d.payMax) || undefined,
      payUnit: d.payUnit || (d.payMin ? "HOUR" : undefined),
      employmentType: TYPES.has(d.employmentType) ? d.employmentType : "FULL_TIME",
      schedule: d.schedule ? String(d.schedule).trim() : undefined,
      summary: String(d.summary).trim(),
      responsibilities: list(d.responsibilities),
      requirements: list(d.requirements),
      benefits: list(d.benefits),
      featured: d.featured === true || undefined,
      street: d.street ? String(d.street).trim() : undefined,
      postalCode: d.postalCode ? String(d.postalCode).trim() : undefined,
      posted,
      validThrough,
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.posted.localeCompare(a.posted) || a.slug.localeCompare(b.slug));

const json = JSON.stringify(jobs, null, 2) + "\n"; // undefined fields drop out on their own
const before = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
const live = jobs.filter((j) => j.validThrough >= new Date().toISOString().slice(0, 10));

for (const p of problems) console.warn(`  skipped ${p}`);
console.log(`dac_jobs: ${snap.size} approved → ${jobs.length} valid (${live.length} not yet expired)`);

if (dry) {
  console.log(json === before ? "No change." : "Would rewrite " + OUT);
} else if (json === before) {
  console.log(`${OUT} already up to date.`);
} else {
  fs.writeFileSync(OUT, json);
  console.log(`Wrote ${OUT}. Now run: npm run build && firebase deploy --only hosting  (or push to Vercel).`);
}

const pending = await db.collection("dac_jobs").where("status", "==", "pending").count().get();
const employerLeads = await db.collection("dac_leads").where("type", "==", "employer").where("status", "==", "new").count().get();
if (pending.data().count) console.log(`${pending.data().count} job(s) waiting for approval in dac_jobs.`);
if (employerLeads.data().count) console.log(`${employerLeads.data().count} new employer submission(s) in dac_leads to turn into listings.`);
