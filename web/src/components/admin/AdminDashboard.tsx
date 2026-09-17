"use client";

import { useCallback, useEffect, useState } from "react";
import { LogOut, RefreshCw } from "lucide-react";
import { Card, DailyBars, DataTable, Funnel, Heatmap, LEAD_COLOR, StatTile, VISITOR_COLOR } from "./charts";

type Row = [string, number];
type Stats = {
  generatedAt: string;
  days: number;
  truncated: boolean;
  overview: { visitors: number; sessions: number; pageViews: number; leads: number; bounceRate: number; avgEngagedSec: number; pagesPerSession: number; activeNow: number };
  daily: { date: string; visitors: number; sessions: number; pageViews: number; leads: number }[];
  funnel: { label: string; count: number }[];
  quizAbandon: number;
  sources: Row[];
  landings: Row[];
  devices: Row[];
  pages: { path: string; views: number; avgEngagedSec: number | null; read90: number }[];
  ctas: Row[];
  topClicks: Row[];
  deadClicks: Row[];
  notFound: Row[];
  errors: Row[];
  vitals: { metric: string; good: number; "needs-improvement": number; poor: number }[];
  heatmaps: { path: string; clicks: { x: number; y: number; vw: number; i: boolean }[] }[];
  recent: { t: string; name: string; path: string; device: string; detail: string }[];
  leads: { id: string; type: string; createdAt: string; contact: Record<string, string>; answers: Record<string, string>; consent: boolean; source: string; landing: string | null; device: string }[];
};

