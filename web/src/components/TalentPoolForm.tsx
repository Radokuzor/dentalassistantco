import { ContactForm } from "@/components/ContactForm";
import { TALENT_POOL_CONSENT } from "@/lib/consent";

/** Candidate side of the two-sided market: job alerts plus a profile Colorado offices can be
 *  matched against (docs/04 revenue stream 3). Nothing here leaves the site. */
export function TalentPoolForm() {
  return (
    <ContactForm
      type="talent_pool"
      cta="Join the Colorado talent pool"
      fields={[
        { name: "firstName", label: "First name", required: true },
        { name: "lastName", label: "Last name" },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "city", label: "City you can work in", required: true, placeholder: "Denver, Aurora, Colorado Springs…" },
        {
          name: "experience",
          label: "Experience",
          options: ["Still in training", "New graduate", "Under 1 year", "1–3 years", "3–5 years", "5+ years"],
          required: true,
        },
        {
          name: "credentials",
          label: "X-ray / certification",
          options: [
            "None yet",
            "Board-approved x-ray training module",
            "DANB RHS (radiation health & safety)",
            "DANB CDA (certified dental assistant)",
            "EDDA / expanded duties",
          ],
        },
        {
          name: "availability",
          label: "Looking for",
          options: ["Full time", "Part time", "Temp / fill-in", "Either full or part time"],
        },
        {
          name: "about",
          label: "Anything an office should know",
          textarea: true,
          placeholder: "Software you know, ortho or oral surgery experience, days you can work, Spanish or another language…",
        },
      ]}
      consent={TALENT_POOL_CONSENT}
    />
  );
}
