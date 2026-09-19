import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Advertising & Affiliate Disclosure",
  description: "How DentalAssistantCO makes money: school referrals, employer services, affiliate links and ads.",
  alternates: { canonical: "/advertising-disclosure/" },
};

export default function AdvertisingDisclosure() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Advertising and affiliate disclosure"
        intro="DentalAssistantCO is free to use. Here's exactly how we earn money, in line with the FTC's Endorsement Guides."
        crumbs={[
          { href: "/about-us/", label: "About" },
          { href: "/advertising-disclosure/", label: "Advertising disclosure" },
        ]}
      />
      <Prose>
        <h2>How we make money</h2>
        <ol>
          <li>
            <strong>School referrals.</strong> If you ask to be matched with a program and agree to be contacted, a partner
            school may pay us for the introduction. Our <Link href="/partners/">Partners page</Link> lists current partners.
          </li>
          <li>
            <strong>Employer services.</strong> Dental offices may pay to post jobs or be introduced to candidates. See{" "}
            <Link href="/hire/">Hire an assistant</Link>.
          </li>
          <li>
            <strong>Affiliate links.</strong> Some links to products such as scrubs, study guides and courses are affiliate
            links. If you buy through one, we may earn a commission at no extra cost to you.
          </li>
          <li>
            <strong>Advertising.</strong> We may show ads, and we label them clearly. Advertisers don&apos;t control our content.
          </li>
          <li>
            <strong>Our own products.</strong> We may sell study and career-prep materials, and we&apos;ll always label them
            as ours.
          </li>
        </ol>

        <h2>What money doesn&apos;t buy</h2>
        <p>
          Payment never changes the facts, prices or order of schools in our comparisons, and we don&apos;t accept payment for
          positive coverage. Read our <Link href="/editorial-policy/">editorial policy</Link>.
        </p>

        <h2>Your information</h2>
        <p>
          We share your contact details with a school or employer only when you ask us to and check the consent box on a
          form. Our <Link href="/privacy-policy/">privacy policy</Link> has the details.
        </p>

        <p>
          Reference:{" "}
          <Link href="/resources/#ftc-endorsements">
            FTC Endorsement Guides: What People Are Asking
          </Link>
          . Last updated September 17, 2026.
        </p>
      </Prose>
    </>
  );
}
