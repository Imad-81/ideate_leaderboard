/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";

interface CarImageFallbackProps {
  src?: string | null;
  alt: string;
  type?: "car" | "driver";
  className?: string;
  containerClassName?: string;
}

export function CarImageFallback({
  src,
  alt,
  type = "car",
  className = "w-full h-full object-cover",
  containerClassName = "relative overflow-hidden rounded-md bg-neutral-900 border border-neutral-800",
}: CarImageFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const showFallback = !src || hasError;

  return (
    <div className={`group flex items-center justify-center ${containerClassName}`}>
      {!showFallback ? (
        <img
          src={src}
          alt={alt}
          onError={() => setHasError(true)}
          className={`transition-transform duration-500 group-hover:scale-105 ${className}`}
          loading="lazy"
        />
      ) : type === "car" ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 p-2 text-neutral-500">
          <svg
            className="h-7 w-7 stroke-neutral-600 transition-colors group-hover:stroke-red-500"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            RACE CAR
          </span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-neutral-950 p-2 text-neutral-500">
          <svg
            className="h-7 w-7 stroke-neutral-600 transition-colors group-hover:stroke-red-500"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
            <path d="M12 13v3" />
          </svg>
          <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-neutral-500">
            DRIVER
          </span>
        </div>
      )}
    </div>
  );
}
