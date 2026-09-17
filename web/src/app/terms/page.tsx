import type { Metadata } from "next";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = { title: "Terms of Use", alternates: { canonical: "/terms/" } };

export default function Terms() {
  return (
    <>
      <PageHero title="Terms of use" intro="Last updated: September 17, 2026" crumbs={[{ href: "/terms/", label: "Terms" }]} />
      <Prose>
        <p>
          DentalAssistantCO provides general career information. It is not legal, medical or financial advice. Program
          details, requirements and salaries change, so confirm them with the school, the Colorado Dental Board or the employer
          before making decisions.
        </p>
        <p>
          We don&apos;t guarantee admission, employment or earnings. Links to third-party sites are provided for convenience,
          and some are affiliate links that may earn us a commission.
        </p>
        <p>You agree not to submit false information, scrape the site, or misuse our forms.</p>
      </Prose>
    </>
  );
}
