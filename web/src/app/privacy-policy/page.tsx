import Link from "next/link";
import type { Metadata } from "next";
import { PageHero, Prose } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How DentalAssistantCO collects, uses and shares information.",
  alternates: { canonical: "/privacy-policy/" },
};

// NOTE: have this reviewed by a lawyer before selling or sharing leads.
export default function Privacy() {
  return (
    <>
      <PageHero title="Privacy policy" intro="Last updated: September 17, 2026" crumbs={[{ href: "/privacy-policy/", label: "Privacy" }]} />
      <Prose>
        <h2>Information we collect</h2>
        <ul>
          <li><strong>Information you give us:</strong> name, email, phone, ZIP code, quiz answers, messages, and (for employers) practice and job details.</li>
          <li><strong>Usage information:</strong> pages viewed, clicks (including where on the page you clicked), scroll depth, time on page, referring site, campaign (UTM) tags, device type, browser language and time zone, and performance measurements.</li>
          <li><strong>Cookies:</strong> if you accept analytics cookies, we set a first-party visitor ID and use Google Analytics (Firebase). We do not use session-recording tools. If you choose &quot;Essential only,&quot; we record only anonymous, cookieless page activity.</li>
          <li><strong>Consent records:</strong> when you agree to be contacted, we store the consent language, time, IP address, browser and page URL as proof of consent.</li>
        </ul>
        <h2>How we use it</h2>
        <p>To answer your requests, match you with programs or candidates, send the information you asked for, improve the site, prevent abuse, and comply with the law.</p>
        <h2>How we share it</h2>
        <p>
          If you check the consent box on a form, we may share your contact information and answers with the schools,
          employers or staffing agencies listed on our <Link href="/partners/">Partners page</Link>, and they may contact you.
          This may count as a &quot;sale&quot; of personal data under some state laws. We also use service providers
          (Google Firebase, Google Analytics, and Telegram for internal notifications) that process data for us.
        </p>
        <h2>Your choices and rights</h2>
        <ul>
          <li>Reply STOP to any text message to opt out of texts, or use the unsubscribe link in any email.</li>
          <li>Colorado and other state residents may request access to, correction of, or deletion of their personal data, and may opt out of its sale or use for targeted advertising.</li>
          <li><strong>Do not sell or share my personal information:</strong> call {site.phone} or email {site.email}, and we&apos;ll process your request within the legal timeframe.</li>
        </ul>
        <h2>Retention and security</h2>
        <p>We keep lead and consent records for as long as needed for the purposes above and for legal compliance (typically up to 5 years). Data is stored in Google Cloud with access limited to our team.</p>
        <h2>Children</h2>
        <p>This site is not directed at children under 13, and we don&apos;t knowingly collect their information.</p>
        <h2>Contact</h2>
        <p>
          {site.name} · <a href={site.phoneHref}>{site.phone}</a> · {site.email}
        </p>
      </Prose>
    </>
  );
}
