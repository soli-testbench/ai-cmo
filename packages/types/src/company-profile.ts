import { z } from "zod";

export const CompanyProfileSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  name: z.string().min(1),
  industry: z.string().min(1),
  description: z.string(),
  website: z.string().url().nullable(),
  keywords: z.array(z.string()),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type CompanyProfile = z.infer<typeof CompanyProfileSchema>;

export const InsertCompanyProfileSchema = CompanyProfileSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCompanyProfile = z.infer<typeof InsertCompanyProfileSchema>;
