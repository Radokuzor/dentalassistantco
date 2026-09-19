import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Editorial Policy",
  description: "How DentalAssistantCO researches, sources, reviews and updates its guides to dental assistant careers in Colorado.",
  alternates: { canonical: "/editorial-policy/" },
};

export default function EditorialPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Editorial policy"
        intro="How we research, write and update our guides, and how we keep money from influencing what we publish."
        crumbs={[
          { href: "/about-us/", label: "About" },
          { href: "/editorial-policy/", label: "Editorial policy" },
        ]}
      />
      <Prose>
        <h2>Primary sources first</h2>
        <p>
          Every regulatory, pay or job-outlook claim we publish should trace back to a primary source. The ones we rely on
          most are:
        </p>
        <ul>
          <li>
            <Link href="/resources/#dental-board">
              Colorado Dental Board (DORA)
            </Link>{" "}
            for which tasks assistants may do
          </li>
          <li>
            <Link href="/resources/#danb">
              Dental Assisting National Board (DANB)
            </Link>{" "}
            for exams and state requirement summaries
          </li>
          <li>
            <Link href="/resources/#bls">
              U.S. Bureau of Labor Statistics
            </Link>{" "}
            for pay and employment data
          </li>
          <li>
            <Link href="/resources/#cdhe">
              Colorado Department of Higher Education
            </Link>{" "}
            for school approval and student records
          </li>
          <li>Each school&apos;s own website for tuition, length and schedule, with the date we checked</li>
        </ul>
        <p>
          Salary averages from job boards (Indeed, ZipRecruiter and similar sites) are labeled as estimates and never presented
          as official data.
        </p>

        <h2>Dates and updates</h2>
        <p>
          Every guide shows when it was last updated. We re-check program prices and requirements at least once a year, and
          sooner when the Dental Board changes its rules or BLS releases new data.
        </p>

        <h2>Independence</h2>
        <ul>
          <li>We&apos;re not a school, and we don&apos;t sell training.</li>
          <li>
            Schools and employers may pay us for referrals, but{" "}
            <strong>payment never changes a school&apos;s position, description or data in our comparisons</strong>. Paid
            relationships are listed on our <Link href="/partners/">Partners page</Link>.
          </li>
          <li>
            Our <Link href="/advertising-disclosure/">advertising disclosure</Link> explains affiliate links and ads.
          </li>
        </ul>

        <h2>Original writing only</h2>
        <p>
          This web address previously belonged to a school. We don&apos;t reuse that school&apos;s copy, photos or
          testimonials. Where an older URL still exists, we&apos;ve replaced its content with new, independently written
          material on the same topic. <Link href="/former-aida-students/">Looking for that school?</Link>
        </p>

        <h2>No invented stories</h2>
        <p>
          We don&apos;t publish made-up testimonials, reviews or quotes. If we share someone&apos;s experience, it comes from a
          real person who agreed to be featured.
        </p>

        <h2>Photos</h2>
        <p>
          Photos are stock images from Pexels, credited to their photographers. They show models, not the people in our
          stories.
        </p>

        <h2>Corrections</h2>
        <p>
          Spot something wrong or out of date? <Link href="/contact-us/">Tell us</Link>. We review every correction request.
          When a fix is significant, we update the page and its date.
        </p>
      </Prose>
    </>
  );
}
