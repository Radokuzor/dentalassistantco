import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Expanded Duties Dental Assistant (EDDA) in Colorado",
  description: "What expanded-duties dental assistants do, how the Colorado Dental Board handles delegated duties, and how to move up from a basic DA role.",
  alternates: { canonical: "/programs/expanded-duties-dental-assistant/" },
};

export default function Edda() {
  return (
    <>
      <PageHero
        eyebrow="Career growth"
        title="Expanded duties dental assisting (EDDA) in Colorado"
        intro="Expanded duties can mean more responsibility and higher pay. Here's how it works, and why Colorado's rules differ from many other states'."
        crumbs={[
          { href: "/programs/dental-assistant/", label: "Programs" },
          { href: "/programs/expanded-duties-dental-assistant/", label: "EDDA" },
        ]}
      />
      <Prose>
        <h2>What “expanded duties” means</h2>
        <p>
          Across the U.S., titles like EDDA, EFDA (Expanded Functions Dental Assistant) and RDAEF describe assistants who are
          allowed to do more than basic chairside support, often including placing and finishing certain restorations,
          applying sealants, or taking final impressions. Each state decides which tasks can be delegated and what training
          is required.
        </p>
        <h2>How Colorado handles it</h2>
        <p>
          Colorado doesn&apos;t license or register dental assistants. Instead, the Colorado Dental Board&apos;s rules
          define which tasks a dentist may delegate, the level of supervision, and any training certain tasks require. The
          best-known requirement is <strong>radiography</strong>: before taking x-rays, an assistant needs Board-approved
          training or a qualifying DANB exam.
        </p>
        <p>
          Because the rules change, always check the current{" "}
          <Link href="/resources/#dental-board">
            Colorado Dental Board rules
          </Link>{" "}
          and{" "}
          <Link href="/resources/#danb-colorado">
            DANB&apos;s Colorado page
          </Link>{" "}
          before taking a course that promises a specific expanded-duty credential.
        </p>
        <h2>How to grow into expanded duties</h2>
        <ol>
          <li>Get hired as a dental assistant and learn chairside basics.</li>
          <li>Earn national credentials, such as DANB&apos;s RHS, ICE or full CDA certification.</li>
          <li>Take continuing education in the skills your office wants to delegate.</li>
          <li>Ask your dentist to document your training for each delegated task.</li>
        </ol>
        <p>
          Related: <Link href="/blog/understanding-the-role-of-expanded-duties-dental-assistants-edda/">Understanding the EDDA role</Link> ·{" "}
          <Link href="/blog/highest-paying-dental-assistant-job/">Highest-paying dental assistant jobs</Link>
        </p>
      </Prose>
    </>
  );
}
