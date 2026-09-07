"use client";

import React from "react";
import { LeaderboardEntry } from "@/lib/types";
import { formatLapTime, formatGap } from "@/lib/time";
import { CarImageFallback } from "@/components/common/CarImageFallback";
import { Trophy, Flame } from "lucide-react";

interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  // Only show podium if we have at least 2 or 3 finished entries
  const finishedEntries = entries.filter((e) => e.status === "FINISHED");
  if (finishedEntries.length < 3) {
    return null;
  }

  const p1 = finishedEntries[0];
  const p2 = finishedEntries[1];
  const p3 = finishedEntries[2];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-4 w-4 text-amber-500" />
        <h3
          className="font-mono text-sm font-bold uppercase tracking-widest text-neutral-400"
        >
          APEX PODIUM • TOP 3 CONTENDERS
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* P2 - Silver Position (Left) */}
        <div className="order-2 md:order-1 relative rounded-xl border border-neutral-700/60 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-5 shadow-lg backdrop-blur-md transition-all hover:border-neutral-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 font-mono text-xs font-bold text-neutral-300 border border-neutral-700">
                P2
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                SILVER
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-neutral-300">
              {formatGap(p2.gapMs, false, p2.status)}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <CarImageFallback
              src={p2.driverImageUrl}
              alt={p2.participantName}
              type="driver"
              containerClassName="h-14 w-14 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900"
            />
            <div className="overflow-hidden">
              <h4
                className="truncate font-mono text-lg font-black uppercase text-white"
                style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
              >
                {p2.participantName}
              </h4>
              <p className="truncate font-mono text-xs text-neutral-400">
                {p2.teamName || "Privateer"}
              </p>
            </div>
          </div>

          {p2.carImageUrl && (
            <div className="mb-4 h-24 w-full rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
              <CarImageFallback
                src={p2.carImageUrl}
                alt={`${p2.participantName} car`}
                type="car"
                containerClassName="h-full w-full"
              />
            </div>
          )}

          <div className="flex items-baseline justify-between border-t border-neutral-800/80 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              LAP TIME
            </span>
            <span
              className="font-mono text-2xl font-black text-neutral-100"
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {formatLapTime(p2.timeMs)}
            </span>
          </div>
        </div>

        {/* P1 - Gold Dominant Position (Center, Elevated) */}
        <div className="order-1 md:order-2 relative rounded-xl border-2 border-red-500/80 bg-gradient-to-b from-[#181113] via-neutral-950 to-neutral-950 p-6 shadow-2xl shadow-red-900/30 backdrop-blur-md md:-translate-y-3 z-10">
          {/* Glowing Apex Ring */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-0.5 shadow-md shadow-red-600/50">
            <Flame className="h-3.5 w-3.5 text-amber-200 fill-amber-200" />
            <span className="font-mono text-[11px] font-black uppercase tracking-widest text-white">
              LEADER P1
            </span>
          </div>

          <div className="flex items-start justify-between mt-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 font-mono text-base font-black text-white shadow-md shadow-red-600/40">
                01
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-red-400 font-bold block">
                  FASTEST ON GRID
                </span>
                <span className="font-mono text-[11px] text-neutral-400">
                  {p1.runNumber ? `Run #${p1.runNumber}` : "Official Run"}
                </span>
              </div>
            </div>
            <div className="rounded border border-red-500/30 bg-red-950/40 px-2.5 py-1 text-center">
              <span className="font-mono text-xs font-bold text-red-400">
                LEADER
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <CarImageFallback
              src={p1.driverImageUrl}
              alt={p1.participantName}
              type="driver"
              containerClassName="h-16 w-16 rounded-xl overflow-hidden border-2 border-red-500/80 bg-neutral-900 shadow-lg shadow-red-900/40"
            />
            <div className="overflow-hidden">
              <h4
                className="truncate font-mono text-xl font-black uppercase text-white"
                style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
              >
                {p1.participantName}
              </h4>
              <p className="truncate font-mono text-xs font-semibold text-red-400">
                {p1.teamName || "Privateer Entry"}
              </p>
            </div>
          </div>

          {p1.carImageUrl && (
            <div className="mb-4 h-28 w-full rounded-lg overflow-hidden border border-red-900/40 bg-neutral-900">
              <CarImageFallback
                src={p1.carImageUrl}
                alt={`${p1.participantName} car`}
                type="car"
                containerClassName="h-full w-full"
              />
            </div>
          )}

          <div className="flex items-baseline justify-between border-t border-red-900/40 pt-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-300 font-bold">
              BENCHMARK
            </span>
            <span
              className="font-mono text-3xl font-black text-white drop-shadow-[0_0_12px_rgba(225,6,0,0.5)]"
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {formatLapTime(p1.timeMs)}
            </span>
          </div>
        </div>

        {/* P3 - Bronze Position (Right) */}
        <div className="order-3 relative rounded-xl border border-neutral-700/60 bg-gradient-to-b from-neutral-900/90 to-neutral-950 p-5 shadow-lg backdrop-blur-md transition-all hover:border-neutral-500">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-neutral-800 font-mono text-xs font-bold text-neutral-300 border border-neutral-700">
                P3
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-amber-500/80">
                BRONZE
              </span>
            </div>
            <span className="font-mono text-xs font-semibold text-neutral-300">
              {formatGap(p3.gapMs, false, p3.status)}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <CarImageFallback
              src={p3.driverImageUrl}
              alt={p3.participantName}
              type="driver"
              containerClassName="h-14 w-14 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900"
            />
            <div className="overflow-hidden">
              <h4
                className="truncate font-mono text-lg font-black uppercase text-white"
                style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
              >
                {p3.participantName}
              </h4>
              <p className="truncate font-mono text-xs text-neutral-400">
                {p3.teamName || "Privateer"}
              </p>
            </div>
          </div>

          {p3.carImageUrl && (
            <div className="mb-4 h-24 w-full rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900">
              <CarImageFallback
                src={p3.carImageUrl}
                alt={`${p3.participantName} car`}
                type="car"
                containerClassName="h-full w-full"
              />
            </div>
          )}

          <div className="flex items-baseline justify-between border-t border-neutral-800/80 pt-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400">
              LAP TIME
            </span>
            <span
              className="font-mono text-2xl font-black text-neutral-100"
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {formatLapTime(p3.timeMs)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
