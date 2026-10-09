import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { AppError } from "../lib/app-error";
import { ERROR_CODES } from "../lib/error-codes";

export function validate(schema: ZodType): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(
        new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          "Request validation failed.",
          result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            code: issue.code,
            message: issue.message,
          })),
        ),
      );

      return;
    }

    req.body = result.data;
    next();
  };
}