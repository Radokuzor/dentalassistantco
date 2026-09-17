"use client";

// Analytics core. Every event goes to our own `collect` function (first-party log in Firestore),
// including click positions used for heatmaps. No third-party trackers besides Firebase Analytics (GA4),
// which loads only after the visitor accepts analytics cookies.
// Event names and params are documented in docs/07-analytics-plan.md.

import type { Analytics } from "firebase/analytics";
import { firebaseApp } from "./firebase";

type Params = Record<string, string | number | boolean | undefined>;
export type Consent = "granted" | "denied";

const VID_COOKIE = "dac_vid";
const SID_KEY = "dac_sid";
const ATTR_KEY = "dac_attr";
const CONSENT_KEY = "dac_consent";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const COLLECT_URL = "/api/collect/";
const ATTR_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid", "msclkid"];

const safe = <T>(fn: () => T, fallback: T): T => {
  try {
    return fn();
  } catch {
    return fallback;
  }
};

const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export const getConsent = (): Consent | null =>
  safe(() => localStorage.getItem(CONSENT_KEY) as Consent | null, null);

/** Anonymous visitor id — persisted in a first-party cookie only after consent. */
function getVid(): string {
  if (getConsent() !== "granted") return "anon";
  const match = document.cookie.match(new RegExp(`${VID_COOKIE}=([^;]+)`));
  if (match) return match[1];
  const vid = uuid();
  document.cookie = `${VID_COOKIE}=${vid}; Max-Age=${60 * 60 * 24 * 395}; Path=/; SameSite=Lax; Secure`;
  return vid;
}

/** Session id — rotates after 30 minutes of inactivity. */
function getSid(): { sid: string; isNew: boolean } {
  return safe(
    () => {
      const now = Date.now();
      const stored = JSON.parse(sessionStorage.getItem(SID_KEY) || "null") as { id: string; last: number } | null;
      const isNew = !stored || now - stored.last > SESSION_TIMEOUT_MS;
      const id = isNew ? uuid() : stored!.id;
      sessionStorage.setItem(SID_KEY, JSON.stringify({ id, last: now }));
      return { sid: id, isNew };
    },
    { sid: "nosession", isNew: false },
  );
}

/** First-touch attribution, saved once and attached to every lead. */
export function captureAttribution() {
  const url = new URL(location.href);
  const touch: Params = { landing: url.pathname, referrer: document.referrer || "(direct)", ts: new Date().toISOString() };
  for (const key of ATTR_PARAMS) {
    const value = url.searchParams.get(key);
    if (value) touch[key] = value;
  }
  safe(() => {
    if (!localStorage.getItem(ATTR_KEY)) localStorage.setItem(ATTR_KEY, JSON.stringify(touch));
    // Last paid/campaign touch is kept per session so returning visitors are attributed too.
    if (ATTR_PARAMS.some((k) => touch[k])) sessionStorage.setItem(ATTR_KEY, JSON.stringify(touch));
  }, undefined);
}

export function getAttribution(): { first: Params | null; last: Params | null } {
  return safe(
    () => ({
      first: JSON.parse(localStorage.getItem(ATTR_KEY) || "null"),
      last: JSON.parse(sessionStorage.getItem(ATTR_KEY) || "null"),
    }),
    { first: null, last: null },
  );
}

export const getIds = () => ({ vid: getVid(), sid: getSid().sid });

let ga: Analytics | null = null;

async function loadThirdParty() {
  if (ga || typeof window === "undefined") return;
  const { initializeAnalytics, isSupported, setConsent } = await import("firebase/analytics");
  if (!(await isSupported())) return;
  setConsent({ analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  // page_view is sent manually on every route change, so disable the automatic one.
  ga = initializeAnalytics(firebaseApp(), { config: { send_page_view: false } });
}

export function setConsent(value: Consent) {
  safe(() => localStorage.setItem(CONSENT_KEY, value), undefined);
  if (value === "granted") void loadThirdParty();
  track("consent_update", { value });
}

export function initAnalytics() {
  captureAttribution();
  if (getConsent() === "granted") void loadThirdParty();
}

/** The owner's dashboard and its heatmap previews (pages framed inside /admin/) must not count as traffic. */
const isInternalView = () => location.pathname.startsWith("/admin") || window.self !== window.top;

export function track(name: string, params: Params = {}) {
  if (typeof window === "undefined" || isInternalView()) return;
  const { sid, isNew } = getSid();
  const payload = {
    name,
    params,
    vid: getVid(),
    sid,
    newSession: isNew,
    path: location.pathname,
    title: document.title,
    referrer: document.referrer,
    attribution: isNew || name === "page_view" ? getAttribution() : undefined,
    screen: `${window.innerWidth}x${window.innerHeight}`,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ts: Date.now(),
  };
  const body = JSON.stringify(payload);
  const sent = safe(() => navigator.sendBeacon(COLLECT_URL, new Blob([body], { type: "application/json" })), false);
  if (!sent) void fetch(COLLECT_URL, { method: "POST", body, keepalive: true, headers: { "content-type": "application/json" } }).catch(() => {});

  if (ga) {
    void import("firebase/analytics").then(({ logEvent }) => ga && logEvent(ga, name, params));
  }
}
