import type {
  ErrorRequestHandler,
} from "express";

import { AppError } from "./app-error.js";
import { ERROR_CODES } from "./error-codes.js";

export const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      ...(err.details !== undefined && {
        errors: err.details,
      }),
    });
  }

  console.error(err);

  return res.status(500).json({
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: "Internal server error.",
  });
};