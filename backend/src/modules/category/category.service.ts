import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/app-error.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "./dto/category.dto.js";

export async function createCategoryService(
  data: CreateCategoryDto,
  userId: string,
) {
  await prisma.category.create({
    data: {
      name: data.name,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoriesService() {
  return prisma.category.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getCategoryByIdService(id: string) {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });

  if (!category) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Category not found.",
    );
  }

  return category;
}

export async function updateCategoryService(
  id: string,
  data: UpdateCategoryDto,
  userId: string,
) {
  await prisma.category.update({
    where: { id },
    data: {
      ...data,
      updatedBy: userId,
    },
  });

  return prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
}

export async function deleteCategoryService(id: string, userId: string) {
  await getCategoryByIdService(id);

  await prisma.category.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: userId,
    },
  });
}
