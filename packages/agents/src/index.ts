export type { Agent, AgentContext, AnalysisResult, IngestResult } from "./interface.js";
export { getAgent, getAllAgents, registerAgent } from "./registry.js";

// Import agents to trigger registration
import "./agents/search-mog.js";
import "./agents/geo.js";
import "./agents/reddit-mog.js";
import "./agents/competitor-intel.js";
import "./agents/content-foundry.js";
