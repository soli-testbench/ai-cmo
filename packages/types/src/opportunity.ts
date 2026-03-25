import { z } from "zod";

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
  title: z.string().min(1),
  description: z.string(),
  score: z.number().min(0).max(100),
  metadata: z.record(z.unknown()),
  status: OpportunityStatusEnum,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Opportunity = z.infer<typeof OpportunitySchema>;

export const InsertOpportunitySchema = OpportunitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOpportunity = z.infer<typeof InsertOpportunitySchema>;
