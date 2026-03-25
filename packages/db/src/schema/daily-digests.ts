import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const dailyDigests = pgTable("daily_digests", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  date: timestamp("date", { withTimezone: true }).notNull(),
  summary: text("summary").notNull(),
  opportunityCount: integer("opportunity_count").notNull().default(0),
  agentRunIds: jsonb("agent_run_ids").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
