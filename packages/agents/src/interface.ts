import type {
  CompanyProfile,
  CompetitorProfile,
  NarrativeModel,
  Opportunity,
} from "@chief-mog/types";

export interface AgentContext {
  projectId: string;
  companyProfile: CompanyProfile;
  narrativeModel?: NarrativeModel;
  competitors: CompetitorProfile[];
}

export interface IngestResult {
  agentId: string;
  data: Record<string, unknown>;
  timestamp: Date;
}

export interface AnalysisResult {
  agentId: string;
  insights: string[];
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  ingest(context: AgentContext): Promise<IngestResult>;
  analyze(context: AgentContext, data: IngestResult): Promise<AnalysisResult>;
  generateOpportunities(context: AgentContext, analysis: AnalysisResult): Promise<Opportunity[]>;
  summarize(context: AgentContext, opportunities: Opportunity[]): Promise<string>;
}
