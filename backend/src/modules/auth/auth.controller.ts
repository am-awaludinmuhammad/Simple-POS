import type { Request, Response } from "express";
import { LoginDto } from "./dto/login.dto.js";
import { loginService } from "./auth.service.js";


export async function login(
  req: Request,
  res: Response,
): Promise<void> {
  const result = await loginService(req.body as LoginDto);

  res.cookie("refresh_token", result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/v1/auth",
  });

  res.status(200).json({
    message: "Login successful.",
    data: {
      accessToken: result.accessToken,
      user: result.user,
    },
  });
}