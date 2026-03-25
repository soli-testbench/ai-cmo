import { Hono } from "hono";

const MOCK_OPPORTUNITIES = [
  {
    id: "00000000-0000-0000-0000-000000000101",
    projectId: "00000000-0000-0000-0000-000000000001",
    agentId: "search-mog",
    type: "search",
    title: "Rising search trend: AI workflow automation",
    description: "Search volume up 340% MoM",
    score: 85,
    metadata: { volume: 12400, trend: "rising" },
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "00000000-0000-0000-0000-000000000102",
    projectId: "00000000-0000-0000-0000-000000000001",
    agentId: "competitor-intel",
    type: "competitor",
    title: "TechRival pricing change detected",
    description: "TechRival increased pricing by 20%",
    score: 91,
    metadata: { competitor: "TechRival Inc" },
    status: "new",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const opportunityRoutes = new Hono();

opportunityRoutes.get("/projects/:id/opportunities", (c) => {
  return c.json(MOCK_OPPORTUNITIES);
});
