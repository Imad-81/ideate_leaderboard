"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { GridStats } from "@/lib/types";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ResultForm } from "@/components/admin/ResultForm";
import { ResultsManagementTable } from "@/components/admin/ResultsManagementTable";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { BrandCredit } from "@/components/common/BrandCredit";

export default function AdminPage() {
  const stats = useQuery(api.results.getStats) as GridStats | undefined;

  return (
    <div className="min-h-screen bg-carbon-pattern flex flex-col justify-between text-neutral-100 relative">
      <AnimatedBackground />
      <div className="relative z-10">
        {/* Race Control Header */}
        <AdminHeader stats={stats} />

        {/* Main Console Workspace */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Quick Result Entry Console */}
          <ResultForm />

          {/* Existing Grid Management & Telemetry Log Table */}
          <ResultsManagementTable />
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-neutral-800/80 bg-neutral-950/90 py-4 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 font-mono text-[11px] text-neutral-400 sm:px-6 lg:px-8">
          <div>OFFICIAL RACE CONTROL CONSOLE • RESTRICTED MARSHAL DESK</div>
          {/* Bottom Center Credit */}
          <div className="w-full sm:w-auto sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex justify-center order-last sm:order-none">
            <BrandCredit layout="horizontal" />
          </div>
          <div className="text-red-400">TELEMETRY SECURE</div>
        </div>
      </footer>
    </div>
  );
}
