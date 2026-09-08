import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { AnimatedBackground } from "@/components/common/AnimatedBackground";
import { BrandCredit } from "@/components/common/BrandCredit";

export const metadata = {
  title: "Race Control Login | Grand Prix Live Timing",
  description: "Official marshal authentication and access portal for race control telemetry management.",
};

export default async function AdminLoginPage() {
  // Check if already authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-carbon-pattern flex flex-col justify-between text-neutral-100 relative">
      <AnimatedBackground />

      {/* Top red racing line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-red-600 via-neutral-700 to-red-600 relative z-20" />

      {/* Center login workspace */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <AdminLoginForm />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-800/80 bg-neutral-950/90 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 font-mono text-[11px] text-neutral-400 sm:px-6 lg:px-8">
          <div>RESTRICTED CONSOLE • OFFICIAL MARSHAL DESK</div>
          <div className="w-full sm:w-auto flex justify-center order-last sm:order-none">
            <BrandCredit layout="horizontal" />
          </div>
          <div className="text-red-400">SESSION ENCRYPTION ACTIVE</div>
        </div>
      </footer>
    </div>
  );
}
