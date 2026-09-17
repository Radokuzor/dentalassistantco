// POST /api/admin/  { password, days }  →  analytics JSON for the /admin/ dashboard.
// The password lives only in the ADMIN_PASSWORD secret. Failed attempts are rate-limited per IP.
import { createHash, timingSafeEqual } from "node:crypto";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { defineSecret } from "firebase-functions/params";
import { onRequest, type Request } from "firebase-functions/v2/https";

const ADMIN_PASSWORD = defineSecret("ADMIN_PASSWORD");
const TZ = "America/Denver";
const MAX_FAILS = 8;
const LOCK_WINDOW_MS = 15 * 60 * 1000;
const MAX_EVENTS = 60_000;
const MAX_HEATMAP_POINTS = 1500;

type Row = [string, number];
type Doc = FirebaseFirestore.DocumentData;

const sha = (s: string) => createHash("sha256").update(s).digest();
const passwordOk = (given: string) => timingSafeEqual(sha(given), sha(ADMIN_PASSWORD.value()));
const clientIp = (req: Request) => (String(req.headers["x-forwarded-for"] ?? "").split(",")[0] || req.ip || "").trim();
const dayKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });
const bump = (m: Map<string, number>, k: string, n = 1) => m.set(k, (m.get(k) ?? 0) + n);
const top = (m: Map<string, number>, n = 12): Row[] => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const hostOf = (url?: string) => {
  try {
    return url && url !== "(direct)" ? new URL(url).host : "(direct)";
  } catch {
    return "(unknown)";
  }
};
const toDate = (v: unknown) => (v instanceof Timestamp ? v.toDate() : null);

