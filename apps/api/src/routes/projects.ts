import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { ApiResponse, PaginatedResponse, Project, CreateProjectInput } from '@ai-cmo/types';
import { getDb } from '@ai-cmo/db';
import { projects, companyProfiles } from '@ai-cmo/db';
import { createLogger } from '@ai-cmo/lib';

const log = createLogger('api:projects');

export const projectsRouter = Router();

const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
  companyName: z.string().min(1).max(255),
  industry: z.string().min(1).max(255),
  companyDescription: z.string().min(1),
  website: z.string().url().optional(),
  targetAudience: z.string().optional(),
});

// GET /api/projects — list all projects
projectsRouter.get('/', async (_req, res) => {
  try {
    const db = getDb();
    const allProjects = await db.select().from(projects);

    const response: PaginatedResponse<Project> = {
      success: true,
      data: allProjects as Project[],
      total: allProjects.length,
      page: 1,
      pageSize: 50,
    };

    res.json(response);
  } catch (err) {
    log.error('Failed to list projects', { error: String(err) });
    res.status(500).json({ success: false, error: 'Internal server error', data: null });
  }
});

// POST /api/projects — create a new project
projectsRouter.post('/', async (req, res) => {
  try {
    const input = createProjectSchema.parse(req.body) as CreateProjectInput;
    const db = getDb();

    const projectId = crypto.randomUUID();
    const profileId = crypto.randomUUID();
    // Placeholder userId — will come from auth in the future
    const userId = 'user-demo-001';

    await db.insert(projects).values({
      id: projectId,
      name: input.name,
      description: input.description,
      userId,
    });

    await db.insert(companyProfiles).values({
      id: profileId,
      projectId,
      companyName: input.companyName,
      industry: input.industry,
      description: input.companyDescription,
      website: input.website ?? null,
      targetAudience: input.targetAudience ?? null,
    });

    const response: ApiResponse<{ id: string }> = {
      success: true,
      data: { id: projectId },
    };

    res.status(201).json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', data: err.errors });
      return;
    }
    log.error('Failed to create project', { error: String(err) });
    res.status(500).json({ success: false, error: 'Internal server error', data: null });
  }
});

// GET /api/projects/:id — get a single project
projectsRouter.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const { id } = req.params;
    const result = await db.select().from(projects).where(eq(projects.id, id));

    const project = result[0];
    if (!project) {
      res.status(404).json({ success: false, error: 'Project not found', data: null });
      return;
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: project as Project,
    };

    res.json(response);
  } catch (err) {
    log.error('Failed to get project', { error: String(err) });
    res.status(500).json({ success: false, error: 'Internal server error', data: null });
  }
});
