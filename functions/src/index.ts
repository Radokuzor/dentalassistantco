// Backend for dentalassistantco.com (see docs/07-analytics-plan.md).
//   collect        POST /api/collect/  first-party analytics events → Firestore
//   lead           POST /api/lead/     quiz, contact and employer forms → Firestore
//   onLeadCreated  Firestore trigger   instant Telegram alert for every lead
//   dailyDigest    08:00 America/Denver  yesterday's KPIs → Telegram + dailyStats
//   weeklyDigest   Mondays 08:15         last 7 days vs the prior 7 → Telegram
import { createHash } from "node:crypto";
import { initializeApp } from "firebase-admin/app";
import { FieldValue, Timestamp, getFirestore } from "firebase-admin/firestore";
import { logger } from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onRequest, type Request } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";

initializeApp();
const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });

const TELEGRAM_BOT_TOKEN = defineSecret("TELEGRAM_BOT_TOKEN");
const TELEGRAM_CHAT_ID = defineSecret("TELEGRAM_CHAT_ID");
const TZ = "America/Denver";
const REGION = "us-central1";

// ---------- helpers ----------

const clientIp = (req: Request) => (String(req.headers["x-forwarded-for"] ?? "").split(",")[0] || req.ip || "").trim();

/** Daily-rotating salted hash: counts unique IPs per day without storing them. */
const ipHash = (ip: string) =>
  createHash("sha256").update(`${ip}|${new Date().toISOString().slice(0, 10)}|${process.env.GCLOUD_PROJECT}`).digest("hex").slice(0, 16);

const deviceType = (ua = "") => (/tablet|ipad/i.test(ua) ? "tablet" : /mobi|android|iphone/i.test(ua) ? "mobile" : /bot|crawl|spider|headless/i.test(ua) ? "bot" : "desktop");

const parseBody = (req: Request): Record<string, unknown> | null => {
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : Buffer.isBuffer(req.body) ? JSON.parse(req.body.toString()) : req.body;
    return body && typeof body === "object" ? body : null;
  } catch {
    return null;
  }
};

const clip = (v: unknown, max = 300): string | undefined => (v == null ? undefined : String(v).slice(0, max));

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function telegram(text: string) {
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN.value()}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID.value(), text: text.slice(0, 4000), parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) logger.error("Telegram send failed", res.status, await res.text());
}

const sameOrigin = (req: Request) => {
  const origin = String(req.headers.origin ?? req.headers.referer ?? "");
  return !origin || /^https:\/\/(www\.)?dentalassistantco\.com|^https:\/\/take-shots-f1a99\.(web\.app|firebaseapp\.com)|^http:\/\/localhost/.test(origin);
};

// ---------- analytics collection ----------

const EVENT_NAME = /^[a-z][a-z0-9_]{1,39}$/;

export const collect = onRequest({ region: REGION, memory: "256MiB", maxInstances: 10 }, async (req, res) => {
  if (req.method !== "POST" || !sameOrigin(req)) {
    res.status(405).end();
    return;
  }
  const b = parseBody(req);
  const ua = String(req.headers["user-agent"] ?? "");
  const device = deviceType(ua);
  if (!b || !EVENT_NAME.test(String(b.name)) || JSON.stringify(b).length > 8000 || device === "bot") {
    res.status(204).end();
    return;
  }

  const sid = clip(b.sid, 64) ?? "nosession";
  const params = (typeof b.params === "object" && b.params) || {};
  const event = {
    name: String(b.name),
    params,
    vid: clip(b.vid, 64),
    sid,
    path: clip(b.path, 300),
    title: clip(b.title, 200),
    referrer: clip(b.referrer, 300),
    attribution: b.attribution,
    screen: clip(b.screen, 20),
    lang: clip(b.lang, 20),
    tz: clip(b.tz, 60),
    device,
    ipHash: ipHash(clientIp(req)),
    clientTs: typeof b.ts === "number" ? b.ts : undefined,
    ts: FieldValue.serverTimestamp(),
  };

  const batch = db.batch();
  batch.create(db.collection("dac_events").doc(), event);
  const session = db.collection("dac_sessions").doc(sid);
  batch.set(
    session,
    {
      vid: event.vid,
      device,
      last: FieldValue.serverTimestamp(),
      events: FieldValue.increment(1),
      ...(event.name === "page_view" ? { pages: FieldValue.increment(1), lastPath: event.path } : {}),
      ...(b.newSession ? { start: FieldValue.serverTimestamp(), landing: event.path, referrer: event.referrer, attribution: event.attribution } : {}),
    },
    { merge: true },
  );
  await batch.commit();
  res.status(204).end();
});

// ---------- lead intake ----------

const LEAD_TYPES = new Set(["program_match", "contact", "employer"]);

