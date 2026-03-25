import { describe, expect, it } from "vitest";
import {
  AgentRunSchema,
  AssetSchema,
  CampaignSchema,
  CompanyProfileSchema,
  CompetitorProfileSchema,
  DailyDigestSchema,
  InsertProjectSchema,
  InsertUserSchema,
  NarrativeModelSchema,
  OpportunitySchema,
  ProjectSchema,
  UserSchema,
} from "../index.js";

const uuid = "550e8400-e29b-41d4-a716-446655440000";
const now = new Date();

describe("UserSchema", () => {
  it("validates a correct user", () => {
    const result = UserSchema.safeParse({
      id: uuid,
      email: "test@example.com",
      name: "Test User",
      role: "admin",
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid role", () => {
    const result = UserSchema.safeParse({
      id: uuid,
      email: "test@example.com",
      name: "Test User",
      role: "superadmin",
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(false);
  });

  it("InsertUserSchema omits auto fields", () => {
    const result = InsertUserSchema.safeParse({
      email: "test@example.com",
      name: "Test User",
      role: "member",
    });
    expect(result.success).toBe(true);
  });
});

describe("ProjectSchema", () => {
  it("validates a correct project", () => {
    const result = ProjectSchema.safeParse({
      id: uuid,
      name: "Test Project",
      description: "A test project",
      companyProfileId: null,
      userId: uuid,
      status: "active",
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid status", () => {
    const result = ProjectSchema.safeParse({
      id: uuid,
      name: "Test",
      description: "Desc",
      companyProfileId: null,
      userId: uuid,
      status: "deleted",
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(false);
  });

  it("InsertProjectSchema works without auto fields", () => {
    const result = InsertProjectSchema.safeParse({
      name: "Test",
      description: "Desc",
      companyProfileId: null,
      userId: uuid,
      status: "active",
    });
    expect(result.success).toBe(true);
  });
});

describe("OpportunitySchema", () => {
  it("validates opportunity with all types", () => {
    for (const type of ["search", "geo", "reddit", "competitor", "content"] as const) {
      const result = OpportunitySchema.safeParse({
        id: uuid,
        projectId: uuid,
        agentId: "test-agent",
        type,
        title: "Test Opportunity",
        description: "Test description",
        score: 75,
        metadata: { key: "value" },
        status: "new",
        createdAt: now,
        updatedAt: now,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects score out of range", () => {
    const result = OpportunitySchema.safeParse({
      id: uuid,
      projectId: uuid,
      agentId: "test-agent",
      type: "search",
      title: "Test",
      description: "Test",
      score: 150,
      metadata: {},
      status: "new",
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(false);
  });
});

describe("CompanyProfileSchema", () => {
  it("validates with nullable website", () => {
    const result = CompanyProfileSchema.safeParse({
      id: uuid,
      projectId: uuid,
      name: "Test Co",
      industry: "Tech",
      description: "A company",
      website: null,
      keywords: ["ai", "ml"],
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });
});

describe("NarrativeModelSchema", () => {
  it("validates a narrative model", () => {
    const result = NarrativeModelSchema.safeParse({
      id: uuid,
      projectId: uuid,
      coreNarrative: "Our story",
      themes: ["innovation"],
      voiceTone: "professional",
      targetAudiences: ["CTOs"],
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });
});

describe("CompetitorProfileSchema", () => {
  it("validates a competitor profile", () => {
    const result = CompetitorProfileSchema.safeParse({
      id: uuid,
      projectId: uuid,
      name: "Rival Corp",
      website: "https://rival.example.com",
      description: "A competitor",
      strengths: ["speed"],
      weaknesses: ["cost"],
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });
});

describe("AssetSchema", () => {
  it("validates all asset types", () => {
    for (const type of ["article", "social", "email", "ad"] as const) {
      const result = AssetSchema.safeParse({
        id: uuid,
        projectId: uuid,
        opportunityId: null,
        type,
        title: "Test Asset",
        content: "Content here",
        status: "draft",
        createdAt: now,
        updatedAt: now,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("CampaignSchema", () => {
  it("validates with nullable dates", () => {
    const result = CampaignSchema.safeParse({
      id: uuid,
      projectId: uuid,
      name: "Campaign",
      description: "A campaign",
      status: "draft",
      startDate: null,
      endDate: null,
      createdAt: now,
      updatedAt: now,
    });
    expect(result.success).toBe(true);
  });
});

describe("AgentRunSchema", () => {
  it("validates all statuses", () => {
    for (const status of ["pending", "running", "completed", "failed"] as const) {
      const result = AgentRunSchema.safeParse({
        id: uuid,
        projectId: uuid,
        agentId: "test-agent",
        status,
        startedAt: now,
        completedAt: status === "completed" ? now : null,
        result: null,
        error: status === "failed" ? "Something went wrong" : null,
        createdAt: now,
      });
      expect(result.success).toBe(true);
    }
  });
});

describe("DailyDigestSchema", () => {
  it("validates a daily digest", () => {
    const result = DailyDigestSchema.safeParse({
      id: uuid,
      projectId: uuid,
      date: now,
      summary: "Today's summary",
      opportunityCount: 5,
      agentRunIds: [uuid],
      createdAt: now,
    });
    expect(result.success).toBe(true);
  });
});
