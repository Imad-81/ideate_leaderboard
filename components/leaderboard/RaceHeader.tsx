"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Maximize2, Minimize2, SlidersHorizontal } from "lucide-react";

interface RaceHeaderProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  totalEntries?: number;
}

export function RaceHeader({
  isFullscreen,
  onToggleFullscreen,
  totalEntries = 0,
}: RaceHeaderProps) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-20 border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md">
      {/* Top micro racing accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-neutral-700 to-red-600" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left: Event Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-800 font-mono text-xl font-black text-white shadow-lg shadow-red-600/30">
            01
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-red-500">
                ROUND 01
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-600" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-400">
                COLLEGE MOTORSPORT SERIES
              </span>
            </div>
            <h1 className="font-mono text-xl font-black tracking-tight text-white sm:text-2xl" style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}>
              GRAND PRIX <span className="text-red-500">TIMING</span>
            </h1>
          </div>
        </div>

        {/* Center: Track Status & Telemetry (Hidden on small mobile) */}
        <div className="hidden md:flex items-center gap-6 border-x border-neutral-800/80 px-6 py-1">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
                TRACK STATUS
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                GREEN FLAG
              </span>
            </div>
          </div>

          <div className="flex flex-col border-l border-neutral-800/80 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              TELEMETRY CLOCK
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-200">
              {timeStr || "00:00:00"} UTC
            </span>
          </div>

          <div className="flex flex-col border-l border-neutral-800/80 pl-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-neutral-400">
              CARS ON GRID
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-200">
              {totalEntries} REGISTERED
            </span>
          </div>
        </div>

        {/* Right: Live Beacon & Controls */}
        <div className="flex items-center gap-3">
          {/* Pulsing Live Badge */}
          <div className="flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 shadow-sm shadow-red-900/40">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-red-400">
              LIVE
            </span>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-xs font-medium text-neutral-200 transition-all hover:border-neutral-500 hover:bg-neutral-800 active:scale-95"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen (TV Mode)"}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5 text-red-400" />
                <span className="hidden sm:inline font-mono">EXIT TV</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5 text-neutral-400" />
                <span className="hidden sm:inline font-mono">TV MODE</span>
              </>
            )}
          </button>

          {/* Admin Race Control Link */}
          <Link
            href="/admin"
            className="flex h-9 items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-xs font-medium text-neutral-300 transition-all hover:border-red-600/50 hover:bg-red-950/30 hover:text-white active:scale-95"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-red-500" />
            <span className="hidden sm:inline font-mono uppercase tracking-wider">
              Race Control
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