export const lead = onRequest({ region: REGION, memory: "256MiB", maxInstances: 5 }, async (req, res) => {
  if (req.method !== "POST" || !sameOrigin(req)) {
    res.status(405).end();
    return;
  }
  const b = parseBody(req);
  if (!b || !LEAD_TYPES.has(String(b.type)) || JSON.stringify(b).length > 10000) {
    res.status(400).json({ ok: false });
    return;
  }
  const contact = Object.fromEntries(Object.entries((b.contact as Record<string, unknown>) ?? {}).map(([k, v]) => [k.slice(0, 40), clip(v, 2000)]));
  if (!contact.email && !contact.phone) {
    res.status(400).json({ ok: false, error: "email or phone required" });
    return;
  }
  const consent = (b.consent as { given?: boolean; text?: string }) ?? { given: false };
  const ip = clientIp(req);
  const ua = String(req.headers["user-agent"] ?? "");

  const ref = await db.collection("dac_leads").add({
    type: b.type,
    contact,
    answers: b.answers ?? {},
    consent: {
      given: consent.given === true,
      text: clip(consent.text, 2000),
      ip,
      ua,
      url: clip(b.page, 500),
      ts: FieldValue.serverTimestamp(),
    },
    attribution: b.attribution ?? null,
    ids: b.ids ?? null,
    device: deviceType(ua),
    status: "new",
    createdAt: FieldValue.serverTimestamp(),
  });
  res.status(200).json({ ok: true, id: ref.id });
});

const LEAD_LABEL: Record<string, string> = { program_match: "🎓 New program lead", contact: "✉️ New contact message", employer: "🦷 New employer / job post" };

export const onLeadCreated = onDocumentCreated(
  { document: "dac_leads/{id}", region: REGION, secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID] },
  async (event) => {
    const d = event.data?.data();
    if (!d) return;
    const first = d.attribution?.first ?? {};
    const last = d.attribution?.last ?? {};
    const lines = [
      `<b>${LEAD_LABEL[d.type] ?? d.type}</b>`,
      ...Object.entries(d.contact ?? {}).map(([k, v]) => `<b>${esc(k)}:</b> ${esc(v)}`),
      ...Object.entries(d.answers ?? {}).map(([k, v]) => `• ${esc(k)}: ${esc(v)}`),
      `Consent to contact: ${d.consent?.given ? "✅ yes" : "❌ no"}`,
      `Page: ${esc(d.consent?.url)}`,
      `First touch: ${esc(first.utm_source ?? first.referrer ?? "?")} → ${esc(first.landing ?? "?")}`,
      last.utm_source ? `Campaign: ${esc(last.utm_source)} / ${esc(last.utm_medium)} / ${esc(last.utm_campaign)}` : "",
      `Device: ${esc(d.device)} · id ${event.params.id}`,
    ].filter(Boolean);
    await telegram(lines.join("\n"));
  },
);

// ---------- digests ----------

type Stats = {
  sessions: number;
  visitors: number;
  pageViews: number;
  leads: number;
  leadsByType: Record<string, number>;
  phoneClicks: number;
  quiz: { start: number; step: Record<string, number>; abandon: number; submit: number };
  topPages: [string, number][];
  topSources: [string, number][];
  notFound: [string, number][];
  devices: Record<string, number>;
  avgEngagedSec: number;
};

const hostOf = (url?: string) => {
  try {
    return url && url !== "(direct)" ? new URL(url).host : "(direct)";
  } catch {
    return "(unknown)";
  }
};
const top = (m: Map<string, number>, n = 5) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const bump = (m: Map<string, number>, k: string) => m.set(k, (m.get(k) ?? 0) + 1);

async function aggregate(from: Date, to: Date): Promise<Stats> {
  const range = (col: string, field: string) =>
    db.collection(col).where(field, ">=", Timestamp.fromDate(from)).where(field, "<", Timestamp.fromDate(to));
  const [events, leads] = await Promise.all([range("dac_events", "ts").get(), range("dac_leads", "createdAt").get()]);

  const sessions = new Set<string>();
  const visitors = new Set<string>();
  const pages = new Map<string, number>();
  const sources = new Map<string, number>();
  const notFound = new Map<string, number>();
  const devices = new Map<string, number>();
  const quiz = { start: 0, step: {} as Record<string, number>, abandon: 0, submit: 0 };
  let pageViews = 0;
  let phoneClicks = 0;
  let engaged = 0;
  let engagedCount = 0;

  for (const doc of events.docs) {
    const e = doc.data();
    sessions.add(e.sid);
    visitors.add(e.vid && e.vid !== "anon" ? e.vid : e.ipHash);
    switch (e.name) {
      case "page_view": {
        pageViews++;
        bump(pages, e.path ?? "?");
        bump(devices, e.device ?? "?");
        const a = e.attribution?.last ?? e.attribution?.first;
        if (a && e.params?.page_path === a.landing) {
          const ref = a.utm_source ?? hostOf(a.referrer);
          bump(sources, String(ref));
        }
        break;
      }
      case "phone_click":
        phoneClicks++;
        break;
      case "quiz_start":
        quiz.start++;
        break;
      case "quiz_step":
        quiz.step[String(e.params?.step)] = (quiz.step[String(e.params?.step)] ?? 0) + 1;
        break;
      case "quiz_abandon":
        quiz.abandon++;
        break;
      case "generate_lead":
        if (e.params?.form_id === "program_match") quiz.submit++;
        break;
      case "not_found":
        bump(notFound, e.params?.path ?? e.path ?? "?");
        break;
      case "engaged_time":
        engaged += Number(e.params?.seconds) || 0;
        engagedCount++;
        break;
    }
  }

  const leadsByType: Record<string, number> = {};
  for (const l of leads.docs) leadsByType[l.get("type")] = (leadsByType[l.get("type")] ?? 0) + 1;

  return {
    sessions: sessions.size,
    visitors: visitors.size,
    pageViews,
    leads: leads.size,
    leadsByType,
    phoneClicks,
    quiz,
    topPages: top(pages),
    topSources: top(sources),
    notFound: top(notFound),
    devices: Object.fromEntries(devices),
    avgEngagedSec: engagedCount ? Math.round(engaged / engagedCount) : 0,
  };
}

