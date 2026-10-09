import { createHash } from "node:crypto";
import {
  jwtVerify,
  SignJWT,
} from "jose";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRES_IN =
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? "15m";

const REFRESH_TOKEN_EXPIRES_IN =
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? "30d";

if (!ACCESS_TOKEN_SECRET) {
  throw new Error("JWT_ACCESS_TOKEN_SECRET is not configured.");
}

if (!REFRESH_TOKEN_SECRET) {
  throw new Error("JWT_REFRESH_TOKEN_SECRET is not configured.");
}

const accessTokenSecret = new TextEncoder().encode(
  ACCESS_TOKEN_SECRET,
);

const refreshTokenSecret = new TextEncoder().encode(
  REFRESH_TOKEN_SECRET,
);

export type AccessTokenPayload = {
  userId: string;
  roleId: string;
};

export type RefreshTokenPayload = {
  userId: string;
  sessionId: string;
};

async function signToken(
  payload: Record<string, string>,
  secret: Uint8Array,
  expiresIn: string,
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function signAccessToken(
  payload: AccessTokenPayload,
): Promise<string> {
  return signToken(
    {
      sub: payload.userId,
      roleId: payload.roleId,
    },
    accessTokenSecret,
    ACCESS_TOKEN_EXPIRES_IN,
  );
}

export async function signRefreshToken(
  payload: RefreshTokenPayload,
): Promise<string> {
  return signToken(
    {
      sub: payload.userId,
      sessionId: payload.sessionId,
    },
    refreshTokenSecret,
    REFRESH_TOKEN_EXPIRES_IN,
  );
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify(
    token,
    accessTokenSecret,
    {
      algorithms: ["HS256"],
    },
  );

  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Invalid access token payload.");
  }

  if (
    !payload.roleId ||
    typeof payload.roleId !== "string"
  ) {
    throw new Error("Invalid access token payload.");
  }

  return {
    userId: payload.sub,
    roleId: payload.roleId,
  };
}

export async function verifyRefreshToken(
  token: string,
): Promise<RefreshTokenPayload> {
  const { payload } = await jwtVerify(
    token,
    refreshTokenSecret,
    {
      algorithms: ["HS256"],
    },
  );

  if (!payload.sub || typeof payload.sub !== "string") {
    throw new Error("Invalid refresh token payload.");
  }

  if (
    !payload.sessionId ||
    typeof payload.sessionId !== "string"
  ) {
    throw new Error("Invalid refresh token payload.");
  }

  return {
    userId: payload.sub,
    sessionId: payload.sessionId,
  };
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}