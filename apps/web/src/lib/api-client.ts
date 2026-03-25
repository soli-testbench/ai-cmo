import type { InsertProject, Opportunity, Project } from "@chief-mog/types";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer placeholder",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

// Mock data for standalone frontend development
const mockProjects: Project[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Acme Corp AI Strategy",
    description: "Competitive intelligence for Acme Corp's AI product line",
    companyProfileId: "550e8400-e29b-41d4-a716-446655440010",
    userId: "550e8400-e29b-41d4-a716-446655440000",
    status: "active",
    createdAt: new Date("2025-01-15T10:00:00.000Z"),
    updatedAt: new Date("2025-03-20T14:30:00.000Z"),
  },
];

const mockOpportunities: Opportunity[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440101",
    projectId: "550e8400-e29b-41d4-a716-446655440001",
    agentId: "search-mog",
    type: "search",
    title: "Rising search interest in 'AI workflow automation'",
    description:
      "Search volume for 'AI workflow automation' increased 340% in the last 30 days. Acme Corp has no content targeting this keyword.",
    score: 87,
    metadata: {},
    status: "new",
    createdAt: new Date("2025-03-20T08:00:00.000Z"),
    updatedAt: new Date("2025-03-20T08:00:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    projectId: "550e8400-e29b-41d4-a716-446655440001",
    agentId: "competitor-intel",
    type: "competitor",
    title: "Competitor launched new pricing tier",
    description:
      "TechRival Inc. introduced a freemium tier targeting SMBs. This undercuts Acme's entry-level pricing by 40%.",
    score: 92,
    metadata: {},
    status: "reviewed",
    createdAt: new Date("2025-03-19T14:00:00.000Z"),
    updatedAt: new Date("2025-03-20T09:00:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440103",
    projectId: "550e8400-e29b-41d4-a716-446655440001",
    agentId: "reddit-mog",
    type: "reddit",
    title: "Viral Reddit thread comparing AI tools",
    description:
      "A thread on r/artificial with 2.3k upvotes is comparing AI productivity tools. Acme is mentioned but not favorably.",
    score: 74,
    metadata: {},
    status: "new",
    createdAt: new Date("2025-03-18T16:00:00.000Z"),
    updatedAt: new Date("2025-03-18T16:00:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440104",
    projectId: "550e8400-e29b-41d4-a716-446655440001",
    agentId: "geo",
    type: "geo",
    title: "Untapped demand in DACH region",
    description:
      "Analysis shows strong search demand for AI tools in Germany, Austria, and Switzerland with minimal competition.",
    score: 68,
    metadata: {},
    status: "acted",
    createdAt: new Date("2025-03-17T10:00:00.000Z"),
    updatedAt: new Date("2025-03-19T11:00:00.000Z"),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440105",
    projectId: "550e8400-e29b-41d4-a716-446655440001",
    agentId: "content-foundry",
    type: "content",
    title: "Content gap: 'Enterprise AI implementation guide'",
    description:
      "Top-ranking guides are outdated (2023). An updated guide could capture 15k monthly searches.",
    score: 81,
    metadata: {},
    status: "dismissed",
    createdAt: new Date("2025-03-16T12:00:00.000Z"),
    updatedAt: new Date("2025-03-18T09:00:00.000Z"),
  },
];

export const api = {
  async getProjects(): Promise<Project[]> {
    try {
      return await request<Project[]>("/api/projects");
    } catch {
      return mockProjects;
    }
  },

  async createProject(data: InsertProject): Promise<Project> {
    try {
      return await request<Project>("/api/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      return {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  async getOpportunities(projectId: string): Promise<Opportunity[]> {
    try {
      return await request<Opportunity[]>(`/api/projects/${projectId}/opportunities`);
    } catch {
      return mockOpportunities.filter((o) => o.projectId === projectId);
    }
  },

  async triggerAnalysis(projectId: string): Promise<{ jobId: string; status: string }> {
    try {
      return await request<{ jobId: string; status: string }>(
        `/api/projects/${projectId}/analyze`,
        { method: "POST" },
      );
    } catch {
      return { jobId: crypto.randomUUID(), status: "queued" };
    }
  },
};

export { mockOpportunities, mockProjects };
