"use client";

import React from "react";

export function AnimatedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Primary Crimson Flare (Top-Left drifting and pulsing) */}
      <div className="absolute -top-32 -left-32 h-[650px] w-[650px] rounded-full bg-red-600/20 blur-[150px] animate-ambient-red" />

      {/* Primary Electric Sapphire Flare (Top-Right drifting and pulsing) */}
      <div className="absolute -top-32 -right-32 h-[700px] w-[700px] rounded-full bg-blue-600/25 blur-[160px] animate-ambient-blue" />

      {/* Deep Violet / Magenta Aurora (Center breathing) */}
      <div className="absolute top-1/2 left-1/2 h-[750px] w-[750px] rounded-full bg-purple-600/15 blur-[180px] animate-ambient-purple" />

      {/* Electric Cyan Telemetry Accent (Bottom drifting) */}
      <div className="absolute -bottom-40 right-1/4 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[150px] animate-ambient-cyan" />

      {/* Counter-balanced Red Flare (Bottom-Left) */}
      <div
        className="absolute -bottom-40 -left-20 h-[500px] w-[500px] rounded-full bg-red-700/15 blur-[160px] animate-ambient-red"
        style={{ animationDelay: "-8s" }}
      />
    </div>
  );
}
