import "dotenv/config";
import { eq } from "drizzle-orm";
import { client, db } from "./connection.js";
import {
  agentRuns,
  companyProfiles,
  competitorProfiles,
  dailyDigests,
  narrativeModels,
  opportunities,
  projects,
  users,
} from "./schema/index.js";

async function seed() {
  console.log("Seeding database...");

  // 1. User
  const [user] = await db
    .insert(users)
    .values({
      email: "demo@example.com",
      name: "Demo User",
      role: "admin",
    })
    .returning();

  // 2. Project
  const [project] = await db
    .insert(projects)
    .values({
      name: "Acme Corp AI Strategy",
      description: "Competitive intelligence for Acme Corp AI initiatives",
      userId: user.id,
      status: "active",
    })
    .returning();

  // 3. Company Profile
  const [companyProfile] = await db
    .insert(companyProfiles)
    .values({
      projectId: project.id,
      name: "Acme Corp",
      industry: "Technology",
      description: "A leading technology company focused on AI-powered enterprise solutions",
      website: "https://acme.example.com",
      keywords: ["AI", "enterprise", "SaaS", "machine learning"],
    })
    .returning();

  // Update project with company profile ID
  await db
    .update(projects)
    .set({ companyProfileId: companyProfile.id })
    .where(eq(projects.id, project.id));

  // 4. Narrative Model
  await db.insert(narrativeModels).values({
    projectId: project.id,
    coreNarrative:
      "Acme Corp leads the enterprise AI revolution by making intelligent automation accessible to every business",
    themes: ["AI democratization", "enterprise efficiency", "responsible AI"],
    voiceTone: "authoritative yet approachable",
    targetAudiences: ["CTOs", "enterprise decision makers", "tech media"],
  });

  // 5. Competitor Profiles
  await db.insert(competitorProfiles).values([
    {
      projectId: project.id,
      name: "TechRival Inc",
      website: "https://techrival.example.com",
      description: "Competing enterprise AI platform with focus on data analytics",
      strengths: ["strong data pipeline", "large customer base", "established brand"],
      weaknesses: ["slow innovation cycle", "legacy architecture", "high pricing"],
    },
    {
      projectId: project.id,
      name: "InnovateCo",
      website: "https://innovateco.example.com",
      description: "Fast-growing AI startup targeting mid-market",
      strengths: ["agile development", "modern tech stack", "competitive pricing"],
      weaknesses: ["limited enterprise features", "small team", "narrow market focus"],
    },
  ]);

  // 6. Opportunities (one per agent type)
  await db.insert(opportunities).values([
    {
      projectId: project.id,
      agentId: "search-mog",
      type: "search",
      title: "Rising search interest in 'AI automation tools'",
      description:
        "Search volume for 'AI automation tools' has increased 45% in the last 30 days, presenting a content opportunity",
      score: 82,
      metadata: { searchVolume: 12400, trend: "rising", region: "US" },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "geo",
      type: "geo",
      title: "Untapped market in Austin, TX tech corridor",
      description:
        "Austin tech sector growing 23% YoY with limited AI enterprise presence — opportunity for targeted outreach",
      score: 74,
      metadata: { city: "Austin", state: "TX", growthRate: 0.23 },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "reddit-mog",
      type: "reddit",
      title: "Active discussion in r/MachineLearning about enterprise adoption",
      description:
        "Thread with 200+ comments discussing pain points of enterprise AI adoption — opportunity to engage",
      score: 68,
      metadata: { subreddit: "MachineLearning", commentCount: 213, upvotes: 450 },
      status: "reviewed",
    },
    {
      projectId: project.id,
      agentId: "competitor-intel",
      type: "competitor",
      title: "TechRival Inc delayed product launch",
      description:
        "TechRival pushed back their next-gen platform launch by 3 months — window to capture market attention",
      score: 91,
      metadata: { competitor: "TechRival Inc", originalDate: "2025-Q1", newDate: "2025-Q2" },
      status: "new",
    },
    {
      projectId: project.id,
      agentId: "content-foundry",
      type: "content",
      title: "Thought leadership article on responsible AI governance",
      description:
        "High-demand topic with limited quality content — opportunity to establish authority",
      score: 77,
      metadata: { format: "article", estimatedReach: 15000, topic: "AI governance" },
      status: "new",
    },
  ]);

  // 7. Agent Runs (2 completed)
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  await db.insert(agentRuns).values([
    {
      projectId: project.id,
      agentId: "search-mog",
      status: "completed",
      startedAt: oneHourAgo,
      completedAt: new Date(oneHourAgo.getTime() + 45000),
      result: { opportunitiesFound: 3, searchesPerformed: 12 },
    },
    {
      projectId: project.id,
      agentId: "competitor-intel",
      status: "completed",
      startedAt: oneHourAgo,
      completedAt: new Date(oneHourAgo.getTime() + 62000),
      result: { competitorsAnalyzed: 2, alertsGenerated: 1 },
    },
  ]);

  // 8. Daily Digest
  await db.insert(dailyDigests).values({
    projectId: project.id,
    date: new Date(),
    summary:
      "5 new opportunities detected across search trends, geographic markets, social discussions, and competitive intelligence. Key highlight: TechRival Inc delayed their product launch, creating a strategic window.",
    opportunityCount: 5,
    agentRunIds: [],
  });

  console.log("Seed complete.");
  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
