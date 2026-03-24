import express from 'express';
import cors from 'cors';
import { createLogger } from '@ai-cmo/lib';
import { getConfig } from '@ai-cmo/config';
import { healthRouter } from './routes/health.js';
import { projectsRouter } from './routes/projects.js';
import { analysisRouter } from './routes/analysis.js';
import { authMiddleware } from './middleware/auth.js';

const log = createLogger('api');
const config = getConfig();

const app = express();

app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/health', healthRouter);

// Protected routes (auth placeholder)
app.use('/api/projects', authMiddleware, projectsRouter);
app.use('/api/analysis', authMiddleware, analysisRouter);

app.listen(config.API_PORT, config.API_HOST, () => {
  log.info(`API server listening on ${config.API_HOST}:${config.API_PORT}`);
});

export { app };
