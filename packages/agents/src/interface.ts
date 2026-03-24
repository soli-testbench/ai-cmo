import type { Opportunity } from '@ai-cmo/types';

export interface AgentContext {
  projectId: string;
  companyName: string;
  industry: string;
  description: string;
}

export interface AgentResult {
  opportunities: Opportunity[];
  summary: string;
}

export interface Agent {
  /** Unique agent identifier */
  readonly name: string;

  /** Human-readable description */
  readonly description: string;

  /** Ingest external data sources */
  ingest(context: AgentContext): Promise<void>;

  /** Analyze ingested data */
  analyze(context: AgentContext): Promise<void>;

  /** Generate actionable opportunities */
  generateOpportunities(context: AgentContext): Promise<Opportunity[]>;

  /** Summarize findings from this run */
  summarize(context: AgentContext): Promise<string>;
}
