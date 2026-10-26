import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/app-error.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import type { CreateInventoryDto, UpdateInventoryDto } from "./dto/inventory.dto.js";

export async function createInventoryService(
  data: CreateInventoryDto,
  userId: string,
) {
  const unit = await prisma.unit.findUnique({
    where: { id: data.unitId },
  });

  if (!unit) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Unit not found.",
    );
  }

  await prisma.inventory.create({
    data: {
      name: data.name,
      unitId: data.unitId,
      currentStock: data.currentStock,
      minimumStock: data.minimumStock,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  return prisma.inventory.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      unitId: true,
      currentStock: true,
      minimumStock: true,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getInventoriesService() {
  return prisma.inventory.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      unitId: true,
      currentStock: true,
      minimumStock: true,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function getInventoryByIdService(id: string) {
  const inventory = await prisma.inventory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      unitId: true,
      currentStock: true,
      minimumStock: true,
      isActive: true,
    },
  });

  if (!inventory) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Inventory not found.",
    );
  }

  return inventory;
}

export async function updateInventoryService(
  id: string,
  data: UpdateInventoryDto,
  userId: string,
) {
  await getInventoryByIdService(id);

  if (data.unitId) {
    const unit = await prisma.unit.findUnique({
      where: { id: data.unitId },
    });

    if (!unit) {
      throw new AppError(
        404,
        ERROR_CODES.NOT_FOUND,
        "Unit not found.",
      );
    }
  }

  await prisma.inventory.update({
    where: { id },
    data: {
      ...data,
      updatedBy: userId,
    },
  });

  return prisma.inventory.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      unitId: true,
      currentStock: true,
      minimumStock: true,
      isActive: true,
    },
  });
}

export async function deleteInventoryService(id: string, userId: string) {
  await getInventoryByIdService(id);

  await prisma.inventory.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: userId,
    },
  });
}
