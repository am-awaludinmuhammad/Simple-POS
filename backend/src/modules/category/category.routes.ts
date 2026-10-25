import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "./category.controller.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./dto/category.dto.js";

const router = Router();

// All category routes require authentication
router.use(authenticate);

router.post(
  "/",
  validate(createCategorySchema),
  createCategory,
);

router.get("/", getCategories);

router.get("/:id", getCategoryById);

router.patch(
  "/:id",
  validate(updateCategorySchema),
  updateCategory,
);

router.delete("/:id", deleteCategory);

export default router;
