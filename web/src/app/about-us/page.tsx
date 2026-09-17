import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Prose } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About DentalAssistantCO",
  description: "DentalAssistantCO is an independent guide to dental assistant careers in Colorado.",
  alternates: { canonical: "/about-us/" },
};

export default function About() {
  return (
    <>
      <PageHero title="About DentalAssistantCO" intro={site.tagline} crumbs={[{ href: "/about-us/", label: "About" }]} />
      <Prose>
        <h2>What we do</h2>
        <p>
          We help Coloradans figure out whether dental assisting is right for them, how to get trained, what it costs, and what
          they can earn. We also help Colorado dental offices find assistants. Our guides cite primary sources such as the
          Colorado Dental Board, DANB and the U.S. Bureau of Labor Statistics, and we date-stamp every update.
        </p>
        <h2>We&apos;re not a school</h2>
        <p>
          DentalAssistantCO doesn&apos;t offer training, diplomas or certificates. We compare programs run by others, and some
          schools or employers may become partners who pay us to connect them with interested people. Partners never pay for
          better rankings in our comparisons, and every current partner is listed on our <Link href="/partners/">Partners page</Link>.
        </p>
        <h2>About this web address</h2>
        <p>
          From about 2016 to 2026, dentalassistantco.com was the website of the American Institute of Dental Assisting, a
          Colorado Springs school. The domain has since changed hands. <strong>We are not affiliated with that school</strong>{" "}
          and can&apos;t answer questions about its programs, records or transcripts. Former students who need records can
          find out how to request them on our <Link href="/former-aida-students/">help page for former students</Link>.
        </p>
        <h2>How we work</h2>
        <p>
          Read our <Link href="/editorial-policy/">editorial policy</Link> to learn how we research and update our guides,
          and our <Link href="/advertising-disclosure/">advertising disclosure</Link> to see how we make money.
        </p>
        <h2>Contact</h2>
        <p>
          Call <a href={site.phoneHref}>{site.phone}</a> or use our <Link href="/contact-us/">contact form</Link>.
        </p>
      </Prose>
    </>
  );
}
