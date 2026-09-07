"use client";

import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LeaderboardEntry } from "@/lib/types";
import { RaceHeader } from "@/components/leaderboard/RaceHeader";
import { FastestLapHero } from "@/components/leaderboard/FastestLapHero";
import { Podium } from "@/components/leaderboard/Podium";
import { TimingTower } from "@/components/leaderboard/TimingTower";
import { NewFastestLapAlert } from "@/components/leaderboard/NewFastestLapAlert";
import { EmptyState } from "@/components/leaderboard/EmptyState";
import { Activity } from "lucide-react";

export default function LeaderboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subscribe to Convex realtime leaderboard query
  const data = useQuery(api.results.getLeaderboard);

  const leaderboardEntries = (data?.leaderboard || []) as LeaderboardEntry[];
  const fastestDriver = data?.fastestParticipant as LeaderboardEntry | null;
  const totalCount = data?.totalCount || 0;
  const finishedCount = data?.finishedCount || 0;

  // Handle browser Fullscreen API
  const handleToggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-carbon-pattern flex flex-col justify-between text-neutral-100 ${
        isFullscreen ? "p-4 sm:p-8" : ""
      }`}
    >
      {/* Alert toast for new fastest lap */}
      <NewFastestLapAlert fastestDriver={fastestDriver} />

      <div>
        {/* Race Broadcast Header */}
        <RaceHeader
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          totalEntries={totalCount}
        />

        {/* Main Leaderboard Board Container */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {data === undefined ? (
            /* High-tech Loading State */
            <div className="flex min-h-[450px] flex-col items-center justify-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-neutral-900 border border-red-500/40">
                <div className="absolute inset-0 rounded-full border border-red-500/60 animate-ping opacity-75" />
                <Activity className="h-6 w-6 text-red-500 animate-pulse" />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
                CONNECTING TO RACE CONTROL TELEMETRY...
              </p>
            </div>
          ) : leaderboardEntries.length === 0 ? (
            /* Empty State */
            <EmptyState />
          ) : (
            /* Active Live Board */
            <div>
              {/* Broadcast Fastest Lap Banner */}
              <FastestLapHero
                fastestDriver={fastestDriver}
                totalFinished={finishedCount}
              />

              {/* Podium Section (P2 - P1 - P3) */}
              <Podium entries={leaderboardEntries} />

              {/* Timing Tower Table */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
                <div className="mb-4 flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <h3
                      className="font-mono text-sm font-bold uppercase tracking-widest text-neutral-300"
                    >
                      LIVE TIMING TOWER
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-neutral-400">
                    REAL-TIME UPDATES VIA CONVEX
                  </span>
                </div>

                <TimingTower
                  entries={leaderboardEntries}
                  isFullscreen={isFullscreen}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Bottom Telemetry Ticker / Status Bar */}
      <footer className="mt-8 border-t border-neutral-800/80 bg-neutral-950/90 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 font-mono text-[11px] text-neutral-400 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              OFFICIAL TIMING
            </span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="hidden sm:inline">SECTOR 1: CLEAR</span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="hidden sm:inline">SECTOR 2: CLEAR</span>
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span className="hidden sm:inline">FINISH LINE: ACTIVE</span>
          </div>

          <div className="flex items-center gap-4">
            <span>COLLEGE MOTORSPORT SERIES</span>
            <span className="text-neutral-700">•</span>
            <span className="text-red-400">ROUND 01</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
