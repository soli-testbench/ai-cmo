import { index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    agentId: text("agent_id").notNull(),
    type: text("type", {
      enum: ["search", "geo", "reddit", "competitor", "content"],
    }).notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    score: integer("score").notNull().default(0),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    status: text("status", {
      enum: ["new", "reviewed", "acted", "dismissed"],
    })
      .notNull()
      .default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("opportunities_project_id_idx").on(table.projectId)],
);
