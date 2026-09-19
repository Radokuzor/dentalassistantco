import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "DentalAssistantCO's commitment to an accessible website, and how to report a barrier.",
  alternates: { canonical: "/accessibility/" },
};

export default function Accessibility() {
  return (
    <>
      <PageHero eyebrow="Trust" title="Accessibility statement" crumbs={[{ href: "/accessibility/", label: "Accessibility" }]} />
      <Prose>
        <p>
          We want everyone to be able to research a dental assisting career, including people who use screen readers,
          keyboard navigation, magnification or captions.
        </p>
        <h2>Our goal</h2>
        <p>
          We aim to meet the{" "}
          <Link href="/resources/#wcag">
            Web Content Accessibility Guidelines (WCAG) 2.2
          </Link>{" "}
          at level AA. That means readable color contrast, text descriptions for images, a clear heading structure on every
          page, labeled form fields, and pages that work without a mouse.
        </p>
        <h2>Known limitations</h2>
        <p>
          Some content we link to, such as school websites and government PDFs, is run by other organizations, and we
          can&apos;t control how accessible it is.
        </p>
        <h2>Report a barrier</h2>
        <p>
          If something on this site is hard to use, call <a href={site.phoneHref}>{site.phone}</a> or use our{" "}
          <Link href="/contact-us/">contact form</Link>. Tell us the page and what happened. We&apos;ll get you the
          information another way while we fix the problem.
        </p>
        <p>
          <em>Last reviewed September 17, 2026.</em>
        </p>
      </Prose>
    </>
  );
}
