import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { opportunities } from "./opportunities.js";
import { projects } from "./projects.js";

export const assetTypeEnum = pgEnum("asset_type", ["article", "social", "email", "ad"]);

export const assetStatusEnum = pgEnum("asset_status", ["draft", "published", "archived"]);

export const assets = pgTable("assets", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => projects.id),
  opportunityId: uuid("opportunity_id").references(() => opportunities.id),
  type: assetTypeEnum("type").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: assetStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});
