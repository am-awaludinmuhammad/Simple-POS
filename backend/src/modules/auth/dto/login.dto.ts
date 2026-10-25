import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Username or phone number is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginSchema>;