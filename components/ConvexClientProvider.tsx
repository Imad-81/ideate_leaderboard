"use client";

import { ReactNode, useMemo } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ||
    "https://notable-setter-552.convex.cloud";

  const client = useMemo(() => {
    return new ConvexReactClient(convexUrl);
  }, [convexUrl]);

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
