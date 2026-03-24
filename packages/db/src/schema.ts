import { pgTable, text, timestamp, varchar, integer, pgEnum } from 'drizzle-orm/pg-core';

// ── Enums ──────────────────────────────────────────────────────────────────

export const opportunityCategoryEnum = pgEnum('opportunity_category', [
  'content',
  'seo',
  'social',
  'competitive',
  'geographic',
  'trending',
]);

export const priorityEnum = pgEnum('priority', ['low', 'medium', 'high', 'critical']);

export const opportunityStatusEnum = pgEnum('opportunity_status', [
  'new',
  'reviewed',
  'accepted',
  'dismissed',
  'completed',
]);

export const assetTypeEnum = pgEnum('asset_type', [
  'blog_post',
  'social_post',
  'email',
  'ad_copy',
  'landing_page',
]);

export const assetStatusEnum = pgEnum('asset_status', ['draft', 'review', 'approved', 'published']);

export const campaignStatusEnum = pgEnum('campaign_status', [
  'planning',
  'active',
  'paused',
  'completed',
]);

export const agentRunStatusEnum = pgEnum('agent_run_status', [
  'pending',
  'running',
  'completed',
  'failed',
  'retrying',
]);

// ── Tables ─────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const companyProfiles = pgTable('company_profiles', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id)
    .unique(),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  industry: varchar('industry', { length: 255 }).notNull(),
  description: text('description').notNull(),
  website: varchar('website', { length: 512 }),
  targetAudience: text('target_audience'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const narrativeModels = pgTable('narrative_models', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id)
    .unique(),
  coreNarrative: text('core_narrative').notNull(),
  toneGuidelines: text('tone_guidelines').notNull(),
  keyMessages: text('key_messages').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const competitorProfiles = pgTable('competitor_profiles', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  name: varchar('name', { length: 255 }).notNull(),
  website: varchar('website', { length: 512 }),
  description: text('description').notNull(),
  strengths: text('strengths').array().notNull(),
  weaknesses: text('weaknesses').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const agentRuns = pgTable('agent_runs', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  agentName: varchar('agent_name', { length: 255 }).notNull(),
  status: agentRunStatusEnum('status').default('pending').notNull(),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  resultSummary: text('result_summary'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const opportunities = pgTable('opportunities', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  agentRunId: text('agent_run_id')
    .notNull()
    .references(() => agentRuns.id),
  title: varchar('title', { length: 512 }).notNull(),
  description: text('description').notNull(),
  category: opportunityCategoryEnum('category').notNull(),
  priority: priorityEnum('priority').notNull(),
  sourceAgent: varchar('source_agent', { length: 255 }).notNull(),
  sourceUrl: varchar('source_url', { length: 1024 }),
  status: opportunityStatusEnum('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const assets = pgTable('assets', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  opportunityId: text('opportunity_id').references(() => opportunities.id),
  title: varchar('title', { length: 512 }).notNull(),
  content: text('content').notNull(),
  assetType: assetTypeEnum('asset_type').notNull(),
  status: assetStatusEnum('status').default('draft').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const campaigns = pgTable('campaigns', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: campaignStatusEnum('status').default('planning').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const dailyDigests = pgTable('daily_digests', {
  id: text('id').primaryKey(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id),
  date: timestamp('date').notNull(),
  summary: text('summary').notNull(),
  opportunityCount: integer('opportunity_count').notNull(),
  topOpportunities: text('top_opportunities').array().notNull(),
  agentRunIds: text('agent_run_ids').array().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
