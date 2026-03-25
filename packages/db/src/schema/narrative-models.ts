import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { projects } from "./projects.js";

export const narrativeModels = pgTable("narrative_models", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  coreNarrative: text("core_narrative").notNull(),
  themes: jsonb("themes").$type<string[]>().notNull().default([]),
  voiceTone: text("voice_tone").notNull(),
  targetAudiences: jsonb("target_audiences").$type<string[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
