import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

// Blog posts live in web/content/blog/<slug>.md. Slugs must match the inherited URLs (docs/03-seo-plan.md).
const DIR = path.join(process.cwd(), "content", "blog");

export type Faq = { q: string; a: string };
export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated: string;
  author: string;
  cluster: string;
  image?: string;
  imageAlt?: string;
  faq: Faq[];
  readingMinutes: number;
};
export type Post = PostMeta & { html: string };

function load(file: string): Post {
  const slug = file.replace(/\.md$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(DIR, file), "utf8"));
  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated ?? data.date,
    author: data.author ?? "DentalAssistantCO Editorial Team",
    cluster: data.cluster ?? "Guides",
    image: data.image,
    imageAlt: data.imageAlt,
    faq: data.faq ?? [],
    readingMinutes: Math.max(1, Math.round(content.split(/\s+/).length / 230)),
    html: marked.parse(content, { async: false }),
  };
}

export function getPosts(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(load)
    .sort((a, b) => b.updated.localeCompare(a.updated));
}

export const getPost = (slug: string) => getPosts().find((p) => p.slug === slug);

export const POSTS_PER_PAGE = 9;
