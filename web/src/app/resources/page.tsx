import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { GROUPS, sources } from "@/data/sources";

export const metadata: Metadata = {
  title: "Dental Assistant Resources & Sources",
  description:
    "Every official source we cite for Colorado dental assistant rules, x-ray requirements, pay and school approvals, in one place.",
  alternates: { canonical: "/resources/" },
};

export default function Resources() {
  return (
    <>
      <PageHero
        eyebrow="Toolkit"
        title="Resources for future dental assistants"
        intro="Our guides link here rather than bouncing you off mid-sentence. Everything we cite is below, grouped and one click from the original."
        crumbs={[{ href: "/resources/", label: "Resources" }]}
      />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6">
        <section>
          <h2 className="font-display text-2xl">Official sources</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Government and certification bodies only. We date-stamp what we take from them, and re-check before we publish.
          </p>
          {GROUPS.map(({ key, title }) => (
            <div key={key} className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-coral-deep">{title}</h3>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {sources
                  .filter((s) => s.group === key)
                  .map((s) => (
                    <li key={s.id} id={s.id} className="scroll-mt-24">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener"
                        className="block h-full rounded-2xl border border-line bg-white p-5 hover:border-teal"
                      >
                        <span className="font-semibold text-teal">{s.name} ↗</span>
                        <span className="mt-1 block text-sm text-ink-soft">{s.note}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
        <section>
          <h2 className="font-display text-2xl">Start here</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ["/requirements/", "Colorado requirements", "License, x-ray rule, DANB and CPR in one place"],
              ["/programs/dental-assistant/", "Programs compared", "Cost, length and schedule for Colorado schools"],
              ["/blog/how-long-does-it-take-to-become-a-dental-assistant/", "How long it takes", "Timelines from 8 weeks to 2 years"],
              ["/blog/choose-dental-assisting-school-thats-right/", "School checklist", "12 questions to ask before you enroll"],
            ].map(([href, name, note]) => (
              <li key={href}>
                <Link href={href} className="block h-full rounded-2xl border border-line bg-white p-5 hover:border-teal">
                  <span className="font-semibold text-teal">{name}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-3xl border border-dashed border-line bg-white p-8">
          <h2 className="font-display text-2xl">Coming soon: study packs</h2>
          <p className="mt-2 text-ink-soft">
            Colorado radiography (RHS) practice questions, dental terminology flashcards, and an interview and resume kit.{" "}
            <Link href="/contact-us/" className="text-teal underline">
              Ask to be notified
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
