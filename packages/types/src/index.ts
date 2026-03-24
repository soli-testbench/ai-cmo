// ── Domain Model Type Definitions ──────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  companyProfileId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyProfile {
  id: string;
  projectId: string;
  companyName: string;
  industry: string;
  description: string;
  website: string | null;
  targetAudience: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NarrativeModel {
  id: string;
  projectId: string;
  coreNarrative: string;
  toneGuidelines: string;
  keyMessages: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CompetitorProfile {
  id: string;
  projectId: string;
  name: string;
  website: string | null;
  description: string;
  strengths: string[];
  weaknesses: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Opportunity {
  id: string;
  projectId: string;
  agentRunId: string;
  title: string;
  description: string;
  category: OpportunityCategory;
  priority: Priority;
  sourceAgent: string;
  sourceUrl: string | null;
  status: OpportunityStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type OpportunityCategory =
  | 'content'
  | 'seo'
  | 'social'
  | 'competitive'
  | 'geographic'
  | 'trending';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type OpportunityStatus = 'new' | 'reviewed' | 'accepted' | 'dismissed' | 'completed';

export interface Asset {
  id: string;
  projectId: string;
  opportunityId: string | null;
  title: string;
  content: string;
  assetType: AssetType;
  status: AssetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type AssetType = 'blog_post' | 'social_post' | 'email' | 'ad_copy' | 'landing_page';
export type AssetStatus = 'draft' | 'review' | 'approved' | 'published';

export interface Campaign {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: CampaignStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface AgentRun {
  id: string;
  projectId: string;
  agentName: string;
  status: AgentRunStatus;
  startedAt: Date;
  completedAt: Date | null;
  resultSummary: string | null;
  errorMessage: string | null;
  createdAt: Date;
}

export type AgentRunStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying';

export interface DailyDigest {
  id: string;
  projectId: string;
  date: Date;
  summary: string;
  opportunityCount: number;
  topOpportunities: string[];
  agentRunIds: string[];
  createdAt: Date;
}

// ── API Types ──────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  name: string;
  description: string;
  companyName: string;
  industry: string;
  companyDescription: string;
  website?: string;
  targetAudience?: string;
}

export interface TriggerAnalysisInput {
  projectId: string;
  agentNames?: string[];
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
}
