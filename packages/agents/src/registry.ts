import type { Agent } from "./interface.js";

const registry = new Map<string, Agent>();

export function registerAgent(agent: Agent): void {
  registry.set(agent.id, agent);
}

export function getAgent(id: string): Agent | undefined {
  return registry.get(id);
}

export function getAllAgents(): Agent[] {
  return [...registry.values()];
}
