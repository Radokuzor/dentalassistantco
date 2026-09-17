import Link from "next/link";
import { Quote } from "lucide-react";
import stories from "@/data/stories.json";

/**
 * Testimonials from real people, stored in src/data/stories.json.
 * Only add an entry when all of these are true (FTC 16 CFR Part 465 and 255):
 *  - the person exists and submitted it (see the "story" leads in Firestore) or gave it to us directly
 *  - we have their written permission to publish, with the name format they chose
 *  - the quote is their words (trim for length only, never change the meaning)
 *  - any payment, discount or partner relationship is disclosed in `disclosure`
 */
export type Story = {
  name: string; // as they agreed to be shown, e.g. "Maria G."
  role: "graduate" | "assistant" | "employer";
  city: string;
  detail: string; // e.g. "Weekend program, 2025" or "Office manager, general dentistry"
  quote: string;
  consentDate: string; // YYYY-MM-DD the written permission was received
  disclosure?: string;
};

export const allStories = stories as Story[];

export function Stories({ limit, heading = "In their words" }: { limit?: number; heading?: string }) {
  const list = limit ? allStories.slice(0, limit) : allStories;
  if (list.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6" data-section="stories">
      <div className="flex items-end justify-between gap-6">
        <h2 className="font-display text-4xl leading-tight">{heading}</h2>
        {limit && allStories.length > limit && (
          <Link href="/stories/" className="font-semibold text-teal">
            More stories →
          </Link>
        )}
      </div>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {list.map((s) => (
          <li key={`${s.name}-${s.consentDate}`} className="flex flex-col rounded-3xl border border-line bg-white p-7">
            <Quote className="size-6 text-coral" aria-hidden />
            <blockquote className="mt-4 flex-1 leading-relaxed">{s.quote}</blockquote>
            <p className="mt-6 font-semibold">{s.name}</p>
            <p className="text-sm text-ink-soft">
              {s.detail} · {s.city}
            </p>
            {s.disclosure && <p className="mt-2 text-xs text-ink-soft">{s.disclosure}</p>}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-ink-soft">
        Shared with permission. Individual experiences vary. Photos elsewhere on this site are stock images.
      </p>
    </section>
  );
}
