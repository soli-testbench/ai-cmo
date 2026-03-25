import { z } from "zod";

export const AssetSchema = z.object({
  id: z.uuid(),
  projectId: z.uuid(),
  opportunityId: z.nullable(z.uuid()),
  type: z.enum(["article", "social", "email", "ad"]),
  title: z.string(),
  content: z.string(),
  status: z.enum(["draft", "published", "archived"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Asset = z.infer<typeof AssetSchema>;

export const InsertAssetSchema = AssetSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAsset = z.infer<typeof InsertAssetSchema>;
