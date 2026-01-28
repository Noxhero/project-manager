import { Router, type NextFunction, type Request, type Response } from "express";
import type { ManagedTransaction, Record as Neo4jRecord } from "neo4j-driver";
import { z } from "zod";

import { getNeo4jDriver } from "../db/neo4j.js";
import { requireAuth } from "../http/middleware/requireAuth.js";

export const graphRouter = Router();

graphRouter.use(requireAuth);

const linkSchema = z.object({
  fromProjectId: z.string().min(1),
  toProjectId: z.string().min(1),
  type: z.enum(["DEPENDS_ON", "SIMILAR_TO", "SHARES_RESOURCES_WITH"])
});

graphRouter.post("/link", async (req: Request, res: Response, next: NextFunction) => {
  const session = getNeo4jDriver().session();
  try {
    const body = linkSchema.parse(req.body);

    await session.executeWrite(async (tx: ManagedTransaction) => {
      await tx.run(
        `MERGE (a:Project {id: $fromId, ownerId: $ownerId})
         MERGE (b:Project {id: $toId, ownerId: $ownerId})
         MERGE (a)-[r:${body.type}]->(b)
         SET r.updatedAt = datetime()`,
        {
          fromId: body.fromProjectId,
          toId: body.toProjectId,
          ownerId: req.user!.userId
        }
      );
    });

    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  } finally {
    await session.close();
  }
});

graphRouter.get("/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  const session = getNeo4jDriver().session();
  try {
    const result = await session.executeRead(async (tx: ManagedTransaction) =>
      tx.run(
        `MATCH (a:Project {id: $projectId, ownerId: $ownerId})-[r]->(b:Project {ownerId: $ownerId})
         RETURN type(r) as type, b.id as toProjectId`,
        { projectId: req.params.projectId, ownerId: req.user!.userId }
      )
    );

    const links = result.records.map((r: Neo4jRecord) => ({
      type: r.get("type"),
      toProjectId: r.get("toProjectId")
    }));

    res.json({ links });
  } catch (err) {
    next(err);
  } finally {
    await session.close();
  }
});
