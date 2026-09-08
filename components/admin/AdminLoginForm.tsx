"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Tv,
  Radio,
  ArrowRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AdminLoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      setErrorMessage("Please enter your marshal username or email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your security access password.");
      return;
    }

    setIsLoading(true);

    try {
      let result;
      if (trimmedIdentifier.includes("@")) {
        // Authenticate with email
        result = await authClient.signIn.email({
          email: trimmedIdentifier,
          password,
        });
      } else {
        // Authenticate with username
        result = await authClient.signIn.username({
          username: trimmedIdentifier,
          password,
        });
      }

      if (result.error) {
        setErrorMessage(
          result.error.message ||
            "Authentication failed. Please verify your clearance credentials."
        );
        setIsLoading(false);
        return;
      }

      // Success - route to Race Control Console
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during authentication."
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Top Header Card Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-600/10 border border-red-500/20 shadow-lg shadow-red-600/10 mb-4 backdrop-blur-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 font-mono text-white shadow-md shadow-red-600/40">
            <ShieldCheck className="h-6 w-6" />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-red-400">
            RESTRICTED ACCESS PORTAL
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mb-2"
          style={{ fontFamily: "var(--font-racing), var(--font-mono)" }}
        >
          RACE CONTROL <span className="text-red-500">AUTHORIZATION</span>
        </h1>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto">
          Authorized telemetry marshals, race directors, and stewards access desk.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="relative rounded-2xl border border-neutral-800/80 bg-neutral-900/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/80">
        {/* Top telemetry accent */}
        <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

        {/* Error Callout */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-950/40 p-3.5 text-xs text-red-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
            <div className="flex-1 font-mono leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username or Email Input */}
          <div>
            <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
              Marshal Identifier / Username
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <User className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="admin or admin@racecontrol.io"
                autoComplete="username"
                disabled={isLoading}
                required
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-10 pr-4 font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="mb-2 block font-mono text-xs font-bold uppercase tracking-wider text-neutral-300">
              Clearance Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                required
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-10 pr-10 font-mono text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-3 font-mono text-sm font-black uppercase tracking-wider text-white shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01] hover:shadow-red-600/50 active:scale-[0.99] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Radio className="h-4 w-4 animate-spin text-white" />
                <span>VERIFYING CLEARANCE...</span>
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                <span>AUTHORIZE CONSOLE ENTRY</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-6 text-center">
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <Tv className="h-3.5 w-3.5 text-red-500" />
          <span>RETURN TO LIVE BROADCAST LEADERBOARD</span>
        </Link>
      </div>
    </div>
  );
}
