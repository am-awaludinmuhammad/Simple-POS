import { z } from "zod";

export const createRecipeSchema = z.object({
  menuId: z
    .string()
    .uuid("Invalid menu ID"),
  ingredients: z
    .array(
      z.object({
        inventoryId: z
          .string()
          .uuid("Invalid inventory ID"),
        quantity: z
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one ingredient is required"),
});

export const updateRecipeSchema = z.object({
  ingredients: z
    .array(
      z.object({
        inventoryId: z
          .string()
          .uuid("Invalid inventory ID"),
        quantity: z
          .number()
          .int("Quantity must be an integer")
          .positive("Quantity must be greater than 0"),
      })
    )
    .min(1, "At least one ingredient is required")
    .optional(),
  isActive: z.boolean().optional(),
});

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>;
export type UpdateRecipeDto = z.infer<typeof updateRecipeSchema>;
