import { z } from "zod";

export const CampaignSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string(),
  status: z.enum(["draft", "active", "completed"]),
  startDate: z.coerce.date().nullable(),
  endDate: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export const InsertCampaignSchema = CampaignSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCampaign = z.infer<typeof InsertCampaignSchema>;
