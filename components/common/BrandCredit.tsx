import React from "react";
import Image from "next/image";

interface BrandCreditProps {
  className?: string;
  layout?: "vertical" | "horizontal";
}

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function BrandCredit({ className = "", layout = "vertical" }: BrandCreditProps) {
  if (layout === "horizontal") {
    return (
      <div
        className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-neutral-800/90 bg-neutral-950/85 backdrop-blur-md shadow-xl text-neutral-300 hover:border-neutral-700 transition-all select-none ${className}`}
      >
        <Image
          src="/ideate logo white.png"
          alt="Ideate Logo"
          width={70}
          height={28}
          className="h-6 w-auto object-contain brightness-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.25)]"
          priority
        />
        <span className="h-4 w-px bg-neutral-700" />
        <span className="font-mono text-xs sm:text-sm text-neutral-200 tracking-normal">
          made with love by Shaik Imaduddin and Ideate.
        </span>
        <span className="h-4 w-px bg-neutral-700" />
        <a
          href="https://instagram.com/imad._.81"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm text-neutral-300 hover:text-pink-400 transition-colors"
          title="Follow on Instagram"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400" />
          <span>@imad._.81</span>
        </a>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-col items-center justify-center gap-3 sm:gap-3.5 px-8 py-5 sm:px-12 sm:py-6 rounded-2xl sm:rounded-3xl border border-neutral-800/90 bg-neutral-950/75 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] text-center select-none hover:border-neutral-700/90 transition-all duration-300 ${className}`}
    >
      <Image
        src="/ideate logo white.png"
        alt="Ideate Logo"
        width={180}
        height={72}
        className="h-12 sm:h-14 md:h-16 w-auto object-contain brightness-125 drop-shadow-[0_0_18px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-300"
        priority
      />
      <p className="font-mono text-sm sm:text-base md:text-lg font-medium text-neutral-100 tracking-normal">
        made with love by Shaik Imaduddin and Ideate.
      </p>
      <a
        href="https://instagram.com/imad._.81"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/60 font-mono text-xs sm:text-sm md:text-[15px] text-neutral-200 hover:text-white hover:border-pink-500/50 hover:bg-neutral-800/80 transition-all shadow-md"
        title="Follow on Instagram"
      >
        <InstagramIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-pink-400 group-hover:scale-110 transition-transform" />
        <span className="tracking-wide group-hover:underline underline-offset-2">@imad._.81</span>
      </a>
    </div>
  );
}
