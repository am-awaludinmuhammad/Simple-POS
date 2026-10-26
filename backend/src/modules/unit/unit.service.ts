import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../lib/app-error.js";
import { ERROR_CODES } from "../../lib/error-codes.js";
import type { CreateUnitDto, UpdateUnitDto } from "./dto/unit.dto.js";

export async function createUnitService(
  data: CreateUnitDto,
  userId: string,
) {
  await prisma.unit.create({
    data: {
      code: data.code,
      name: data.name,
      createdBy: userId,
      updatedBy: userId,
    },
  });

  return prisma.unit.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
    },
    orderBy: { code: "asc" },
  });
}

export async function getUnitsService() {
  return prisma.unit.findMany({
    where: { isActive: true },
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
    },
    orderBy: { code: "asc" },
  });
}

export async function getUnitByIdService(id: string) {
  const unit = await prisma.unit.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
    },
  });

  if (!unit) {
    throw new AppError(
      404,
      ERROR_CODES.NOT_FOUND,
      "Unit not found.",
    );
  }

  return unit;
}

export async function updateUnitService(
  id: string,
  data: UpdateUnitDto,
  userId: string,
) {
  await getUnitByIdService(id);

  await prisma.unit.update({
    where: { id },
    data: {
      ...data,
      updatedBy: userId,
    },
  });

  return prisma.unit.findUnique({
    where: { id },
    select: {
      id: true,
      code: true,
      name: true,
      isActive: true,
    },
  });
}

export async function deleteUnitService(id: string, userId: string) {
  await getUnitByIdService(id);

  await prisma.unit.update({
    where: { id },
    data: {
      isActive: false,
      updatedBy: userId,
    },
  });
}
