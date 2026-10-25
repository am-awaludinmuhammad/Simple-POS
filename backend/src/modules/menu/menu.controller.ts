import type { Request, Response } from "express";
import {
  createMenuService,
  getMenusService,
  getMenuByIdService,
  updateMenuService,
  deleteMenuService,
} from "./menu.service.js";
import type { CreateMenuDto, UpdateMenuDto } from "./dto/menu.dto.js";

export async function createMenu(
  req: Request,
  res: Response,
): Promise<void> {
  await createMenuService(
    req.body as CreateMenuDto,
    req.user.id,
  );

  const menus = await getMenusService();

  res.status(201).json({
    message: "Menu created successfully.",
    data: menus,
  });
}

export async function getMenus(
  _req: Request,
  res: Response,
): Promise<void> {
  const menus = await getMenusService();

  res.status(200).json({
    message: "Menus retrieved successfully.",
    data: menus,
  });
}

export async function getMenuById(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const menu = await getMenuByIdService(id);

  res.status(200).json({
    message: "Menu retrieved successfully.",
    data: menu,
  });
}

export async function updateMenu(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const menu = await updateMenuService(
    id,
    req.body as UpdateMenuDto,
    req.user.id,
  );

  res.status(200).json({
    message: "Menu updated successfully.",
    data: menu,
  });
}

export async function deleteMenu(
  req: Request,
  res: Response,
): Promise<void> {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await deleteMenuService(id, req.user.id);

  res.status(200).json({
    message: "Menu deleted successfully.",
  });
}
