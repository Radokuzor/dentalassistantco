"use client";

import Link from "next/link";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

// Tracks 404s so inherited URLs that still get traffic can be redirected (docs/07-analytics-plan.md).
export default function NotFound() {
  useEffect(() => {
    track("not_found", { path: location.pathname, referrer: document.referrer });
  }, []);

  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl text-teal">404</p>
      <h1 className="mt-4 font-display text-3xl">That page took a different trail</h1>
      <p className="mt-3 text-ink-soft">
        This website recently changed ownership, so some old pages no longer exist. Try one of these instead.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/find-a-program/" className="rounded-full bg-coral px-6 py-3 font-semibold text-white">
          Find a program
        </Link>
        <Link href="/blog/" className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
          Browse guides
        </Link>
      </div>
    </section>
  );
}
