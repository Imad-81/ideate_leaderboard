"use client";

import React from "react";
import { formatLapTime } from "@/lib/time";
import { CarImageFallback } from "@/components/common/CarImageFallback";
import { Zap, Timer } from "lucide-react";
import { LeaderboardEntry } from "@/lib/types";

interface FastestLapHeroProps {
  fastestDriver: LeaderboardEntry | null;
  totalFinished: number;
}

export function FastestLapHero({
  fastestDriver,
  totalFinished,
}: FastestLapHeroProps) {
  if (!fastestDriver) {
    return null;
  }

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border border-red-500/30 bg-gradient-to-r from-neutral-950 via-[#111117] to-neutral-950 p-5 shadow-2xl shadow-red-950/20 sm:p-6">
      {/* Animated scanline & speed flare */}
      <div className="pointer-events-none absolute -inset-px opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-500 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />

      <div className="relative z-10 flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        {/* Left: Driver & P1 status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Circular Driver Avatar */}
          <div className="relative">
            <CarImageFallback
              src={fastestDriver.driverImageUrl}
              alt={fastestDriver.participantName}
              type="driver"
              containerClassName="h-16 w-16 sm:h-20 sm:w-20 rounded-full border-2 border-red-500/70 shadow-lg shadow-red-600/30 overflow-hidden bg-neutral-900"
            />
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 font-mono text-xs font-black text-white ring-2 ring-neutral-950">
              P1
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 rounded bg-purple-950/80 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wider text-purple-300 border border-purple-800/60 shadow-sm">
                <Zap className="h-3 w-3 text-purple-400 fill-purple-400" />
                FASTEST LAP OVERALL
              </span>
              {fastestDriver.runNumber && (
                <span className="font-mono text-xs text-neutral-400">
                  RUN #{fastestDriver.runNumber}
                </span>
              )}
            </div>

            <h2
              className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {fastestDriver.participantName}
            </h2>

            <div className="flex items-center gap-3 mt-1">
              <span className="font-mono text-sm font-semibold uppercase tracking-wider text-neutral-300">
                {fastestDriver.teamName || "INDEPENDENT RACING"}
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="font-mono text-xs text-neutral-400">
                {totalFinished} {totalFinished === 1 ? "lap" : "laps"} timed
              </span>
            </div>
          </div>
        </div>

        {/* Center: Car Visual Preview */}
        {fastestDriver.carImageUrl && (
          <div className="hidden xl:block w-48 h-24 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-md">
            <CarImageFallback
              src={fastestDriver.carImageUrl}
              alt={`${fastestDriver.participantName} race car`}
              type="car"
              containerClassName="h-full w-full overflow-hidden bg-neutral-900"
            />
          </div>
        )}

        {/* Right: Giant Lap Time Display */}
        <div className="flex flex-col items-start lg:items-end w-full lg:w-auto border-t border-neutral-800/80 pt-4 lg:border-t-0 lg:pt-0">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-red-500" />
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-400">
              BENCHMARK TIME
            </span>
          </div>

          <div
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(225,6,0,0.4)]"
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            {formatLapTime(fastestDriver.timeMs, true)}
          </div>

          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-emerald-400 font-bold">
              CURRENT LEADER • LAP RECORD
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
