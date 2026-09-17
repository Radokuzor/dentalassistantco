import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export const staticPaths = [
  "/",
  "/find-a-program/",
  "/programs/dental-assistant/",
  "/programs/expanded-duties-dental-assistant/",
  "/colorado-needs-dental-assistants/",
  "/locations/colorado-springs/",
  "/jobs/",
  "/hire/",
  "/resources/",
  "/blog/",
  "/about-us/",
  "/contact-us/",
  "/partners/",
  "/privacy-policy/",
  "/terms/",
  "/site-map/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}` })),
    ...getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: p.updated })),
  ];
}
