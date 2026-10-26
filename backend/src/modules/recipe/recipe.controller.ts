import type { Request, Response } from "express";
import {
  createRecipeService,
  getRecipeByMenuIdService,
  getRecipeByIdService,
  updateRecipeService,
  deleteRecipeService,
} from "./recipe.service.js";
import type { CreateRecipeDto, UpdateRecipeDto } from "./dto/recipe.dto.js";

export async function createRecipe(
  req: Request,
  res: Response,
): Promise<void> {
  const recipe = await createRecipeService(
    req.body as CreateRecipeDto,
    req.user.id,
  );

  res.status(201).json({
    message: "Recipe created successfully.",
    data: recipe,
  });
}

export async function getRecipeByMenuId(
  req: Request,
  res: Response,
): Promise<void> {
  const menuId = Array.isArray(req.params.menuId)
    ? req.params.menuId[0]
    : req.params.menuId;
  const recipe = await getRecipeByMenuIdService(menuId);

  res.status(200).json({
    message: "Recipe retrieved successfully.",
    data: recipe,
  });
}

export async function getRecipeById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const recipe = await getRecipeByIdService(id);

  res.status(200).json({
    message: "Recipe retrieved successfully.",
    data: recipe,
  });
}

export async function updateRecipe(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const recipe = await updateRecipeService(
    id,
    req.body as UpdateRecipeDto,
    req.user.id,
  );

  res.status(200).json({
    message: "Recipe updated successfully.",
    data: recipe,
  });
}

export async function deleteRecipe(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteRecipeService(id, req.user.id);

  res.status(200).json({
    message: "Recipe deleted successfully.",
  });
}
