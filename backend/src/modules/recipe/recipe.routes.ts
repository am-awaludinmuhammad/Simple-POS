import { Router } from "express";
import { validate } from "../../middlewares/validate.js";
import { authenticate } from "../../middlewares/authenticate.js";
import {
  createRecipe,
  getRecipeByMenuId,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "./recipe.controller.js";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "./dto/recipe.dto.js";

const router = Router();

// All recipe routes require authentication
router.use(authenticate);

router.post(
  "/",
  validate(createRecipeSchema),
  createRecipe,
);

router.get("/menu/:menuId", getRecipeByMenuId);

router.get("/:id", getRecipeById);

router.patch(
  "/:id",
  validate(updateRecipeSchema),
  updateRecipe,
);

router.delete("/:id", deleteRecipe);

export default router;
