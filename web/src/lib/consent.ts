// Exact consent wording for every form on the site. Whatever string is shown to the visitor is
// stored verbatim with the submission (functions/src/index.ts), so a disclosure can be proven later.
// TCPA-wise the school and job forms name the ONE organization the request goes to, rather than
// leaning on a blanket "our partners" list. Don't reword these without reading docs/04 § Compliance.

export const QUIZ_CONSENT =
  "By checking this box, I agree that DentalAssistantCO and the partner schools and employers listed on the Partners page may contact me about dental assistant programs and jobs by phone, text message (including autodialed or prerecorded calls/texts) and email at the number and address I provided. Consent is not a condition of any purchase or enrollment. Message and data rates may apply. Reply STOP to opt out.";

/** One school, named. Used on /schools/<slug>/. */
export const schoolConsent = (school: string) =>
  `By checking this box, I ask DentalAssistantCO to send my request to ${school}, and I agree that ${school} and DentalAssistantCO may contact me about dental assistant training by phone, text message (including autodialed or prerecorded calls/texts) and email at the number and address I provided. Consent is not a condition of enrollment or of any purchase. Message and data rates may apply. Reply STOP to opt out.`;

/** One employer, named. Used on /jobs/<slug>/. */
export const applicationConsent = (employer: string) =>
  `By checking this box, I ask DentalAssistantCO to send my application to ${employer}, and I agree that ${employer} and DentalAssistantCO may contact me about this job by phone, text message and email at the number and address I provided. Consent is not a condition of any purchase. Message and data rates may apply. Reply STOP to opt out.`;

/** Talent pool: employers we vet, plus job alerts. */
export const TALENT_POOL_CONSENT =
  "By checking this box, I agree that DentalAssistantCO may email me new Colorado dental assistant openings, and may share my profile with Colorado dental offices hiring for roles that match it so they can contact me by phone, text message and email. Consent is not a condition of any purchase. Message and data rates may apply. I can ask to be removed at any time by replying STOP or emailing hello@dentalassistantco.com.";
