import type { Metadata } from "next";
import { PageHero, Prose } from "@/components/PageHero";
import { partners } from "@/data/partners";

export const metadata: Metadata = {
  title: "Partners",
  description: "Schools and employers that may contact people who request information through DentalAssistantCO.",
  alternates: { canonical: "/partners/" },
};

export default function Partners() {
  return (
    <>
      <PageHero title="Our partners" crumbs={[{ href: "/partners/", label: "Partners" }]} />
      <Prose>
        <p>
          When you submit a form and agree to be contacted, your information may be shared with the organizations listed
          below so they can reach you about dental assistant programs or jobs. We update this list whenever a partner joins
          or leaves.
        </p>
        {partners.length === 0 ? (
          <p>
            <strong>We currently have no partners.</strong> Your information is used only by DentalAssistantCO to follow up
            with you.
          </p>
        ) : (
          <ul>
            {partners.map((p) => (
              <li key={p.name}>
                {p.name}: {p.type}
              </li>
            ))}
          </ul>
        )}
      </Prose>
    </>
  );
}
