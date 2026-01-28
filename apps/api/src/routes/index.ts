import { Router } from "express";

import { authRouter } from "./auth.js";
import { graphRouter } from "./graph.js";
import { healthRouter } from "./health.js";
import { projectsRouter } from "./projects.js";
import { tasksRouter } from "./tasks.js";

export const routes = Router();

routes.use("/health", healthRouter);
routes.use("/auth", authRouter);
routes.use("/projects", projectsRouter);
routes.use("/tasks", tasksRouter);
routes.use("/graph", graphRouter);
