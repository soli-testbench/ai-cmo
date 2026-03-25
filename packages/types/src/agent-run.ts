import { z } from "zod";

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
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date().nullable(),
  result: z.record(z.unknown()).nullable(),
  error: z.string().nullable(),
  createdAt: z.coerce.date(),
});

export type AgentRun = z.infer<typeof AgentRunSchema>;

export const InsertAgentRunSchema = AgentRunSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertAgentRun = z.infer<typeof InsertAgentRunSchema>;
