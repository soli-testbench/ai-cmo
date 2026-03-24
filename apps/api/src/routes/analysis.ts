import { Router } from 'express';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import type { ApiResponse } from '@ai-cmo/types';
import { getDb } from '@ai-cmo/db';
import { agentRuns, opportunities } from '@ai-cmo/db';
import { createLogger } from '@ai-cmo/lib';

const log = createLogger('api:analysis');

export const analysisRouter = Router();

const triggerAnalysisSchema = z.object({
  projectId: z.string().min(1),
  agentNames: z.array(z.string()).optional(),
});

// POST /api/analysis/trigger — trigger an analysis run
analysisRouter.post('/trigger', async (req, res) => {
  try {
    const input = triggerAnalysisSchema.parse(req.body);
    log.info('Analysis triggered', { projectId: input.projectId, agents: input.agentNames });

    // Stub: create a pending agent run record
    const runId = crypto.randomUUID();
    const db = getDb();

    await db.insert(agentRuns).values({
      id: runId,
      projectId: input.projectId,
      agentName: input.agentNames?.[0] ?? 'all',
      status: 'pending',
    });

    const response: ApiResponse<{ runId: string; status: string }> = {
      success: true,
      data: { runId, status: 'pending' },
    };

    res.status(202).json(response);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, error: 'Validation error', data: err.errors });
      return;
    }
    log.error('Failed to trigger analysis', { error: String(err) });
    res.status(500).json({ success: false, error: 'Internal server error', data: null });
  }
});

// GET /api/analysis/opportunities — list opportunities
analysisRouter.get('/opportunities', async (req, res) => {
  try {
    const db = getDb();
    const projectId = req.query['projectId'] as string | undefined;

    let result;
    if (projectId) {
      result = await db
        .select()
        .from(opportunities)
        .where(eq(opportunities.projectId, projectId));
    } else {
      result = await db.select().from(opportunities);
    }

    res.json({
      success: true,
      data: result,
      total: result.length,
      page: 1,
      pageSize: 50,
    });
  } catch (err) {
    log.error('Failed to list opportunities', { error: String(err) });
    res.status(500).json({ success: false, error: 'Internal server error', data: null });
  }
});
