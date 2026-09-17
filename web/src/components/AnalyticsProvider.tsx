"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { initAnalytics, track } from "@/lib/analytics";

const SCROLL_MARKS = [25, 50, 75, 90];

/** Site-wide automatic tracking. Explicit events (quiz, forms) call `track` directly. */
export function AnalyticsProvider() {
  const pathname = usePathname();
  const pageStart = useRef({ visibleMs: 0, since: Date.now(), path: "" });

  // One-time listeners: clicks, errors, web vitals, engaged time on hide.
  useEffect(() => {
    initAnalytics();

    const clicks: { t: number; target: EventTarget | null }[] = [];
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-track]");

      const now = Date.now();
      clicks.push({ t: now, target: e.target });
      while (clicks.length && now - clicks[0].t > 600) clicks.shift();
      if (clicks.length >= 3 && clicks.every((c) => c.target === e.target)) {
        const t = e.target as HTMLElement;
        track("rage_click", { selector: `${t.tagName.toLowerCase()}${t.id ? `#${t.id}` : ""}.${t.className}`.slice(0, 120) });
        clicks.length = 0;
      }

      if (!el) return;
      const text = (el.dataset.trackLabel || el.textContent || "").trim().slice(0, 80);
      const section = el.closest<HTMLElement>("[data-section]")?.dataset.section ?? "page";
      const kind = el.dataset.track;
      const href = el instanceof HTMLAnchorElement ? el.href : "";

      if (kind === "cta") track("cta_click", { cta_id: el.dataset.trackId, cta_text: text, location: section });
      if (kind === "affiliate") track("affiliate_click", { partner: el.dataset.partner, product: el.dataset.product, url: href });
      if (kind === "purchase") track("purchase_click", { product: el.dataset.product });
      if (!href) return;
      if (href.startsWith("tel:")) track("phone_click", { location: section });
      else if (href.startsWith("mailto:")) track("email_click", { location: section });
      else if (/\.(pdf|zip|docx?)($|\?)/i.test(href)) track("file_download", { file: href });
      else if (new URL(href).host !== window.location.host) track("outbound_click", { url: href, domain: new URL(href).host });
    };

    const onError = (e: ErrorEvent) =>
      track("js_error", { message: String(e.message).slice(0, 200), source: `${e.filename}:${e.lineno}` });

    const flushEngaged = () => {
      const p = pageStart.current;
      if (document.visibilityState === "hidden") {
        p.visibleMs += Date.now() - p.since;
        if (p.visibleMs > 1000) track("engaged_time", { seconds: Math.round(p.visibleMs / 1000), path: p.path });
        p.visibleMs = 0;
      } else {
        p.since = Date.now();
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("visibilitychange", flushEngaged);
    window.addEventListener("error", onError);

    void import("web-vitals").then(({ onLCP, onCLS, onINP, onTTFB }) => {
      const report = (m: { name: string; value: number; rating: string }) =>
        track("web_vitals", { metric: m.name, value: Math.round(m.name === "CLS" ? m.value * 1000 : m.value), rating: m.rating });
      onLCP(report);
      onCLS(report);
      onINP(report);
      onTTFB(report);
    });

    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("visibilitychange", flushEngaged);
      window.removeEventListener("error", onError);
    };
  }, []);

  // Per-route: page_view, scroll depth, and engaged-time reset.
  useEffect(() => {
    const p = pageStart.current;
    if (p.path && p.path !== pathname) {
      const ms = p.visibleMs + (Date.now() - p.since);
      if (ms > 1000) track("engaged_time", { seconds: Math.round(ms / 1000), path: p.path });
    }
    pageStart.current = { visibleMs: 0, since: Date.now(), path: pathname };
    track("page_view", { page_path: pathname, page_title: document.title });

    const hit = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
      for (const mark of SCROLL_MARKS) {
        if (pct >= mark && !hit.has(mark)) {
          hit.add(mark);
          track("scroll_depth", { percent: mark });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  return null;
}
