import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

async function seed() {
  const connectionString =
    process.env['DATABASE_URL'] ?? 'postgresql://cmo:cmo@localhost:5432/ai_cmo';
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client, { schema });

  console.log('Seeding database...');

  const userId = 'user-demo-001';
  await db
    .insert(schema.users)
    .values({
      id: userId,
      email: 'demo@example.com',
      name: 'Demo User',
    })
    .onConflictDoNothing();

  const projectId = 'project-demo-001';
  await db
    .insert(schema.projects)
    .values({
      id: projectId,
      name: 'Acme Corp Marketing',
      description: 'Marketing intelligence for Acme Corporation',
      userId,
    })
    .onConflictDoNothing();

  await db
    .insert(schema.companyProfiles)
    .values({
      id: 'cp-demo-001',
      projectId,
      companyName: 'Acme Corporation',
      industry: 'Technology',
      description: 'Leading provider of innovative solutions for modern businesses',
      website: 'https://acme.example.com',
      targetAudience: 'B2B SaaS companies with 50-500 employees',
    })
    .onConflictDoNothing();

  const agentRunId = 'run-demo-001';
  await db
    .insert(schema.agentRuns)
    .values({
      id: agentRunId,
      projectId,
      agentName: 'SearchMogAgent',
      status: 'completed',
      resultSummary: 'Found 3 trending topics in the technology space',
    })
    .onConflictDoNothing();

  await db
    .insert(schema.opportunities)
    .values([
      {
        id: 'opp-demo-001',
        projectId,
        agentRunId,
        title: 'Trending: AI-powered productivity tools',
        description:
          'Rising search interest in AI productivity tools — opportunity for thought leadership content.',
        category: 'trending',
        priority: 'high',
        sourceAgent: 'SearchMogAgent',
        sourceUrl: 'https://trends.google.com/example',
        status: 'new',
      },
      {
        id: 'opp-demo-002',
        projectId,
        agentRunId,
        title: 'Competitor gap: Missing documentation hub',
        description:
          'Top competitor lacks comprehensive documentation — opportunity to capture search traffic.',
        category: 'competitive',
        priority: 'medium',
        sourceAgent: 'CompetitorIntelAgent',
        status: 'new',
      },
      {
        id: 'opp-demo-003',
        projectId,
        agentRunId,
        title: 'Reddit discussion: Pain points in SaaS onboarding',
        description:
          'Active Reddit thread discussing onboarding friction — opportunity for a how-to guide.',
        category: 'social',
        priority: 'medium',
        sourceAgent: 'RedditMogAgent',
        sourceUrl: 'https://reddit.com/r/saas/example',
        status: 'reviewed',
      },
    ])
    .onConflictDoNothing();

  console.log('Seed complete. Demo project "Acme Corp Marketing" created.');
  await client.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
