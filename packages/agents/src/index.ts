export type { Agent, AgentContext, IngestResult, AnalysisResult } from "./interface.js";
export { registerAgent, getAgent, getAllAgents } from "./registry.js";

// Import agents to trigger registration
import "./agents/search-mog.js";
import "./agents/geo.js";
import "./agents/reddit-mog.js";
import "./agents/competitor-intel.js";
import "./agents/content-foundry.js";
