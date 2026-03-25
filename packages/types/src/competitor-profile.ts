import { z } from "zod";

export const CompetitorProfileSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  website: z.string().url().nullable(),
  description: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CompetitorProfile = z.infer<typeof CompetitorProfileSchema>;

export const InsertCompetitorProfileSchema = CompetitorProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompetitorProfile = z.infer<typeof InsertCompetitorProfileSchema>;
