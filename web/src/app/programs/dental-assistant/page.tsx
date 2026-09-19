import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Dental Assistant Programs in Colorado (2026 Comparison)",
  description: "Compare Colorado dental assistant programs by cost, length, schedule and location, plus the questions to ask before you enroll.",
  alternates: { canonical: "/programs/dental-assistant/" },
};

export default function Programs() {
  return (
    <>
      <PageHero
        eyebrow="Updated September 2026"
        title="Dental assistant programs in Colorado, compared"
        intro="Private Colorado programs typically take 8–12 weeks and cost a few thousand dollars; career colleges take about 9 months. Here's how the options stack up, and what to ask before you pay a deposit."
        crumbs={[{ href: "/programs/dental-assistant/", label: "Programs" }]}
      />
      <Prose>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>Location</th>
              <th>Length</th>
              <th>Schedule</th>
              <th>Tuition*</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
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
        <p>
          <small>
            *As published on each school&apos;s website, checked September 17, 2026. Listing a school doesn&apos;t mean we partner
            with it. Every school name above opens its profile here on DentalAssistantCO, where you can see the details and ask
            the school a question without leaving the site.
          </small>
        </p>

        <p>
          By city: <Link href="/locations/denver/">Denver &amp; Front Range</Link> ·{" "}
          <Link href="/locations/colorado-springs/">Colorado Springs</Link>. New to this? Read{" "}
          <Link href="/blog/choose-dental-assisting-school-thats-right/">how to choose a school</Link>.
        </p>

        <h2>Short programs vs. college certificates</h2>
        <p>
          Private occupational schools run short, hands-on programs, often on weekends. Community colleges offer longer
          certificate programs that may be accredited by the Commission on Dental Accreditation (CODA) and lead more
          directly to DANB&apos;s CDA exam. Colorado doesn&apos;t license dental assistants, so either route can get you
          hired. The right choice depends on your time, budget, and long-term goals.
        </p>

        <h2>10 questions to ask any program</h2>
        <ol>
          <li>Is the school approved by the Colorado Department of Higher Education (Private Occupational School Board)?</li>
          <li>Does tuition include the radiography (x-ray) training Colorado requires?</li>
          <li>How many hours are hands-on, and are they with real patients?</li>
          <li>Is there an externship, and do you place me?</li>
          <li>Are CPR/BLS, scrubs, books and exam fees included?</li>
          <li>What&apos;s the total cost, and what payment plans are available?</li>
          <li>What is the refund policy if I withdraw?</li>
          <li>What percentage of graduates are working as dental assistants 6 months later?</li>
          <li>Who are the instructors, and are they currently working in dentistry?</li>
          <li>Can I talk to a recent graduate?</li>
        </ol>

        <p>
          Not sure where to start? <Link href="/find-a-program/">Take the 60-second match quiz</Link>.
        </p>
      </Prose>
    </>
  );
}
