import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  createMenu,
  getMenus,
  getMenuById,
  updateMenu,
  deleteMenu,
} from "./menu.controller.js";
import {
  createMenuSchema,
  updateMenuSchema,
} from "./dto/menu.dto.js";

const router = Router();

// All menu routes require authentication
router.use(authenticate);

router.post(
  "/",
  validate(createMenuSchema),
  createMenu,
);

router.get("/", getMenus);

router.get("/:id", getMenuById);

router.patch(
  "/:id",
  validate(updateMenuSchema),
  updateMenu,
);

router.delete("/:id", deleteMenu);

export default router;
