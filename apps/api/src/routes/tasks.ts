import { Router, type NextFunction, type Request, type Response } from "express";
import mongoose from "mongoose";
import { z } from "zod";

import { HttpError } from "../http/errors.js";
import { requireAuth } from "../http/middleware/requireAuth.js";
import { TaskModel } from "../models/Task.js";

export const tasksRouter = Router();

tasksRouter.use(requireAuth);

tasksRouter.get("/by-project/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await TaskModel.find({
      projectId: req.params.projectId,
      createdBy: req.user!.userId
    })
      .sort({ updatedAt: -1 })
      .lean();

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
});

const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueAt: z.string().datetime().optional()
});

tasksRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = createTaskSchema.parse(req.body);

    if (!mongoose.isValidObjectId(body.projectId)) throw new HttpError(400, "Invalid projectId");

    const task = await TaskModel.create({
      projectId: body.projectId,
      title: body.title,
      description: body.description ?? "",
      status: body.status ?? "TODO",
      priority: body.priority ?? "MEDIUM",
      dueAt: body.dueAt ? new Date(body.dueAt) : undefined,
      createdBy: req.user!.userId
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
});

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["TODO", "DOING", "DONE"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  dueAt: z.string().datetime().nullable().optional()
});

tasksRouter.patch("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = updateTaskSchema.parse(req.body);

    const update: Record<string, unknown> = {};
    if (body.title !== undefined) update.title = body.title;
    if (body.description !== undefined) update.description = body.description;
    if (body.status !== undefined) update.status = body.status;
    if (body.priority !== undefined) update.priority = body.priority;
    if (body.dueAt !== undefined) update.dueAt = body.dueAt === null ? null : new Date(body.dueAt);

    const task = await TaskModel.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user!.userId },
      { $set: update },
      { new: true }
    ).lean();

    if (!task) throw new HttpError(404, "Task not found");

    res.json({ task });
  } catch (err) {
    next(err);
  }
});

tasksRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await TaskModel.findOneAndDelete({ _id: req.params.id, createdBy: req.user!.userId }).lean();
    if (!task) throw new HttpError(404, "Task not found");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
