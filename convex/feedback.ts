import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
  args: {
    message: v.string(),
    recipientAliasId: v.optional(v.string()),
    donorId: v.optional(v.id("donors")),
    donationId: v.optional(v.id("donations")),
    payoutId: v.optional(v.id("payouts")),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const msg = args.message.trim();
    if (msg.length < 5) throw new Error("Message too short");
    if (msg.length > 500) throw new Error("Message too long");

    const now = Date.now();
    const id = await ctx.db.insert("feedbackMessages", {
      recipientId: undefined,
      recipientAliasId: args.recipientAliasId,
      donorId: args.donorId,
      donationId: args.donationId,
      payoutId: args.payoutId,
      message: msg,
      isPublic: args.isPublic ?? true,
      status: "pending",
      createdAt: now,
    });

    return await ctx.db.get(id);
  },
});

export const listPublicApproved = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 50, 200));

    const rows = await ctx.db
      .query("feedbackMessages")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(limit);

    return rows.filter((r) => r.isPublic);
  },
});

export const moderate = mutation({
  args: { id: v.id("feedbackMessages"), status: v.union(v.literal("approved"), v.literal("rejected")) },
  handler: async (ctx, args) => {
    // TODO: authz (admin/NGO). For MVP we keep it simple and rely on deployment secrets.
    await ctx.db.patch(args.id, { status: args.status });
    return await ctx.db.get(args.id);
  },
});
