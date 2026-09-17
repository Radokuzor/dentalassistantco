"use client";

import { useEffect, useRef, useState } from "react";

// Chart colors validated with the dataviz palette checker against a white card surface.
export const VISITOR_COLOR = "#0d9488";
export const LEAD_COLOR = "#e2553f";

const fmt = new Intl.NumberFormat("en-US");
const shortDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export function Card({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white p-5 ${className}`}>
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {subtitle && <p className="mt-0.5 text-xs text-ink-soft">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

/** Single-series daily bar chart: one axis, rounded data-ends, hover tooltip, table fallback. */
export function DailyBars({ data, valueKey, color, unit }: { data: { date: string; [k: string]: number | string }[]; valueKey: string; color: string; unit: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 640;
  const H = 180;
  const padL = 32;
  const padB = 22;
  const padT = 14;
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(1, ...values);
  const niceMax = max <= 5 ? 5 : Math.ceil(max / 5) * 5;
  const slot = (W - padL) / Math.max(1, data.length);
  const barW = Math.max(2, Math.min(28, slot - 2));
  const y = (v: number) => padT + (H - padB - padT) * (1 - v / niceMax);
  const ticks = [0, niceMax / 2, niceMax];
  const peak = values.indexOf(max);
  const labelEvery = Math.ceil(data.length / 7);

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${unit} per day`}>
          {ticks.map((t) => (
            <g key={t}>
              <line x1={padL} x2={W} y1={y(t)} y2={y(t)} stroke="#e7e2d6" strokeWidth={1} />
              <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#6b7a78">
                {fmt.format(t)}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const v = values[i];
            const x = padL + i * slot + (slot - barW) / 2;
            const top = y(v);
            const h = H - padB - top;
            const r = Math.min(4, barW / 2, h);
            return (
              <g key={d.date}>
                {v > 0 && (
                  <path
                    d={`M${x},${H - padB} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${H - padB} Z`}
                    fill={color}
                    opacity={hover === null || hover === i ? 1 : 0.45}
                  />
                )}
                {i % labelEvery === 0 && (
                  <text x={x + barW / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#6b7a78">
                    {shortDate(d.date)}
                  </text>
                )}
                {i === peak && v > 0 && (
                  <text x={x + barW / 2} y={top - 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10201f">
                    {fmt.format(v)}
                  </text>
                )}
                <rect x={padL + i * slot} y={0} width={slot} height={H - padB} fill="transparent" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs shadow-lg"
            style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%` }}
          >
            <p className="font-semibold text-ink">{shortDate(data[hover].date)}</p>
            <p className="text-ink-soft">
              {fmt.format(values[hover])} {unit}
            </p>
          </div>
        )}
      </div>
      <details className="mt-2 text-xs text-ink-soft">
        <summary className="cursor-pointer">View as table</summary>
        <DataTable head={["Date", unit]} rows={data.map((d, i) => [d.date, values[i]])} />
      </details>
    </div>
  );
}

/** Horizontal funnel: bar length = count, label shows % of the first step. */
export function Funnel({ steps }: { steps: { label: string; count: number }[] }) {
  const max = Math.max(1, ...steps.map((s) => s.count));
  const base = steps[1]?.count || 0;
  return (
    <ol className="space-y-2.5">
      {steps.map((s, i) => (
        <li key={s.label}>
          <div className="flex justify-between text-xs">
            <span className="text-ink">{s.label}</span>
            <span className="text-ink-soft">
              {fmt.format(s.count)}
              {i > 1 && base ? ` · ${Math.round((s.count / base) * 100)}% of starts` : ""}
            </span>
          </div>
          <div className="mt-1 h-3 rounded-full bg-paper-deep">
            <div className="h-3 rounded-full" style={{ width: `${(s.count / max) * 100}%`, background: VISITOR_COLOR, minWidth: s.count ? 4 : 0 }} />
          </div>
        </li>
      ))}
    </ol>
  );
}

export function DataTable({ head, rows, empty = "No data yet." }: { head: string[]; rows: (string | number | null | undefined)[][]; empty?: string }) {
  if (!rows.length) return <p className="text-sm text-ink-soft">{empty}</p>;
  return (
    <div className="max-h-80 overflow-auto">
      <table className="w-full text-left text-sm">
        <thead className="sticky top-0 bg-white text-xs text-ink-soft">
          <tr>
            {head.map((h, i) => (
              <th key={h} className={`py-1.5 pr-3 font-medium ${i > 0 ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line/70">
              {r.map((c, j) => (
                <td key={j} className={`py-1.5 pr-3 align-top ${j > 0 ? "text-right tabular-nums" : "break-all text-ink"}`}>
                  {typeof c === "number" ? fmt.format(c) : (c ?? "–")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Click = { x: number; y: number; vw: number; i: boolean };

/** Click heatmap: the real page in an iframe with every recorded click drawn on top. */
export function Heatmap({ pages }: { pages: { path: string; clicks: Click[] }[] }) {
  const [path, setPath] = useState(pages[0]?.path ?? "/");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const box = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(800);

  useEffect(() => {
    if (!box.current) return;
    const ro = new ResizeObserver(([e]) => setBoxW(e.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  if (!pages.length) return <p className="text-sm text-ink-soft">No clicks recorded yet.</p>;

  const pageW = device === "desktop" ? 1280 : 390;
  const all = pages.find((p) => p.path === path)?.clicks ?? [];
  const clicks = all.filter((c) => (device === "desktop" ? c.vw >= 1024 : c.vw < 768));
  const pageH = Math.min(12000, Math.max(1600, ...clicks.map((c) => c.y + 900)));
  const scale = Math.min(1, boxW / pageW);
  const dead = clicks.filter((c) => !c.i).length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={path} onChange={(e) => setPath(e.target.value)} className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-sm">
          {pages.map((p) => (
            <option key={p.path} value={p.path}>
              {p.path} ({p.clicks.length})
            </option>
          ))}
        </select>
        <div className="flex rounded-lg border border-line p-0.5 text-sm">
          {(["desktop", "mobile"] as const).map((d) => (
            <button key={d} onClick={() => setDevice(d)} className={`rounded-md px-3 py-1 capitalize ${device === d ? "bg-ink text-white" : "text-ink-soft"}`}>
              {d}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-soft">
          {clicks.length} clicks · {dead} dead (outlined) · filled dots are links and buttons
        </p>
      </div>
      <div ref={box} className="mt-3 overflow-hidden rounded-xl border border-line bg-paper" style={{ height: pageH * scale }}>
        <div className="relative origin-top-left" style={{ width: pageW, height: pageH, transform: `scale(${scale})` }}>
          <iframe key={`${path}-${device}`} src={path} title={`Preview of ${path}`} className="pointer-events-none absolute inset-0 h-full w-full border-0" loading="lazy" />
          <div className="absolute inset-0">
            {clicks.map((c, i) => (
              <span
                key={i}
                className="absolute size-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={
                  c.i
                    ? { left: `${c.x}%`, top: c.y, background: `radial-gradient(circle, ${LEAD_COLOR}cc 0%, ${LEAD_COLOR}55 45%, transparent 70%)` }
                    : { left: `${c.x}%`, top: c.y, border: `2px solid ${LEAD_COLOR}`, background: "rgba(255,255,255,0.35)" }
                }
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
