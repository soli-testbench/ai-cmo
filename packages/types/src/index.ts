import { z } from "zod";

// ── User ──
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(["admin", "member"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

// ── Project ──
export const ProjectStatusEnum = z.enum(["active", "paused", "archived"]);

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  companyProfileId: z.string().uuid().nullable(),
  userId: z.string().uuid(),
  status: ProjectStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Project = z.infer<typeof ProjectSchema>;

export const InsertProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertProject = z.infer<typeof InsertProjectSchema>;

// ── CompanyProfile ──
export const CompanyProfileSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string(),
  industry: z.string(),
  description: z.string(),
  website: z.string().nullable(),
  keywords: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

// ── NarrativeModel ──
export const NarrativeModelSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  coreNarrative: z.string(),
  themes: z.array(z.string()),
  voiceTone: z.string(),
  targetAudiences: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type NarrativeModel = z.infer<typeof NarrativeModelSchema>;

// ── CompetitorProfile ──
export const CompetitorProfileSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string(),
  website: z.string().nullable(),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CompetitorProfile = z.infer<typeof CompetitorProfileSchema>;

// ── Opportunity ──
export const OpportunityTypeEnum = z.enum([
  "search",
  "geo",
  "reddit",
  "competitor",
  "content",
]);
export const OpportunityStatusEnum = z.enum([
  "new",
  "reviewed",
  "acted",
  "dismissed",
]);

export const OpportunitySchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  agentId: z.string(),
  type: OpportunityTypeEnum,
  title: z.string(),
  description: z.string(),
  score: z.number().min(0).max(100),
  metadata: z.record(z.unknown()),
  status: OpportunityStatusEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Opportunity = z.infer<typeof OpportunitySchema>;

// ── Asset ──
export const AssetSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  opportunityId: z.string().uuid().nullable(),
  type: z.enum(["article", "social", "email", "ad"]),
  title: z.string(),
  content: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Asset = z.infer<typeof AssetSchema>;

// ── Campaign ──
export const CampaignSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["draft", "active", "completed"]),
  startDate: z.string().datetime().nullable(),
  endDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Campaign = z.infer<typeof CampaignSchema>;

// ── AgentRun ──
export const AgentRunStatusEnum = z.enum([
  "pending",
  "running",
  "completed",
  "failed",
]);

export const AgentRunSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  agentId: z.string(),
  status: AgentRunStatusEnum,
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
  result: z.record(z.unknown()).nullable(),
  error: z.string().nullable(),
  createdAt: z.string().datetime(),
});
export type AgentRun = z.infer<typeof AgentRunSchema>;

// ── DailyDigest ──
export const DailyDigestSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  date: z.string(),
  summary: z.string(),
  opportunityCount: z.number(),
  agentRunIds: z.array(z.string()),
  createdAt: z.string().datetime(),
});
export type DailyDigest = z.infer<typeof DailyDigestSchema>;
