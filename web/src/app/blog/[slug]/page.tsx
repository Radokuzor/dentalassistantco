import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import credits from "@/data/image-credits.json";
import { getPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
type Credit = { photographer: string; photographerUrl: string; url: string; width: number; height: number; alt: string };

export const dynamicParams = false;
export const generateStaticParams = () => getPosts().map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}/` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: post.image ? [`/images/${post.image}.jpg`] : undefined,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const credit = post.image ? (credits as Record<string, Credit>)[post.image] : undefined;
  const related = getPosts().filter((p) => p.slug !== post.slug && p.cluster === post.cluster).slice(0, 3);

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          dateModified: post.updated,
          author: { "@type": "Organization", name: post.author },
          publisher: { "@id": `${site.url}/#org` },
          mainEntityOfPage: `${site.url}/blog/${post.slug}/`,
          image: post.image ? `${site.url}/images/${post.image}.jpg` : undefined,
        }}
      />
      {post.faq.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: post.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }}
        />
      )}
      <PageHero
        eyebrow={post.cluster}
        title={post.title}
        intro={post.description}
        crumbs={[
          { href: "/blog/", label: "Guides" },
          { href: `/blog/${post.slug}/`, label: post.title },
        ]}
      />
      <div className="mx-auto max-w-3xl px-4 pt-8 text-sm text-ink-soft sm:px-6">
        By {post.author} · Updated <time dateTime={post.updated}>{post.updated}</time> · {post.readingMinutes} min read
      </div>
      {post.image && credit && (
        <figure className="mx-auto mt-6 max-w-3xl px-4 sm:px-6">
          <Image src={`/images/${post.image}.jpg`} alt={post.imageAlt ?? credit.alt} width={credit.width} height={credit.height} className="aspect-[16/9] w-full rounded-3xl object-cover" priority />
          <figcaption className="mt-2 text-xs text-ink-soft">
            {/* Credit as text, not a link: Pexels doesn't require attribution, and page bodies stay internal. */}
            Photo: {credit.photographer} / Pexels
          </figcaption>
        </figure>
      )}
      <div className="prose-guide mx-auto max-w-3xl px-4 py-10 sm:px-6" dangerouslySetInnerHTML={{ __html: post.html }} />

      {post.faq.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 sm:px-6" data-section="post_faq">
          <h2 className="font-display text-3xl">FAQ</h2>
          <div className="mt-4 divide-y divide-line border-y border-line">
            {post.faq.map((f) => (
              <details key={f.q} className="py-4">
                <summary className="cursor-pointer font-semibold">{f.q}</summary>
                <p className="mt-2 text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <aside className="mx-auto mt-12 max-w-3xl px-4 sm:px-6" data-section="post_cta">
        <div className="relative overflow-hidden rounded-3xl bg-teal-deep p-8 text-paper">
          <div className="topo absolute inset-0 opacity-40" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl">Ready to start?</h2>
            <p className="mt-2 text-paper/80">Get matched with Colorado programs that fit your schedule and budget in 60 seconds.</p>
            <Link href="/find-a-program/" data-track="cta" data-track-id="post_footer_quiz" className="mt-5 inline-block rounded-full bg-coral px-6 py-3 font-semibold text-white">
              Find my program →
            </Link>
          </div>
        </div>
      </aside>

      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-2xl">Related guides</h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/blog/${r.slug}/`} className="text-teal underline underline-offset-4">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
