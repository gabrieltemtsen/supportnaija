import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const PLATFORM_FEE_BPS = 200; // 2% — provisional MVP fee. Tunable via deploy config later.
const MIN_DONATION_NGN = 500;

function computeFee(amountNgn: number) {
  const fee = Math.round((amountNgn * PLATFORM_FEE_BPS) / 10_000);
  return { feeNgn: fee, netNgn: amountNgn - fee };
}

function makeReference(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `snj_${ts}_${rand}`;
}

/**
 * Initiate a donation. Creates a pending donation row that a payment provider
 * (e.g. Paystack) can later transition to "succeeded" via webhook.
 */
export const initiate = mutation({
  args: {
    poolSlug: v.string(),
    donorId: v.id("donors"),
    amountNgn: v.number(),
    isRecurring: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    donationId: Id<"donations">;
    paystackReference: string;
    amountGrossNgn: number;
    amountNetNgn: number;
    platformFeeNgn: number;
  }> => {
    if (!Number.isFinite(args.amountNgn) || args.amountNgn < MIN_DONATION_NGN) {
      throw new Error(`Minimum donation is ₦${MIN_DONATION_NGN}`);
    }
    const amountGrossNgn = Math.round(args.amountNgn);
    const { feeNgn, netNgn } = computeFee(amountGrossNgn);

    const pool = await ctx.db
      .query("pools")
      .withIndex("by_slug", (q) => q.eq("slug", args.poolSlug))
      .unique();
    if (!pool || pool.status !== "active") throw new Error("Pool not active");

    const donor = await ctx.db.get(args.donorId);
    if (!donor) throw new Error("Donor not found");

    const reference = makeReference();
    const donationId = await ctx.db.insert("donations", {
      poolId: pool._id,
      donorId: donor._id,
      amountGrossNgn,
      platformFeeNgn: feeNgn,
      amountNetNgn: netNgn,
      paystackReference: reference,
      status: "pending",
      isRecurring: args.isRecurring ?? false,
      createdAt: Date.now(),
    });

    return {
      donationId,
      paystackReference: reference,
      amountGrossNgn,
      amountNetNgn: netNgn,
      platformFeeNgn: feeNgn,
    };
  },
});

export const recentSucceeded = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 10, 50));
    return await ctx.db
      .query("donations")
      .withIndex("by_status_createdAt", (q) => q.eq("status", "succeeded"))
      .order("desc")
      .take(limit);
  },
});
