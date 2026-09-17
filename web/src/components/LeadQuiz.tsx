"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getAttribution, getIds, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export const CONSENT_TEXT =
  "By checking this box, I agree that DentalAssistantCO and the partner schools and employers listed on the Partners page may contact me about dental assistant programs and jobs by phone, text message (including autodialed or prerecorded calls/texts) and email at the number and address I provided. Consent is not a condition of any purchase or enrollment. Message and data rates may apply. Reply STOP to opt out.";

type Step = { id: string; question: string; options: string[] };

const STEPS: Step[] = [
  { id: "start", question: "When would you like to start training?", options: ["As soon as possible", "In 1–3 months", "In 3–6 months", "Just researching"] },
  { id: "schedule", question: "Which schedule fits your life?", options: ["Weekends", "Weeknights", "Weekdays", "Online / hybrid"] },
  { id: "budget", question: "What's your training budget?", options: ["Under $3,000", "$3,000–$5,000", "$5,000+", "I need a payment plan"] },
  { id: "eligible", question: "Are you 18+ with a high school diploma or GED?", options: ["Yes", "Not yet"] },
];

type Contact = { firstName: string; lastName: string; email: string; phone: string; zip: string };

export function LeadQuiz({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState<Contact>({ firstName: "", lastName: "", email: "", phone: "", zip: "" });
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const progress = useRef({ started: false, done: false, step: 0 });
  const total = STEPS.length + 1;

  // Record abandonment when the visitor leaves mid-quiz.
  useEffect(() => {
    const onHide = () => {
      const p = progress.current;
      if (document.visibilityState === "hidden" && p.started && !p.done) track("quiz_abandon", { step: p.step });
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const choose = (s: Step, option: string) => {
    if (!progress.current.started) {
      progress.current.started = true;
      track("quiz_start", { location: compact ? "inline" : "page" });
    }
    setAnswers((a) => ({ ...a, [s.id]: option }));
    track("quiz_step", { step: step + 1, step_id: s.id, answer: option });
    progress.current.step = step + 2;
    setStep(step + 1);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problems: string[] = [];
    if (!contact.firstName.trim()) problems.push("first name");
    if (!/^\S+@\S+\.\S+$/.test(contact.email)) problems.push("email");
    if (contact.phone.replace(/\D/g, "").length < 10) problems.push("phone");
    if (!/^\d{5}$/.test(contact.zip)) problems.push("ZIP code");
    if (problems.length) {
      setError(`Please check your ${problems.join(", ")}.`);
      track("form_error", { form_id: "program_match", field: problems.join(",") });
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type: "program_match",
          answers,
          contact,
          consent: consent ? { given: true, text: CONSENT_TEXT } : { given: false },
          attribution: getAttribution(),
          ids: getIds(),
          page: location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      progress.current.done = true;
      track("generate_lead", { form_id: "program_match", start: answers.start, budget: answers.budget, consent });
      router.push("/thanks/program/");
    } catch {
      setError(`Something went wrong. Please try again or call us.`);
      track("form_error", { form_id: "program_match", field: "submit" });
    } finally {
      setSending(false);
    }
  };

  const field = (key: keyof Contact, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</span>
      <input
        {...props}
        value={contact[key]}
        onFocus={() => track("form_start", { form_id: "program_match", field: key })}
        onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))}
        className="mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
    </label>
  );

  const current = STEPS[step];

  return (
    <div className={cn("rounded-3xl border border-line bg-white shadow-[0_24px_60px_-30px_rgba(11,61,58,0.35)]", compact ? "p-5" : "p-6 sm:p-8")} data-section="quiz">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-ink-soft">
        <span>
          Step {Math.min(step + 1, total)} of {total}
        </span>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 hover:text-teal">
            <ArrowLeft className="size-3.5" /> Back
          </button>
        )}
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-deep">
        <div className="h-full rounded-full bg-teal transition-all duration-500" style={{ width: `${((step + 1) / total) * 100}%` }} />
      </div>

      {current ? (
        <div key={current.id} className="rise">
          <h3 className="mt-6 font-display text-2xl leading-tight">{current.question}</h3>
          <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
            {current.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => choose(current, option)}
                className={cn(
                  "group flex items-center justify-between rounded-xl border px-4 py-3.5 text-left font-medium transition",
                  answers[current.id] === option ? "border-teal bg-teal/5" : "border-line hover:border-teal hover:bg-paper",
                )}
              >
                {option}
                <ArrowRight className="size-4 text-teal opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="rise mt-6 space-y-3" noValidate>
          <h3 className="font-display text-2xl leading-tight">Where should we send your matches?</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {field("firstName", "First name", { autoComplete: "given-name", required: true })}
            {field("lastName", "Last name", { autoComplete: "family-name" })}
            {field("email", "Email", { type: "email", autoComplete: "email", required: true })}
            {field("phone", "Phone", { type: "tel", autoComplete: "tel", required: true })}
            {field("zip", "ZIP code", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 5, required: true })}
          </div>
          <label className="flex gap-3 rounded-xl bg-paper p-3 text-xs leading-relaxed text-ink-soft">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-teal" />
            <span>
              {CONSENT_TEXT}{" "}
              <Link href="/partners/" className="text-teal underline">
                Partners
              </Link>{" "}
              ·{" "}
              <Link href="/privacy-policy/" className="text-teal underline">
                Privacy
              </Link>
            </span>
          </label>
          {error && <p className="text-sm font-medium text-coral-deep">{error}</p>}
          <button
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 font-semibold text-white transition hover:bg-coral-deep disabled:opacity-60"
          >
            {sending ? "Sending…" : "See my program matches"} <Check className="size-4" />
          </button>
        </form>
      )}
    </div>
  );
}
