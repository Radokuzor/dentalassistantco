import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Briefcase, GraduationCap, Radiation, Stethoscope } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { LeadQuiz } from "@/components/LeadQuiz";
import { allStories, Stories } from "@/components/Stories";
import { programs } from "@/data/programs";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const trail = [
  { icon: GraduationCap, elev: "Step 1", title: "Pick a program", body: "Colorado programs run about 10–13 weeks, many on weekends or evenings so you can keep your job." },
  { icon: Radiation, elev: "Step 2", title: "Get x-ray qualified", body: "Colorado requires approved radiography training (or DANB RHS) before you take x-rays." },
  { icon: Stethoscope, elev: "Step 3", title: "Train chairside", body: "Hands-on clinical hours and an externship are what employers look for." },
  { icon: Briefcase, elev: "Step 4", title: "Get hired", body: "Colorado doesn't license dental assistants, so skills and references get you hired." },
];

const faqs = [
  {
    q: "Do you need a license to be a dental assistant in Colorado?",
    a: "No. Colorado doesn't license or register dental assistants. The Colorado Dental Board regulates which tasks assistants may perform under a dentist's supervision. Taking x-rays requires approved radiography training or passing the DANB RHS exam.",
  },
  {
    q: "How long does dental assistant training take in Colorado?",
    a: "Most private Colorado programs take about 10 to 13 weeks, often on weekends or evenings. College certificate programs usually take 9 to 12 months.",
  },
  {
    q: "How much does a dental assistant program cost in Colorado?",
    a: "Private Colorado programs we reviewed list tuition from about $3,250 to $4,000, and some programs have historically charged closer to $6,000. Always ask what's included: radiography, CPR/BLS, scrubs, and exam fees.",
  },
  {
    q: "Is DentalAssistantCO a school?",
    a: "No. We're an independent guide. We compare programs, publish salary and requirement data, and connect people with schools and employers.",
  },
];

