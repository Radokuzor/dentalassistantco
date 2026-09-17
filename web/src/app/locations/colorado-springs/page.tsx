import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { programs } from "@/data/programs";

export const metadata: Metadata = {
  title: "Become a Dental Assistant in Colorado Springs",
  description: "Dental assistant training programs, pay, and jobs in Colorado Springs, CO.",
  alternates: { canonical: "/locations/colorado-springs/" },
};

// Template for the programmatic city pages planned in docs/06-content-plan.md.
export default function ColoradoSprings() {
  const local = programs.filter((p) => p.cities.some((c) => c.includes("Colorado Springs")));
  return (
    <>
      <PageHero
        eyebrow="City guide"
        title="Becoming a dental assistant in Colorado Springs"
        intro="Training options, what to expect from local employers, and how to get started in the Pikes Peak region."
        crumbs={[{ href: "/locations/colorado-springs/", label: "Colorado Springs" }]}
      />
      <Prose>
        <h2>Training programs in Colorado Springs</h2>
        <ul>
          {local.map((p) => (
            <li key={p.school}>
              <strong>{p.school}</strong>: {p.weeks ? `${p.weeks} weeks, ` : ""}
              {p.schedule}, {p.tuition}
            </li>
          ))}
        </ul>
        <p>
          Pikes Peak State College also offers healthcare programs. Check its current catalog for dental options. See the{" "}
          <Link href="/programs/dental-assistant/">full Colorado comparison</Link>.
        </p>
        <h2>Military families</h2>
        <p>
          With Fort Carson, Peterson Space Force Base, Schriever and the Air Force Academy nearby, many students are military
          spouses or veterans. Short, weekend-based programs can fit around PCS moves, and dental assisting skills transfer
          between states (check each state&apos;s x-ray rules).
        </p>
        <h2>Find your fit</h2>
        <p>
          <Link href="/find-a-program/">Take the 60-second quiz</Link> or browse <Link href="/jobs/">local jobs</Link>.
        </p>
      </Prose>
    </>
  );
}
