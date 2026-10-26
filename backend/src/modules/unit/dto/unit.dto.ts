import { z } from "zod";

export const createUnitSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Unit code is required")
    .max(10, "Unit code must be 10 characters or less"),
  name: z
    .string()
    .trim()
    .min(1, "Unit name is required")
    .max(255, "Unit name must be 255 characters or less"),
});

export const updateUnitSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1, "Unit code is required")
    .max(10, "Unit code must be 10 characters or less")
    .optional(),
  name: z
    .string()
    .trim()
    .min(1, "Unit name is required")
    .max(255, "Unit name must be 255 characters or less")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateUnitDto = z.infer<typeof createUnitSchema>;
export type UpdateUnitDto = z.infer<typeof updateUnitSchema>;
