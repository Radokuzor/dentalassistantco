import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, GraduationCap, MapPin, ShieldCheck, Wallet } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { SchoolGrid } from "@/components/SchoolCard";
import { programs, programBySlug, relatedPrograms, type Program } from "@/data/programs";
import { schoolConsent } from "@/lib/consent";
import { site } from "@/lib/site";

export const dynamicParams = false;
export const generateStaticParams = () => programs.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = programBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.school} — Cost, Length & Schedule (2026)`,
    description: `${p.summary} Compare it with every other Colorado dental assistant program and ask your questions here.`,
    alternates: { canonical: `/schools/${p.slug}/` },
  };
}

/** True of the whole format, not of any one school — never put unverified school claims here. */
const FORMAT_NOTES: Record<Program["kind"], { label: string; body: string; watch: string }> = {
  short: {
    label: "Private occupational school",
    body: "Short Colorado programs run 8 to 12 weeks, usually on Saturdays or weeknights, and are taught inside working dental offices rather than on a campus. You pay tuition directly, often in instalments. These schools are approved by the Colorado Department of Higher Education's Private Occupational School Board, but are generally not eligible for federal financial aid and usually aren't CODA-accredited.",
    watch:
      "Ask whether the price includes the radiography training Colorado requires, plus CPR/BLS, scrubs and exam fees. The headline number often doesn't.",
  },
  college: {
    label: "Career / technical college",
    body: "Career-college certificates take roughly eight to nine months, meet on a campus, and normally include a supervised externship in a real practice. Because these schools are accredited, students who qualify can use federal financial aid, and the longer program lines up more neatly with DANB's Certified Dental Assistant exam.",
    watch:
      "Ask for the total cost of attendance in writing rather than the per-term figure, and ask what share of graduates are working as dental assistants six months out.",
  },
};

const QUESTIONS = [
  "Is the program approved by the Colorado Department of Higher Education (Private Occupational School Board)?",
  "Does tuition include the radiography (x-ray) training Colorado requires before you can take x-rays?",
  "How many hours are hands-on, and are any of them with real patients?",
  "Is there an externship, and do you help with placement?",
  "Are CPR/BLS, scrubs, books and exam fees included in the price?",
  "What is the refund policy if I withdraw in the first week?",
  "What share of last year's graduates are working as dental assistants today?",
  "Can I speak to a recent graduate before I pay a deposit?",
];

export default async function School({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = programBySlug(slug);
  if (!p) notFound();

  const format = FORMAT_NOTES[p.kind];
  const priced = programs.filter((o) => o.tuitionFrom > 0);
  const cheapest = p.tuitionFrom > 0 && Math.min(...priced.map((o) => o.tuitionFrom)) === p.tuitionFrom;
  const facts: { icon: typeof Clock; term: string; value: string }[] = [
    { icon: Clock, term: "Length", value: p.length === "See school" ? "Not published — ask below" : p.length },
    { icon: CalendarDays, term: "Schedule", value: p.schedule },
    { icon: Wallet, term: "Tuition", value: p.tuition },
    { icon: MapPin, term: "Where", value: p.cities.join(", ") },
    { icon: GraduationCap, term: "Type of school", value: format.label },
    { icon: ShieldCheck, term: "Our relationship", value: p.partner ? "Paid partner — see disclosure" : "None. We list it independently" },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOccupationalProgram",
          name: `Dental Assistant program — ${p.school}`,
          url: `${site.url}/schools/${p.slug}/`,
          provider: {
            "@type": "EducationalOrganization",
            name: p.school,
            url: p.url,
            areaServed: p.cities.map((c) => ({ "@type": "City", name: c })),
          },
          occupationalCategory: "31-9091 Dental Assistants",
          programType: "Certificate",
          timeToComplete: p.length,
        }}
      />
      <PageHero
        eyebrow={`Colorado school profile · verified ${p.checked}`}
        title={p.school}
        intro={p.summary}
        crumbs={[
          { href: "/programs/dental-assistant/", label: "Schools" },
          { href: `/schools/${p.slug}/`, label: p.school },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {cheapest && (
          <p className="mb-6 inline-flex rounded-full bg-mint/30 px-4 py-1.5 text-sm font-semibold text-teal-deep">
            Lowest published tuition of the Colorado programs we track
          </p>
        )}

        <dl className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2" data-section="school_facts">
          {facts.map(({ icon: Icon, term, value }) => (
            <div key={term} className="bg-white p-5">
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                <Icon className="size-3.5 text-teal" aria-hidden /> {term}
              </dt>
              <dd className="mt-1.5 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs text-ink-soft">
          Taken from the school&apos;s own published materials and checked on {p.checked}. Prices change, so confirm the
          current figure before you pay anything. If something here is out of date,{" "}
          <Link href="/contact-us/" className="text-teal underline">
            tell us
          </Link>{" "}
          and we&apos;ll fix it.
        </p>

        <h2 className="mt-12 font-display text-2xl">What this kind of program means</h2>
        <p className="mt-3 leading-relaxed text-ink-soft">{format.body}</p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          <strong className="text-ink">Watch for:</strong> {format.watch}
        </p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          Whichever school you pick, Colorado doesn&apos;t license or register dental assistants — the Dental Board regulates
          the tasks you may perform, and taking x-rays needs DANB certification, a Board-approved training module, or an
          accredited program&apos;s radiology course. Read the{" "}
          <Link href="/requirements/" className="font-medium text-teal underline">
            Colorado requirements in full
          </Link>
          .
        </p>

        <h2 className="mt-12 font-display text-2xl">Questions to ask before you enroll</h2>
        <ol className="mt-4 space-y-2.5">
          {QUESTIONS.map((q, i) => (
            <li key={q} className="flex gap-3 rounded-xl border border-line bg-white p-3.5 text-sm leading-relaxed">
              <span className="font-display text-teal">{i + 1}</span>
              <span>{q}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-ink-soft">
          Not sure which of these matter most for you? Send them with your request below and we&apos;ll chase the answers.
        </p>

        <section className="mt-12 scroll-mt-24" id="ask">
          <h2 className="font-display text-2xl">Ask {p.school} a question</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Tell us what you need to know — start dates, payment plans, whether x-ray training is included — and we&apos;ll
            get you an answer. No hunting through a school website, no sitting through a sales call to get a price.
          </p>
          <div className="mt-5">
            <ContactForm
              type="school_inquiry"
              cta="Send my question"
              answers={{ school: p.school, schoolSlug: p.slug, city: p.cities[0] }}
              consent={schoolConsent(p.school)}
              fields={[
                { name: "firstName", label: "First name", required: true },
                { name: "lastName", label: "Last name" },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                { name: "zip", label: "ZIP code", placeholder: "80202" },
                ...(p.cities.length > 1 ? [{ name: "campus", label: "Which location?", options: p.cities }] : []),
                {
                  name: "start",
                  label: "When would you like to start?",
                  options: ["As soon as possible", "In 1–3 months", "In 3–6 months", "Just researching"],
                },
                {
                  name: "question",
                  label: "What do you want to know?",
                  textarea: true,
                  placeholder:
                    "e.g. Does the price include x-ray training? Is there a payment plan? When does the next class start?",
                },
              ]}
            />
          </div>
        </section>

        <h2 className="mt-12 font-display text-2xl">Compare with other Colorado programs</h2>
        <div className="mt-4">
          <SchoolGrid programs={relatedPrograms(p)} />
        </div>
        <p className="mt-4 text-sm">
          <Link href="/programs/dental-assistant/" className="font-medium text-teal underline">
            See every Colorado dental assistant program side by side
          </Link>{" "}
          ·{" "}
          <Link href="/find-a-program/" className="font-medium text-teal underline">
            Take the 60-second match quiz
          </Link>
        </p>

        <p className="mt-10 rounded-2xl bg-paper-deep p-5 text-xs leading-relaxed text-ink-soft">
          DentalAssistantCO is independent. We are not {p.school}, we don&apos;t run training, and we&apos;re not affiliated
          with the American Institute of Dental Assisting. Listing a school is not an endorsement.{" "}
          {p.partner
            ? "This school is a paid partner, so we may be compensated when you request information."
            : "This school does not pay us. If that ever changes, this line changes with it and the school appears on our Partners page."}{" "}
          <Link href="/advertising-disclosure/" className="text-teal underline">
            Advertising disclosure
          </Link>{" "}
          ·{" "}
          <Link href="/editorial-policy/" className="text-teal underline">
            Editorial policy
          </Link>
        </p>
      </div>
    </>
  );
}
