import type { Metadata } from "next";
import { LeadQuiz } from "@/components/LeadQuiz";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Find a Dental Assistant Program in Colorado",
  description: "Answer 4 quick questions and get matched with Colorado dental assistant programs that fit your schedule and budget.",
  alternates: { canonical: "/find-a-program/" },
};

export default function FindAProgram() {
  return (
    <>
      <PageHero
        eyebrow="Free · 60 seconds"
        title="Find a dental assistant program that fits your life"
        intro="Tell us when you want to start, which schedule works for you, and your budget. We'll match you with Colorado programs worth calling."
        crumbs={[{ href: "/find-a-program/", label: "Find a Program" }]}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <LeadQuiz />
      </div>
    </>
  );
}
