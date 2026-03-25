import { z } from "zod";

export const AssetSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  opportunityId: z.string().uuid().nullable(),
  type: z.enum(["article", "social", "email", "ad"]),
  title: z.string().min(1),
  content: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const InsertAssetSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAsset = z.infer<typeof InsertAssetSchema>;
