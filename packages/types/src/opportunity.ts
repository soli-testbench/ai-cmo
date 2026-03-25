import { z } from "zod";

export const OpportunitySchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  agentId: z.string(),
  type: z.enum(["search", "geo", "reddit", "competitor", "content"]),
  title: z.string(),
  description: z.string(),
  score: z.number().min(0).max(100),
  metadata: z.record(z.string(), z.unknown()),
  status: z.enum(["new", "reviewed", "acted", "dismissed"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

export const InsertOpportunitySchema = OpportunitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOpportunity = z.infer<typeof InsertOpportunitySchema>;
