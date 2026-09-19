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
        intro="Post an opening or tell us who you need. Listings are free while we launch, candidates apply on our site, and completed applications land in your inbox."
        crumbs={[{ href: "/hire/", label: "Hire" }]}
      />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <ol className="mb-8 space-y-3" data-section="hire_steps">
          {[
            ["You send the details", "Takes two minutes. Pay range is required — listings that show pay get far more applicants."],
            ["We publish it", "We check it and put it on the Colorado job board, with the structured data Google for Jobs needs."],
            ["Candidates apply here", "They fill in experience, x-ray certification and availability on our site. No account, no dead-end ATS."],
            ["You get the applications", "Emailed to you as they arrive. We keep a copy so we can chase anyone who goes quiet."],
          ].map(([title, body], i) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line bg-white p-4">
              <span className="font-display text-2xl text-teal">{i + 1}</span>
              <span>
                <strong className="block">{title}</strong>
                <span className="text-sm leading-relaxed text-ink-soft">{body}</span>
              </span>
            </li>
          ))}
        </ol>
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
            { name: "employmentType", label: "Job type", options: ["Full time", "Part time", "Temporary / fill-in", "Contract"] },
            { name: "schedule", label: "Schedule (e.g. Mon–Thu, 7:30–4:30)" },
            { name: "pay", label: "Pay range (e.g. $20–$26/hr)", required: true, help: "Required to publish. Listings with a pay range get far more applicants." },
            { name: "details", label: "Schedule, requirements, anything else", textarea: true },
          ]}
        />
      </div>
    </>
  );
}
