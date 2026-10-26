import { z } from "zod";

export const createInventorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Inventory name is required")
    .max(255, "Inventory name must be 255 characters or less"),
  unitId: z
    .string()
    .uuid("Invalid unit ID"),
  currentStock: z
    .number()
    .int("Current stock must be an integer")
    .nonnegative("Current stock must be non-negative"),
  minimumStock: z
    .number()
    .int("Minimum stock must be an integer")
    .nonnegative("Minimum stock must be non-negative"),
});

export const updateInventorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Inventory name is required")
    .max(255, "Inventory name must be 255 characters or less")
    .optional(),
  unitId: z
    .string()
    .uuid("Invalid unit ID")
    .optional(),
  currentStock: z
    .number()
    .int("Current stock must be an integer")
    .nonnegative("Current stock must be non-negative")
    .optional(),
  minimumStock: z
    .number()
    .int("Minimum stock must be an integer")
    .nonnegative("Minimum stock must be non-negative")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateInventoryDto = z.infer<typeof createInventorySchema>;
export type UpdateInventoryDto = z.infer<typeof updateInventorySchema>;
