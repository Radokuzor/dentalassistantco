import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import stories from "@/data/stories.json";

export const dynamic = "force-static";

/** Every static page, grouped for the human-readable /site-map/ page. */
export const pageGroups: { title: string; pages: [path: string, label: string][] }[] = [
  {
    title: "Become a dental assistant",
    pages: [
      ["/", "Home"],
      ["/find-a-program/", "Find a program (match quiz)"],
      ["/programs/dental-assistant/", "Colorado dental assistant programs compared"],
      ["/programs/expanded-duties-dental-assistant/", "Expanded duties dental assisting (EDDA)"],
      ["/requirements/", "Colorado dental assistant requirements"],
      ["/resources/", "Resources"],
    ],
  },
  {
    title: "Cities",
    pages: [
      ["/locations/denver/", "Denver & Front Range"],
      ["/locations/colorado-springs/", "Colorado Springs"],
    ],
  },
  {
    title: "Jobs & employers",
    pages: [
      ["/jobs/", "Dental assistant jobs"],
      ["/colorado-needs-dental-assistants/", "Why Colorado needs dental assistants"],
      ["/hire/", "Hire a dental assistant"],
      // /stories/ stays out of the sitemap (and noindex) until it has real stories.
      ...(stories.length > 0 ? [["/stories/", "Stories from Colorado assistants"] as [string, string]] : []),
    ],
  },
  {
    title: "About & policies",
    pages: [
      ["/about-us/", "About DentalAssistantCO"],
      ["/contact-us/", "Contact us"],
      ["/editorial-policy/", "Editorial policy"],
      ["/advertising-disclosure/", "Advertising & affiliate disclosure"],
      ["/partners/", "Partners"],
      ["/former-aida-students/", "Looking for the American Institute of Dental Assisting?"],
      ["/privacy-policy/", "Privacy policy"],
      ["/terms/", "Terms of use"],
      ["/accessibility/", "Accessibility"],
      ["/blog/", "Guides"],
      ["/site-map/", "Site map"],
    ],
  },
];

export const staticPaths = pageGroups.flatMap((g) => g.pages.map(([path]) => path));

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPaths.map((p) => ({ url: `${site.url}${p}` })),
    ...getPosts().map((p) => ({ url: `${site.url}/blog/${p.slug}/`, lastModified: p.updated })),
  ];
}
