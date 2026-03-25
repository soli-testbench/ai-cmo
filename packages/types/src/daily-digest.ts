import { z } from "zod";

export const DailyDigestSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  date: z.coerce.date(),
  summary: z.string(),
  opportunityCount: z.number().int().min(0),
  agentRunIds: z.array(z.string()),
  createdAt: z.coerce.date(),
});

export type DailyDigest = z.infer<typeof DailyDigestSchema>;

export const InsertDailyDigestSchema = DailyDigestSchema.omit({
  id: true,
  createdAt: true,
});

export type InsertDailyDigest = z.infer<typeof InsertDailyDigestSchema>;
