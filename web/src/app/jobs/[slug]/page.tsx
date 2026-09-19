import type { Metadata } from "next";
import Link from "next/link";
import { JobDetails } from "@/components/JobDetails";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { activeJobs, jobBySlug, jobs, postedAgo, type Job } from "@/data/jobs";
import { site } from "@/lib/site";

export const dynamicParams = false;

/** A static export needs at least one path for a dynamic route, so an empty board still
 *  builds one page — an honest "nothing open yet", kept out of the sitemap and out of Google.
 *  A job published from /admin/ appears on /jobs/ within seconds (JobBoard fetches it live) even
 *  before it has a page here; it gets one on the next `npm run jobs:sync` + rebuild. */
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

        <JobDetails job={j} />

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
      </div>
    </>
  );
}
