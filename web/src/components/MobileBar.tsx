"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * The only pinned element on the page: the "Find a Program" CTA.
 * Mobile: full-width bottom bar. Desktop: floating pill that appears once the header has scrolled away.
 */
export function MobileBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-2 backdrop-blur md:hidden" data-section="mobile_bar">
        <Link
          href="/find-a-program/"
          data-track="cta"
          data-track-id="mobile_bar_find_program"
          className="flex items-center justify-center gap-2 rounded-full bg-coral py-3 text-sm font-semibold text-white"
        >
          Find a Program <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
      <Link
        href="/find-a-program/"
        data-track="cta"
        data-track-id="floating_find_program"
        data-section="floating_cta"
        aria-hidden={!scrolled}
        tabIndex={scrolled ? undefined : -1}
        className={`fixed bottom-6 right-6 z-40 hidden items-center gap-2 rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:bg-coral-deep md:flex ${
          scrolled ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        Find a Program <ArrowRight className="size-4" aria-hidden />
      </Link>
    </>
  );
}
