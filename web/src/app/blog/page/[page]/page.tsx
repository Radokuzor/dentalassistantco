import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostList } from "@/components/PostList";
import { getPosts, POSTS_PER_PAGE } from "@/lib/posts";

type Props = { params: Promise<{ page: string }> };

export const dynamicParams = false;

// /blog/page/2/ and /blog/page/3/ are inherited URLs, so always build at least pages 2–3.
export function generateStaticParams() {
  const pages = Math.max(3, Math.ceil(getPosts().length / POSTS_PER_PAGE));
  return Array.from({ length: pages - 1 }, (_, i) => ({ page: String(i + 2) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  return { title: `Dental Assistant Guides (Page ${page})`, alternates: { canonical: `/blog/page/${page}/` } };
}

export default async function BlogPage({ params }: Props) {
  const page = Number((await params).page);
  const posts = getPosts();
  const pages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const slice = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  return (
    <>
      <PageHero title={`Guides, page ${page}`} crumbs={[{ href: "/blog/", label: "Guides" }, { href: `/blog/page/${page}/`, label: `Page ${page}` }]} />
      {slice.length ? (
        <PostList posts={slice} page={page} pages={pages} />
      ) : (
        <p className="mx-auto max-w-5xl px-4 py-12 text-ink-soft sm:px-6">
          More guides are on the way. <Link href="/blog/" className="text-teal underline">See all current guides</Link>.
        </p>
      )}
    </>
  );
}
