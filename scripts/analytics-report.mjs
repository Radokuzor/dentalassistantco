// Pulls first-party analytics from Firestore and writes a report you can read without any dashboard.
//
//   npm run report               # last 7 days
//   npm run report -- --days 30
//
// Output (gitignored): data/analytics/report-<date>.md and data/analytics/clicks-<date>.csv
// Uses the Admin SDK key in the repo root (see .env GOOGLE_APPLICATION_CREDENTIALS). Contains no lead PII.
import fs from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(new URL("../functions/package.json", import.meta.url));
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");

const keyFile = fs.readdirSync(".").find((f) => /firebase-adminsdk.*\.json$/.test(f));
if (!keyFile) throw new Error("Run from the repo root; the firebase-adminsdk JSON key was not found.");
initializeApp({ credential: cert(JSON.parse(fs.readFileSync(keyFile, "utf8"))) });
const db = getFirestore();

const daysArg = process.argv.indexOf("--days");
const days = daysArg > -1 ? Number(process.argv[daysArg + 1]) : 7;
const since = new Date(Date.now() - days * 86400_000);
const today = new Date().toISOString().slice(0, 10);

const [eventsSnap, leadsSnap] = await Promise.all([
  db.collection("dac_events").where("ts", ">=", Timestamp.fromDate(since)).get(),
  db.collection("dac_leads").where("createdAt", ">=", Timestamp.fromDate(since)).get(),
]);
const events = eventsSnap.docs.map((d) => d.data()).sort((a, b) => (a.clientTs ?? 0) - (b.clientTs ?? 0));

// ---------- helpers ----------
const count = () => new Map();
const bump = (m, k, n = 1) => m.set(k, (m.get(k) ?? 0) + n);
const topRows = (m, n = 10) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n);
const table = (head, rows) =>
  rows.length ? [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.join(" | ")} |`)].join("\n") : "_No data yet._";
const pct = (a, b) => (b ? `${Math.round((a / b) * 100)}%` : "–");
const hostOf = (u) => {
  try {
    return u && u !== "(direct)" ? new URL(u).host : "(direct)";
  } catch {
    return "(unknown)";
  }
};

// ---------- aggregate ----------
const sessions = new Map(); // sid -> { pages, landing, source, device, engaged }
const visitors = new Set();
const pages = new Map(); // path -> { views, engaged, engagedN, scroll90 }
const devices = count();
const funnel = count();
const ctas = count();
const notFound = count();
const errors = count();
const vitals = new Map(); // metric -> { good, needs, poor }
const clicksByPage = new Map(); // path -> [{x,y,label,interactive}]
const clickLabels = count();
const deadLabels = count();

for (const e of events) {
  const s = sessions.get(e.sid) ?? { pages: 0, landing: null, source: null, device: e.device, engaged: 0 };
  sessions.set(e.sid, s);
  visitors.add(e.vid && e.vid !== "anon" ? e.vid : e.ipHash);
  const p = pages.get(e.path) ?? { views: 0, engaged: 0, engagedN: 0, scroll90: 0 };
  const params = e.params ?? {};

  switch (e.name) {
    case "page_view": {
      pages.set(e.path, { ...p, views: p.views + 1 });
      s.pages++;
      if (!s.landing) {
        s.landing = e.path;
        const a = e.attribution?.last ?? e.attribution?.first;
        s.source = a?.utm_source ? `${a.utm_source} / ${a.utm_medium ?? "?"}` : hostOf(a?.referrer ?? e.referrer);
        bump(devices, e.device ?? "?");
      }
      break;
    }
    case "engaged_time":
      if (params.path) {
        const q = pages.get(params.path) ?? { views: 0, engaged: 0, engagedN: 0, scroll90: 0 };
        pages.set(params.path, { ...q, engaged: q.engaged + Number(params.seconds || 0), engagedN: q.engagedN + 1 });
      }
      s.engaged += Number(params.seconds || 0);
      break;
    case "scroll_depth":
      if (params.percent === 90) pages.set(e.path, { ...p, scroll90: p.scroll90 + 1 });
      break;
    case "quiz_start":
      bump(funnel, "0 quiz_start");
      break;
    case "quiz_step":
      bump(funnel, `${params.step} step ${params.step} (${params.step_id})`);
      break;
    case "quiz_abandon":
      bump(funnel, "abandon");
      break;
    case "generate_lead":
      bump(funnel, `lead: ${params.form_id}`);
      break;
    case "cta_click":
      bump(ctas, `${params.cta_id ?? params.cta_text} (${params.location})`);
      break;
    case "phone_click":
      bump(ctas, `phone (${params.location})`);
      break;
    case "not_found":
      bump(notFound, params.path ?? e.path);
      break;
    case "js_error":
      bump(errors, `${params.message} @ ${params.source}`);
      break;
    case "web_vitals": {
      const v = vitals.get(params.metric) ?? { good: 0, "needs-improvement": 0, poor: 0 };
      v[params.rating] = (v[params.rating] ?? 0) + 1;
      vitals.set(params.metric, v);
      break;
    }
    case "click": {
      const list = clicksByPage.get(e.path) ?? [];
      list.push({ x: Number(params.x_pct), y: Number(params.y), label: params.label, interactive: params.interactive, vw: params.vw });
      clicksByPage.set(e.path, list);
      bump(params.interactive ? clickLabels : deadLabels, `${e.path} · ${params.label || params.tag}`);
      break;
    }
  }
}

const sessionList = [...sessions.values()].filter((s) => s.pages > 0);
const bounces = sessionList.filter((s) => s.pages === 1).length;
const sources = count();
const landings = count();
for (const s of sessionList) {
  bump(sources, s.source ?? "?");
  bump(landings, s.landing ?? "?");
}

const leads = leadsSnap.docs.map((d) => d.data());
const leadsBy = count();
for (const l of leads) {
  const a = l.attribution?.last ?? l.attribution?.first ?? {};
  bump(leadsBy, `${l.type} ← ${a.utm_source ?? hostOf(a.referrer)} → ${a.landing ?? "?"}`);
}

// ---------- text heatmap ----------
// 10 columns = 10% of page width each; rows = 400px bands. Darker glyph = more clicks.
const SHADES = " .:-=+*#%@";
function heatmap(list) {
  const band = 400;
  const rows = Math.min(20, Math.ceil(Math.max(...list.map((c) => c.y), 1) / band));
  const grid = Array.from({ length: rows }, () => Array(10).fill(0));
  for (const c of list) {
    const r = Math.min(rows - 1, Math.floor(c.y / band));
    const col = Math.min(9, Math.max(0, Math.floor(c.x / 10)));
    grid[r][col]++;
  }
  const max = Math.max(...grid.flat(), 1);
  return [
    "```",
    "        0%   20%  40%  60%  80% 100%",
    ...grid.map((row, i) => `${String(i * band).padStart(6)}px |${row.map((n) => SHADES[Math.ceil((n / max) * 9)].repeat(3)).join("")}| ${row.reduce((a, b) => a + b, 0)}`),
    "```",
  ].join("\n");
}

