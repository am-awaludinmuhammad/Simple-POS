import { z } from "zod";

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type LoginDto = z.infer<typeof loginSchema>;