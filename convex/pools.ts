import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("pools")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();
  },
});

type PoolWithStats = Doc<"pools"> & {
  totalRaisedNgn: number;
  donationCount: number;
  uniqueDonors: number;
  payoutsNgn: number;
  balanceNgn: number;
};

export const listWithStats = query({
  args: {},
  handler: async (ctx): Promise<PoolWithStats[]> => {
    const pools = await ctx.db
      .query("pools")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const out: PoolWithStats[] = [];
    for (const pool of pools) {
      const donations = await ctx.db
        .query("donations")
        .withIndex("by_pool", (q) => q.eq("poolId", pool._id))
        .collect();

      let totalRaisedNgn = 0;
      let donationCount = 0;
      const donorSet = new Set<string>();
      for (const d of donations) {
        if (d.status !== "succeeded") continue;
        totalRaisedNgn += d.amountNetNgn;
        donationCount += 1;
        if (d.donorId) donorSet.add(d.donorId as unknown as string);
      }

      const payouts = await ctx.db
        .query("payouts")
        .withIndex("by_pool", (q) => q.eq("poolId", pool._id))
        .collect();

      let payoutsNgn = 0;
      for (const p of payouts) {
        if (p.status === "succeeded") payoutsNgn += p.amountNgn;
      }

      out.push({
        ...pool,
        totalRaisedNgn,
        donationCount,
        uniqueDonors: donorSet.size,
        payoutsNgn,
        balanceNgn: totalRaisedNgn - payoutsNgn,
      });
    }

    return out.sort((a, b) => b.totalRaisedNgn - a.totalRaisedNgn);
  },
});

export const platformTotals = query({
  args: {},
  handler: async (ctx) => {
    const donations = await ctx.db
      .query("donations")
      .withIndex("by_status", (q) => q.eq("status", "succeeded"))
      .collect();

    let totalRaisedNgn = 0;
    let donationCount = 0;
    const donors = new Set<string>();
    for (const d of donations) {
      totalRaisedNgn += d.amountNetNgn;
      donationCount += 1;
      if (d.donorId) donors.add(d.donorId as unknown as string);
    }

    const payouts = await ctx.db.query("payouts").collect();
    let payoutsSucceededNgn = 0;
    let payoutCount = 0;
    for (const p of payouts) {
      if (p.status === "succeeded") {
        payoutsSucceededNgn += p.amountNgn;
        payoutCount += 1;
      }
    }

    const pools = await ctx.db
      .query("pools")
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    return {
      totalRaisedNgn,
      donationCount,
      uniqueDonors: donors.size,
      payoutsSucceededNgn,
      payoutCount,
      activePoolCount: pools.length,
    };
  },
});

export const ensureGeneralPool = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("pools")
      .withIndex("by_slug", (q) => q.eq("slug", "general"))
      .unique();
    if (existing) return existing;

    const now = Date.now();
    const id = await ctx.db.insert("pools", {
      type: "general",
      name: "General Support Pool",
      slug: "general",
      approvalMode: "platform_controlled",
      proofRequired: true,
      monthlyRecipientCapNgn: 3000,
      autoAirtimeEnabled: true,
      autoAirtimeAmountNgn: 1000,
      status: "active",
      createdAt: now,
    });

    return await ctx.db.get(id);
  },
});

// Helper used by donation initiation to pin to a known pool by slug.
export const requireActiveBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args): Promise<Doc<"pools"> | null> => {
    const pool = await ctx.db
      .query("pools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!pool || pool.status !== "active") return null;
    return pool;
  },
});

// Untyped re-export to avoid TS unused warning for Id helper.
export type _PoolId = Id<"pools">;
