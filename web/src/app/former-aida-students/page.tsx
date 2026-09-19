import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Prose } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Looking for the American Institute of Dental Assisting?",
  description:
    "This web address used to belong to the American Institute of Dental Assisting. We're a different, independent organization. Here's where former students can find help with transcripts, records and refunds.",
  alternates: { canonical: "/former-aida-students/" },
};

export default function FormerStudents() {
  return (
    <>
      <PageHero
        eyebrow="Notice"
        title="Looking for the American Institute of Dental Assisting?"
        intro="You've reached DentalAssistantCO, an independent Colorado career guide. We are not the American Institute of Dental Assisting (AIDA) and have no access to its records."
        crumbs={[
          { href: "/about-us/", label: "About" },
          { href: "/former-aida-students/", label: "Former AIDA students" },
        ]}
      />
      <Prose>
        <h2>What happened to this website</h2>
        <p>
          From about 2016 to 2026, dentalassistantco.com was the website of the American Institute of Dental Assisting, a
          school in Colorado Springs. The domain later expired and was registered by a new, unrelated owner. The school&apos;s
          programs, policies, refund terms and contact details that used to appear here no longer apply, and we can&apos;t
          answer questions about them.
        </p>

        <h2>Transcripts, diplomas and enrollment verification</h2>
        <p>
          When a Colorado private occupational school closes, the Colorado Department of Higher Education (CDHE) is the
          state&apos;s repository for student records. Its{" "}
          <strong>Division of Private Occupational Schools (DPOS)</strong> handles transcript and education-verification
          requests.
        </p>
        <ul>
          <li>
            Start at{" "}
            <Link href="/resources/#cdhe-transcripts">
              CDHE transcript requests
            </Link>{" "}
            and submit the online student record request form.
          </li>
          <li>
            CDHE lists a $20 non-refundable fee per request (plus $5 per extra copy) and currently issues electronic
            transcripts. Check its page for current fees.
          </li>
          <li>CDHE notes it doesn&apos;t hold records for every closed school.</li>
          <li>
            Questions: <a href="mailto:DPOS@dhe.state.co.us">DPOS@dhe.state.co.us</a>
          </li>
        </ul>
        <p>
          If the school or one of its campuses is still operating, contact the school directly. We don&apos;t have its
          current contact details and can&apos;t forward messages.
        </p>

        <h2>Refunds, complaints and enrollment agreements</h2>
        <p>
          Refund and financial-hold policies that were posted on this site were the school&apos;s policies, not ours. If you
          have an unresolved issue with a Colorado private occupational school, CDHE&apos;s Division of Private Occupational
          Schools accepts student complaints. See the{" "}
          <Link href="/resources/#cdhe-students">
            CDHE student and consumer FAQ
          </Link>
          .
        </p>

        <h2>DANB exams and x-ray qualification</h2>
        <p>
          If you finished dental assisting training and need to prove you&apos;re qualified to take x-rays, your transcript or
          certificate matters. Once you have your records, read our{" "}
          <Link href="/requirements/">Colorado requirements guide</Link> to see which radiography route applies to you.
        </p>

        <h2>Still want to become a dental assistant?</h2>
        <p>
          If you were planning to enroll, you still have options. Compare{" "}
          <Link href="/programs/dental-assistant/">current Colorado programs</Link>, including{" "}
          <Link href="/locations/colorado-springs/">Colorado Springs schools</Link>, or{" "}
          <Link href="/find-a-program/">take our 60-second match quiz</Link>.
        </p>

        <h2>Contact us</h2>
        <p>
          For questions about <em>this</em> website, call <a href={site.phoneHref}>{site.phone}</a> or use our{" "}
          <Link href="/contact-us/">contact form</Link>. Please don&apos;t send us transcripts, Social Security numbers or
          other student records.
        </p>
      </Prose>
    </>
  );
}
