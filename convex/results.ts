import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Status type
const statusValidator = v.union(
  v.literal("FINISHED"),
  v.literal("DNF"),
  v.literal("DNS"),
  v.literal("DISQUALIFIED")
);

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const rawResults = await ctx.db.query("results").collect();

    // Separate FINISHED from non-finished
    const finished = rawResults
      .filter((r) => r.status === "FINISHED")
      .sort((a, b) => {
        if (a.timeMs !== b.timeMs) {
          return a.timeMs - b.timeMs; // Lower time = faster (P1 first)
        }
        return a.createdAt - b.createdAt; // Earlier entry wins tie
      });

    const nonFinished = rawResults
      .filter((r) => r.status !== "FINISHED")
      .sort((a, b) => a.createdAt - b.createdAt);

    const leaderTime = finished.length > 0 ? finished[0].timeMs : 0;

    // Map finished with rank and gap to leader
    const rankedFinished = finished.map((item, index) => {
      const rank = index + 1;
      const gapMs = index === 0 ? 0 : item.timeMs - leaderTime;
      return {
        ...item,
        rank,
        gapMs,
        isLeader: index === 0,
      };
    });

    // Map non-finished entries
    const rankedNonFinished = nonFinished.map((item) => {
      return {
        ...item,
        rank: null,
        gapMs: null,
        isLeader: false,
      };
    });

    return {
      leaderboard: [...rankedFinished, ...rankedNonFinished],
      totalCount: rawResults.length,
      finishedCount: finished.length,
      fastestTimeMs: leaderTime,
      fastestParticipant: finished[0] || null,
    };
  },
});

export const getAllResults = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("results").collect();
    // Sort by createdAt descending for race control management
    return results.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("results").collect();
    const finished = results.filter((r) => r.status === "FINISHED");
    const fastest = finished.sort((a, b) => a.timeMs - b.timeMs)[0] || null;
    const avgTimeMs =
      finished.length > 0
        ? Math.round(
            finished.reduce((acc, curr) => acc + curr.timeMs, 0) /
              finished.length
          )
        : 0;

    return {
      totalRuns: results.length,
      finishedRuns: finished.length,
      dnfRuns: results.filter((r) => r.status === "DNF").length,
      disqualifiedRuns: results.filter((r) => r.status === "DISQUALIFIED").length,
      dnsRuns: results.filter((r) => r.status === "DNS").length,
      fastestTimeMs: fastest ? fastest.timeMs : null,
      fastestDriver: fastest ? fastest.participantName : null,
      fastestTeam: fastest ? fastest.teamName : null,
      averageTimeMs: avgTimeMs,
    };
  },
});

export const createResult = mutation({
  args: {
    participantName: v.string(),
    teamName: v.optional(v.string()),
    timeMs: v.number(),
    driverImageUrl: v.optional(v.string()),
    carImageUrl: v.optional(v.string()),
    status: statusValidator,
    notes: v.optional(v.string()),
    runNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const trimmedName = args.participantName.trim();
    if (!trimmedName) {
      throw new Error("Participant name cannot be empty");
    }

    if (args.status === "FINISHED" && args.timeMs <= 0) {
      throw new Error("Lap time must be greater than 0 for finished runs");
    }

    const now = Date.now();
    const id = await ctx.db.insert("results", {
      participantName: trimmedName,
      teamName: args.teamName?.trim() || undefined,
      timeMs: Math.max(0, Math.round(args.timeMs)),
      driverImageUrl: args.driverImageUrl?.trim() || undefined,
      carImageUrl: args.carImageUrl?.trim() || undefined,
      status: args.status,
      notes: args.notes?.trim() || undefined,
      runNumber: args.runNumber,
      createdAt: now,
      updatedAt: now,
    });

    return id;
  },
});

export const updateResult = mutation({
  args: {
    id: v.id("results"),
    participantName: v.string(),
    teamName: v.optional(v.string()),
    timeMs: v.number(),
    driverImageUrl: v.optional(v.string()),
    carImageUrl: v.optional(v.string()),
    status: statusValidator,
    notes: v.optional(v.string()),
    runNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    const existing = await ctx.db.get(id);
    if (!existing) {
      throw new Error("Result record not found");
    }

    const trimmedName = data.participantName.trim();
    if (!trimmedName) {
      throw new Error("Participant name cannot be empty");
    }

    if (data.status === "FINISHED" && data.timeMs <= 0) {
      throw new Error("Lap time must be greater than 0 for finished runs");
    }

    await ctx.db.patch(id, {
      participantName: trimmedName,
      teamName: data.teamName?.trim() || undefined,
      timeMs: Math.max(0, Math.round(data.timeMs)),
      driverImageUrl: data.driverImageUrl?.trim() || undefined,
      carImageUrl: data.carImageUrl?.trim() || undefined,
      status: data.status,
      notes: data.notes?.trim() || undefined,
      runNumber: data.runNumber,
      updatedAt: Date.now(),
    });

    return id;
  },
});

export const deleteResult = mutation({
  args: {
    id: v.id("results"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Result record not found");
    }
    await ctx.db.delete(args.id);
    return true;
  },
});

export const clearAllResults = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("results").collect();
    for (const record of all) {
      await ctx.db.delete(record._id);
    }
    return all.length;
  },
});

export const seedDemoData = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing to avoid duplicates
    const existing = await ctx.db.query("results").collect();
    for (const record of existing) {
      await ctx.db.delete(record._id);
    }

    const demoDrivers = [
      {
        participantName: "Aarav Mehta",
        teamName: "Scuderia Corsa",
        timeMs: 17842, // 17.842s -> P1
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Aggressive apex entry, maximum sector 3 velocity.",
      },
      {
        participantName: "Kabir Shah",
        teamName: "Apex Red Racing",
        timeMs: 18215, // 18.215s -> P2
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "High downforce trim; strong exit out of Turn 4.",
      },
      {
        participantName: "Arjun Nair",
        teamName: "Silverstone Motorsport",
        timeMs: 18764, // 18.764s -> P3
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Tight lines through the technical chicane section.",
      },
      {
        participantName: "Rohan Patel",
        teamName: "Aston Velocity",
        timeMs: 19308, // 19.308s -> P4
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Smooth lap, slight oversteer on final straight.",
      },
      {
        participantName: "Vihaan Rao",
        teamName: "McLaren Papaya",
        timeMs: 20145, // 20.145s -> P5
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Consistent split times across all telemetry sectors.",
      },
      {
        participantName: "Aditya Joshi",
        teamName: "Williams Racing Team",
        timeMs: 21450, // 21.450s -> P6
        status: "FINISHED" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Solid baseline setup; ready for Run #2 adjustment.",
      },
      {
        participantName: "Devansh Sen",
        teamName: "Haas Dynamics",
        timeMs: 0,
        status: "DNF" as const,
        driverImageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        carImageUrl: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&auto=format&fit=crop&q=80",
        runNumber: 1,
        notes: "Front suspension lockup entering hairpin.",
      },
    ];

    const now = Date.now();
    for (let i = 0; i < demoDrivers.length; i++) {
      const driver = demoDrivers[i];
      await ctx.db.insert("results", {
        participantName: driver.participantName,
        teamName: driver.teamName,
        timeMs: driver.timeMs,
        driverImageUrl: driver.driverImageUrl,
        carImageUrl: driver.carImageUrl,
        status: driver.status,
        notes: driver.notes,
        runNumber: driver.runNumber,
        createdAt: now - (demoDrivers.length - i) * 60000,
        updatedAt: now - (demoDrivers.length - i) * 60000,
      });
    }

    return demoDrivers.length;
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

