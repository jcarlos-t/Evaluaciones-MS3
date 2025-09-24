// src/middlewares/error.ts
import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  code: string;
  httpStatus: number;
  meta?: unknown;
  constructor(code: string, httpStatus: number, message: string, meta?: unknown) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
    this.meta = meta;
  }
  static badRequest(msg = "Bad request", meta?: unknown) {
    return new ApiError("BAD_REQUEST", 400, msg, meta);
  }
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const isApi = err instanceof ApiError;
  const status = isApi ? err.httpStatus : 500;
  const payload = isApi
    ? { ok: false, error: { code: err.code, message: err.message, meta: err.meta } }
    : { ok: false, error: { code: "INTERNAL_ERROR", message: "Unexpected error" } };

  if (!isApi) console.error(err);
  res.status(status).json(payload);
}

