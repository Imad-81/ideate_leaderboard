import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const dbPath = path.join(process.cwd(), "auth.db");

export const auth = betterAuth({
  database: new DatabaseSync(dbPath),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
    nextCookies(),
  ],
});
