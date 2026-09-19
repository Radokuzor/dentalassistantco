"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAttribution, getIds, track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export type Field = {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
  /** Renders a <select> instead of an input. */
  options?: string[];
  placeholder?: string;
  help?: string;
  /** Force the field to span the full width of the two-column grid. */
  full?: boolean;
};

export type LeadType = "contact" | "employer" | "story" | "school_inquiry" | "job_application" | "talent_pool";

/** Where each form sends people afterwards (see web/src/app/thanks/[type]/page.tsx). */
const THANKS: Record<LeadType, string> = {
  contact: "contact",
  employer: "employer",
  story: "story",
  school_inquiry: "school",
  job_application: "job",
  talent_pool: "talent-pool",
};

const EVENT: Record<LeadType, string> = {
  contact: "generate_lead",
  employer: "job_post_submit",
  story: "story_submit",
  school_inquiry: "generate_lead",
  job_application: "job_application_submit",
  talent_pool: "talent_pool_join",
};

/** Generic lead form behind every on-site capture: /contact-us/, /hire/, /stories/,
 *  the school profiles, the job application and the talent pool.
 *  `consent` renders a required checkbox whose exact wording is stored with the submission (TCPA).
 *  `answers` carries the context of the submission (which school, which job) into Firestore. */
export function ContactForm({
  type,
  fields,
  cta,
  consent,
  answers,
  intro,
}: {
  type: LeadType;
  fields: Field[];
  cta: string;
  consent?: string;
  answers?: Record<string, string>;
  intro?: React.ReactNode;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => f.label.toLowerCase());
    if (consent && !agreed) missing.push("the permission checkbox");
    if (missing.length) {
      setError(`Please fill in: ${missing.join(", ")}.`);
      track("form_error", { form_id: type, field: missing.join(",") });
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          contact: values,
          answers,
          consent: consent ? { given: agreed, text: consent } : undefined,
          attribution: getAttribution(),
          ids: getIds(),
          page: location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track(EVENT[type], { form_id: type, ...answers });
      router.push(`/thanks/${THANKS[type]}/`);
    } catch {
      setError("Something went wrong. Please try again or call us.");
      track("form_error", { form_id: type, field: "submit" });
    } finally {
      setSending(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-base outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

  return (
    <form onSubmit={submit} noValidate className="space-y-3 rounded-3xl border border-line bg-white p-6 sm:p-8" data-section={`form_${type}`}>
      {intro}
      <div className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => {
          const props = {
            name: f.name,
            value: values[f.name] ?? "",
            onFocus: () => {
              if (!started) track("form_start", { form_id: type });
              setStarted(true);
            },
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
              setValues((v) => ({ ...v, [f.name]: e.target.value })),
            className: inputClass,
          };
          return (
            <label key={f.name} className={cn("block", (f.textarea || f.full) && "sm:col-span-2")}>
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
                {f.label}
                {f.required && " *"}
              </span>
              {f.textarea ? (
                <textarea rows={4} placeholder={f.placeholder} {...props} />
              ) : f.options ? (
                <select {...props}>
                  <option value="">Choose one…</option>
                  {f.options.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input type={f.type ?? "text"} placeholder={f.placeholder} {...props} />
              )}
              {f.help && <span className="mt-1 block text-xs text-ink-soft">{f.help}</span>}
            </label>
          );
        })}
      </div>
      {consent && (
        <label className="flex gap-3 rounded-xl bg-paper p-3 text-xs leading-relaxed text-ink-soft">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-teal" />
          <span>{consent}</span>
        </label>
      )}
      {error && <p className="text-sm font-medium text-coral-deep">{error}</p>}
      <button disabled={sending} className="w-full rounded-full bg-teal px-6 py-3.5 font-semibold text-white transition hover:bg-teal-deep disabled:opacity-60">
        {sending ? "Sending…" : cta}
      </button>
    </form>
  );
}
