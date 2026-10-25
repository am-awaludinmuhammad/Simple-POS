import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name must be 255 characters or less"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(255, "Category name must be 255 characters or less")
    .optional(),
  isActive: z.boolean().optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().uuid("Invalid category ID"),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
