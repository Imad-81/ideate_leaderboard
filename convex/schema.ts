import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  results: defineTable({
    participantName: v.string(),
    teamName: v.optional(v.string()),
    timeMs: v.number(),
    driverImageUrl: v.optional(v.string()),
    carImageUrl: v.optional(v.string()),
    status: v.union(
      v.literal("FINISHED"),
      v.literal("DNF"),
      v.literal("DNS"),
      v.literal("DISQUALIFIED")
    ),
    notes: v.optional(v.string()),
    runNumber: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_time", ["timeMs"])
    .index("by_created", ["createdAt"])
    .index("by_status", ["status"]),
});
