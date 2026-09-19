import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

const copy: Record<string, { title: string; body: string }> = {
  program: {
    title: "You're on your way",
    body: "We received your answers. Expect a call or text shortly with programs that match your schedule and budget. While you wait, read up on Colorado's x-ray requirement so you know what to ask.",
  },
  contact: { title: "Message received", body: "Thanks for reaching out. We usually reply within one business day." },
  story: {
    title: "Thank you for sharing",
    body: "We read every story. If we'd like to feature yours, we'll email you to confirm the wording before anything goes live.",
  },
  employer: {
    title: "Your opening is in",
    body: "We'll review it and reach out to confirm the details before it goes live on the job board.",
  },
  school: {
    title: "Question sent",
    body: "We'll get you an answer, usually the same day, and by phone or text if that is faster. If the school is slow to respond, we'll chase it.",
  },
  job: {
    title: "Application sent",
    body: "The practice has your details. We keep a copy, so if you have not heard anything in about a week, tell us and we'll follow up for you.",
  },
  "talent-pool": {
    title: "You're in the pool",
    body: "We'll email you Colorado openings that match your profile, and let you know when an office asks to be put in touch. Nothing else, and you can leave any time.",
  },
};

export const dynamicParams = false;
export const generateStaticParams = () => Object.keys(copy).map((type) => ({ type }));

export default async function Thanks({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const c = copy[type];
  return (
    <>
      <PageHero title={c.title} intro={c.body} />
      <div className="mx-auto flex max-w-4xl flex-wrap gap-3 px-4 py-10 sm:px-6">
        <Link href="/blog/dental-assistant-colorado-licensed/" className="rounded-full bg-teal px-6 py-3 font-semibold text-white">
          Colorado requirements
        </Link>
        <a href={site.phoneHref} className="rounded-full border border-line bg-white px-6 py-3 font-semibold">
          Call {site.phone}
        </a>
      </div>
    </>
  );
}
