import { generateId, NotFoundError } from "@chief-mog/lib";
import { Hono } from "hono";
import { z } from "zod";

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(""),
  userId: z.string().uuid().optional(),
  companyProfileId: z.string().uuid().nullable().optional(),
  status: z.enum(["active", "paused", "archived"]).default("active"),
});

const MOCK_PROJECT = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Acme Corp AI Strategy",
  description: "Competitive intelligence for Acme Corp",
  companyProfileId: null,
  userId: "00000000-0000-0000-0000-000000000010",
  status: "active" as const,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const projectRoutes = new Hono();

projectRoutes.get("/projects", (c) => {
  return c.json([MOCK_PROJECT]);
});

projectRoutes.post("/projects", async (c) => {
  const body = await c.req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: { code: "VALIDATION_ERROR", message: parsed.error.message } }, 400);
  }
  const now = new Date().toISOString();
  const project = {
    id: generateId(),
    name: parsed.data.name,
    description: parsed.data.description,
    companyProfileId: parsed.data.companyProfileId ?? null,
    userId: parsed.data.userId ?? "00000000-0000-0000-0000-000000000010",
    status: parsed.data.status,
    createdAt: now,
    updatedAt: now,
  };
  return c.json(project, 201);
});

projectRoutes.get("/projects/:id", (c) => {
  const id = c.req.param("id");
  if (id === MOCK_PROJECT.id) {
    return c.json(MOCK_PROJECT);
  }
  throw new NotFoundError(`Project ${id} not found`);
});
