"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { LeaderboardEntry } from "@/lib/types";
import { Podium } from "@/components/leaderboard/Podium";
import { TimingTower } from "@/components/leaderboard/TimingTower";
import { NewFastestLapAlert } from "@/components/leaderboard/NewFastestLapAlert";
import { EmptyState } from "@/components/leaderboard/EmptyState";
import { Maximize2, Minimize2, SlidersHorizontal, Activity } from "lucide-react";

export default function LeaderboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subscribe to Convex realtime leaderboard query
  const data = useQuery(api.results.getLeaderboard);

  const leaderboardEntries = (data?.leaderboard || []) as LeaderboardEntry[];
  const fastestDriver = data?.fastestParticipant as LeaderboardEntry | null;

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

      {/* Floating minimal utility controls (unobtrusive, replaces bulky navbar) */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={handleToggleFullscreen}
          className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/80 px-2.5 font-mono text-[11px] text-neutral-400 backdrop-blur-md hover:border-neutral-600 hover:text-white transition-all shadow-md"
          title={isFullscreen ? "Exit TV Mode" : "TV Mode"}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="h-3.5 w-3.5 text-red-400" />
              <span className="hidden sm:inline">EXIT TV</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">TV MODE</span>
            </>
          )}
        </button>

        <Link
          href="/admin"
          className="flex h-8 items-center gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950/80 px-2.5 font-mono text-[11px] text-neutral-400 backdrop-blur-md hover:border-red-500/50 hover:text-white transition-all shadow-md"
          title="Race Control"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 text-red-500" />
          <span className="hidden sm:inline">CONTROL</span>
        </Link>
      </div>

      {/* Dynamic Ambient Background Glows: Crimson Red (Left) and Electric Sapphire Blue (Right) */}
      <div className="pointer-events-none fixed -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-red-600/10 blur-[150px]" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-600/15 blur-[160px]" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-indigo-950/20 blur-[180px]" />

      <div>
        {/* Main Leaderboard Board Container */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
              {/* Podium Section (P2 - P1 - P3) */}
              <Podium entries={leaderboardEntries} />

              {/* Timing Tower Table */}
              <div className="relative overflow-hidden rounded-2xl border border-neutral-800/90 bg-neutral-950/70 p-4 sm:p-6 shadow-2xl backdrop-blur-md">
                {/* Top dual red-to-blue racing laser line */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-purple-600 to-blue-500 shadow-[0_0_12px_rgba(0,102,255,0.6)]" />

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
            <Link href="/admin" className="text-neutral-400 hover:text-red-400 transition-colors">
              RACE CONTROL
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
