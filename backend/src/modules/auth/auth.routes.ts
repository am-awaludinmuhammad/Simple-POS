import { Router } from "express";
import { login } from "./auth.controller.js";
import { validate } from "../../middlewares/validate.js";
import { loginSchema } from "./dto/login.dto.js";

const router = Router();

router.post("/login", validate(loginSchema), login);

export default router;