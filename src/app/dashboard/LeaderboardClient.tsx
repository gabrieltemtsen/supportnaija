"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function fmtNgn(n: number) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `₦${n.toLocaleString()}`;
  }
}

function donorLabel(row: {
  isAnonymous: boolean;
  displayName?: string;
  anonymousId: string;
}) {
  if (!row.isAnonymous && row.displayName) return row.displayName;
  return `Anonymous (${row.anonymousId})`;
}

export function LeaderboardClient() {
  const month = useQuery(api.leaderboard.thisMonth, { limit: 10 });
  const allTime = useQuery(api.leaderboard.allTime, { limit: 10 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Leaderboard — this month</h2>
        <div className="mt-4 grid gap-2">
          {(month ?? []).map((row: any, i: number) => (
            <div
              key={row.donorId}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {i + 1}. {donorLabel(row)}
                </div>
                <div className="text-xs text-black/60">
                  {row.donationCount} donation{row.donationCount === 1 ? "" : "s"}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold">
                {fmtNgn(row.totalDonatedNgn)}
              </div>
            </div>
          ))}

          {month && month.length === 0 && (
            <div className="text-sm text-black/60">No donations yet.</div>
          )}
          {!month && <div className="text-sm text-black/60">Loading…</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-black/10 bg-white p-5">
        <h2 className="text-sm font-semibold">Leaderboard — all time</h2>
        <div className="mt-4 grid gap-2">
          {(allTime ?? []).map((row: any, i: number) => (
            <div
              key={row.donorId}
              className="flex items-center justify-between gap-4 rounded-xl border border-black/5 bg-white px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">
                  {i + 1}. {donorLabel(row)}
                </div>
                <div className="text-xs text-black/60">
                  {row.donationCount} donation{row.donationCount === 1 ? "" : "s"}
                </div>
              </div>
              <div className="shrink-0 text-sm font-semibold">
                {fmtNgn(row.totalDonatedNgn)}
              </div>
            </div>
          ))}

          {allTime && allTime.length === 0 && (
            <div className="text-sm text-black/60">No donations yet.</div>
          )}
          {!allTime && <div className="text-sm text-black/60">Loading…</div>}
        </div>
      </section>
    </div>
  );
}
