import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { getMigrations } from "better-auth/db/migration";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import process from "node:process";

const dbPath = path.join(process.cwd(), "auth.db");

const auth = betterAuth({
  database: new DatabaseSync(dbPath),
  emailAndPassword: { enabled: true },
  plugins: [username()],
});

async function main() {
  console.log("🏁 Race Control: Initializing Authentication Database...");

  try {
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
    console.log("✅ Database schema verified.");
  } catch (error) {
    console.error("⚠️ Migration notice:", error);
  }

  const adminCredentials = {
    email: "admin@racecontrol.io",
    username: "admin",
    password: "RaceControl2026!",
    name: "Race Director",
  };

  try {
    const user = await auth.api.signUpEmail({
      body: adminCredentials,
    });
    console.log("🏎️ Admin user created successfully!");
    console.log("-----------------------------------------");
    console.log("👤 Name:     ", user.user.name);
    console.log("🔑 Username: ", user.user.username);
    console.log("✉️ Email:    ", user.user.email);
    console.log("🔒 Password: ", adminCredentials.password);
    console.log("-----------------------------------------");
  } catch (error) {
    const msg = error?.body?.message || error?.message || "";
    const code = error?.body?.code || error?.code || "";
    if (
      msg.includes("already taken") ||
      msg.includes("already exists") ||
      code === "USER_ALREADY_EXISTS" ||
      code === "USERNAME_IS_ALREADY_TAKEN" ||
      error?.statusCode === 400 ||
      error?.status === 400
    ) {
      console.log("ℹ️ Admin user already exists in the database.");
      console.log("-----------------------------------------");
      console.log("👤 Name:     ", adminCredentials.name);
      console.log("🔑 Username: ", adminCredentials.username);
      console.log("✉️ Email:    ", adminCredentials.email);
      console.log("🔒 Password: ", adminCredentials.password);
      console.log("-----------------------------------------");
    } else {
      console.error("❌ Error creating admin user:", error);
    }
  }
}

main()
  .then(() => {
    console.log("✨ Race Control Auth setup complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Failed to initialize auth:", err);
    process.exit(1);
  });
