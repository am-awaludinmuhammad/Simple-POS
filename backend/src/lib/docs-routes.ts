import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../lib/swagger-config.js";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerSpec, {
  customCss: ".swagger-ui { max-width: 100%; }",
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

router.get("/openapi.json", (_req, res) => {
  res.json(swaggerSpec);
});

export default router;
