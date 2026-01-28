import { Router, type NextFunction, type Request, type Response } from "express";
import { z } from "zod";

import { HttpError } from "../http/errors.js";
import { requireAuth } from "../http/middleware/requireAuth.js";
import { ProjectModel } from "../models/Project.js";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await ProjectModel.find({ createdBy: req.user!.userId })
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

const createProjectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  deadline: z.string().datetime().optional(),
  tags: z.array(z.string()).optional()
});

projectsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createProjectSchema.parse(req.body);
    const project = await ProjectModel.create({
      name: body.name,
      description: body.description ?? "",
      objectives: body.objectives ?? [],
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      tags: body.tags ?? [],
      createdBy: req.user!.userId
    });

    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
});

projectsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await ProjectModel.findOne({ _id: req.params.id, createdBy: req.user!.userId }).lean();
    if (!project) throw new HttpError(404, "Project not found");
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  objectives: z.array(z.string()).optional(),
  deadline: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional()
});

projectsRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateProjectSchema.parse(req.body);

    const update: Record<string, unknown> = {};
    if (body.name !== undefined) update.name = body.name;
    if (body.description !== undefined) update.description = body.description;
    if (body.objectives !== undefined) update.objectives = body.objectives;
    if (body.tags !== undefined) update.tags = body.tags;
    if (body.deadline !== undefined) update.deadline = body.deadline === null ? null : new Date(body.deadline);

    const project = await ProjectModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user!.userId },
      { $set: update },
      { new: true }
    ).lean();

    if (!project) throw new HttpError(404, "Project not found");

    res.json({ project });
  } catch (err) {
    next(err);
  }
});

projectsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await ProjectModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.userId }).lean();
    if (!project) throw new HttpError(404, "Project not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
