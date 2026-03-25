import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { client, db } from "./connection.js";

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");
  await client.end();
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
