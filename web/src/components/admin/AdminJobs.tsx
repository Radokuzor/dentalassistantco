"use client";

import { useCallback, useEffect, useState } from "react";
import { Ban, CheckCircle2, ExternalLink, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "./charts";

const PW_KEY = "dac_admin_pw"; // shared with AdminDashboard: one login unlocks both tabs

type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTOR" | "TEMPORARY" | "INTERN";
const TYPE_OPTIONS: { value: EmploymentType; label: string }[] = [
  { value: "FULL_TIME", label: "Full time" },
  { value: "PART_TIME", label: "Part time" },
  { value: "CONTRACTOR", label: "Contract" },
  { value: "TEMPORARY", label: "Temporary" },
  { value: "INTERN", label: "Externship" },
];

type StoredJob = {
  id: string;
  slug: string;
  title: string;
  employer: string;
  city: string;
  region?: string;
  pay: string;
  employmentType: EmploymentType;
  summary: string;
  featured?: boolean;
  source?: string;
  posted: string;
  validThrough: string;
  forwardTo?: string;
};

const EMPTY_FORM = {
  title: "",
  employer: "",
  city: "",
  region: "",
  pay: "",
  payMin: "",
  payMax: "",
  payUnit: "HOUR",
  employmentType: "FULL_TIME" as EmploymentType,
  schedule: "",
  summary: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
  forwardTo: "",
  featured: false,
  validThrough: "",
};

const isActive = (j: StoredJob) => j.validThrough >= new Date().toISOString().slice(0, 10);

export function AdminJobs() {
  const [password, setPassword] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [authing, setAuthing] = useState(false);

  const [jobs, setJobs] = useState<StoredJob[] | null>(null);
  const [listError, setListError] = useState("");
  const [busySlug, setBusySlug] = useState<string | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      setPassword(sessionStorage.getItem(PW_KEY));
    } catch {
      /* ignore */
    }
  }, []);

  const call = useCallback(async (pw: string, body: Record<string, unknown>) => {
    const res = await fetch("/api/admin-jobs/", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw, ...body }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) {
      if (res.status === 401 || res.status === 429) {
        setPassword(null);
        try {
          sessionStorage.removeItem(PW_KEY);
        } catch {}
      }
      throw new Error(data.error || `Request failed (${res.status})`);
    }
    return data;
  }, []);

  const loadJobs = useCallback(
    async (pw: string) => {
      setListError("");
      try {
        const data = await call(pw, { action: "list" });
        setJobs(data.jobs);
      } catch (e) {
        setListError(e instanceof Error ? e.message : "Could not load jobs.");
      }
    },
    [call],
  );

  useEffect(() => {
    if (password) void loadJobs(password);
  }, [password, loadJobs]);

  const authenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthing(true);
    setAuthError("");
    try {
      await call(input, { action: "list" }); // doubles as a password check
      setPassword(input);
      try {
        sessionStorage.setItem(PW_KEY, input);
      } catch {}
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Could not reach the jobs service.");
    } finally {
      setAuthing(false);
    }
  };

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) => setForm((f) => ({ ...f, [key]: value }));

  const publish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setSaving(true);
    setSaveError("");
    setSavedSlug(null);
    try {
      const data = await call(password, {
        action: "create",
        job: {
          ...form,
          payMin: form.payMin || undefined,
          payMax: form.payMax || undefined,
          featured: form.featured || undefined,
        },
      });
      setSavedSlug(data.slug);
      setForm(EMPTY_FORM);
      void loadJobs(password);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not publish this job.");
    } finally {
      setSaving(false);
    }
  };

  const act = async (action: "close" | "reopen" | "delete", slug: string) => {
    if (!password) return;
    if (action === "delete" && !confirm(`Delete "${slug}" for good? This can't be undone.`)) return;
    setBusySlug(slug);
    try {
      await call(password, { action, slug });
      void loadJobs(password);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Could not update that job.");
    } finally {
      setBusySlug(null);
    }
  };

  if (!password) {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="font-display text-3xl">Admin</h1>
        <form className="mt-6 space-y-3" onSubmit={authenticate}>
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-xl border border-line bg-white px-4 py-3 outline-none focus:border-teal"
          />
          {authError && <p className="text-sm text-coral-deep">{authError}</p>}
          <button disabled={authing || !input} className="w-full rounded-full bg-teal py-3 font-semibold text-white disabled:opacity-50">
            {authing ? "Checking…" : "Open dashboard"}
          </button>
        </form>
      </div>
    );
  }

  const input1 = "mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";
  const label1 = "block text-xs font-semibold uppercase tracking-wider text-ink-soft";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl">Publish a job</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-soft">
        Goes live on <a href="/jobs/" target="_blank" rel="noopener" className="underline">/jobs/</a> within seconds of
        saving — no deploy needed. Applications get emailed to the address below.
      </p>

      <form onSubmit={publish} className="mt-5 space-y-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className={label1.replace("block", "block")}>
            Job title *
            <input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Chairside Dental Assistant" className={input1} />
          </label>
          <label className={label1}>
            Employer *
            <input required value={form.employer} onChange={(e) => set("employer", e.target.value)} placeholder="Front Range Family Dental" className={input1} />
          </label>
          <label className={label1}>
            City *
            <input required value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Denver" className={input1} />
          </label>
          <label className={label1}>
            Region <span className="normal-case font-normal">(auto-filled from city if left blank)</span>
            <input value={form.region} onChange={(e) => set("region", e.target.value)} placeholder="Denver metro" className={input1} />
          </label>
          <label className={label1}>
            Pay range, as shown to applicants *
            <input required value={form.pay} onChange={(e) => set("pay", e.target.value)} placeholder="$22–$26/hr" className={input1} />
          </label>
          <label className={label1}>
            Job type *
            <select required value={form.employmentType} onChange={(e) => set("employmentType", e.target.value as EmploymentType)} className={input1}>
              {TYPE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className={label1}>
            Schedule
            <input value={form.schedule} onChange={(e) => set("schedule", e.target.value)} placeholder="Mon–Thu, 7:30–4:30" className={input1} />
          </label>
          <label className={label1}>
            Listing stays live until
            <input type="date" value={form.validThrough} onChange={(e) => set("validThrough", e.target.value)} className={input1} />
            <span className="mt-1 block text-xs font-normal normal-case text-ink-soft">Defaults to 60 days out if left blank.</span>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={label1}>
            Pay min ($, optional)
            <input type="number" value={form.payMin} onChange={(e) => set("payMin", e.target.value)} placeholder="22" className={input1} />
          </label>
          <label className={label1}>
            Pay max ($, optional)
            <input type="number" value={form.payMax} onChange={(e) => set("payMax", e.target.value)} placeholder="26" className={input1} />
          </label>
          <label className={label1}>
            Unit
            <select value={form.payUnit} onChange={(e) => set("payUnit", e.target.value)} className={input1}>
              <option value="HOUR">Per hour</option>
              <option value="YEAR">Per year</option>
            </select>
          </label>
        </div>

        <label className={label1}>
          Summary *
          <textarea required rows={3} value={form.summary} onChange={(e) => set("summary", e.target.value)} placeholder="One or two sentences describing the role." className={input1} />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className={label1}>
            Responsibilities <span className="normal-case font-normal">(one per line)</span>
            <textarea rows={4} value={form.responsibilities} onChange={(e) => set("responsibilities", e.target.value)} className={input1} />
          </label>
          <label className={label1}>
            Requirements <span className="normal-case font-normal">(one per line)</span>
            <textarea rows={4} value={form.requirements} onChange={(e) => set("requirements", e.target.value)} className={input1} />
          </label>
          <label className={label1}>
            Benefits <span className="normal-case font-normal">(one per line)</span>
            <textarea rows={4} value={form.benefits} onChange={(e) => set("benefits", e.target.value)} className={input1} />
          </label>
        </div>

        <label className={label1}>
          Forward applications to *
          <input required type="email" value={form.forwardTo} onChange={(e) => set("forwardTo", e.target.value)} placeholder="hiring@practice.com" className={input1} />
          <span className="mt-1 block text-xs font-normal normal-case text-ink-soft">
            Not shown publicly. Each application is emailed here and included in the Telegram alert.
          </span>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="size-4 accent-teal" />
          Featured (paid placement badge, shown first on the board)
        </label>

        {saveError && <p className="text-sm font-medium text-coral-deep">{saveError}</p>}
        {savedSlug && (
          <p className="flex items-center gap-1.5 text-sm font-medium text-teal-deep">
            <CheckCircle2 className="size-4" /> Published.{" "}
            <a href={`/jobs/#${savedSlug}`} target="_blank" rel="noopener" className="underline">
              View it live <ExternalLink className="inline size-3" />
            </a>
          </p>
        )}
        <button disabled={saving} className="flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-semibold text-white disabled:opacity-60">
          {saving && <Loader2 className="size-4 animate-spin" />} {saving ? "Publishing…" : "Publish job"}
        </button>
      </form>

      <div className="mt-8">
        <Card title="Published jobs" subtitle="Direct listings and anything pulled in by npm run jobs:import">
          {listError && <p className="mb-3 text-sm text-coral-deep">{listError}</p>}
          {jobs === null ? (
            <p className="text-sm text-ink-soft">Loading…</p>
          ) : jobs.length === 0 ? (
            <p className="text-sm text-ink-soft">Nothing published yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-ink-soft">
                    <th className="py-2 pr-3">Title</th>
                    <th className="py-2 pr-3">Employer</th>
                    <th className="py-2 pr-3">City</th>
                    <th className="py-2 pr-3">Pay</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Until</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => {
                    const active = isActive(j);
                    const busy = busySlug === j.slug;
                    return (
                      <tr key={j.id} className="border-t border-line">
                        <td className="py-2.5 pr-3 font-medium">{j.title}</td>
                        <td className="py-2.5 pr-3">{j.employer}</td>
                        <td className="py-2.5 pr-3">{j.city}</td>
                        <td className="py-2.5 pr-3">{j.pay}</td>
                        <td className="py-2.5 pr-3">
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", active ? "bg-teal/10 text-teal-deep" : "bg-line text-ink-soft")}>
                            {active ? "Live" : "Closed"}
                          </span>
                          {j.source && j.source !== "direct" && <span className="ml-1.5 text-xs text-ink-soft">({j.source})</span>}
                        </td>
                        <td className="py-2.5 pr-3 text-xs text-ink-soft">{j.validThrough}</td>
                        <td className="py-2.5">
                          <div className="flex gap-1.5">
                            {active ? (
                              <button disabled={busy} onClick={() => act("close", j.slug)} title="Close listing" className="rounded-lg border border-line p-1.5 hover:border-coral hover:text-coral-deep disabled:opacity-50">
                                <Ban className="size-4" />
                              </button>
                            ) : (
                              <button disabled={busy} onClick={() => act("reopen", j.slug)} title="Reopen for 60 days" className="rounded-lg border border-line p-1.5 hover:border-teal hover:text-teal disabled:opacity-50">
                                <RotateCcw className="size-4" />
                              </button>
                            )}
                            <button disabled={busy} onClick={() => act("delete", j.slug)} title="Delete" className="rounded-lg border border-line p-1.5 hover:border-coral hover:text-coral-deep disabled:opacity-50">
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
