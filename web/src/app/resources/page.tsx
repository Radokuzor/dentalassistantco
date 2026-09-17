import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Dental Assistant Resources",
  description: "Official sources, study tools and planning resources for future dental assistants in Colorado.",
  alternates: { canonical: "/resources/" },
};

const official = [
  ["Colorado Dental Board (DORA)", "https://dpo.colorado.gov/Dental", "Rules for what dental assistants may do"],
  ["DANB: Colorado radiography requirements", "https://www.danb.org/state-requirements/colorado-radiography", "The x-ray requirement, explained by DANB"],
  ["BLS: Dental assistants", "https://www.bls.gov/ooh/healthcare/dental-assistants.htm", "National pay and job outlook"],
  ["Colorado Dept. of Higher Education", "https://cdhe.colorado.gov/", "Check that a private school is approved"],
];

export default function Resources() {
  return (
    <>
      <PageHero eyebrow="Toolkit" title="Resources for future dental assistants" crumbs={[{ href: "/resources/", label: "Resources" }]} />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6">
        <section>
          <h2 className="font-display text-2xl">Official sources</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {official.map(([name, url, note]) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener" className="block h-full rounded-2xl border border-line bg-white p-5 hover:border-teal">
                  <span className="font-semibold text-teal">{name} ↗</span>
                  <span className="mt-1 block text-sm text-ink-soft">{note}</span>
                </a>
              </li>
            ))}
          </ul>
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
