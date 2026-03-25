import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const competitorProfiles = pgTable("competitor_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  name: text("name").notNull(),
  website: text("website"),
  description: text("description").notNull(),
  strengths: jsonb("strengths").$type<string[]>().notNull().default([]),
  weaknesses: jsonb("weaknesses").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
