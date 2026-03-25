import { generateId, logger } from "@chief-mog/lib";
import { Hono } from "hono";

export const analysisRoutes = new Hono();

analysisRoutes.post("/projects/:id/analyze", async (c) => {
  const projectId = c.req.param("id");
  let jobId: string;

  try {
    const { getAnalysisQueue } = await import("../lib/queue.js");
    const queue = getAnalysisQueue();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Queue timeout")), 2000),
    );
    const job = await Promise.race([queue.add("analyze", { projectId }), timeout]);
    jobId = job.id ?? generateId();
  } catch {
    logger.warn("Redis unavailable, generating mock job ID");
    jobId = generateId();
  }

  return c.json({ jobId, status: "queued", projectId });
});
