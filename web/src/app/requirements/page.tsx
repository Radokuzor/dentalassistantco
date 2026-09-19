import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHero, Prose } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Colorado Dental Assistant Requirements (2026)",
  description:
    "Everything Colorado requires of dental assistants: no state license, the x-ray (radiography) rule, DANB options, CPR/BLS, and expanded duties, with official sources.",
  alternates: { canonical: "/requirements/" },
};

const faq = [
  {
    q: "Do I need a license to be a dental assistant in Colorado?",
    a: "No. Colorado doesn't license, register or certify dental assistants. The Colorado Dental Board regulates which tasks a dentist may delegate to an assistant.",
  },
  {
    q: "What do I need before I can take x-rays in Colorado?",
    a: "You need a qualifying route: passing DANB's Radiation Health and Safety (RHS) exam or the full CDA exam, completing a Colorado Dental Board–approved radiography module, or completing a qualifying radiography course in an accredited program. Confirm the current rule with the Colorado Dental Board before you enroll.",
  },
  {
    q: "Is DANB certification required in Colorado?",
    a: "No. DANB certification is optional in Colorado, but the RHS exam is one accepted way to qualify for x-rays, and many employers value DANB credentials.",
  },
  {
    q: "Do I need a high school diploma?",
    a: "The state doesn't set one for dental assistants, but most training programs require you to be 18 or older with a high school diploma or GED, and most employers expect one.",
  },
];

const steps: [string, string][] = [
  ["Meet program entry basics", "Most schools ask for age 18+, a high school diploma or GED, and sometimes immunization records and a background check."],
  ["Get trained (optional but expected)", "The state doesn't require formal training, but most employers prefer it. Programs run from about 8 weeks to 9 months."],
  ["Qualify for x-rays", "Complete one of Colorado's accepted radiography routes before exposing patients to x-rays."],
  ["Get CPR/BLS certified", "Nearly every dental office requires current Basic Life Support (BLS) certification."],
  ["Add credentials over time", "DANB's RHS, ICE or full CDA credentials can help with pay, promotions and moving to another state."],
];

export default function Requirements() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }}
      />
      <PageHero
        eyebrow="Requirements hub · Updated September 2026"
        title="Colorado dental assistant requirements"
        intro="Colorado has some of the most accessible rules in the country for dental assistants. There's no state license, but there is one rule you can't skip."
        crumbs={[{ href: "/requirements/", label: "Requirements" }]}
      />
      <Prose>
        <h2>At a glance</h2>
        <table>
          <tbody>
            <tr>
              <th>State license or registration</th>
              <td>Not required</td>
            </tr>
            <tr>
              <th>Formal training</th>
              <td>Not required by the state; preferred by most employers</td>
            </tr>
            <tr>
              <th>X-ray (radiography) qualification</th>
              <td>
                <strong>Required</strong> before taking x-rays
              </td>
            </tr>
            <tr>
              <th>DANB certification</th>
              <td>Optional (RHS is one way to qualify for x-rays)</td>
            </tr>
            <tr>
              <th>CPR/BLS</th>
              <td>Expected by nearly all employers</td>
            </tr>
            <tr>
              <th>Who regulates the tasks</th>
              <td>
                <Link href="/resources/#dental-board">
                  Colorado Dental Board (DORA)
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <h2>The path, step by step</h2>
        <ol>
          {steps.map(([title, body]) => (
            <li key={title}>
              <strong>{title}.</strong> {body}
            </li>
          ))}
        </ol>

        <h2>The x-ray rule</h2>
        <p>
          Before you expose a patient to x-rays in Colorado, you need one of the state&apos;s accepted radiography
          qualifications. According to{" "}
          <Link href="/resources/#danb-colorado">
            DANB&apos;s Colorado summary
          </Link>
          , the routes include:
        </p>
        <ul>
          <li>Passing DANB&apos;s Radiation Health and Safety (RHS) exam, or the full Certified Dental Assistant (CDA) exam</li>
          <li>Completing a Colorado Dental Board–approved radiography training module</li>
          <li>Completing a qualifying radiography course in an accredited dental assisting program</li>
        </ul>
        <p>
          When you compare schools, ask whether radiography is included in tuition and whether it meets Colorado&apos;s rule.
          Details: <Link href="/blog/dental-assistant-colorado-licensed/">Do dental assistants need a license in Colorado?</Link>
        </p>

        <h2>DANB credentials</h2>
        <p>
          The Dental Assisting National Board (DANB) offers national exams. None are required to work in Colorado, but they
          help. <Link href="/blog/danb-certification-required-colorado/">Is DANB certification required in Colorado?</Link>{" "}
          explains RHS, ICE, NELDA and CDA.
        </p>

        <h2>Expanded duties</h2>
        <p>
          Colorado doesn&apos;t issue a separate expanded-functions license. The Dental Board&apos;s rules decide which advanced
          tasks may be delegated and what training they require. See our{" "}
          <Link href="/programs/expanded-duties-dental-assistant/">EDDA guide</Link>.
        </p>

        <h2>Checking a school</h2>
        <p>
          Private occupational schools in Colorado must be approved by the{" "}
          <Link href="/resources/#cdhe">
            Colorado Department of Higher Education
          </Link>{" "}
          (Division of Private Occupational Schools). Ask any school for its approval status, and read{" "}
          <Link href="/blog/choose-dental-assisting-school-thats-right/">how to choose a dental assisting school</Link>.
        </p>

        <h2>Frequently asked questions</h2>
        {faq.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}

        <p>
          <em>
            This page summarizes public sources and isn&apos;t legal advice. Rules change, so confirm with the Colorado Dental
            Board before you enroll or accept delegated duties. Last reviewed September 17, 2026.
          </em>
        </p>
      </Prose>
    </>
  );
}
