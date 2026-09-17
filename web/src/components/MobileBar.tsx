import Link from "next/link";
import { Phone } from "lucide-react";
import { site } from "@/lib/site";

/** Sticky mobile action bar with the two conversions that matter most. */
export function MobileBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper/95 backdrop-blur md:hidden"
      data-section="mobile_bar"
    >
      <a href={site.phoneHref} className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold">
        <Phone className="size-4 text-teal" aria-hidden /> Call
      </a>
      <Link
        href="/find-a-program/"
        data-track="cta"
        data-track-id="mobile_bar_find_program"
        className="bg-coral py-3.5 text-center text-sm font-semibold text-white"
      >
        Find a Program
      </Link>
    </div>
  );
}
