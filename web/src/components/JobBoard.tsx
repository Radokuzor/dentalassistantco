"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Banknote, Briefcase, ChevronDown, MapPin, Search, Sparkles } from "lucide-react";
import { JobDetails } from "@/components/JobDetails";
import { TYPE_LABEL, jobFacets, postedAgo, type Job } from "@/data/jobs";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** The board itself: filter in place, expand a card to see the full listing and apply — all
 *  without leaving the site.
 *
 *  `initialJobs` is whatever was baked in at the last build (from npm run jobs:sync / jobs:import).
 *  On mount we also fetch the live Firestore feed (/api/jobs-feed/), which includes anything
 *  published from /admin/ moments ago. Merging the two means a job goes live the instant it's
 *  published, with no rebuild — a job only in the live feed doesn't have a static /jobs/<slug>/
 *  page yet, so its card expands in place instead of linking out to one. */
export function JobBoard({ initialJobs }: { initialJobs: Job[] }) {
  const [liveJobs, setLiveJobs] = useState<Job[] | null>(null);
  const staticSlugs = useMemo(() => new Set(initialJobs.map((j) => j.slug)), [initialJobs]);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (fetchedOnce.current) return;
    fetchedOnce.current = true;
    fetch("/api/jobs-feed/")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data?.jobs && setLiveJobs(data.jobs))
      .catch(() => {});
  }, []);

  const jobs = useMemo(() => {
    if (!liveJobs) return initialJobs;
    const merged = new Map(initialJobs.map((j) => [j.slug, j]));
    for (const j of liveJobs) merged.set(j.slug, j); // live data wins for overlapping slugs
    return [...merged.values()].sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.posted.localeCompare(a.posted));
  }, [initialJobs, liveJobs]);

  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const facets = useMemo(() => jobFacets(jobs), [jobs]);

  // Deep-linkable: /jobs/#<slug> opens and scrolls to that card. `jobs` gets a new identity once
  // the live feed resolves after mount, so this only auto-opens once per hash — otherwise a card
  // the visitor just collapsed would silently reopen itself when the live fetch lands.
  const openedHash = useRef<string | null>(null);
  useEffect(() => {
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash && hash !== openedHash.current && jobs.some((j) => j.slug === hash)) {
      openedHash.current = hash;
      setExpanded(hash);
      requestAnimationFrame(() => document.getElementById(`job-${hash}`)?.scrollIntoView({ block: "start" }));
    }
  }, [jobs]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (!city || j.city === city) &&
        (!type || j.employmentType === type) &&
        (!needle || `${j.title} ${j.employer} ${j.city} ${j.summary}`.toLowerCase().includes(needle)),
    );
  }, [jobs, q, city, type]);

  if (results.length === 0 && jobs.length === 0) return <EmptyBoard />;

  const select = "rounded-xl border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-teal focus:ring-2 focus:ring-teal/20";

  return (
    <div data-section="job_board">
      <div className="flex flex-wrap gap-2.5 rounded-2xl border border-line bg-white p-3">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => q && track("job_search", { query: q.slice(0, 60), results: results.length })}
            placeholder="Search title, office or city"
            aria-label="Search jobs"
            className={cn(select, "w-full pl-9")}
          />
        </div>
        <select value={city} onChange={(e) => { setCity(e.target.value); track("job_filter", { field: "city", value: e.target.value }); }} aria-label="Filter by city" className={select}>
          <option value="">All of Colorado</option>
          {facets.cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); track("job_filter", { field: "type", value: e.target.value }); }} aria-label="Filter by job type" className={select}>
          <option value="">Any schedule</option>
          {facets.types.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABEL[t]}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-4 text-sm text-ink-soft" aria-live="polite">
        {results.length} {results.length === 1 ? "opening" : "openings"}
        {city && ` in ${city}`}
      </p>

      {results.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-center text-ink-soft">
          Nothing matches that yet. Clear the filters, or join the talent pool below and we&apos;ll email you when
          something does.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {results.map((j) => {
            const hasStaticPage = staticSlugs.has(j.slug);
            const isOpen = expanded === j.slug;
            return (
              <li
                key={j.slug}
                id={`job-${j.slug}`}
                className={cn(
                  "scroll-mt-24 rounded-2xl border bg-white transition",
                  j.featured ? "border-teal/50 ring-1 ring-teal/20" : "border-line",
                  !isOpen && "hover:border-teal hover:shadow-[0_18px_40px_-28px_rgba(11,61,58,0.5)]",
                )}
              >
                <div className="group relative p-5">
                  {j.featured && (
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-coral-deep">Featured listing (paid)</p>
                  )}
                  {!hasStaticPage && !j.featured && (
                    <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-teal">
                      <Sparkles className="size-3" aria-hidden /> Just published
                    </p>
                  )}
                  <h2 className="font-display text-xl leading-snug">
                    {hasStaticPage ? (
                      <Link
                        href={`/jobs/${j.slug}/`}
                        data-track="job_card"
                        data-track-id={j.slug}
                        onClick={() => track("job_open", { job: j.slug, employer: j.employer })}
                        className="after:absolute after:inset-0"
                      >
                        {j.title}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        data-track="job_card"
                        data-track-id={j.slug}
                        onClick={() => {
                          const next = isOpen ? null : j.slug;
                          setExpanded(next);
                          if (next) {
                            track("job_open", { job: j.slug, employer: j.employer });
                            history.replaceState(null, "", `#${j.slug}`);
                          }
                        }}
                        className="flex w-full items-center justify-between gap-3 text-left after:absolute after:inset-0"
                      >
                        {j.title}
                        <ChevronDown className={cn("size-5 shrink-0 text-teal transition-transform", isOpen && "rotate-180")} aria-hidden />
                      </button>
                    )}
                  </h2>
                  <p className="mt-1 text-sm font-medium">{j.employer}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-soft">{j.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-teal" aria-hidden /> {j.city}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium text-ink">
                      <Banknote className="size-3.5 text-teal" aria-hidden /> {j.pay}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 text-teal" aria-hidden /> {TYPE_LABEL[j.employmentType]}
                    </span>
                    <span className="ml-auto text-xs">{postedAgo(j.posted)}</span>
                  </div>
                </div>
                {isOpen && !hasStaticPage && (
                  <div className="border-t border-line bg-paper/60 p-5 sm:p-6">
                    <JobDetails job={j} compact />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyBoard() {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white p-8 text-center sm:p-10" data-section="jobs_empty">
      <h2 className="font-display text-2xl">The board is filling up now</h2>
      <p className="mx-auto mt-3 max-w-lg leading-relaxed text-ink-soft">
        We only publish openings a Colorado practice has sent us directly, so the board starts empty rather than
        scraped and stale. Join the talent pool below and you&apos;ll hear about the first roles before they&apos;re
        anywhere else — and if you run an office, your posting is free while we launch.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="#talent-pool"
          data-track="cta"
          data-track-id="jobs_empty_pool"
          className="rounded-full bg-coral px-6 py-3 font-semibold text-white"
        >
          Get the first openings
        </Link>
        <Link href="/hire/" data-track="cta" data-track-id="jobs_empty_hire" className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
          Post a job free
        </Link>
      </div>
    </div>
  );
}
