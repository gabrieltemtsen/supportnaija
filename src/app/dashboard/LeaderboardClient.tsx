"use client";

import { useQuery } from "convex/react";
import { Crown, Trophy } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import { fmtNgn } from "@/lib/format";

type Row = {
  donorId: string;
  totalDonatedNgn: number;
  donationCount: number;
  isAnonymous: boolean;
  displayName?: string;
  anonymousId: string;
};

function donorLabel(row: Row) {
  if (!row.isAnonymous && row.displayName) return row.displayName;
  return `Anonymous (${row.anonymousId})`;
}

function donorInitials(row: Row) {
  const src = !row.isAnonymous && row.displayName ? row.displayName : row.anonymousId;
  const parts = src.split(/[\s-]+/).filter(Boolean);
  return (parts[0]?.[0] ?? "?").toUpperCase() + (parts[1]?.[0] ?? "").toUpperCase();
}

function Board({
  title,
  rows,
  loading,
  highlight,
}: {
  title: string;
  rows?: Row[];
  loading: boolean;
  highlight?: boolean;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-center gap-2">
        {highlight ? (
          <Crown className="h-4 w-4" style={{ color: "var(--brand-green)" }} />
        ) : (
          <Trophy className="h-4 w-4 text-black/65" />
        )}
        <h2 className="text-sm font-semibold">{title}</h2>
      </div>

      <div className="mt-4 grid gap-2">
        {loading && (
          <div className="grid gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-xl bg-black/[0.04]"
              />
            ))}
          </div>
        )}

        {!loading && rows && rows.length === 0 && (
          <div className="rounded-xl border border-dashed border-black/15 p-4 text-sm text-black/55">
            No donations yet — be the first.
          </div>
        )}

        {!loading &&
          (rows ?? []).map((row, i) => {
            const top = i === 0;
            return (
              <div
                key={row.donorId}
                className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
                  top
                    ? "border-[color:var(--brand-green-50)] bg-[color:var(--brand-green-50)]/60"
                    : "border-black/5 bg-white"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: top
                        ? "var(--brand-green)"
                        : "rgba(0,0,0,0.06)",
                      color: top ? "white" : "rgba(0,0,0,0.7)",
                    }}
                  >
                    {donorInitials(row)}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {i + 1}. {donorLabel(row)}
                    </div>
                    <div className="text-xs text-black/55">
                      {row.donationCount} donation
                      {row.donationCount === 1 ? "" : "s"}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 tabular text-sm font-semibold">
                  {fmtNgn(row.totalDonatedNgn)}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export function LeaderboardClient() {
  const month = useQuery(api.leaderboard.thisMonth, { limit: 10 }) as
    | Row[]
    | undefined;
  const allTime = useQuery(api.leaderboard.allTime, { limit: 10 }) as
    | Row[]
    | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Board
        title="This month"
        rows={month}
        loading={!month}
        highlight
      />
      <Board title="All time" rows={allTime} loading={!allTime} />
    </div>
  );
}
