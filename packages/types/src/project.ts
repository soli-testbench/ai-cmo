import { z } from "zod";

export const ProjectSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string(),
  companyProfileId: z.nullable(z.uuid()),
  userId: z.uuid(),
  status: z.enum(["active", "paused", "archived"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const InsertProjectSchema = ProjectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProject = z.infer<typeof InsertProjectSchema>;
