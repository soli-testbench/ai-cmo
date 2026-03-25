import { z } from "zod";

export const CompanyProfileSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  name: z.string(),
  industry: z.string(),
  description: z.string(),
  website: z.nullable(z.url()),
  keywords: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

export const InsertCompanyProfileSchema = CompanyProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompanyProfile = z.infer<typeof InsertCompanyProfileSchema>;
