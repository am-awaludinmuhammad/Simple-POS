import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/app-error.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import type { CreateRecipeDto, UpdateRecipeDto } from "./dto/recipe.dto.js";

export async function createRecipeService(
  data: CreateRecipeDto,
  userId: string,
) {
  const menu = await prisma.menu.findUnique({
    where: { id: data.menuId },
  });

  if (!menu) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Menu not found.",
    );
  }

  if (menu.recipeId) {
    throw new AppError(
      409,
      ERROR_CODES.CONFLICT,
      "Menu already has a recipe.",
    );
  }

  const recipe = await prisma.recipe.create({
    data: {
      createdBy: userId,
      updatedBy: userId,
    },
  });

  await prisma.menu.update({
    where: { id: data.menuId },
    data: { recipeId: recipe.id },
  });

  await prisma.recipeIngredient.createMany({
    data: data.ingredients.map((ingredient) => ({
      recipeId: recipe.id,
      inventoryId: ingredient.inventoryId,
      quantity: ingredient.quantity,
    })),
  });

  return getRecipeByIdService(recipe.id);
}

export async function getRecipeByMenuIdService(menuId: string) {
  const menu = await prisma.menu.findUnique({
    where: { id: menuId },
    include: {
      recipe: {
        include: {
          ingredients: {
            select: {
              id: true,
              inventoryId: true,
              quantity: true,
            },
          },
        },
      },
    },
  });

  if (!menu || !menu.recipe) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Recipe not found.",
    );
  }

  return menu.recipe;
}

export async function getRecipeByIdService(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      ingredients: {
        select: {
          id: true,
          inventoryId: true,
          quantity: true,
        },
      },
    },
  });

  if (!recipe) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Recipe not found.",
    );
  }

  return recipe;
}

export async function updateRecipeService(
  recipeId: string,
  data: UpdateRecipeDto,
  userId: string,
) {
  await getRecipeByIdService(recipeId);

  if (data.ingredients) {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId },
    });

    await prisma.recipeIngredient.createMany({
      data: data.ingredients.map((ingredient) => ({
        recipeId,
        inventoryId: ingredient.inventoryId,
        quantity: ingredient.quantity,
      })),
    });
  }

  if (data.isActive !== undefined) {
    await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        isActive: data.isActive,
        updatedBy: userId,
      },
    });
  }

  return getRecipeByIdService(recipeId);
}

export async function deleteRecipeService(recipeId: string, userId: string) {
  await getRecipeByIdService(recipeId);

  await prisma.recipe.update({
    where: { id: recipeId },
    data: {
      isActive: false,
      updatedBy: userId,
    },
  });
}
