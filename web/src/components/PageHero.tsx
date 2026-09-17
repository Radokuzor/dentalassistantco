import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { site } from "@/lib/site";

type Crumb = { href: string; label: string };

/** Standard interior-page header with breadcrumbs (+ BreadcrumbList schema). */
export function PageHero({ eyebrow, title, intro, crumbs = [] }: { eyebrow?: string; title: string; intro?: string; crumbs?: Crumb[] }) {
  const trail = [{ href: "/", label: "Home" }, ...crumbs];
  return (
    <section className="relative overflow-hidden border-b border-line" data-section="page_hero">
      <div className="topo absolute inset-0" aria-hidden />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: `${site.url}${c.href}` })),
        }}
      />
      <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
        <nav aria-label="Breadcrumb" className="text-xs text-ink-soft">
          {trail.map((c, i) => (
            <span key={c.href}>
              {i > 0 && <span className="mx-1.5">/</span>}
              {i < trail.length - 1 ? (
                <Link href={c.href} className="hover:text-teal">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page">{c.label}</span>
              )}
            </span>
          ))}
        </nav>
        {eyebrow && <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-coral-deep">{eyebrow}</p>}
        <h1 className="mt-3 font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">{intro}</p>}
      </div>
    </section>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <div className="prose-guide mx-auto max-w-3xl px-4 py-12 sm:px-6">{children}</div>;
}
