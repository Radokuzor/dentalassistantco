"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent, type Consent } from "@/lib/analytics";

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(getConsent() === null), []);
  if (!open) return null;

  const choose = (value: Consent) => {
    setConsent(value);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-3 bottom-16 z-50 mx-auto max-w-xl rounded-2xl border border-line bg-white p-5 shadow-2xl md:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ink-soft">
        We use cookies and analytics to learn which guides help people most and to improve the site. See our{" "}
        <Link href="/privacy-policy/" className="text-teal underline">
          privacy policy
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => choose("granted")} className="rounded-full bg-teal px-5 py-2 text-sm font-semibold text-white">
          Accept
        </button>
        <button onClick={() => choose("denied")} className="rounded-full border border-line px-5 py-2 text-sm font-semibold">
          Essential only
        </button>
      </div>
    </div>
  );
}
