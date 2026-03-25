import { z } from "zod";

export const DailyDigestSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  date: z.date(),
  summary: z.string(),
  opportunityCount: z.number(),
  agentRunIds: z.array(z.string()),
  createdAt: z.date(),
});

export type DailyDigest = z.infer<typeof DailyDigestSchema>;

export const InsertDailyDigestSchema = DailyDigestSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertDailyDigest = z.infer<typeof InsertDailyDigestSchema>;
