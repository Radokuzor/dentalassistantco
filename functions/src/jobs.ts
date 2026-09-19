// Manual job-board publishing, driven from /admin/ (see web/src/components/admin/AdminJobs.tsx).
//   adminJobs   POST /api/admin-jobs/  { password, action, job? | slug? }  →  create/update/close/reopen/delete/list
//   jobsFeed    GET  /api/jobs-feed/                                      →  public JSON of live listings
//
// Firestore is the source of truth (`dac_jobs`, prefixed per the shared-project rule). Publishing
// here makes a job appear on /jobs/ within seconds (JobBoard fetches jobsFeed at runtime) with no
// rebuild needed. A rebuild (npm run jobs:sync) additionally bakes it into a static /jobs/<slug>/
// page with JobPosting schema for Google — worth doing, not required to go live.
import { createHash, timingSafeEqual } from "node:crypto";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { onRequest, type Request } from "firebase-functions/v2/https";

const ADMIN_PASSWORD = defineSecret("ADMIN_PASSWORD");
const REGION = "us-central1";
const MAX_FAILS = 8;
const LOCK_WINDOW_MS = 15 * 60 * 1000;

const sha = (s: string) => createHash("sha256").update(s).digest();
const passwordOk = (given: string) => timingSafeEqual(sha(given), sha(ADMIN_PASSWORD.value()));
const clientIp = (req: Request) => (String(req.headers["x-forwarded-for"] ?? "").split(",")[0] || req.ip || "").trim();
const today = () => new Date().toISOString().slice(0, 10);
const clip = (v: unknown, max = 300): string | undefined => (v == null || v === "" ? undefined : String(v).slice(0, max));

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 70);

const regionOf = (city = "") =>
  /denver|aurora|lakewood|arvada|westminster|thornton|littleton|centennial|broomfield|golden/i.test(city)
    ? "Denver metro"
    : /colorado springs|fountain|monument|fort carson|peterson|schriever/i.test(city)
      ? "Pikes Peak"
      : /fort collins|greeley|loveland|longmont|boulder/i.test(city)
        ? "Northern Colorado"
        : /pueblo|trinidad|canon city|florence/i.test(city)
          ? "Southern Colorado"
          : "Colorado";

