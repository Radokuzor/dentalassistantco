import Link from "next/link";
import { ArrowRight, Clock, MapPin, Wallet } from "lucide-react";
import type { Program } from "@/data/programs";

/** The one way a school is shown anywhere on the site: a card that goes to our own
 *  profile page, never to the school's website. Used by the comparison page and city guides. */
export function SchoolCard({ program: p }: { program: Program }) {
  const meta = [
    { icon: Clock, text: p.length === "See school" ? "Length varies" : p.length },
    { icon: Wallet, text: p.tuition },
    { icon: MapPin, text: p.cities.join(", ") },
  ];
  return (
    <li className="group relative rounded-2xl border border-line bg-white p-5 transition hover:border-teal hover:shadow-[0_18px_40px_-28px_rgba(11,61,58,0.5)]">
      <p className="text-xs font-semibold uppercase tracking-wider text-coral-deep">
        {p.kind === "short" ? "Private program" : "Career college"}
      </p>
      <h3 className="mt-1 font-display text-xl leading-snug">
        <Link href={`/schools/${p.slug}/`} data-track="school_card" data-track-id={p.slug} className="after:absolute after:inset-0">
          {p.school}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.summary}</p>
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-ink-soft">
        {meta.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-1.5">
            <Icon className="size-3.5 shrink-0 text-teal" aria-hidden />
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-teal">
        Details &amp; ask a question <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </p>
    </li>
  );
}

export function SchoolGrid({ programs }: { programs: Program[] }) {
  return (
    <ul className="not-prose grid list-none gap-4 p-0 sm:grid-cols-2">
      {programs.map((p) => (
        <SchoolCard key={p.slug} program={p} />
      ))}
    </ul>
  );
}
