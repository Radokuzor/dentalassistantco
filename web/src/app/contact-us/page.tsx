import Link from "next/link";
import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about becoming a dental assistant in Colorado, partnering, or hiring? Contact DentalAssistantCO.",
  alternates: { canonical: "/contact-us/" },
};

export default function Contact() {
  return (
    <>
      <PageHero title="Contact us" intro="Questions about programs, partnerships or hiring? We usually reply within one business day." crumbs={[{ href: "/contact-us/", label: "Contact" }]} />
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-soft">Call or text</p>
            <a href={site.phoneHref} className="mt-1 block font-display text-3xl text-teal">
              {site.phone}
            </a>
          </div>
          <p className="text-sm leading-relaxed text-ink-soft">
            Looking for the American Institute of Dental Assisting? This website now belongs to an independent guide and is
            not affiliated with that school. Our <Link href="/programs/dental-assistant/" className="text-teal underline">program comparison</Link> lists
            current Colorado options.
          </p>
        </div>
        <ContactForm
          type="contact"
          cta="Send message"
          fields={[
            { name: "name", label: "Name", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "topic", label: "Topic (student, school partner, employer, other)" },
            { name: "message", label: "Message", textarea: true, required: true },
          ]}
        />
      </div>
    </>
  );
}
