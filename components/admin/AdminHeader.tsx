"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, Tv } from "lucide-react";
import { GridStats } from "@/lib/types";
import { formatLapTime } from "@/lib/time";

interface AdminHeaderProps {
  stats?: GridStats;
}

export function AdminHeader({ stats }: AdminHeaderProps) {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/95 backdrop-blur-md">
      {/* Top red racing line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-neutral-700 to-red-600" />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 font-mono text-lg font-black text-white shadow-lg shadow-red-600/30">
            <SlidersHorizontal className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
                OFFICIAL OPERATIONS
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                MARSHAL DESK
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white"
              style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
            >
              RACE CONTROL <span className="text-red-500">CONSOLE</span>
            </h1>
          </div>
        </div>

        {/* Center / Stats summary */}
        {stats && (
          <div className="flex flex-wrap items-center gap-4 border-y sm:border-y-0 sm:border-x border-neutral-800/80 py-2 sm:py-0 sm:px-6">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase text-neutral-400">
                RECORD LAP
              </span>
              <span className="font-mono text-xs font-bold text-purple-400">
                {stats.fastestTimeMs ? formatLapTime(stats.fastestTimeMs) : "--"}
              </span>
            </div>

            <div className="flex flex-col border-l border-neutral-800 pl-4">
              <span className="font-mono text-[10px] uppercase text-neutral-400">
                COMPLETED
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {stats.finishedRuns} / {stats.totalRuns}
              </span>
            </div>

            <div className="flex flex-col border-l border-neutral-800 pl-4">
              <span className="font-mono text-[10px] uppercase text-neutral-400">
                DNF / DSQ
              </span>
              <span className="font-mono text-xs font-bold text-red-400">
                {stats.dnfRuns + stats.disqualifiedRuns}
              </span>
            </div>
          </div>
        )}

        {/* Right: Link to Public Broadcast Board */}
        <div className="flex items-center gap-3">
          <Link
            href="/leaderboard"
            className="flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
          >
            <Tv className="h-4 w-4" />
            <span>VIEW LIVE BOARD</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
