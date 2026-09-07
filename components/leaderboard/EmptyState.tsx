"use client";

import React from "react";
import Link from "next/link";
import { SlidersHorizontal, Radio } from "lucide-react";

export function EmptyState() {
  return (
    <div className="relative mx-auto my-12 max-w-2xl rounded-2xl border border-neutral-800 bg-gradient-to-b from-neutral-900/60 to-neutral-950 p-8 sm:p-12 text-center backdrop-blur-xl shadow-2xl">
      {/* Radar pulses */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900 border border-neutral-700/60 relative">
        <div className="absolute inset-0 rounded-full border border-red-500/40 animate-ping opacity-60" />
        <Radio className="h-8 w-8 text-red-500 animate-pulse" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-950/40 px-3 py-1 font-mono text-xs font-bold text-red-400 mb-4">
        <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
        TIMING SENSORS ACTIVE
      </div>

      <h2
        className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-3"
        style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
      >
        NO LAPS RECORDED
      </h2>

      <p className="font-mono text-sm sm:text-base text-neutral-400 max-w-md mx-auto leading-relaxed mb-8">
        RACE CONTROL IS WAITING FOR THE FIRST DRIVER TO CROSS THE START/FINISH LINE.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/admin"
          className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:bg-red-500 active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4" />
          OPEN RACE CONTROL
        </Link>
      </div>
    </div>
  );
}
