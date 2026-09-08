"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, Tv, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { GridStats } from "@/lib/types";
import { formatLapTime } from "@/lib/time";
import { authClient } from "@/lib/auth-client";

interface AdminHeaderProps {
  stats?: GridStats;
}

export function AdminHeader({ stats }: AdminHeaderProps) {
  const router = useRouter();
  const [session, setSession] = useState<{ user?: { name?: string | null; username?: string | null } } | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    authClient.getSession().then((res) => {
      if (res?.data) {
        setSession(res.data);
      }
    });
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
    }
  };

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

        {/* Right: User Status & Actions */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Operator Status */}
          {session?.user && (
            <div className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 font-mono text-xs text-neutral-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">{session.user.name || "Marshal"}</span>
                <span className="text-[10px] text-neutral-400">
                  (@{(session.user as { username?: string }).username || "admin"})
                </span>
              </div>
            </div>
          )}

          {/* Link to Public Broadcast Board */}
          <Link
            href="/leaderboard"
            className="flex h-9 items-center gap-2 rounded-lg bg-neutral-800/80 hover:bg-neutral-700 px-3 font-mono text-xs font-bold uppercase tracking-wider text-neutral-200 border border-neutral-700/60 transition-all active:scale-95"
          >
            <Tv className="h-3.5 w-3.5 text-red-400" />
            <span className="hidden sm:inline">LIVE BOARD</span>
          </Link>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 hover:text-white border border-red-600/40 px-3 font-mono text-xs font-bold uppercase tracking-wider text-red-300 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            title="Sign out of race control console"
          >
            {isSigningOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            <span>SIGN OUT</span>
          </button>
        </div>
      </div>
    </header>
  );
}

