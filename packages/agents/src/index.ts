export type { Agent, AgentContext, AgentResult } from './interface.js';
export { registerAgent, getAgent, getAllAgents, getAgentNames } from './registry.js';

export { SearchMogAgent } from './stubs/SearchMogAgent.js';
export { GeoAgent } from './stubs/GeoAgent.js';
export { RedditMogAgent } from './stubs/RedditMogAgent.js';
export { CompetitorIntelAgent } from './stubs/CompetitorIntelAgent.js';
export { ContentFoundryAgent } from './stubs/ContentFoundryAgent.js';

// Auto-register all stub agents
import { registerAgent } from './registry.js';
import { SearchMogAgent } from './stubs/SearchMogAgent.js';
import { GeoAgent } from './stubs/GeoAgent.js';
import { RedditMogAgent } from './stubs/RedditMogAgent.js';
import { CompetitorIntelAgent } from './stubs/CompetitorIntelAgent.js';
import { ContentFoundryAgent } from './stubs/ContentFoundryAgent.js';

registerAgent(new SearchMogAgent());
registerAgent(new GeoAgent());
registerAgent(new RedditMogAgent());
registerAgent(new CompetitorIntelAgent());
registerAgent(new ContentFoundryAgent());
