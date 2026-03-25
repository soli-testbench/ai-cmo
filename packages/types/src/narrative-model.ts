import { z } from "zod";

export const NarrativeModelSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  coreNarrative: z.string(),
  themes: z.array(z.string()),
  voiceTone: z.string(),
  targetAudiences: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type NarrativeModel = z.infer<typeof NarrativeModelSchema>;

export const InsertNarrativeModelSchema = NarrativeModelSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNarrativeModel = z.infer<typeof InsertNarrativeModelSchema>;
