"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X } from "lucide-react";
import { LeaderboardEntry } from "@/lib/types";
import { formatLapTime } from "@/lib/time";

interface NewFastestLapAlertProps {
  fastestDriver: LeaderboardEntry | null;
}

export function NewFastestLapAlert({ fastestDriver }: NewFastestLapAlertProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [activeDriver, setActiveDriver] = useState<LeaderboardEntry | null>(null);

  const prevFastestIdRef = useRef<string | null>(null);
  const prevTimeMsRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!fastestDriver) return;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      prevFastestIdRef.current = fastestDriver._id;
      prevTimeMsRef.current = fastestDriver.timeMs;
      return;
    }

    const prevId = prevFastestIdRef.current;
    const prevTime = prevTimeMsRef.current;

    // Check if new driver took P1 or existing P1 improved lap time
    const isNewLeader = prevId !== fastestDriver._id;
    const isFasterTime = prevTime !== null && fastestDriver.timeMs < prevTime;

    if (isNewLeader || isFasterTime) {
      setActiveDriver(fastestDriver);
      setShowNotification(true);

      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 6000);

      prevFastestIdRef.current = fastestDriver._id;
      prevTimeMsRef.current = fastestDriver.timeMs;

      return () => clearTimeout(timer);
    }
  }, [fastestDriver]);

  if (!activeDriver) return null;

  return (
    <AnimatePresence>
      {showNotification && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full"
        >
          <div className="relative overflow-hidden rounded-xl border-2 border-purple-500 bg-neutral-950 p-4 shadow-2xl shadow-purple-950/70 backdrop-blur-xl">
            {/* Top scanning highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-red-500 to-purple-500 animate-pulse" />

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-600 font-mono text-xs font-black text-white shadow-md shadow-purple-600/50">
                  <Zap className="h-3.5 w-3.5 fill-white" />
                </span>
                <span className="font-mono text-xs font-black uppercase tracking-wider text-purple-400">
                  NEW FASTEST LAP • P1 OVERALL
                </span>
              </div>

              <button
                onClick={() => setShowNotification(false)}
                className="text-neutral-500 hover:text-neutral-200 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <h3
                  className="font-mono text-xl font-black uppercase text-white tracking-tight"
                  style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                >
                  {activeDriver.participantName}
                </h3>
                <p className="font-mono text-xs text-neutral-400">
                  {activeDriver.teamName || "Independent Competitor"}
                </p>
              </div>

              <div className="text-right">
                <div
                  className="font-mono text-2xl font-black text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
                >
                  {formatLapTime(activeDriver.timeMs)}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-purple-400">
                  NEW BENCHMARK
                </div>
              </div>
            </div>

            {/* Progress countdown bar */}
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: 6, ease: "linear" }}
              className="mt-3 h-0.5 bg-purple-500/60 rounded-full"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