export const admin = onRequest(
  { region: "us-central1", memory: "1GiB", timeoutSeconds: 120, maxInstances: 2, secrets: [ADMIN_PASSWORD] },
  async (req, res) => {
    res.set("Cache-Control", "no-store");
    if (req.method !== "POST") {
      res.status(405).end();
      return;
    }
    const db = getFirestore();
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body ?? {};

    // --- rate limit + password check ---
    const attemptRef = db.collection("dac_admin_attempts").doc(sha(clientIp(req)).toString("hex").slice(0, 24));
    const attempt = (await attemptRef.get()).data();
    const windowOpen = attempt && Date.now() - attempt.first.toMillis() < LOCK_WINDOW_MS;
    if (windowOpen && attempt.fails >= MAX_FAILS) {
      res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
      return;
    }
    if (!passwordOk(String(body.password ?? ""))) {
      await attemptRef.set(windowOpen ? { fails: FieldValue.increment(1) } : { fails: 1, first: Timestamp.now() }, { merge: true });
      res.status(401).json({ error: "Wrong password." });
      return;
    }
    if (attempt) await attemptRef.delete();

    // --- load data ---
    const days = Math.min(90, Math.max(1, Number(body.days) || 7));
    const since = new Date(Date.now() - days * 86_400_000);
    const [eventsSnap, leadsSnap] = await Promise.all([
      db.collection("dac_events").where("ts", ">=", Timestamp.fromDate(since)).orderBy("ts", "asc").limit(MAX_EVENTS).get(),
      db.collection("dac_leads").where("createdAt", ">=", Timestamp.fromDate(since)).orderBy("createdAt", "desc").get(),
    ]);
    const events = eventsSnap.docs.map((d) => d.data());
    const leads = leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as Doc);

    // --- aggregate ---
    const daily = new Map<string, { visitors: Set<string>; sessions: Set<string>; pageViews: number; leads: number }>();
    for (let t = since.getTime(); t <= Date.now(); t += 86_400_000) {
      daily.set(dayKey.format(new Date(t)), { visitors: new Set(), sessions: new Set(), pageViews: 0, leads: 0 });
    }
    const sessions = new Map<string, { pages: number; engaged: number; last: number; source?: string; landing?: string; device?: string }>();
    const visitors = new Set<string>();
    const pages = new Map<string, { views: number; engaged: number; engagedN: number; read90: number }>();
    const sources = new Map<string, number>();
    const landings = new Map<string, number>();
    const devices = new Map<string, number>();
    const ctas = new Map<string, number>();
    const topClicks = new Map<string, number>();
    const deadClicks = new Map<string, number>();
    const notFound = new Map<string, number>();
    const errors = new Map<string, number>();
    const vitals = new Map<string, { good: number; "needs-improvement": number; poor: number }>();
    const quizSteps = new Map<number, number>();
    const clicksByPage = new Map<string, { x: number; y: number; vw: number; i: boolean }[]>();
    let quizStart = 0;
    let quizAbandon = 0;
    const recent: Doc[] = [];

    for (const e of events) {
      const when = toDate(e.ts);
      const visitor = e.vid && e.vid !== "anon" ? e.vid : e.ipHash;
      const s = sessions.get(e.sid) ?? { pages: 0, engaged: 0, last: 0 };
      sessions.set(e.sid, s);
      if (when) s.last = Math.max(s.last, when.getTime());
      const p = e.params ?? {};
      const day = when ? daily.get(dayKey.format(when)) : undefined;

      switch (e.name) {
        case "page_view": {
          visitors.add(visitor);
          day?.visitors.add(visitor);
          day?.sessions.add(e.sid);
          if (day) day.pageViews++;
          const pg = pages.get(e.path) ?? { views: 0, engaged: 0, engagedN: 0, read90: 0 };
          pg.views++;
          pages.set(e.path, pg);
          s.pages++;
          if (!s.landing) {
            const a = e.attribution?.last ?? e.attribution?.first;
            s.landing = e.path;
            s.device = e.device;
            s.source = a?.utm_source ? `${a.utm_source} / ${a.utm_medium ?? "?"}` : hostOf(a?.referrer ?? e.referrer);
          }
          break;
        }
        case "engaged_time": {
          const pg = pages.get(p.path);
          if (pg) {
            pg.engaged += Number(p.seconds) || 0;
            pg.engagedN++;
          }
          s.engaged += Number(p.seconds) || 0;
          break;
        }
        case "scroll_depth":
          if (p.percent === 90 && pages.has(e.path)) pages.get(e.path)!.read90++;
          break;
        case "quiz_start":
          quizStart++;
          break;
        case "quiz_step":
          quizSteps.set(Number(p.step), (quizSteps.get(Number(p.step)) ?? 0) + 1);
          break;
        case "quiz_abandon":
          quizAbandon++;
          break;
        case "cta_click":
          bump(ctas, `${p.cta_id ?? p.cta_text} · ${p.location}`);
          break;
        case "phone_click":
          bump(ctas, `phone · ${p.location}`);
          break;
        case "click": {
          bump(p.interactive ? topClicks : deadClicks, `${e.path} · ${p.label || p.tag || "?"}`);
          const list = clicksByPage.get(e.path) ?? [];
          if (list.length < MAX_HEATMAP_POINTS) list.push({ x: Number(p.x_pct), y: Number(p.y), vw: Number(p.vw), i: Boolean(p.interactive) });
          clicksByPage.set(e.path, list);
          break;
        }
        case "not_found":
          bump(notFound, p.path ?? e.path);
          break;
        case "js_error":
          bump(errors, `${p.message} (${p.source})`);
          break;
        case "web_vitals": {
          const v = vitals.get(p.metric) ?? { good: 0, "needs-improvement": 0, poor: 0 };
          v[p.rating as keyof typeof v] = (v[p.rating as keyof typeof v] ?? 0) + 1;
          vitals.set(p.metric, v);
          break;
        }
      }
      if (["page_view", "cta_click", "phone_click", "quiz_start", "generate_lead", "form_error", "not_found", "outbound_click"].includes(e.name)) {
        recent.push({ t: when?.toISOString(), name: e.name, path: e.path, device: e.device, detail: p.cta_id ?? p.form_id ?? p.domain ?? p.location ?? "" });
      }
    }

    const real = [...sessions.values()].filter((s) => s.pages > 0);
    for (const s of real) {
      bump(sources, s.source ?? "?");
      bump(landings, s.landing ?? "?");
      bump(devices, s.device ?? "?");
    }
    for (const l of leads) {
      const d = toDate(l.createdAt);
      const day = d ? daily.get(dayKey.format(d)) : undefined;
      if (day) day.leads++;
    }
    const programLeads = leads.filter((l) => l.type === "program_match").length;
    const activeCutoff = Date.now() - 30 * 60 * 1000;

    res.json({
      generatedAt: new Date().toISOString(),
      days,
      truncated: events.length >= MAX_EVENTS,
      overview: {
        visitors: visitors.size,
        sessions: real.length,
        pageViews: [...pages.values()].reduce((a, p) => a + p.views, 0),
        leads: leads.length,
        bounceRate: real.length ? real.filter((s) => s.pages === 1).length / real.length : 0,
        avgEngagedSec: real.length ? Math.round(real.reduce((a, s) => a + s.engaged, 0) / real.length) : 0,
        pagesPerSession: real.length ? real.reduce((a, s) => a + s.pages, 0) / real.length : 0,
        activeNow: real.filter((s) => s.last >= activeCutoff).length,
      },
      daily: [...daily.entries()].map(([date, d]) => ({ date, visitors: d.visitors.size, sessions: d.sessions.size, pageViews: d.pageViews, leads: d.leads })),
      funnel: [
        { label: "Sessions", count: real.length },
        { label: "Started quiz", count: quizStart },
        ...[...quizSteps.entries()].sort((a, b) => a[0] - b[0]).map(([step, count]) => ({ label: `Answered step ${step}`, count })),
        { label: "Submitted (program lead)", count: programLeads },
      ],
      quizAbandon,
      sources: top(sources),
      landings: top(landings),
      devices: top(devices),
      pages: [...pages.entries()]
        .sort((a, b) => b[1].views - a[1].views)
        .slice(0, 25)
        .map(([path, p]) => ({ path, views: p.views, avgEngagedSec: p.engagedN ? Math.round(p.engaged / p.engagedN) : null, read90: p.views ? p.read90 / p.views : 0 })),
      ctas: top(ctas, 15),
      topClicks: top(topClicks, 15),
      deadClicks: top(deadClicks, 10),
      notFound: top(notFound),
      errors: top(errors, 10),
      vitals: [...vitals.entries()].map(([metric, v]) => ({ metric, ...v })),
      heatmaps: [...clicksByPage.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 10).map(([path, clicks]) => ({ path, clicks })),
      recent: recent.slice(-50).reverse(),
      leads: leads.slice(0, 50).map((l) => ({
        id: l.id,
        type: l.type,
        createdAt: toDate(l.createdAt)?.toISOString(),
        contact: l.contact ?? {},
        answers: l.answers ?? {},
        consent: Boolean(l.consent?.given),
        source: l.attribution?.last?.utm_source ?? l.attribution?.first?.utm_source ?? hostOf(l.attribution?.first?.referrer),
        landing: l.attribution?.first?.landing ?? null,
        page: l.consent?.url ?? null,
        device: l.device,
      })),
    });
  },
);
