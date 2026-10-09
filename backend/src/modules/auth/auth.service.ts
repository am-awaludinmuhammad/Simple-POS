import { randomUUID } from "node:crypto";

import { prisma } from "../../lib/prisma.js";
import { verifyPassword } from "./password.js";
import {
  hashRefreshToken,
  signAccessToken,
  signRefreshToken,
} from "./jwt.js";
import type { LoginDto } from "./dto/login.dto.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import { AppError } from "../../lib/app-error.js";

export async function loginService(data: LoginDto) {
  const { phoneNumber, password } = data;

  const user = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
    include: {
      role: true,
    },
  });

  if (!user) {
    throw new AppError(
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid phone number or password.",
    );
  }

  if (!user.isActive) {
    throw new AppError(
      403,
      ERROR_CODES.ACCOUNT_INACTIVE,
      "User account is inactive.",
    );
  }

  const passwordValid = await verifyPassword(
    password,
    user.passwordHash,
  );

  if (!passwordValid) {
    throw new AppError(
      401,
      ERROR_CODES.INVALID_CREDENTIALS,
      "Invalid phone number or password.",
    );
  }

  const sessionId = randomUUID();

  const accessToken = await signAccessToken({
    userId: user.id,
    roleId: user.roleId,
  });

  const refreshToken = await signRefreshToken({
    userId: user.id,
    sessionId,
  });

  await prisma.refreshSession.create({
    data: {
      id: sessionId,
      userId: user.id,
      tokenHash: hashRefreshToken(refreshToken),
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      phoneNumber: user.phoneNumber,
      role: user.role,
    },
  };
}

function getRefreshTokenExpiry(): Date {
  const expiresIn =
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? "30d";

  const match = /^(\d+)([smhd])$/.exec(expiresIn);

  if (!match) {
    throw new Error(
      "Invalid JWT_REFRESH_TOKEN_EXPIRES_IN format.",
    );
  }

  const value = Number(match[1]);
  const unit = match[2] as "s" | "m" | "h" | "d";

  const milliseconds = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };

  return new Date(Date.now() + value * milliseconds[unit]);
}