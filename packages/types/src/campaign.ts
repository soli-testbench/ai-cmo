import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  name: z.string(),
  description: z.string(),
  status: z.enum(["draft", "active", "completed"]),
  startDate: z.nullable(z.date()),
  endDate: z.nullable(z.date()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const InsertCampaignSchema = CampaignSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaign = z.infer<typeof InsertCampaignSchema>;