const heatPages = [...clicksByPage.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 6);

// ---------- write ----------
const md = `# DentalAssistantCO analytics: last ${days} days
Generated ${new Date().toISOString()} · ${events.length} events · source: Firestore \`dac_events\`, \`dac_leads\`

## Overview
${table(
  ["Visitors", "Sessions", "Page views", "Pages/session", "Bounce rate", "Avg engaged/session", "Leads"],
  [[
    visitors.size,
    sessionList.length,
    [...pages.values()].reduce((a, p) => a + p.views, 0),
    sessionList.length ? (sessionList.reduce((a, s) => a + s.pages, 0) / sessionList.length).toFixed(1) : "–",
    pct(bounces, sessionList.length),
    sessionList.length ? `${Math.round(sessionList.reduce((a, s) => a + s.engaged, 0) / sessionList.length)}s` : "–",
    leads.length,
  ]],
)}

## Traffic sources
${table(["Source", "Sessions"], topRows(sources))}

## Landing pages
${table(["Page", "Sessions"], topRows(landings))}

## Pages
${table(
  ["Page", "Views", "Avg engaged", "Read to 90%"],
  [...pages.entries()]
    .filter(([, p]) => p.views)
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 20)
    .map(([path, p]) => [path, p.views, p.engagedN ? `${Math.round(p.engaged / p.engagedN)}s` : "–", pct(p.scroll90, p.views)]),
)}

## Devices
${table(["Device", "Sessions"], topRows(devices))}

## Quiz funnel
${table(["Step", "Count"], [...funnel.entries()].sort())}

## Leads (by type ← source → landing page)
${table(["Lead", "Count"], topRows(leadsBy, 20))}

## CTA and phone clicks
${table(["CTA (section)", "Clicks"], topRows(ctas, 15))}

## Click heatmaps
Columns are page width (10% each); rows are 400px bands from the top. Darker glyphs mean more clicks.
${heatPages.map(([path, list]) => `### ${path} (${list.length} clicks, ${list.filter((c) => !c.interactive).length} dead)\n${heatmap(list)}`).join("\n\n") || "_No clicks yet._"}

## Most-clicked elements
${table(["Page · element", "Clicks"], topRows(clickLabels, 15))}

## Dead clicks (clicked, but not a link or button)
${table(["Page · element", "Clicks"], topRows(deadLabels, 10))}

## 404s (add redirects for these)
${table(["Path", "Hits"], topRows(notFound))}

## JavaScript errors
${table(["Error", "Count"], topRows(errors))}

## Core Web Vitals (share of page loads rated good)
${table(["Metric", "Good", "Needs work", "Poor"], [...vitals.entries()].map(([m, v]) => {
  const total = v.good + v["needs-improvement"] + v.poor;
  return [m, pct(v.good, total), pct(v["needs-improvement"], total), pct(v.poor, total)];
}))}
`;

fs.mkdirSync("data/analytics", { recursive: true });
fs.writeFileSync(`data/analytics/report-${today}.md`, md);
const csv = ["path,x_pct,y,viewport_width,interactive,label"];
for (const [path, list] of clicksByPage) {
  for (const c of list) csv.push([path, c.x, c.y, c.vw, c.interactive, `"${String(c.label ?? "").replace(/"/g, '""')}"`].join(","));
}
fs.writeFileSync(`data/analytics/clicks-${today}.csv`, csv.join("\n"));
console.log(`Wrote data/analytics/report-${today}.md (${events.length} events, ${leads.length} leads)`);
process.exit(0);