export default function Home() {
  const posts = getPosts().slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />

      {/* HERO */}
      <section className="grain relative overflow-hidden" data-section="hero">
        <div className="topo absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
          <div>
            <p className="rise inline-flex items-center gap-2 rounded-full border border-teal/30 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal">
              <span className="size-1.5 rounded-full bg-coral" /> Colorado · Updated 2026
            </p>
            <h1 className="rise rise-1 mt-6 font-display text-[2.6rem] leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Become a dental assistant in Colorado in about{" "}
              <em className="relative whitespace-nowrap font-normal text-teal">
                13 weeks
                <svg viewBox="0 0 200 12" className="absolute -bottom-2 left-0 w-full text-coral" aria-hidden>
                  <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </em>
              .
            </h1>
            <p className="rise rise-2 mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
              Honest, independent answers about Colorado programs, costs, x-ray rules, pay and jobs. Then get matched with a
              program that fits your schedule.
            </p>
            <div className="rise rise-3 mt-8 flex flex-wrap gap-3">
              <Link
                href="/find-a-program/"
                data-track="cta"
                data-track-id="hero_find_program"
                className="rounded-full bg-coral px-7 py-3.5 font-semibold text-white shadow-lg shadow-coral/25 transition hover:-translate-y-0.5 hover:bg-coral-deep"
              >
                Find my program →
              </Link>
              <Link
                href="/blog/dental-assistant-salary-colorado/"
                data-track="cta"
                data-track-id="hero_salary"
                className="rounded-full border border-ink/15 bg-white px-7 py-3.5 font-semibold transition hover:border-teal"
              >
                See Colorado pay
              </Link>
            </div>
            <dl className="rise rise-4 mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["10–13", "weeks, typical"],
                ["$3.2k+", "typical tuition"],
                ["0", "state licenses required"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-teal-deep">{v}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider text-ink-soft">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise rise-2 relative">
            <div className="absolute -right-6 -top-6 h-full w-full rounded-[2rem] border-2 border-teal/25" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src="/images/hero-assistant.jpg"
                alt="Dental assistant using a curing light while a colleague prepares instruments"
                width={1880}
                height={1253}
                priority
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 max-w-[15rem] rounded-2xl bg-teal-deep p-4 text-paper shadow-xl sm:-left-10">
              <p className="text-xs uppercase tracking-widest text-mint">Colorado rule</p>
              <p className="mt-1 text-sm leading-snug">No state license for assistants, but x-rays need approved training.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TRAIL MAP */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" data-section="trail">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-deep">The trail</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl leading-tight">Four switchbacks from “curious” to “hired.”</h2>
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <svg className="absolute left-0 top-7 hidden h-8 w-full md:block" preserveAspectRatio="none" viewBox="0 0 100 10" aria-hidden>
            <path d="M0 8 L25 3 L50 7 L75 2 L100 5" fill="none" stroke="var(--teal)" strokeWidth="0.4" strokeDasharray="1.2 1.2" />
          </svg>
          {trail.map(({ icon: Icon, elev, title, body }) => (
            <li key={title} className="relative">
              <span className="relative z-10 grid size-14 place-items-center rounded-2xl bg-teal text-paper shadow-lg">
                <Icon className="size-6" aria-hidden />
              </span>
              <p className="mt-5 text-xs font-bold uppercase tracking-widest text-ink-soft">{elev}</p>
              <h3 className="mt-1 font-display text-2xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* QUIZ */}
      <section className="bg-paper-deep/70" data-section="quiz_home">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-deep">60-second match</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">Which Colorado program fits your life?</h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Answer four quick questions about timing, schedule and budget. We&apos;ll show you the programs worth a call and
              the questions to ask them.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Free and independent", "No obligation", "Weekend and evening options"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-teal" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <LeadQuiz compact />
        </div>
      </section>

      {/* PROGRAM COMPARISON */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" data-section="compare">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral-deep">Side by side</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">Colorado programs, compared</h2>
          </div>
          <Link href="/programs/dental-assistant/" className="flex items-center gap-1 font-semibold text-teal">
            Full comparison <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-8 overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-paper-deep text-xs uppercase tracking-wider text-ink-soft">
              <tr>
                {["School", "Where", "Length", "Schedule", "Tuition*"].map((h) => (
                  <th key={h} className="px-5 py-3 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {programs.map((p) => (
                <tr key={p.school} className="border-t border-line">
                  <td className="px-5 py-4 font-semibold">
                    <Link href={`/schools/${p.slug}/`} data-track="school_row" data-track-id={p.slug} className="hover:text-teal hover:underline">
                      {p.school}
                    </Link>
                  </td>
                  <td className="px-5 py-4">{p.cities.join(", ")}</td>
                  <td className="px-5 py-4">{p.length}</td>
                  <td className="px-5 py-4">{p.schedule}</td>
                  <td className="px-5 py-4 font-display text-lg text-teal-deep">{p.tuition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-ink-soft">*As listed on each school&apos;s website, checked September 2026. Confirm with the school before enrolling.</p>
      </section>

      {/* JOBS / EMPLOYERS */}
      <section className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 md:grid-cols-2" data-section="work">
        <Link href="/jobs/" className="group relative overflow-hidden rounded-[2rem] bg-teal-deep p-8 text-paper sm:p-10">
          <div className="topo absolute inset-0 opacity-50" aria-hidden />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-mint">For assistants</p>
            <h2 className="mt-3 font-display text-3xl">Colorado dental assistant jobs</h2>
            <p className="mt-3 max-w-sm text-paper/75">New openings from Colorado Springs to Fort Collins, with pay listed up front.</p>
            <span className="mt-8 inline-flex items-center gap-1 font-semibold text-mint group-hover:gap-2">
              Browse jobs <ArrowUpRight className="size-4" />
            </span>
          </div>
        </Link>
        <Link href="/hire/" className="group relative overflow-hidden rounded-[2rem] bg-coral p-8 text-white sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">For dental offices</p>
          <h2 className="mt-3 font-display text-3xl">Need an assistant this month?</h2>
          <p className="mt-3 max-w-sm text-white/85">Post a job or tell us who you need. We&apos;ll connect you with trained candidates.</p>
          <span className="mt-8 inline-flex items-center gap-1 font-semibold group-hover:gap-2">
            Hire an assistant <ArrowUpRight className="size-4" />
          </span>
        </Link>
      </section>

      {/* STORIES (hidden until src/data/stories.json has entries) */}
      {allStories.length > 0 && (
        <div className="pt-20">
          <Stories limit={3} heading="From Colorado assistants and offices" />
        </div>
      )}

      {/* GUIDES */}
      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6" data-section="guides">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-4xl leading-tight">Straight-talk guides</h2>
            <Link href="/blog/" className="flex items-center gap-1 font-semibold text-teal">
              All guides <ArrowUpRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="group rounded-3xl border border-line bg-white p-6 transition hover:-translate-y-1 hover:shadow-xl">
                <p className="text-xs font-bold uppercase tracking-widest text-coral-deep">{p.cluster}</p>
                <h3 className="mt-3 font-display text-xl leading-snug group-hover:text-teal">{p.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm text-ink-soft">{p.description}</p>
                <p className="mt-5 text-xs text-ink-soft">{p.readingMinutes} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 pb-8 sm:px-6" data-section="faq">
        <h2 className="font-display text-4xl leading-tight">Quick answers</h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold">
                {f.q}
                <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-sm text-ink-soft">
          Still have questions? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-teal">
            {site.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
