import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/85 backdrop-blur" data-section="header">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-1 font-display text-xl font-semibold tracking-tight">
          DentalAssistant
          <span className="rounded bg-teal px-1.5 py-0.5 text-sm font-bold tracking-widest text-paper">CO</span>
        </Link>
        <NavLinks />
        <div className="flex items-center gap-3">
          <a href={site.phoneHref} className="hidden items-center gap-1.5 text-sm font-semibold lg:flex">
            <Phone className="size-4 text-teal" aria-hidden /> {site.phone}
          </a>
          <Link
            href="/find-a-program/"
            data-track="cta"
            data-track-id="header_find_program"
            className="rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-coral-deep"
          >
            Find a Program
          </Link>
        </div>
      </div>
    </header>
  );
}
