import type { Request, Response } from "express";
import {
  createUnitService,
  getUnitsService,
  getUnitByIdService,
  updateUnitService,
  deleteUnitService,
} from "./unit.service.js";
import type { CreateUnitDto, UpdateUnitDto } from "./dto/unit.dto.js";

export async function createUnit(
  req: Request,
  res: Response,
): Promise<void> {
  await createUnitService(
    req.body as CreateUnitDto,
    req.user.id,
  );

  const units = await getUnitsService();

  res.status(201).json({
    message: "Unit created successfully.",
    data: units,
  });
}

export async function getUnits(
  _req: Request,
  res: Response,
): Promise<void> {
  const units = await getUnitsService();

  res.status(200).json({
    message: "Units retrieved successfully.",
    data: units,
  });
}

export async function getUnitById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const unit = await getUnitByIdService(id);

  res.status(200).json({
    message: "Unit retrieved successfully.",
    data: unit,
  });
}

export async function updateUnit(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const unit = await updateUnitService(
    id,
    req.body as UpdateUnitDto,
    req.user.id,
  );

  res.status(200).json({
    message: "Unit updated successfully.",
    data: unit,
  });
}

export async function deleteUnit(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteUnitService(id, req.user.id);

  res.status(200).json({
    message: "Unit deleted successfully.",
  });
}
