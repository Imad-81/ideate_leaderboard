"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LeaderboardEntry } from "@/lib/types";
import { formatLapTime, formatGap } from "@/lib/time";
import { CarImageFallback } from "@/components/common/CarImageFallback";
import { ChevronUp, ChevronDown, Minus, AlertTriangle } from "lucide-react";

interface TimingTowerProps {
  entries: LeaderboardEntry[];
  isFullscreen?: boolean;
}

export function TimingTower({ entries, isFullscreen = false }: TimingTowerProps) {
  // Track previous ranks for position delta animation
  const prevRanksRef = useRef<Map<string, number>>(new Map());
  const [rankDeltas, setRankDeltas] = useState<Record<string, number>>({});

  useEffect(() => {
    const newDeltas: Record<string, number> = {};
    const currentRanks = new Map<string, number>();

    entries.forEach((item) => {
      if (item.rank !== null) {
        currentRanks.set(item._id, item.rank);
        const prevRank = prevRanksRef.current.get(item._id);

        if (prevRank !== undefined && prevRank !== item.rank) {
          // If prevRank was 4 and now is 2 -> delta is +2 (moved up)
          newDeltas[item._id] = prevRank - item.rank;
        } else {
          newDeltas[item._id] = 0;
        }
      }
    });

    setRankDeltas(newDeltas);
    prevRanksRef.current = currentRanks;
  }, [entries]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "FINISHED":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            FIN
          </span>
        );
      case "DNF":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-red-500/30 bg-red-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-red-400">
            <AlertTriangle className="h-2.5 w-2.5" />
            DNF
          </span>
        );
      case "DNS":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-400">
            DNS
          </span>
        );
      case "DISQUALIFIED":
        return (
          <span className="inline-flex items-center gap-1 rounded border border-purple-500/30 bg-purple-950/40 px-2 py-0.5 font-mono text-[10px] font-bold text-purple-400">
            DSQ
          </span>
        );
      default:
        return null;
    }
  };

  const renderDelta = (id: string) => {
    const delta = rankDeltas[id] || 0;
    if (delta > 0) {
      return (
        <span className="flex items-center font-mono text-xs font-bold text-emerald-400 animate-pulse">
          <ChevronUp className="h-3.5 w-3.5" />
          {delta}
        </span>
      );
    }
    if (delta < 0) {
      return (
        <span className="flex items-center font-mono text-xs font-bold text-red-500 animate-pulse">
          <ChevronDown className="h-3.5 w-3.5" />
          {Math.abs(delta)}
        </span>
      );
    }
    return (
      <span className="flex items-center font-mono text-xs font-medium text-neutral-600">
        <Minus className="h-3 w-3" />
      </span>
    );
  };

  return (
    <div className="w-full">
      {/* Timing Tower Header */}
      <div className="mb-3 hidden sm:grid sm:grid-cols-12 items-center px-4 py-2 font-mono text-xs uppercase tracking-widest text-neutral-400 border-b border-neutral-800">
        <div className="col-span-1 text-center font-bold">POS</div>
        <div className="col-span-1 text-center">CHG</div>
        <div className="col-span-4 lg:col-span-5 pl-2">DRIVER / TEAM</div>
        <div className="col-span-2 hidden lg:block">CAR</div>
        <div className="col-span-3 lg:col-span-2 text-right pr-2">BEST TIME</div>
        <div className="col-span-2 lg:col-span-1 text-right">GAP</div>
      </div>

      {/* Row List with Framer Motion Layout Animations */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {entries.map((item) => {
            const isP1 = item.rank === 1;
            const isP2 = item.rank === 2;
            const isP3 = item.rank === 3;

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  layout: { type: "spring", stiffness: 350, damping: 30 },
                  duration: 0.35,
                }}
                className={`group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  isP1
                    ? "border-red-500/80 bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-950 shadow-lg shadow-red-950/40 hover:border-red-400"
                    : isP2
                    ? "border-neutral-700 bg-neutral-900/80 hover:border-neutral-500"
                    : isP3
                    ? "border-neutral-700/80 bg-neutral-900/70 hover:border-neutral-500"
                    : "border-neutral-800/80 bg-neutral-950/80 hover:border-neutral-700"
                } ${isFullscreen ? "py-4 px-5" : "py-3 px-4"}`}
              >
                {/* Subtle Left Accent Stripe for P1 */}
                {isP1 && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-600 shadow-[0_0_10px_#e10600]" />
                )}

                {/* Desktop & TV Grid View */}
                <div className="hidden sm:grid sm:grid-cols-12 items-center gap-2">
                  {/* Position */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span
                      className={`font-mono font-black tracking-tighter ${
                        isP1
                          ? "text-red-500 text-3xl sm:text-4xl"
                          : isP2 || isP3
                          ? "text-neutral-100 text-2xl sm:text-3xl"
                          : "text-neutral-300 text-xl sm:text-2xl"
                      }`}
                      style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                    >
                      {item.rank ? item.rank.toString().padStart(2, "0") : "--"}
                    </span>
                  </div>

                  {/* Position Delta (Up/Down/Same) */}
                  <div className="col-span-1 flex items-center justify-center">
                    {renderDelta(item._id)}
                  </div>

                  {/* Driver Name, Team, & Driver Avatar */}
                  <div className="col-span-4 lg:col-span-5 flex items-center gap-3 pl-2 min-w-0">
                    <CarImageFallback
                      src={item.driverImageUrl}
                      alt={item.participantName}
                      type="driver"
                      containerClassName={`shrink-0 rounded-lg overflow-hidden border ${
                        isP1
                          ? "h-11 w-11 border-red-500/60 ring-2 ring-red-600/30"
                          : "h-10 w-10 border-neutral-700"
                      } bg-neutral-900`}
                    />

                    <div className="min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span
                          className={`truncate font-mono font-black uppercase tracking-tight ${
                            isFullscreen ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
                          } ${isP1 ? "text-white" : "text-neutral-100"}`}
                          style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                        >
                          {item.participantName}
                        </span>
                        {renderStatusBadge(item.status)}
                      </div>

                      {item.teamName && (
                        <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                          <span className="truncate">{item.teamName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Car Thumbnail (Large screens) */}
                  <div className="col-span-2 hidden lg:flex items-center">
                    {item.carImageUrl ? (
                      <CarImageFallback
                        src={item.carImageUrl}
                        alt={`${item.participantName} car`}
                        type="car"
                        containerClassName="h-10 w-24 rounded border border-neutral-800 bg-neutral-900 overflow-hidden"
                      />
                    ) : (
                      <span className="font-mono text-xs text-neutral-600 italic">No car visual</span>
                    )}
                  </div>

                  {/* Lap Time */}
                  <div className="col-span-3 lg:col-span-2 text-right pr-2">
                    <div
                      className={`font-mono font-black tracking-tight ${
                        isP1
                          ? "text-red-400 text-2xl sm:text-3xl drop-shadow-[0_0_8px_rgba(225,6,0,0.5)]"
                          : "text-white text-xl sm:text-2xl"
                      }`}
                      style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                    >
                      {item.status === "FINISHED" ? formatLapTime(item.timeMs) : item.status}
                    </div>
                    <div className="font-mono text-[10px] uppercase text-neutral-400">
                      {isP1 ? "FASTEST LAP" : "TIME"}
                    </div>
                  </div>

                  {/* Gap */}
                  <div className="col-span-2 lg:col-span-1 text-right">
                    <span
                      className={`font-mono font-bold ${
                        isP1
                          ? "text-red-400 text-base"
                          : "text-neutral-400 text-sm"
                      }`}
                    >
                      {formatGap(item.gapMs, isP1, item.status)}
                    </span>
                  </div>
                </div>

                {/* Mobile Compact Card View */}
                <div className="flex sm:hidden flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-mono font-black text-2xl ${
                          isP1 ? "text-red-500" : "text-white"
                        }`}
                        style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                      >
                        {item.rank ? item.rank.toString().padStart(2, "0") : "--"}
                      </span>
                      <div className="flex items-center">
                        {renderDelta(item._id)}
                      </div>
                      <CarImageFallback
                        src={item.driverImageUrl}
                        alt={item.participantName}
                        type="driver"
                        containerClassName="h-9 w-9 rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900"
                      />
                      <div>
                        <h4
                          className="font-mono text-base font-bold uppercase text-white leading-tight"
                          style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                        >
                          {item.participantName}
                        </h4>
                        {item.teamName && (
                          <span className="font-mono text-xs text-neutral-400">
                            {item.teamName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>{renderStatusBadge(item.status)}</div>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-neutral-800/80 pt-2 font-mono">
                    <span className="text-xs text-neutral-400">
                      GAP: {formatGap(item.gapMs, isP1, item.status)}
                    </span>
                    <span
                      className={`text-xl font-black ${
                        isP1 ? "text-red-400" : "text-white"
                      }`}
                      style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                    >
                      {item.status === "FINISHED" ? formatLapTime(item.timeMs) : item.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
