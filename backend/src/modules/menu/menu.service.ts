import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/app-error.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import type { CreateMenuDto, UpdateMenuDto } from "./dto/menu.dto.js";

export async function createMenuService(
  data: CreateMenuDto,
  userId: string,
) {
  await prisma.category.findUnique({
    where: { id: data.categoryId },
  });

  if (!await prisma.category.findUnique({ where: { id: data.categoryId } })) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Category not found.",
    );
  }

  await prisma.menu.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      price: data.price,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  return prisma.menu.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      categoryId: true,
      price: true,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getMenusService() {
  return prisma.menu.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      categoryId: true,
      price: true,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getMenuByIdService(id: string) {
  const menu = await prisma.menu.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      categoryId: true,
      price: true,
      isActive: true,
    },
  });

  if (!menu) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Menu not found.",
    );
  }

  return menu;
}

export async function updateMenuService(
  id: string,
  data: UpdateMenuDto,
  userId: string,
) {
  await getMenuByIdService(id);

  if (data.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    if (!category) {
      throw new AppError(
        404,
        ERROR_CODES.NOT_FOUND,
        "Category not found.",
      );
    }
  }

  await prisma.menu.update({
    where: { id },
    data: {
      ...data,
      updatedBy: userId,
    },
  });

  return prisma.menu.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      categoryId: true,
      price: true,
      isActive: true,
    },
  });
}

export async function deleteMenuService(id: string, userId: string) {
  await getMenuByIdService(id);

  await prisma.menu.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: userId,
    },
  });
}
