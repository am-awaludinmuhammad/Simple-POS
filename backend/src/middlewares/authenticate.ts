import type { RequestHandler } from "express";
import { verifyAccessToken } from "../modules/auth/jwt.js";
import { AppError } from "../lib/app-error.js";
import { ERROR_CODES } from "../lib/error-codes.js";

export const authenticate: RequestHandler = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Missing or invalid authorization header.",
      );
    }

    const token = authHeader.slice(7);

    try {
      const payload = await verifyAccessToken(token);
      req.user = {
        id: payload.userId,
        roleId: payload.roleId,
      };
      next();
    } catch {
      throw new AppError(
        401,
        ERROR_CODES.UNAUTHORIZED,
        "Invalid or expired access token.",
      );
    }
  } catch (error) {
    next(error);
  }
};