const delta = (now: number, before?: number) => {
  if (before === undefined) return "";
  if (!before) return now ? " (new)" : "";
  const pct = Math.round(((now - before) / before) * 100);
  return ` (${pct >= 0 ? "+" : ""}${pct}%)`;
};

function formatStats(title: string, s: Stats, prev?: Stats) {
  const list = (rows: [string, number][]) => (rows.length ? rows.map(([k, v]) => `  ${v} · ${esc(k)}`).join("\n") : "  —");
  const steps = Object.entries(s.quiz.step).sort().map(([k, v]) => `s${k}:${v}`).join(" → ");
  return [
    `<b>📊 ${title}</b>`,
    `Visitors: <b>${s.visitors}</b>${delta(s.visitors, prev?.visitors)} · Sessions: ${s.sessions}${delta(s.sessions, prev?.sessions)}`,
    `Page views: ${s.pageViews}${delta(s.pageViews, prev?.pageViews)} · Avg engaged: ${s.avgEngagedSec}s`,
    `Leads: <b>${s.leads}</b>${delta(s.leads, prev?.leads)} ${JSON.stringify(s.leadsByType)}`,
    `Phone clicks: ${s.phoneClicks}`,
    `Quiz: start ${s.quiz.start} → ${steps || "no steps"} → submit ${s.quiz.submit} (abandon ${s.quiz.abandon})`,
    `Devices: ${JSON.stringify(s.devices)}`,
    `<b>Top pages</b>\n${list(s.topPages)}`,
    `<b>Top sources</b>\n${list(s.topSources)}`,
    s.notFound.length ? `<b>404s (add redirects?)</b>\n${list(s.notFound)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Midnight in Denver for the given date offset (days from today). */
function denverMidnight(offsetDays: number) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date()); // YYYY-MM-DD
  const base = new Date(`${today}T00:00:00Z`);
  base.setUTCDate(base.getUTCDate() + offsetDays);
  // Denver is UTC-6 (MDT) or UTC-7 (MST); resolve the actual offset for that date.
  const offset = new Intl.DateTimeFormat("en-US", { timeZone: TZ, timeZoneName: "shortOffset" })
    .formatToParts(base)
    .find((p) => p.type === "timeZoneName")!.value; // e.g. "GMT-6"
  const hours = Number(offset.replace("GMT", "")) || 0;
  return new Date(base.getTime() - hours * 3600_000);
}

export const dailyDigest = onSchedule(
  { schedule: "0 8 * * *", timeZone: TZ, region: REGION, secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID] },
  async () => {
    const from = denverMidnight(-1);
    const to = denverMidnight(0);
    const [s, prev] = await Promise.all([aggregate(from, to), aggregate(denverMidnight(-2), from)]);
    const day = from.toISOString().slice(0, 10);
    await db.collection("dac_dailyStats").doc(day).set({ ...s, topPages: Object.fromEntries(s.topPages), topSources: Object.fromEntries(s.topSources), notFound: Object.fromEntries(s.notFound), from, to });
    await telegram(formatStats(`Daily report · ${day}`, s, prev));
  },
);

export const weeklyDigest = onSchedule(
  { schedule: "15 8 * * 1", timeZone: TZ, region: REGION, secrets: [TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID], memory: "512MiB" },
  async () => {
    const to = denverMidnight(0);
    const from = denverMidnight(-7);
    const [s, prev] = await Promise.all([aggregate(from, to), aggregate(denverMidnight(-14), from)]);
    await telegram(formatStats(`Weekly report · ${from.toISOString().slice(0, 10)} → ${to.toISOString().slice(0, 10)}`, s, prev));
  },
);
