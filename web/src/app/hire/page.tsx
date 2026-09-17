import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Hire a Dental Assistant in Colorado",
  description: "Colorado dental offices: post a dental assistant job or request trained candidates. Free listings during launch.",
  alternates: { canonical: "/hire/" },
};

export default function Hire() {
  return (
    <>
      <PageHero
        eyebrow="For dental offices"
        title="Hire a dental assistant in Colorado"
        intro="Post an opening or tell us who you need. Listings are free while we launch, and we'll share your role with Colorado candidates and training programs."
        crumbs={[{ href: "/hire/", label: "Hire" }]}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <ContactForm
          type="employer"
          cta="Submit job opening"
          fields={[
            { name: "practice", label: "Practice name", required: true },
            { name: "contactName", label: "Your name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel", required: true },
            { name: "city", label: "City", required: true },
            { name: "role", label: "Role (e.g. chairside DA, ortho assistant, EDDA)", required: true },
            { name: "pay", label: "Pay range (e.g. $20–$26/hr)" },
            { name: "details", label: "Schedule, requirements, anything else", textarea: true },
          ]}
        />
      </div>
    </>
  );
}
