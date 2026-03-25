import { db } from "./connection.js";
import {
  agentRuns,
  assets,
  campaigns,
  companyProfiles,
  competitorProfiles,
  dailyDigests,
  narrativeModels,
  opportunities,
  projects,
  users,
} from "./schema/index.js";

async function seed() {
  const [user] = await db
    .insert(users)
    .values({
      email: "demo@example.com",
      name: "Demo User",
      role: "admin",
    })
    .returning();

  const [project] = await db
    .insert(projects)
    .values({
      name: "Acme Corp AI Strategy",
      description: "Competitive intelligence for Acme Corp's AI product line",
      userId: user.id,
      status: "active",
    })
    .returning();

  await db.insert(companyProfiles).values({
    projectId: project.id,
    name: "Acme Corp",
    industry: "Technology",
    description: "Leading AI solutions provider",
    website: "https://acme.example.com",
    keywords: ["AI", "machine learning", "SaaS", "enterprise"],
  });

  await db.insert(narrativeModels).values({
    projectId: project.id,
    coreNarrative: "Acme Corp leads the AI revolution with practical, enterprise-grade solutions",
    themes: ["innovation", "reliability", "enterprise-ready"],
    voiceTone: "professional yet approachable",
    targetAudiences: ["CTOs", "VP Engineering", "Data Scientists"],
  });

  await db.insert(competitorProfiles).values([
    {
      projectId: project.id,
      name: "TechRival Inc",
      website: "https://techrival.example.com",
      description: "Competing AI platform focused on SMBs",
      strengths: ["lower pricing", "simpler onboarding"],
      weaknesses: ["limited enterprise features", "smaller team"],
    },
    {
      projectId: project.id,
      name: "DataCorp",
      website: "https://datacorp.example.com",
      description: "Enterprise data analytics with AI features",
      strengths: ["established brand", "large customer base"],
      weaknesses: ["legacy architecture", "slow innovation"],
    },
  ]);

  await db.insert(opportunities).values([
    {
      projectId: project.id,
      agentId: "search-mog",
      type: "search",
      title: "Rising search trend: 'AI workflow automation'",
      description: "Search volume for 'AI workflow automation' up 340% MoM",
      score: 85,
      metadata: { volume: 12400, trend: "rising" },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "geo",
      type: "geo",
      title: "Austin TX market gap in AI consulting",
      description: "Low competition for AI consulting services in Austin metro area",
      score: 72,
      metadata: { region: "Austin, TX", competitors: 3 },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "reddit-mog",
      type: "reddit",
      title: "r/MachineLearning discussion on enterprise tools",
      description: "Trending thread about enterprise ML tools with 500+ upvotes",
      score: 68,
      metadata: { subreddit: "MachineLearning", upvotes: 523 },
      status: "reviewed",
    },
    {
      projectId: project.id,
      agentId: "competitor-intel",
      type: "competitor",
      title: "TechRival pricing change detected",
      description: "TechRival increased pricing by 20%, creating opportunity for competitive positioning",
      score: 91,
      metadata: { competitor: "TechRival Inc", priceChange: "+20%" },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "content-foundry",
      type: "content",
      title: "Blog post opportunity: AI ROI Calculator",
      description: "High-intent keyword gap for 'AI ROI calculator' content",
      score: 77,
      metadata: { contentType: "blog", estimatedTraffic: 8500 },
      status: "new",
    },
  ]);

  const runIds: string[] = [];
  const runs = await db
    .insert(agentRuns)
    .values([
      {
        projectId: project.id,
        agentId: "search-mog",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        result: { opportunitiesFound: 3, summary: "Found 3 trending search opportunities" },
      },
      {
        projectId: project.id,
        agentId: "competitor-intel",
        status: "completed",
        startedAt: new Date(),
        completedAt: new Date(),
        result: { opportunitiesFound: 1, summary: "Detected competitor pricing changes" },
      },
    ])
    .returning();

  for (const run of runs) {
    runIds.push(run.id);
  }

  await db.insert(dailyDigests).values({
    projectId: project.id,
    date: new Date(),
    summary: "5 new opportunities identified across search trends, geographic markets, and competitor intelligence.",
    opportunityCount: 5,
    agentRunIds: runIds,
  });

  process.stdout.write("Seed completed successfully\n");
  process.exit(0);
}

seed().catch((err) => {
  process.stderr.write(`Seed failed: ${err}\n`);
  process.exit(1);
});