const TYPES = new Set(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"]);
const REQUIRED = ["title", "employer", "city", "pay", "summary"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const lines = (v: unknown) =>
  Array.isArray(v)
    ? v.map(String).map((s) => s.trim()).filter(Boolean)
    : typeof v === "string"
      ? v.split("\n").map((s) => s.trim()).filter(Boolean)
      : undefined;

/** Validates and normalizes a job posted from the admin form into the Job shape web/src/data/jobs.ts expects. */
function sanitizeJob(input: Record<string, unknown>, keepSlug?: string) {
  const problems = REQUIRED.filter((k) => !String(input[k] ?? "").trim());
  if (!TYPES.has(String(input.employmentType))) problems.push("employment type");
  if (!/^\S+@\S+\.\S+$/.test(String(input.forwardTo ?? ""))) problems.push("forward-to email");
  if (problems.length) return { problems };

  const city = String(input.city).trim();
  const slug = keepSlug || slugify(String(input.slug || `${input.title}-${input.employer}-${city}`));
  const posted = DATE_RE.test(String(input.posted)) ? String(input.posted) : today();
  const validThrough = DATE_RE.test(String(input.validThrough))
    ? String(input.validThrough)
    : new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10);

  const job: Record<string, unknown> = {
    slug,
    title: clip(input.title, 140),
    employer: clip(input.employer, 140),
    city,
    region: clip(input.region, 60) ?? regionOf(city),
    pay: clip(input.pay, 80),
    payMin: Number(input.payMin) || undefined,
    payMax: Number(input.payMax) || undefined,
    payUnit: ["HOUR", "DAY", "WEEK", "MONTH", "YEAR"].includes(String(input.payUnit)) ? input.payUnit : undefined,
    employmentType: input.employmentType,
    schedule: clip(input.schedule, 140),
    summary: clip(input.summary, 800),
    responsibilities: lines(input.responsibilities),
    requirements: lines(input.requirements),
    benefits: lines(input.benefits),
    featured: input.featured === true || undefined,
    street: clip(input.street, 140),
    postalCode: clip(input.postalCode, 12),
    posted,
    validThrough,
    source: "direct",
    sourceName: undefined,
    forwardTo: clip(input.forwardTo, 200),
    status: "approved",
    updatedAt: FieldValue.serverTimestamp(),
  };
  return { job: Object.fromEntries(Object.entries(job).filter(([, v]) => v !== undefined)) };
}

/** Same shared-secret + IP lockout as functions/src/admin.ts, kept local so this file has no
 *  cross-file dependency on the analytics dashboard. */
async function checkPassword(req: Request, res: import("firebase-functions/v2/https").Response): Promise<boolean> {
  const db = getFirestore();
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  const attemptRef = db.collection("dac_admin_attempts").doc(`jobs_${sha(clientIp(req)).toString("hex").slice(0, 24)}`);
  const attempt = (await attemptRef.get()).data();
  const windowOpen = attempt && Date.now() - attempt.first.toMillis() < LOCK_WINDOW_MS;
  if (windowOpen && attempt.fails >= MAX_FAILS) {
    res.status(429).json({ ok: false, error: "Too many attempts. Try again in 15 minutes." });
    return false;
  }
  if (!passwordOk(String(body.password ?? ""))) {
    await attemptRef.set(windowOpen ? { fails: FieldValue.increment(1) } : { fails: 1, first: FieldValue.serverTimestamp() }, { merge: true });
    res.status(401).json({ ok: false, error: "Wrong password." });
    return false;
  }
  if (attempt) await attemptRef.delete();
  return true;
}

export const adminJobs = onRequest({ region: REGION, memory: "256MiB", maxInstances: 3, secrets: [ADMIN_PASSWORD] }, async (req, res) => {
  res.set("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.status(405).end();
    return;
  }
  if (!(await checkPassword(req, res))) return;

  const db = getFirestore();
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  const action = String(body.action || "");

  if (action === "list") {
    const snap = await db.collection("dac_jobs").get();
    const jobs = snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) => String(b.posted ?? "").localeCompare(String(a.posted ?? "")));
    res.json({ ok: true, jobs });
    return;
  }

  if (action === "create" || action === "update") {
    const keepSlug = action === "update" ? clip(body.slug, 70) : undefined;
    const { job, problems } = sanitizeJob((body.job ?? {}) as Record<string, unknown>, keepSlug);
    if (problems) {
      res.status(400).json({ ok: false, error: `Fix these fields: ${problems.join(", ")}.` });
      return;
    }
    await db.collection("dac_jobs").doc(job!.slug as string).set(job!, { merge: true });
    res.json({ ok: true, slug: job!.slug });
    return;
  }

  if (action === "close" || action === "reopen" || action === "delete") {
    const slug = clip(body.slug, 70);
    if (!slug) {
      res.status(400).json({ ok: false, error: "Missing slug." });
      return;
    }
    const ref = db.collection("dac_jobs").doc(slug);
    if (action === "delete") await ref.delete();
    else if (action === "close") await ref.set({ validThrough: new Date(Date.now() - 86_400_000).toISOString().slice(0, 10) }, { merge: true });
    else await ref.set({ validThrough: new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10), status: "approved" }, { merge: true });
    res.json({ ok: true });
    return;
  }

  res.status(400).json({ ok: false, error: "Unknown action." });
});

/** Public, unauthenticated: the live job list. Powers JobBoard's runtime fetch so a job published
 *  in the admin shows up on /jobs/ immediately, without a rebuild. Only public-safe fields. */
export const jobsFeed = onRequest({ region: REGION, memory: "256MiB", maxInstances: 10 }, async (req, res) => {
  res.set("Cache-Control", "public, max-age=30, s-maxage=60, stale-while-revalidate=300");
  if (req.method !== "GET") {
    res.status(405).end();
    return;
  }
  const db = getFirestore();
  const snap = await db.collection("dac_jobs").where("status", "==", "approved").get();
  const t = today();
  const jobs = snap.docs
    .map((d) => d.data())
    .filter((j) => String(j.validThrough ?? "") >= t)
    .map(({ forwardTo: _forwardTo, status: _status, updatedAt: _updatedAt, ...pub }) => pub)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || String(b.posted).localeCompare(String(a.posted)));
  res.json({ jobs });
});
