import { z } from "zod";

export const createMenuSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Menu name is required")
    .max(255, "Menu name must be 255 characters or less"),
  categoryId: z
    .string()
    .uuid("Invalid category ID"),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be greater than 0"),
});

export const updateMenuSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Menu name is required")
    .max(255, "Menu name must be 255 characters or less")
    .optional(),
  categoryId: z
    .string()
    .uuid("Invalid category ID")
    .optional(),
  price: z
    .number()
    .int("Price must be an integer")
    .positive("Price must be greater than 0")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateMenuDto = z.infer<typeof createMenuSchema>;
export type UpdateMenuDto = z.infer<typeof updateMenuSchema>;