const PW_KEY = "dac_admin_pw";
const RANGES = [
  { days: 1, label: "24h" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
];
const pct = (n: number) => `${Math.round(n * 100)}%`;
const time = (iso?: string) => (iso ? new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "–");
const secs = (s: number | null) => (s == null ? "–" : s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`);

export function AdminDashboard() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [days, setDays] = useState(7);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    try {
      setPassword(sessionStorage.getItem(PW_KEY));
    } catch {
      /* storage unavailable: ask every time */
    }
  }, []);

  const load = useCallback(
    async (pw: string, range: number) => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ password: pw, days: range }),
        });
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 401 || res.status === 429) {
            setPassword(null);
            try {
              sessionStorage.removeItem(PW_KEY);
            } catch {}
          }
          setError(body.error ?? `Request failed (${res.status})`);
          return;
        }
        setStats(body);
        try {
          sessionStorage.setItem(PW_KEY, pw);
        } catch {}
      } catch {
        setError("Could not reach the analytics service.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (password) void load(password, days);
  }, [password, days, load]);

  useEffect(() => {
    if (!password || !autoRefresh) return;
    const id = setInterval(() => void load(password, days), 60_000);
    return () => clearInterval(id);
  }, [password, days, autoRefresh, load]);

  if (!password) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="font-display text-3xl">Admin</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setError("");
            setPassword(input);
          }}
        >
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-teal"
          />
          {error && <p className="text-sm text-coral-deep">{error}</p>}
          <button disabled={loading || !input} className="w-full rounded-full bg-teal py-3 font-semibold text-white disabled:opacity-50">
            {loading ? "Checking…" : "Open dashboard"}
          </button>
        </form>
      </div>
    );
  }

  const o = stats?.overview;
  const leadRate = o && o.sessions ? o.leads / o.sessions : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Site analytics</h1>
          <p className="text-xs text-ink-soft">
            {stats ? `Updated ${time(stats.generatedAt)}` : "Loading…"}
            {stats?.truncated && " · showing the first 60,000 events in this range"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg border border-line bg-white p-0.5 text-sm">
            {RANGES.map((r) => (
              <button key={r.days} onClick={() => setDays(r.days)} className={`rounded-md px-3 py-1.5 ${days === r.days ? "bg-ink text-white" : "text-ink-soft"}`}>
                {r.label}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1.5 text-xs text-ink-soft">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="accent-teal" />
            Auto-refresh
          </label>
          <button onClick={() => void load(password, days)} className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm" aria-label="Refresh">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={() => {
              try {
                sessionStorage.removeItem(PW_KEY);
              } catch {}
              setPassword(null);
              setStats(null);
              setInput("");
            }}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-1.5 text-sm"
          >
            <LogOut className="size-4" /> Lock
          </button>
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-coral-deep">{error}</p>}

      {stats && o && (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
            <StatTile label="Active now" value={String(o.activeNow)} hint="sessions, last 30 min" />
            <StatTile label="Visitors" value={o.visitors.toLocaleString()} />
            <StatTile label="Sessions" value={o.sessions.toLocaleString()} />
            <StatTile label="Page views" value={o.pageViews.toLocaleString()} hint={`${o.pagesPerSession.toFixed(1)} per session`} />
            <StatTile label="Leads" value={o.leads.toLocaleString()} />
            <StatTile label="Lead rate" value={pct(leadRate)} hint="leads ÷ sessions" />
            <StatTile label="Bounce rate" value={pct(o.bounceRate)} hint="1-page sessions" />
            <StatTile label="Avg engaged" value={secs(o.avgEngagedSec)} hint="per session" />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="Visitors per day">
              <DailyBars data={stats.daily} valueKey="visitors" color={VISITOR_COLOR} unit="visitors" />
            </Card>
            <Card title="Leads per day" subtitle="All form types">
              <DailyBars data={stats.daily} valueKey="leads" color={LEAD_COLOR} unit="leads" />
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Program-match quiz funnel" subtitle={`${stats.quizAbandon} abandoned mid-quiz`}>
              <Funnel steps={stats.funnel} />
            </Card>
            <Card title="Traffic sources" subtitle="First touch per session">
              <DataTable head={["Source", "Sessions"]} rows={stats.sources} />
            </Card>
            <Card title="Landing pages">
              <DataTable head={["Page", "Sessions"]} rows={stats.landings} />
            </Card>
          </div>

          <Card title="Pages" subtitle="Read to 90% = share of views that scrolled 90% of the page">
            <DataTable
              head={["Page", "Views", "Avg engaged", "Read to 90%"]}
              rows={stats.pages.map((p) => [p.path, p.views, secs(p.avgEngagedSec), pct(p.read90)])}
            />
          </Card>

          <Card title="Click heatmap" subtitle="Where visitors clicked on the live page (top 10 pages by clicks)">
            <Heatmap pages={stats.heatmaps} />
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Buttons and calls">
              <DataTable head={["CTA · section", "Clicks"]} rows={stats.ctas} />
            </Card>
            <Card title="Most-clicked elements">
              <DataTable head={["Page · element", "Clicks"]} rows={stats.topClicks} />
            </Card>
            <Card title="Dead clicks" subtitle="Clicked, but not a link or button">
              <DataTable head={["Page · element", "Clicks"]} rows={stats.deadClicks} />
            </Card>
          </div>

          <Card title="Recent leads" subtitle="Newest first. Contact details are private; don't share this screen.">
            <DataTable
              head={["When", "Type", "Name", "Email", "Phone", "Answers", "Consent", "Source → landing"]}
              rows={stats.leads.map((l) => [
                time(l.createdAt),
                l.type,
                [l.contact.firstName, l.contact.lastName].filter(Boolean).join(" ") || l.contact.name || l.contact.contactName || l.contact.practice || "–",
                l.contact.email,
                l.contact.phone,
                Object.values(l.answers).join(" · ") || l.contact.message?.slice(0, 80) || "–",
                l.consent ? "Yes" : "No",
                `${l.source} → ${l.landing ?? "?"}`,
              ])}
              empty="No leads in this range."
            />
          </Card>

          <div className="grid gap-5 lg:grid-cols-3">
            <Card title="Live activity" subtitle="Latest page views, clicks and form events">
              <DataTable head={["When", "Event", "Page"]} rows={stats.recent.map((r) => [time(r.t), `${r.name}${r.detail ? ` (${r.detail})` : ""}`, `${r.path} · ${r.device}`])} />
            </Card>
            <Card title="Devices">
              <DataTable head={["Device", "Sessions"]} rows={stats.devices} />
            </Card>
            <Card title="Page speed (Core Web Vitals)" subtitle="Share of page loads rated good">
              <DataTable
                head={["Metric", "Good", "Needs work", "Poor"]}
                rows={stats.vitals.map((v) => {
                  const total = v.good + v["needs-improvement"] + v.poor || 1;
                  return [v.metric, pct(v.good / total), pct(v["needs-improvement"] / total), pct(v.poor / total)];
                })}
              />
            </Card>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card title="404s" subtitle="Old or broken URLs people still visit (add redirects)">
              <DataTable head={["Path", "Hits"]} rows={stats.notFound} empty="No 404s. 🎉" />
            </Card>
            <Card title="JavaScript errors">
              <DataTable head={["Error", "Count"]} rows={stats.errors} empty="No errors." />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
