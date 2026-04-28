import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// NOTE: This is an MVP schema. We’ll evolve it carefully (migrations) as we add features.

export default defineSchema({
  pools: defineTable({
    type: v.union(v.literal("general"), v.literal("ngo")),
    name: v.string(),
    slug: v.string(),
    ngoClerkOrgId: v.optional(v.string()),
    approvalMode: v.union(
      v.literal("platform_controlled"),
      v.literal("ngo_controlled"),
      v.literal("hybrid")
    ),
    proofRequired: v.boolean(),
    monthlyRecipientCapNgn: v.number(),
    autoAirtimeEnabled: v.boolean(),
    autoAirtimeAmountNgn: v.number(),
    status: v.union(v.literal("active"), v.literal("paused")),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_type", ["type"]),

  donors: defineTable({
    isAnonymous: v.boolean(),
    displayName: v.optional(v.string()),
    anonymousId: v.string(),
    createdAt: v.number(),
  }).index("by_anonymousId", ["anonymousId"]),

  donations: defineTable({
    poolId: v.id("pools"),
    donorId: v.optional(v.id("donors")),
    amountGrossNgn: v.number(),
    platformFeeNgn: v.number(),
    amountNetNgn: v.number(),
    paystackReference: v.string(),
    paystackEventId: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("succeeded"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    isRecurring: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_reference", ["paystackReference"])
    .index("by_pool", ["poolId"]),

  recipients: defineTable({
    clerkUserId: v.string(),
    recipientAliasId: v.string(),
    phone: v.optional(v.string()),
    verificationStatus: v.union(
      v.literal("unverified"),
      v.literal("bvn_verified"),
      v.literal("verified_plus")
    ),
    bvnHash: v.optional(v.string()),
    ninHash: v.optional(v.string()),
    fraudScore: v.number(),
    createdAt: v.number(),
  })
    .index("by_clerkUserId", ["clerkUserId"])
    .index("by_alias", ["recipientAliasId"]),

  applications: defineTable({
    recipientId: v.id("recipients"),
    poolId: v.id("pools"),
    category: v.string(),
    amountRequestedNgn: v.number(),
    narrative: v.string(),
    proofFiles: v.array(
      v.object({
        url: v.string(),
        type: v.optional(v.string()),
        name: v.optional(v.string()),
      })
    ),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("paid")
    ),
    reviewNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_pool", ["poolId"])
    .index("by_recipient", ["recipientId"]),

  payouts: defineTable({
    applicationId: v.optional(v.id("applications")),
    recipientId: v.id("recipients"),
    poolId: v.id("pools"),
    type: v.union(v.literal("airtime"), v.literal("cash")),
    amountNgn: v.number(),
    provider: v.union(v.literal("termii"), v.literal("paystack")),
    providerReference: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("succeeded"), v.literal("failed")),
    createdAt: v.number(),
  })
    .index("by_pool", ["poolId"])
    .index("by_recipient", ["recipientId"]),

  ledgerEntries: defineTable({
    poolId: v.optional(v.id("pools")),
    entryType: v.union(
      v.literal("donation_net"),
      v.literal("platform_fee"),
      v.literal("payout"),
      v.literal("transparency_fee"),
      v.literal("refund"),
      v.literal("adjustment")
    ),
    amountNgn: v.number(), // signed
    referenceType: v.string(),
    referenceId: v.string(),
    meta: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_pool", ["poolId"])
    .index("by_type", ["entryType"]),
});
