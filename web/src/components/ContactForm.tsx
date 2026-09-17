"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getAttribution, getIds, track } from "@/lib/analytics";

type Field = { name: string; label: string; type?: string; required?: boolean; textarea?: boolean };

/** Generic lead form used by /contact-us/ (type "contact") and /hire/ (type "employer"). */
export function ContactForm({ type, fields, cta }: { type: "contact" | "employer"; fields: Field[]; cta: string }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missing = fields.filter((f) => f.required && !values[f.name]?.trim()).map((f) => f.label.toLowerCase());
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
        body: JSON.stringify({ type, contact: values, attribution: getAttribution(), ids: getIds(), page: location.href }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track(type === "employer" ? "job_post_submit" : "generate_lead", { form_id: type });
      router.push(`/thanks/${type}/`);
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
      {fields.map((f) => (
        <label key={f.name} className="block">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {f.label}
            {f.required && " *"}
          </span>
          {(() => {
            const props = {
              name: f.name,
              value: values[f.name] ?? "",
              onFocus: () => {
                if (!started) track("form_start", { form_id: type });
                setStarted(true);
              },
              onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setValues((v) => ({ ...v, [f.name]: e.target.value })),
              className: inputClass,
            };
            return f.textarea ? <textarea rows={4} {...props} /> : <input type={f.type ?? "text"} {...props} />;
          })()}
        </label>
      ))}
      {error && <p className="text-sm font-medium text-coral-deep">{error}</p>}
      <button disabled={sending} className="w-full rounded-full bg-teal px-6 py-3.5 font-semibold text-white transition hover:bg-teal-deep disabled:opacity-60">
        {sending ? "Sending…" : cta}
      </button>
    </form>
  );
}
