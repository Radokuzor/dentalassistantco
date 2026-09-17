import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Colorado Needs More Dental Assistants",
  description: "Why Colorado dental offices keep hiring assistants, where the jobs are, and how to get trained quickly.",
  alternates: { canonical: "/colorado-needs-dental-assistants/" },
};

export default function Demand() {
  return (
    <>
      <PageHero
        eyebrow="Job outlook"
        title="Colorado needs more dental assistants"
        intro="Dental offices across the Front Range and beyond keep hiring assistants, and it's one of the fastest routes into healthcare."
        crumbs={[{ href: "/colorado-needs-dental-assistants/", label: "Colorado demand" }]}
      />
      <Prose>
        <h2>Why demand stays strong</h2>
        <ul>
          <li>
            The U.S. Bureau of Labor Statistics projects steady national growth for dental assistants, with tens of thousands of
            openings each year as people change careers or retire (<a href="https://www.bls.gov/ooh/healthcare/dental-assistants.htm" rel="noopener" target="_blank">BLS Occupational Outlook</a>).
          </li>
          <li>Colorado&apos;s population growth along the Front Range brings new dental practices and more patients.</li>
          <li>Dentists increasingly rely on assistants for x-rays, digital scanning, sterilization and patient communication.</li>
        </ul>
        <h2>Where the jobs are</h2>
        <p>
          Most openings are in the Denver–Aurora metro area, Colorado Springs, Fort Collins–Loveland, Boulder–Longmont, Greeley
          and Pueblo. Specialty offices (orthodontics, oral surgery, pediatrics) often pay more.
        </p>
        <h2>Next steps</h2>
        <ul>
          <li><Link href="/blog/dental-assistant-salary-colorado/">See what dental assistants earn in Colorado</Link></li>
          <li><Link href="/programs/dental-assistant/">Compare Colorado training programs</Link></li>
          <li><Link href="/find-a-program/">Get matched with a program</Link></li>
        </ul>
      </Prose>
    </>
  );
}
