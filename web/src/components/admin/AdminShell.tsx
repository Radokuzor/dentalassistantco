"use client";

import { useState } from "react";
import { AdminDashboard } from "./AdminDashboard";
import { AdminJobs } from "./AdminJobs";

/** Both tabs read the same `dac_admin_pw` sessionStorage key and gate themselves independently,
 *  so logging into one unlocks the other — this shell only has to switch which one is mounted. */
export function AdminShell() {
  const [tab, setTab] = useState<"analytics" | "jobs">("analytics");
  return (
    <div>
      <div className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2 sm:px-6">
          {(["analytics", "jobs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                tab === t ? "bg-ink text-white" : "text-ink-soft hover:bg-paper-deep"
              }`}
            >
              {t === "analytics" ? "Analytics" : "Job board"}
            </button>
          ))}
        </div>
      </div>
      {tab === "analytics" ? <AdminDashboard /> : <AdminJobs />}
    </div>
  );
}
