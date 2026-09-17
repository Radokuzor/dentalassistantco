import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { allStories, Stories } from "@/components/Stories";

export const metadata: Metadata = {
  title: "Dental Assistant Stories from Colorado",
  description: "Colorado dental assistants and the offices that hire them, on training, first jobs and what they wish they'd known.",
  alternates: { canonical: "/stories/" },
  // Keep the page out of search until it has real content.
  robots: allStories.length === 0 ? { index: false } : undefined,
};

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories"
        title="Colorado dental assistants, in their own words"
        intro="How people got trained, landed their first job and built a career, told by the assistants and dental offices themselves."
        crumbs={[{ href: "/stories/", label: "Stories" }]}
      />
      <div className="space-y-16 py-12">
        <Stories heading="What they told us" />
        <section className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr]" id="share">
          <div>
            <h2 className="font-display text-3xl leading-tight">Share your story</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Trained in Colorado? Working chairside? Hiring assistants? Tell future students what it&apos;s really like. We read
              every submission, may edit for length, and will confirm with you before anything is published.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">
              We don&apos;t pay for stories, and we never publish reviews we can&apos;t verify. See our{" "}
              <Link href="/editorial-policy/" className="text-teal underline">
                editorial policy
              </Link>
              .
            </p>
          </div>
          <ContactForm
            type="story"
            cta="Send my story"
            consent="I confirm this is my own experience, and I give DentalAssistantCO permission to publish it (edited for length) with my first name, last initial and city. I can ask for it to be removed at any time."
            fields={[
              { name: "name", label: "Name", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "city", label: "City", required: true },
              { name: "role", label: "I am a… (graduate, working assistant, dentist/office manager)", required: true },
              { name: "detail", label: "Program or office type, and year" },
              { name: "story", label: "Your story", textarea: true, required: true },
            ]}
          />
        </section>
      </div>
    </>
  );
}
