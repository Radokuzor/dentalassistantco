import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Dental Assistant Schools in Denver, CO (2026)",
  description:
    "Dental assistant schools in Denver, Aurora and the Front Range: short weekend programs vs. 9-month college certificates, with costs, x-ray rules and pay.",
  alternates: { canonical: "/locations/denver/" },
};

const METRO = ["Denver", "Aurora", "Longmont", "Greeley"];

export default function Denver() {
  const local = programs.filter((p) => p.cities.some((c) => METRO.some((m) => c.includes(m))));
  const short = local.filter((p) => p.kind === "short");
  const college = local.filter((p) => p.kind === "college");
  return (
    <>
      <PageHero
        eyebrow="City guide · Updated September 2026"
        title="Dental assistant schools in Denver and the Front Range"
        intro="The Denver metro has the most dental assisting options in Colorado. Here's how the short weekend programs compare with longer college certificates, and how to choose."
        crumbs={[
          { href: "/programs/dental-assistant/", label: "Programs" },
          { href: "/locations/denver/", label: "Denver" },
        ]}
      />
      <Prose>
        <h2>Short private programs (8–12 weeks)</h2>
        <p>
          These are Colorado-approved private occupational schools. Classes are usually held on weekends or evenings inside
          working dental offices, so you can keep your current job.
        </p>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Where</th>
              <th>Length</th>
              <th>Schedule</th>
              <th>Tuition*</th>
            </tr>
          </thead>
          <tbody>
            {short.map((p) => (
              <tr key={p.school}>
                <td>
                  <Link href={`/schools/${p.slug}/`}>{p.school}</Link>
                </td>
                <td>{p.cities.join(", ")}</td>
                <td>{p.length}</td>
                <td>{p.schedule}</td>
                <td>{p.tuition}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Career-college certificates (about 8–9 months)</h2>
        <p>
          Career colleges run longer, campus-based programs with an externship. They cost more, but they&apos;re often
          eligible for federal financial aid, and they go deeper into radiography, infection control and chairside skills.
        </p>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Where</th>
              <th>Length</th>
              <th>Format</th>
            </tr>
          </thead>
          <tbody>
            {college.map((p) => (
              <tr key={p.school}>
                <td>
                  <Link href={`/schools/${p.slug}/`}>{p.school}</Link>
                </td>
                <td>{p.cities.join(", ")}</td>
                <td>{p.length}</td>
                <td>{p.schedule}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <small>
            *As published on each school&apos;s website, checked September 17, 2026. Listing a school doesn&apos;t mean we
            partner with it. Confirm dates, prices and what&apos;s included before you pay a deposit.
          </small>
        </p>

        <h2>Which route fits you?</h2>
        <ul>
          <li>
            <strong>You need to keep working:</strong> a weekend or evening program is usually the fastest, cheapest way in.
          </li>
          <li>
            <strong>You need financial aid:</strong> ask career colleges about federal aid. Short private programs usually
            offer payment plans instead.
          </li>
          <li>
            <strong>You want a longer-term healthcare path:</strong> a college certificate can be a stepping stone toward
            DANB&apos;s CDA credential or a later dental hygiene program.
          </li>
        </ul>

        <h2>X-rays: the one rule to check</h2>
        <p>
          Colorado doesn&apos;t license dental assistants, but you need qualifying radiography training (or a qualifying DANB
          exam) before you take x-rays. Ask every Denver school whether its radiography training meets Colorado&apos;s
          requirement and is included in tuition. <Link href="/requirements/">See all Colorado requirements</Link>.
        </p>

        <h2>Working as a dental assistant in Denver</h2>
        <p>
          The Denver–Aurora metro is Colorado&apos;s largest dental job market. It has general dentistry groups, dental
          service organizations (DSOs), orthodontic and oral-surgery specialists, and community health clinics. Pay tends to
          run higher than in smaller Colorado markets, but so do rent and commuting costs. See our{" "}
          <Link href="/blog/dental-assistant-salary-colorado/">Colorado salary guide</Link> and{" "}
          <Link href="/blog/highest-paying-dental-assistant-job/">highest-paying DA jobs</Link>.
        </p>

        <h2>Nearby</h2>
        <p>
          Considering the Springs instead? Read the <Link href="/locations/colorado-springs/">Colorado Springs guide</Link> or
          compare <Link href="/programs/dental-assistant/">every Colorado program</Link>.
        </p>

        <h2>Get matched</h2>
        <p>
          <Link href="/find-a-program/">Take the 60-second quiz</Link> and we&apos;ll point you to the Denver-area programs
          that fit your schedule and budget.
        </p>
      </Prose>
    </>
  );
}
