"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Banknote, Briefcase, MapPin, Search } from "lucide-react";
import { TYPE_LABEL, jobFacets, postedAgo, type Job } from "@/data/jobs";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/** The board itself: filter in place, open a listing, apply — all without leaving the site. */
export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const facets = useMemo(() => jobFacets(jobs), [jobs]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return jobs.filter(
      (j) =>
        (!city || j.city === city) &&
        (!type || j.employmentType === type) &&
        (!needle || `${j.title} ${j.employer} ${j.city} ${j.summary}`.toLowerCase().includes(needle)),
    );
  }, [jobs, q, city, type]);

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
          {results.map((j) => (
            <li
              key={j.slug}
              className={cn(
                "group relative rounded-2xl border bg-white p-5 transition hover:border-teal hover:shadow-[0_18px_40px_-28px_rgba(11,61,58,0.5)]",
                j.featured ? "border-teal/50 ring-1 ring-teal/20" : "border-line",
              )}
            >
              {j.featured && (
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-coral-deep">Featured listing (paid)</p>
              )}
              <h2 className="font-display text-xl leading-snug">
                <Link
                  href={`/jobs/${j.slug}/`}
                  data-track="job_card"
                  data-track-id={j.slug}
                  onClick={() => track("job_open", { job: j.slug, employer: j.employer })}
                  className="after:absolute after:inset-0"
                >
                  {j.title}
                </Link>
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
