import type { Request, Response } from "express";
import {
  createInventoryService,
  getInventoriesService,
  getInventoryByIdService,
  updateInventoryService,
  deleteInventoryService,
} from "./inventory.service.js";
import type { CreateInventoryDto, UpdateInventoryDto } from "./dto/inventory.dto.js";

export async function createInventory(
  req: Request,
  res: Response,
): Promise<void> {
  await createInventoryService(
    req.body as CreateInventoryDto,
    req.user.id,
  );

  const inventories = await getInventoriesService();

  res.status(201).json({
    message: "Inventory created successfully.",
    data: inventories,
  });
}

export async function getInventories(
  _req: Request,
  res: Response,
): Promise<void> {
  const inventories = await getInventoriesService();

  res.status(200).json({
    message: "Inventories retrieved successfully.",
    data: inventories,
  });
}

export async function getInventoryById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const inventory = await getInventoryByIdService(id);

  res.status(200).json({
    message: "Inventory retrieved successfully.",
    data: inventory,
  });
}

export async function updateInventory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const inventory = await updateInventoryService(
    id,
    req.body as UpdateInventoryDto,
    req.user.id,
  );

  res.status(200).json({
    message: "Inventory updated successfully.",
    data: inventory,
  });
}

export async function deleteInventory(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteInventoryService(id, req.user.id);

  res.status(200).json({
    message: "Inventory deleted successfully.",
  });
}
