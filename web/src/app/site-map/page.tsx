import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { getPosts } from "@/lib/posts";
import { pageGroups } from "../sitemap";

export const metadata: Metadata = {
  title: "Site Map",
  description: "Every page and guide on DentalAssistantCO.",
  alternates: { canonical: "/site-map/" },
};

export default function SiteMap() {
  const posts = getPosts();
  const clusters = [...new Set(posts.map((p) => p.cluster))].sort();
  return (
    <>
      <PageHero title="Site map" crumbs={[{ href: "/site-map/", label: "Site map" }]} />
      <Prose>
        {pageGroups.map((g) => (
          <section key={g.title}>
            <h2>{g.title}</h2>
            <ul>
              {g.pages.map(([path, label]) => (
                <li key={path}>
                  <Link href={path}>{label}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <h2>Guides</h2>
        {clusters.map((c) => (
          <section key={c}>
            <h3>{c}</h3>
            <ul>
              {posts
                .filter((p) => p.cluster === c)
                .map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}/`}>{p.title}</Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
      </Prose>
    </>
  );
}
