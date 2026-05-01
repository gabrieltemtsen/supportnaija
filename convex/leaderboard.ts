import { query } from "./_generated/server";
import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

type LeaderboardRow = {
  donorId: Id<"donors">;
  totalDonatedNgn: number;
  donationCount: number;
  isAnonymous: boolean;
  displayName?: string;
  anonymousId: string;
};

function startOfMonthMs(now: Date): number {
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0);
}

async function buildLeaderboard(
  ctx: QueryCtx,
  opts: { sinceMs?: number; limit: number }
): Promise<LeaderboardRow[]> {
  const sinceMs = opts.sinceMs;

  // MVP approach: scan succeeded donations and aggregate in-memory.
  // If this grows large, we’ll introduce a materialized aggregate table.
  const donations = await ctx.db
    .query("donations")
    .withIndex("by_status", (q) => q.eq("status", "succeeded"))
    .collect();

  const totals = new Map<Id<"donors">, { total: number; count: number }>();

  for (const d of donations) {
    if (!d.donorId) continue;
    if (sinceMs && d.createdAt < sinceMs) continue;

    const key = d.donorId;
    const prev = totals.get(key) ?? { total: 0, count: 0 };
    prev.total += d.amountGrossNgn;
    prev.count += 1;
    totals.set(key, prev);
  }

  const rows: LeaderboardRow[] = [];
  for (const [donorId, agg] of totals.entries()) {
    const donor = await ctx.db.get(donorId);
    if (!donor) continue;

    rows.push({
      donorId,
      totalDonatedNgn: agg.total,
      donationCount: agg.count,
      isAnonymous: donor.isAnonymous,
      displayName: donor.displayName,
      anonymousId: donor.anonymousId,
    });
  }

  rows.sort((a, b) => {
    if (b.totalDonatedNgn !== a.totalDonatedNgn) return b.totalDonatedNgn - a.totalDonatedNgn;
    return b.donationCount - a.donationCount;
  });

  return rows.slice(0, opts.limit);
}

export const allTime = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 25, 100));
    return await buildLeaderboard(ctx, { limit });
  },
});

export const thisMonth = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 25, 100));
    const sinceMs = startOfMonthMs(new Date());
    return await buildLeaderboard(ctx, { limit, sinceMs });
  },
});
