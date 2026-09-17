import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostList({ posts, page, pages }: { posts: PostMeta[]; page: number; pages: number }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="grid gap-5 md:grid-cols-3">
        {posts.map((p, i) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}/`}
            className={`group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl ${
              page === 1 && i === 0 ? "md:col-span-2 md:row-span-2 md:p-10" : ""
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-coral-deep">{p.cluster}</p>
            <h2 className={`mt-3 font-display leading-snug group-hover:text-teal ${page === 1 && i === 0 ? "text-3xl" : "text-xl"}`}>{p.title}</h2>
            <p className="mt-3 text-sm text-ink-soft">{p.description}</p>
            <p className="mt-5 text-xs text-ink-soft">
              Updated {p.updated} · {p.readingMinutes} min read
            </p>
          </Link>
        ))}
      </div>
      {pages > 1 && (
        <nav className="mt-10 flex justify-center gap-2" aria-label="Pagination">
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={n === 1 ? "/blog/" : `/blog/page/${n}/`}
              aria-current={n === page ? "page" : undefined}
              className={`grid size-10 place-items-center rounded-full border font-semibold ${n === page ? "border-teal bg-teal text-white" : "border-line bg-white"}`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
