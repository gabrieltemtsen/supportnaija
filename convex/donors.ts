import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

function makeAnonymousId(): string {
  // SNJ-XXXX with crypto-strong randomness when available.
  const bytes =
    typeof crypto !== "undefined" && "getRandomValues" in crypto
      ? crypto.getRandomValues(new Uint8Array(3))
      : new Uint8Array([
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
          Math.floor(Math.random() * 256),
        ]);
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no I/O/0/1
  let token = "";
  for (let i = 0; i < bytes.length; i++) {
    token += alphabet[bytes[i] % alphabet.length];
    if (i === 1) token += alphabet[(bytes[i] >> 3) % alphabet.length];
  }
  return `SNJ-${token.slice(0, 4)}`;
}

export const createOrGet = mutation({
  args: {
    isAnonymous: v.boolean(),
    displayName: v.optional(v.string()),
    anonymousId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<Id<"donors">> => {
    if (args.anonymousId) {
      const existing = await ctx.db
        .query("donors")
        .withIndex("by_anonymousId", (q) =>
          q.eq("anonymousId", args.anonymousId!)
        )
        .unique();
      if (existing) return existing._id;
    }

    let anonymousId = args.anonymousId ?? makeAnonymousId();
    // Defend against extremely unlikely collisions.
    for (let i = 0; i < 5; i++) {
      const clash = await ctx.db
        .query("donors")
        .withIndex("by_anonymousId", (q) => q.eq("anonymousId", anonymousId))
        .unique();
      if (!clash) break;
      anonymousId = makeAnonymousId();
    }

    const id = await ctx.db.insert("donors", {
      isAnonymous: args.isAnonymous,
      displayName: args.isAnonymous ? undefined : args.displayName,
      anonymousId,
      createdAt: Date.now(),
    });
    return id;
  },
});

export const getByAlias = query({
  args: { anonymousId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("donors")
      .withIndex("by_anonymousId", (q) =>
        q.eq("anonymousId", args.anonymousId)
      )
      .unique();
  },
});
