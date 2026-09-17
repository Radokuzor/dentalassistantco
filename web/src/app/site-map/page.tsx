import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { getPosts } from "@/lib/posts";
import { staticPaths } from "../sitemap";

export const metadata: Metadata = { title: "Site Map", alternates: { canonical: "/site-map/" } };

export default function SiteMap() {
  return (
    <>
      <PageHero title="Site map" crumbs={[{ href: "/site-map/", label: "Site map" }]} />
      <Prose>
        <h2>Pages</h2>
        <ul>
          {staticPaths.map((p) => (
            <li key={p}>
              <Link href={p}>{p === "/" ? "Home" : p}</Link>
            </li>
          ))}
        </ul>
        <h2>Guides</h2>
        <ul>
          {getPosts().map((p) => (
            <li key={p.slug}>
              <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
            </li>
          ))}
        </ul>
      </Prose>
    </>
  );
}
