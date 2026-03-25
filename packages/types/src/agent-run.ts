import { z } from "zod";

export const AgentRunSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  agentId: z.string(),
  status: z.enum(["pending", "running", "completed", "failed"]),
  startedAt: z.date(),
  completedAt: z.nullable(z.date()),
  result: z.nullable(z.unknown()),
  error: z.nullable(z.string()),
  createdAt: z.date(),
});

export type AgentRun = z.infer<typeof AgentRunSchema>;

export const InsertAgentRunSchema = AgentRunSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertAgentRun = z.infer<typeof InsertAgentRunSchema>;
