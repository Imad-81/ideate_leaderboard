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

  const renderPodiumStep = (
    entry: LeaderboardEntry,
    pos: number,
    posLabel: string,
    isP1: boolean,
    borderStyle: string,
    badgeStyle: string,
    timeGradient: string,
    imageHeight: string,
    pedestalHeight: string,
    watermarkNum: string,
    accentLineColor: string,
    offsetClass: string
  ) => {
    const imageUrl = entry.driverImageUrl || entry.carImageUrl;

    return (
      <div
        className={`relative flex flex-col overflow-hidden rounded-2xl ${borderStyle} bg-neutral-950/95 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.015] ${
          isP1 ? "glow-red-blue ring-1 ring-red-500/40 z-10" : "z-0"
        } ${offsetClass}`}
      >
        {/* Driver Hero Portrait on the Step */}
        <div className={`relative w-full ${imageHeight} bg-neutral-900 overflow-hidden`}>
          <CarImageFallback
            src={imageUrl}
            alt={entry.participantName}
            type={entry.carImageUrl && !entry.driverImageUrl ? "car" : "driver"}
            containerClassName="w-full h-full"
            iconClassName={
              isP1
                ? "h-20 w-20 sm:h-24 sm:w-24 stroke-neutral-600 group-hover:stroke-red-500"
                : "h-14 w-14 sm:h-16 sm:w-16 stroke-neutral-600 group-hover:stroke-blue-500"
            }
            className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
          />

          {/* Vignette gradient to seamlessly blend into pedestal */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Position Floating Badge */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
            <span
              className={`flex items-center justify-center font-mono font-black ${badgeStyle} shadow-lg`}
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {posLabel}
            </span>
          </div>

          {/* Gap Badge (for P2 and P3) */}
          {!isP1 && entry.gapMs !== null && (
            <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10">
              <span className="rounded-md sm:rounded-lg bg-black/80 px-1.5 py-0.5 sm:px-2 sm:py-1 font-mono text-[10px] sm:text-xs font-bold text-neutral-300 backdrop-blur-md border border-neutral-700/80 shadow-md">
                {formatGap(entry.gapMs, false, entry.status)}
              </span>
            </div>
          )}
        </div>

        {/* Podium Pedestal Step Block */}
        <div
          className={`relative flex flex-col justify-between ${pedestalHeight} p-3 sm:p-4 md:p-5 bg-gradient-to-b from-neutral-900/90 to-neutral-950 border-t ${accentLineColor} overflow-hidden rounded-b-2xl`}
        >
          {/* Giant Step Number Watermark */}
          <div
            className="pointer-events-none absolute right-1 -bottom-2 font-mono font-black text-white/[0.05] select-none text-7xl sm:text-8xl md:text-9xl leading-none"
            style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
          >
            {watermarkNum}
          </div>

          {/* Driver Name - Fully bold & prominent */}
          <div className="relative z-10">
            <h3
              className={`font-mono font-black uppercase tracking-tight text-white leading-tight break-words ${
                isP1
                  ? "text-lg sm:text-2xl md:text-3xl"
                  : "text-base sm:text-xl md:text-2xl"
              }`}
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              {entry.participantName}
            </h3>
          </div>

          {/* Lap Time - High contrast on pedestal face */}
          <div className="relative z-10 pt-2 border-t border-neutral-800/80">
            <div
              className={`font-mono font-black tracking-tight ${timeGradient} ${
                isP1
                  ? "text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
                  : "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
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

  const commonImageHeight = "h-52 sm:h-60 md:h-68 lg:h-76";
  const commonPedestalHeight = "h-36 sm:h-40 md:h-44";

  return (
    <div className="w-full pb-24 sm:pb-32 lg:pb-36">
      {/* 3 Stepped Podium Columns:
          P1 is highest at both top and bottom.
          P2 (second) is lower than P1 at both top and bottom.
          P3 (third) is lower than both P1 and P2 at both top and bottom.
      */}
      <div className="grid grid-cols-[1fr_1.22fr_1fr] items-start gap-3 sm:gap-4 md:gap-5">
        {/* P2 Step (Left - Second position: shifted down from P1) */}
        {renderPodiumStep(
          p2,
          2,
          "P2",
          false,
          "border border-blue-500/50 shadow-blue-950/30 hover:border-blue-400",
          "h-7 px-2 text-xs sm:h-8 sm:px-2.5 bg-blue-600 text-white rounded-lg shadow-blue-600/40",
          "text-blue-100",
          commonImageHeight,
          commonPedestalHeight,
          "2",
          "border-blue-500/60",
          "translate-y-8 sm:translate-y-10 lg:translate-y-14"
        )}

        {/* P1 Step (Center - First position: highest at both top & bottom) */}
        {renderPodiumStep(
          p1,
          1,
          "P1",
          true,
          "border-2 border-red-500/90 shadow-2xl",
          "h-8 px-2.5 text-xs sm:h-10 sm:px-3.5 sm:text-base bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-white rounded-xl shadow-red-600/50",
          "text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-200 to-blue-300 drop-shadow-[0_0_20px_rgba(225,6,0,0.6)]",
          commonImageHeight,
          commonPedestalHeight,
          "1",
          "border-red-500/80 shadow-[0_0_12px_rgba(225,6,0,0.5)]",
          "translate-y-0"
        )}

        {/* P3 Step (Right - Third position: lowest of both at top & bottom) */}
        {renderPodiumStep(
          p3,
          3,
          "P3",
          false,
          "border border-neutral-800 shadow-neutral-950/40 hover:border-neutral-700",
          "h-7 px-2 text-xs sm:h-8 sm:px-2.5 bg-neutral-800 border border-neutral-700 text-amber-400 rounded-lg shadow-neutral-900/50",
          "text-neutral-100",
          commonImageHeight,
          commonPedestalHeight,
          "3",
          "border-amber-600/60",
          "translate-y-16 sm:translate-y-20 lg:translate-y-28"
        )}
      </div>
    </div>
  );
}
