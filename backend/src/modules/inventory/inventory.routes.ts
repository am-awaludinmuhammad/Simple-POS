import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  createInventory,
  getInventories,
  getInventoryById,
  updateInventory,
  deleteInventory,
} from "./inventory.controller.js";
import {
  createInventorySchema,
  updateInventorySchema,
} from "./dto/inventory.dto.js";

const router = Router();

// All inventory routes require authentication
router.use(authenticate);

router.post(
  "/",
  validate(createInventorySchema),
  createInventory,
);

router.get("/", getInventories);

router.get("/:id", getInventoryById);

router.patch(
  "/:id",
  validate(updateInventorySchema),
  updateInventory,
);

router.delete("/:id", deleteInventory);

export default router;
