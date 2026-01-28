import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../errors.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, code: err.code });
  }

  return res.status(500).json({ error: "Internal Server Error" });
}
