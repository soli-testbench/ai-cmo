import { logger } from "@chief-mog/lib";
import { Hono } from "hono";

export const analysisRoutes = new Hono();

analysisRoutes.post("/projects/:id/analyze", async (c) => {
  const projectId = c.req.param("id");

  try {
    const { getAnalysisQueue } = await import("../lib/queue.js");
    const queue = getAnalysisQueue();
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Queue timeout")), 2000),
    );
    const job = await Promise.race([queue.add("analyze", { projectId }), timeout]);
    return c.json({ jobId: job.id, status: "queued", projectId });
  } catch (err) {
    logger.error("Failed to enqueue analysis job", { projectId, error: String(err) });
    return c.json({ error: "Failed to enqueue analysis job", projectId }, 503);
  }
});
