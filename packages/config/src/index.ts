import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .default('postgresql://cmo:cmo@localhost:5432/ai_cmo'),
  API_PORT: z.coerce.number().default(4000),
  API_HOST: z.string().default('0.0.0.0'),
  WORKER_POLL_INTERVAL_MS: z.coerce.number().default(5000),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  AUTH_SECRET: z.string().default('change-me-in-production'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export type EnvConfig = z.infer<typeof envSchema>;

let cachedConfig: EnvConfig | null = null;

export function getConfig(): EnvConfig {
  if (!cachedConfig) {
    cachedConfig = envSchema.parse(process.env);
  }
  return cachedConfig;
}

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Environment validation failed:');
    for (const issue of result.error.issues) {
      console.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    throw new Error('Invalid environment configuration');
  }
  return result.data;
}
