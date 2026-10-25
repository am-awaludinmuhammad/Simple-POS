import type { Request, Response } from "express";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "./category.service.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto.js";

export async function createCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const category = await createCategoryService(
    req.body as CreateCategoryDto,
    req.user.id,
  );

  res.status(201).json({
    message: "Category created successfully.",
    data: category,
  });
}

export async function getCategories(
  _req: Request,
  res: Response,
): Promise<void> {
  const categories = await getCategoriesService();

  res.status(200).json({
    message: "Categories retrieved successfully.",
    data: categories,
  });
}

export async function getCategoryById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const category = await getCategoryByIdService(id);

  res.status(200).json({
    message: "Category retrieved successfully.",
    data: category,
  });
}

export async function updateCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const category = await updateCategoryService(
    id,
    req.body as UpdateCategoryDto,
    req.user.id,
  );

  res.status(200).json({
    message: "Category updated successfully.",
    data: category,
  });
}

export async function deleteCategory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteCategoryService(id, req.user.id);

  res.status(200).json({
    message: "Category deleted successfully.",
  });
}
