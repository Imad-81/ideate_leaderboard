"use client";

import React from "react";
import { LeaderboardEntry } from "@/lib/types";
import { formatLapTime, formatGap } from "@/lib/time";
import { CarImageFallback } from "@/components/common/CarImageFallback";

interface PodiumProps {
  entries: LeaderboardEntry[];
}

export function Podium({ entries }: PodiumProps) {
  const finishedEntries = entries.filter((e) => e.status === "FINISHED");
  if (finishedEntries.length < 3) {
    return null;
  }

  const p1 = finishedEntries[0];
  const p2 = finishedEntries[1];
  const p3 = finishedEntries[2];

  const renderCard = (
    entry: LeaderboardEntry,
    pos: number,
    posLabel: string,
    isP1: boolean,
    borderStyle: string,
    badgeStyle: string,
    timeGradient: string
  ) => {
    const imageUrl = entry.driverImageUrl || entry.carImageUrl;

    return (
      <div
        className={`relative overflow-hidden rounded-2xl ${borderStyle} bg-neutral-950/90 shadow-2xl backdrop-blur-md flex flex-col transition-all duration-300 hover:scale-[1.01] ${
          isP1 ? "glow-red-blue ring-1 ring-red-500/30" : ""
        }`}
      >
        {/* Prominent Hero Image Container */}
        <div
          className={`relative w-full bg-neutral-900 overflow-hidden ${
            isP1 ? "h-64 sm:h-72 lg:h-80" : "h-44 sm:h-52"
          }`}
        >
          <CarImageFallback
            src={imageUrl}
            alt={entry.participantName}
            type={entry.carImageUrl && !entry.driverImageUrl ? "car" : "driver"}
            containerClassName="w-full h-full"
            iconClassName={
              isP1
                ? "h-24 w-24 sm:h-28 sm:w-28 stroke-neutral-600 group-hover:stroke-red-500"
                : "h-16 w-16 sm:h-20 sm:w-20 stroke-neutral-600 group-hover:stroke-blue-500"
            }
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
          />

          {/* Bottom vignette gradient to blend seamlessly into card content */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Position Floating Badge (P1, P2, P3) */}
          <div className="absolute top-3.5 left-3.5 z-10">
            <span
              className={`flex items-center justify-center font-mono font-black ${badgeStyle} shadow-lg`}
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {posLabel}
            </span>
          </div>

          {/* Gap Badge (for P2 and P3) */}
          {!isP1 && entry.gapMs !== null && (
            <div className="absolute top-3.5 right-3.5 z-10">
              <span className="rounded-lg bg-black/75 px-2.5 py-1 font-mono text-xs font-bold text-neutral-300 backdrop-blur-md border border-neutral-700/80 shadow-md">
                {formatGap(entry.gapMs, false, entry.status)}
              </span>
            </div>
          )}
        </div>

        {/* Info Area: Name & Time Only */}
        <div
          className={`flex flex-col justify-between flex-1 ${
            isP1 ? "p-6 sm:p-7 pt-5" : "p-4 sm:p-5 pt-3"
          }`}
        >
          {/* Driver Name - Fully bold & prominent */}
          <h3
            className={`font-mono font-black uppercase tracking-tight text-white leading-tight mb-2 break-words ${
              isP1
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "text-xl sm:text-2xl"
            }`}
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            {entry.participantName}
          </h3>

          {/* Time - Giant, bold & high-contrast */}
          <div className="pt-2 border-t border-neutral-800/80 flex items-baseline">
            <div
              className={`font-mono font-black tracking-tight ${timeGradient} ${
                isP1 ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl"
              }`}
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {formatLapTime(entry.timeMs)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* P1 Champion Hero Card (Bigger, Crown Position) */}
      {renderCard(
        p1,
        1,
        "P1",
        true,
        "border-2 border-red-500/90 shadow-2xl",
        "h-10 px-3.5 text-base bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white rounded-xl shadow-red-600/50",
        "text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-200 to-blue-400 drop-shadow-[0_0_20px_rgba(225,6,0,0.6)]"
      )}

      {/* P2 & P3 Sub-Podium (Side by Side beneath P1) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* P2 (Left) */}
        {renderCard(
          p2,
          2,
          "P2",
          false,
          "border border-blue-500/50 shadow-blue-950/30 hover:border-blue-400",
          "h-8 px-2.5 text-xs bg-blue-600 text-white rounded-lg shadow-blue-600/40",
          "text-blue-100"
        )}

        {/* P3 (Right) */}
        {renderCard(
          p3,
          3,
          "P3",
          false,
          "border border-neutral-800 shadow-neutral-950/40 hover:border-neutral-700",
          "h-8 px-2.5 text-xs bg-neutral-800 border border-neutral-700 text-amber-400 rounded-lg shadow-neutral-900/50",
          "text-neutral-100"
        )}
      </div>
    </div>
  );
}
