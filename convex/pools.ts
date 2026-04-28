import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
