import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Briefcase, CalendarDays, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { TYPE_LABEL, activeJobs, jobBySlug, jobs, postedAgo, type Job } from "@/data/jobs";
import { applicationConsent } from "@/lib/consent";
import { site } from "@/lib/site";

export const dynamicParams = false;

/** A static export needs at least one path for a dynamic route, so an empty board still
 *  builds one page — an honest "nothing open yet", kept out of the sitemap and out of Google. */
const PLACEHOLDER = "none-open";
export const generateStaticParams = () => (jobs.length ? jobs.map((j) => ({ slug: j.slug })) : [{ slug: PLACEHOLDER }]);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const j = jobBySlug(slug);
  if (!j) return { title: "No openings right now", robots: { index: false }, alternates: { canonical: "/jobs/" } };
  return {
    title: `${j.title} — ${j.employer}, ${j.city} (${j.pay})`,
    description: `${j.summary} Apply on DentalAssistantCO in about two minutes.`,
    alternates: { canonical: `/jobs/${j.slug}/` },
    robots: j.validThrough < new Date().toISOString().slice(0, 10) ? { index: false } : undefined,
  };
}

/** Google for Jobs needs a description string; build one from the structured fields. */
function descriptionHtml(j: Job) {
  const list = (title: string, items?: string[]) =>
    items?.length ? `<h3>${title}</h3><ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` : "";
  return [
    `<p>${j.summary}</p>`,
    j.schedule ? `<p><strong>Schedule:</strong> ${j.schedule}</p>` : "",
    list("What you'll do", j.responsibilities),
    list("What we're looking for", j.requirements),
    list("Benefits", j.benefits),
  ]
    .filter(Boolean)
    .join("");
}

export default async function JobDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const j = jobBySlug(slug);
  if (!j) {
    return (
      <>
        <PageHero
          eyebrow="Job board"
          title="No openings right now"
          intro="Nothing is live on the Colorado board at this moment. Join the talent pool and you'll hear about the next one first."
          crumbs={[{ href: "/jobs/", label: "Jobs" }]}
        />
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <Link href="/jobs/#talent-pool" className="rounded-full bg-coral px-6 py-3 font-semibold text-white">
            Join the talent pool
          </Link>
        </div>
      </>
    );
  }

  const expired = j.validThrough < new Date().toISOString().slice(0, 10);
  const sections: [string, string[] | undefined][] = [
    ["What you'll do", j.responsibilities],
    ["What they're looking for", j.requirements],
    ["Benefits", j.benefits],
  ];
  const others = activeJobs().filter((o) => o.slug !== j.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "JobPosting",
          title: j.title,
          description: descriptionHtml(j),
          identifier: { "@type": "PropertyValue", name: j.employer, value: j.slug },
          datePosted: j.posted,
          validThrough: j.validThrough,
          employmentType: j.employmentType,
          // Only true when this page really is the end of the application. Federal and state roles
          // need their own system, so claiming directApply there would be a false signal to Google.
          directApply: !j.official,
          url: `${site.url}/jobs/${j.slug}/`,
          hiringOrganization: { "@type": "Organization", name: j.employer },
          jobLocation: {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              streetAddress: j.street,
              addressLocality: j.city,
              addressRegion: "CO",
              postalCode: j.postalCode,
              addressCountry: "US",
            },
          },
          occupationalCategory: "31-9091 Dental Assistants",
          ...(j.payMin
            ? {
                baseSalary: {
                  "@type": "MonetaryAmount",
                  currency: "USD",
                  value: { "@type": "QuantitativeValue", minValue: j.payMin, maxValue: j.payMax ?? j.payMin, unitText: j.payUnit ?? "HOUR" },
                },
              }
            : {}),
        }}
      />
      <PageHero
        eyebrow={`${j.employer} · posted ${postedAgo(j.posted).toLowerCase()}`}
        title={j.title}
        intro={j.summary}
        crumbs={[
          { href: "/jobs/", label: "Jobs" },
          { href: `/jobs/${j.slug}/`, label: j.title },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {expired && (
          <p className="mb-6 rounded-2xl border border-coral/40 bg-coral/10 p-4 text-sm font-medium text-coral-deep">
            This opening has closed. Browse{" "}
            <Link href="/jobs/" className="underline">
              current Colorado jobs
            </Link>{" "}
            or join the talent pool.
          </p>
        )}

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
          <section id="apply" className="mt-12 scroll-mt-24">
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

        {others.length > 0 && (
          <section className="mt-14">
            <h2 className="font-display text-2xl">Other Colorado openings</h2>
            <ul className="mt-4 space-y-3">
              {others.map((o) => (
                <li key={o.slug} className="rounded-2xl border border-line bg-white p-4">
                  <Link href={`/jobs/${o.slug}/`} className="font-display text-lg hover:text-teal">
                    {o.title}
                  </Link>
                  <p className="mt-0.5 text-sm text-ink-soft">
                    {o.employer} · {o.city} · {o.pay}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="mt-10 rounded-2xl bg-paper-deep p-5 text-xs leading-relaxed text-ink-soft">
          DentalAssistantCO is not the employer. We pass your application to {j.employer}.{" "}
          {j.source && j.source !== "direct"
            ? `This listing was imported from ${j.sourceName} on ${j.posted}; we re-check that feed and take the listing down when it closes.`
            : "This opening was sent to us by the practice."}{" "} We never charge a job seeker, and we&apos;ll never ask you for payment or bank
          details — read our{" "}
          <Link href="/editorial-policy/" className="text-teal underline">
            editorial policy
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy/" className="text-teal underline">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
