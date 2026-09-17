import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { jobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Dental Assistant Jobs in Colorado",
  description: "Dental assistant job openings across Colorado, with pay listed up front.",
  alternates: { canonical: "/jobs/" },
};

export default function Jobs() {
  return (
    <>
      <PageHero
        eyebrow="Job board"
        title="Dental assistant jobs in Colorado"
        intro="Openings submitted directly by Colorado dental offices."
        crumbs={[{ href: "/jobs/", label: "Jobs" }]}
      />
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {jobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-white p-10 text-center" data-section="jobs_empty">
            <h2 className="font-display text-2xl">The board opens soon</h2>
            <p className="mx-auto mt-3 max-w-md text-ink-soft">
              We&apos;re collecting the first openings from Colorado offices. Meanwhile, get matched with a training program,
              or have your office post the first job for free.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/find-a-program/" data-track="cta" data-track-id="jobs_empty_quiz" className="rounded-full bg-coral px-6 py-3 font-semibold text-white">
                Find a program
              </Link>
              <Link href="/hire/" data-track="cta" data-track-id="jobs_empty_hire" className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
                Post a job
              </Link>
            </div>
          </div>
        ) : (
          <ul className="space-y-4">
            {jobs.map((j) => (
              <li key={j.id} className="rounded-2xl border border-line bg-white p-6">
                <h2 className="font-display text-xl">{j.title}</h2>
                <p className="mt-1 text-sm text-ink-soft">
                  {j.employer} · {j.city} · {j.pay}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
