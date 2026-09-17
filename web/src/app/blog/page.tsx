import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostList } from "@/components/PostList";
import { getPosts, POSTS_PER_PAGE } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Dental Assistant Career Guides for Colorado",
  description: "Straight-talk guides to becoming a dental assistant in Colorado: requirements, costs, salary, certification and jobs.",
  alternates: { canonical: "/blog/", types: { "application/rss+xml": "/feed.xml" } },
};

export default function Blog() {
  const posts = getPosts();
  return (
    <>
      <PageHero eyebrow="Guides" title="Dental assistant career guides" intro="Researched, date-stamped answers for future and working dental assistants in Colorado." crumbs={[{ href: "/blog/", label: "Guides" }]} />
      <PostList posts={posts.slice(0, POSTS_PER_PAGE)} page={1} pages={Math.ceil(posts.length / POSTS_PER_PAGE)} />
    </>
  );
}
