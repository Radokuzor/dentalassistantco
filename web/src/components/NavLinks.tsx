"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

const items = nav.slice(1);

/** Desktop nav: dividers between links, a teal underline that wipes in on hover and stays on the current section. */
export function NavLinks() {
  const raw = usePathname() ?? "/";
  const path = raw.endsWith("/") ? raw : `${raw}/`;
  // Longest matching prefix wins, so /blog/dental-assistant-salary-colorado/ lights up "Salary", not "Guides".
  const active = items
    .filter((item) => path.startsWith(item.href))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <nav aria-label="Main" className="hidden items-center text-sm font-medium md:flex">
      {items.map((item, i) => {
        const current = item.href === active;
        return (
          <div key={item.href} className="flex items-center">
            {i > 0 && <span aria-hidden className="mx-3 h-4 w-px bg-line lg:mx-4" />}
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-teal after:transition-transform after:duration-300 after:ease-out hover:text-teal hover:after:scale-x-100 focus-visible:text-teal focus-visible:after:scale-x-100 ${
                current ? "text-teal after:scale-x-100" : "text-ink after:origin-left after:scale-x-0"
              }`}
            >
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
