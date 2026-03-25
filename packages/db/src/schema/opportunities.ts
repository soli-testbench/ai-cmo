import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const opportunityTypeEnum = pgEnum("opportunity_type", [
  "search",
  "geo",
  "reddit",
  "competitor",
  "content",
]);

export const opportunityStatusEnum = pgEnum("opportunity_status", [
  "new",
  "reviewed",
  "acted",
  "dismissed",
]);

export const opportunities = pgTable(
  "opportunities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    agentId: text("agent_id").notNull(),
    type: opportunityTypeEnum("type").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    score: integer("score").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    status: opportunityStatusEnum("status").notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("opportunities_project_id_idx").on(table.projectId)],
);
