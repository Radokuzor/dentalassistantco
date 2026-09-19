"use client";

import { Banknote, Briefcase, CalendarDays, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { TYPE_LABEL, type Job } from "@/data/jobs";
import { applicationConsent } from "@/lib/consent";

/** Facts grid + sections + apply form for one job. Shared by the static /jobs/<slug>/ page and
 *  JobBoard's inline expand (for a job published in the admin that hasn't been baked into a static
 *  page yet — see AdminJobs.tsx). Nothing here links off-site except the rare `official` panel. */
export function JobDetails({ job: j, compact = false }: { job: Job; compact?: boolean }) {
  const expired = j.validThrough < new Date().toISOString().slice(0, 10);
  const sections: [string, string[] | undefined][] = [
    ["What you'll do", j.responsibilities],
    ["What they're looking for", j.requirements],
    ["Benefits", j.benefits],
  ];

  return (
    <div className={compact ? "" : undefined} data-section="job_details">
      <dl className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2" data-section="job_facts">
        {[
          { icon: Banknote, term: "Pay", value: j.pay },
          { icon: MapPin, term: "Location", value: `${j.city}, CO` },
          { icon: Briefcase, term: "Type", value: TYPE_LABEL[j.employmentType] },
          { icon: CalendarDays, term: "Schedule", value: j.schedule ?? "Ask in your application" },
        ].map(({ icon: Icon, term, value }) => (
          <div key={term} className="bg-white p-5">
            <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              <Icon className="size-3.5 text-teal" aria-hidden /> {term}
            </dt>
            <dd className="mt-1.5 font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      {j.official && (
        <section className="mt-8 rounded-2xl border border-coral/40 bg-coral/5 p-5" data-section="official_application">
          <h2 className="font-display text-xl">This one needs the official application too</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {j.employer} hires through the federal system, so an application here alone will not get you the job. Apply
            below so we can track it and put you in the talent pool, then file the official application
            {j.official.closes ? ` before ${j.official.closes}` : ""}. We would rather lose the click than watch you miss
            a deadline.
          </p>
          <a
            href={j.official.url}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-block rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white"
          >
            {j.official.label} ↗
          </a>
        </section>
      )}

      {sections.map(([title, items]) =>
        items?.length ? (
          <section key={title} className="mt-10">
            <h2 className="font-display text-2xl">{title}</h2>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item} className="flex gap-2.5 leading-relaxed text-ink-soft">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-teal" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}

      {!expired && (
        <section id="apply" className="mt-10 scroll-mt-24">
          <h2 className="font-display text-2xl">Apply for this job</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
            About two minutes, no account, no résumé upload required.{" "}
            {j.source && j.source !== "direct"
              ? `We send your application straight to ${j.employer} and keep a copy, so we can follow up if nobody gets back to you.`
              : `Your application goes to ${j.employer} and a copy stays with us so we can follow up if you don't hear back.`}
          </p>
          <div className="mt-5">
            <ContactForm
              type="job_application"
              cta="Send my application"
              answers={{ job: j.title, jobSlug: j.slug, employer: j.employer, city: j.city }}
              consent={applicationConsent(j.employer)}
              fields={[
                { name: "firstName", label: "First name", required: true },
                { name: "lastName", label: "Last name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                {
                  name: "experience",
                  label: "Dental assisting experience",
                  options: ["Still in training", "New graduate", "Under 1 year", "1–3 years", "3–5 years", "5+ years"],
                  required: true,
                },
                {
                  name: "credentials",
                  label: "X-ray / certification",
                  options: [
                    "None yet",
                    "Board-approved x-ray training module",
                    "DANB RHS (radiation health & safety)",
                    "DANB CDA (certified dental assistant)",
                    "EDDA / expanded duties",
                  ],
                  required: true,
                },
                { name: "startDate", label: "When could you start?", placeholder: "e.g. two weeks' notice" },
                { name: "resumeUrl", label: "Link to your résumé (optional)", placeholder: "https://…" },
                {
                  name: "about",
                  label: "Why you're a fit",
                  textarea: true,
                  placeholder: "A few lines is plenty: where you've worked, what you're good at, what you're looking for.",
                },
              ]}
            />
          </div>
        </section>
      )}

      <p className="mt-10 rounded-2xl bg-paper-deep p-5 text-xs leading-relaxed text-ink-soft">
        DentalAssistantCO is not the employer. We pass your application to {j.employer}.{" "}
        {j.source && j.source !== "direct"
          ? `This listing was imported from ${j.sourceName} on ${j.posted}; we re-check that feed and take the listing down when it closes.`
          : "This opening was sent to us by the practice."}{" "}
        We never charge a job seeker, and we&apos;ll never ask you for payment or bank details.
      </p>
    </div>
  );
}
