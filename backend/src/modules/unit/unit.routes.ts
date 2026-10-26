import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  createUnit,
  getUnits,
  getUnitById,
  updateUnit,
  deleteUnit,
} from "./unit.controller.js";
import {
  createUnitSchema,
  updateUnitSchema,
} from "./dto/unit.dto.js";

const router = Router();

// All unit routes require authentication
router.use(authenticate);

router.post(
  "/",
  validate(createUnitSchema),
  createUnit,
);

router.get("/", getUnits);

router.get("/:id", getUnitById);

router.patch(
  "/:id",
  validate(updateUnitSchema),
  updateUnit,
);

router.delete("/:id", deleteUnit);

export default router;
