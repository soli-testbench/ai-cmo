import type { Request, Response, NextFunction } from 'express';
import { createLogger } from '@ai-cmo/lib';

const log = createLogger('api:auth');

/**
 * Auth middleware placeholder.
 * In production, this would validate JWT tokens, API keys, or session cookies.
 * For now, it passes all requests through.
 */
export function authMiddleware(_req: Request, _res: Response, next: NextFunction): void {
  log.debug('Auth middleware: passing through (placeholder)');
  next();
}
