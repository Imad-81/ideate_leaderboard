import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query, action } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl =
  process.env.SITE_URL ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const authComponent = createClient<DataModel>(components.betterAuth);

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://ideateleaderboard.vercel.app",
      ...(process.env.SITE_URL ? [process.env.SITE_URL] : []),
    ],
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [
      convex({ authConfig }),
    ],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});

export const seedAdmin = action({
  args: {},
  handler: async (ctx) => {
    const auth = createAuth(ctx);
    const adminCredentials = {
      email: "admin@racecontrol.io",
      password: "RaceControl2026!",
      name: "Race Director",
    };

    try {
      const user = await auth.api.signUpEmail({
        body: adminCredentials,
      });
      return { success: true, created: true, user: user.user };
    } catch (err: unknown) {
      const errObj = err as { body?: { message?: string }; message?: string; status?: number; statusCode?: number } | undefined;
      const msg = errObj?.body?.message || errObj?.message || "";
      if (msg.includes("already") || errObj?.status === 400 || errObj?.statusCode === 400) {
        return { success: true, created: false, message: "Admin user already exists in Convex." };
      }
      throw err;
    }
  },
});
