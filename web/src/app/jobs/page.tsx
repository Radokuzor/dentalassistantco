import type { Metadata } from "next";
import Link from "next/link";
import { JobBoard } from "@/components/JobBoard";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { TalentPoolForm } from "@/components/TalentPoolForm";
import { activeJobs } from "@/data/jobs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Dental Assistant Jobs in Colorado",
  description:
    "Live dental assistant openings across Colorado with pay shown up front. Apply on DentalAssistantCO in a couple of minutes — no account, no third-party site.",
  alternates: { canonical: "/jobs/" },
};

export default function Jobs() {
  const open = activeJobs();
  return (
    <>
      <PageHero
        eyebrow="Job board"
        title="Dental assistant jobs in Colorado"
        intro="Openings submitted straight to us by Colorado dental offices, with the pay range shown before you apply. Applications are filled in here and go to the practice — we never bounce you off to a third-party site."
        crumbs={[{ href: "/jobs/", label: "Jobs" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {open.length > 0 && (
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Dental assistant jobs in Colorado",
              numberOfItems: open.length,
              itemListElement: open.map((j, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${site.url}/jobs/${j.slug}/`,
                name: `${j.title} — ${j.employer}, ${j.city}`,
              })),
            }}
          />
        )}
        {/* JobBoard also fetches the live Firestore feed on mount, so a job published from /admin/
            appears here within seconds — it just won't have JobPosting schema until the next
            npm run jobs:sync + rebuild bakes it into a static /jobs/<slug>/ page. */}
        <JobBoard initialJobs={open} />

        <section id="talent-pool" className="mt-14 scroll-mt-24">
          <h2 className="font-display text-2xl">Join the Colorado talent pool</h2>
          <p className="mt-2 max-w-2xl leading-relaxed text-ink-soft">
            One short profile. We email you new Colorado openings that fit it, and offices hiring for that kind of role can
            ask us to put you in touch. Free, and you can leave whenever you like.
          </p>
          <div className="mt-5">
            <TalentPoolForm />
          </div>
        </section>

        <section className="mt-14 rounded-3xl bg-paper-deep p-6 sm:p-8">
          <h2 className="font-display text-2xl">Before you apply</h2>
          <ul className="mt-3 space-y-2 text-ink-soft">
            <li>
              <Link href="/blog/dental-assistant-salary-colorado/" className="font-medium text-teal underline">
                What dental assistants actually earn in Colorado
              </Link>{" "}
              — so you know whether a posted range is fair.
            </li>
            <li>
              <Link href="/requirements/" className="font-medium text-teal underline">
                Colorado requirements
              </Link>{" "}
              — what you need before you can take x-rays on the job.
            </li>
            <li>
              <Link href="/programs/dental-assistant/" className="font-medium text-teal underline">
                Training programs compared
              </Link>{" "}
              — if you&apos;re not qualified yet, start here.
            </li>
            <li>
              Hiring instead?{" "}
              <Link href="/hire/" className="font-medium text-teal underline">
                Post an opening
              </Link>{" "}
              — free while we launch.
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
