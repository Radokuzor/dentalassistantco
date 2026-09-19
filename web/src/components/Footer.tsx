import Link from "next/link";
import { FOOTER_SOURCE_IDS, sourceById } from "@/data/sources";
import { site } from "@/lib/site";

const cols: { title: string; links: [string, string][] }[] = [
  {
    title: "Become a DA",
    links: [
      ["/find-a-program/", "Find a program"],
      ["/programs/dental-assistant/", "Colorado programs compared"],
      ["/programs/expanded-duties-dental-assistant/", "Expanded duties (EDDA)"],
      ["/requirements/", "Colorado requirements"],
      ["/blog/dental-assistant-salary-colorado/", "Salary in Colorado"],
    ],
  },
  {
    title: "Work",
    links: [
      ["/jobs/", "Dental assistant jobs"],
      ["/hire/", "Hire an assistant"],
      ["/locations/denver/", "Denver schools"],
      ["/locations/colorado-springs/", "Colorado Springs"],
      ["/colorado-needs-dental-assistants/", "Colorado demand"],
    ],
  },
  {
    title: "Site",
    links: [
      ["/blog/", "Guides"],
      ["/about-us/", "About"],
      ["/contact-us/", "Contact"],
      ["/stories/", "Share your story"],
      ["/editorial-policy/", "Editorial policy"],
      ["/advertising-disclosure/", "Advertising disclosure"],
      ["/privacy-policy/", "Privacy"],
      ["/terms/", "Terms"],
      ["/accessibility/", "Accessibility"],
      ["/site-map/", "Site map"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden bg-teal-deep text-paper/85" data-section="footer">
      <div className="topo absolute inset-0 opacity-40" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl text-paper">DentalAssistantCO</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">{site.tagline}</p>
          <a href={site.phoneHref} className="mt-5 inline-block text-lg font-semibold text-mint">
            {site.phone}
          </a>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">{col.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {col.links.map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* The only outbound links on the site (plus /resources/). Page bodies stay internal — AGENTS.md #7. */}
      <div className="relative border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-4 gap-y-2 px-4 py-5 text-xs sm:px-6" data-section="footer_sources">
          <p className="font-bold uppercase tracking-[0.2em] text-mint">Official sources</p>
          {FOOTER_SOURCE_IDS.map((id) => sourceById(id)).map(
            (s) =>
              s && (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener"
                  className="text-paper/70 underline decoration-paper/25 underline-offset-4 hover:text-white"
                >
                  {s.short} ↗
                </a>
              ),
          )}
          <Link href="/resources/" className="text-paper/70 underline decoration-paper/25 underline-offset-4 hover:text-white">
            All sources we cite
          </Link>
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-paper/60 sm:px-6">
          {site.disclosure}{" "}
          <Link href="/former-aida-students/" className="underline hover:text-white">
            Looking for that school?
          </Link>{" "}
          Some links may be affiliate links; we may earn a commission at no cost to you (
          <Link href="/advertising-disclosure/" className="underline hover:text-white">
            disclosure
          </Link>
          ). ©{" "}
          {new Date().getFullYear()} DentalAssistantCO.
        </p>
      </div>
    </footer>
  );
}
