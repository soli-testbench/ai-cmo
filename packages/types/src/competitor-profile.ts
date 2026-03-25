import { z } from "zod";

export const CompetitorProfileSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  name: z.string(),
  website: z.nullable(z.string()),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompetitorProfile = z.infer<typeof CompetitorProfileSchema>;

export const InsertCompetitorProfileSchema = CompetitorProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompetitorProfile = z.infer<typeof InsertCompetitorProfileSchema>;
