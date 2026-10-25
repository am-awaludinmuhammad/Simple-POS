import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import menuRoutes from "./modules/menu/menu.routes.js";
import docsRoutes from "./lib/docs-routes.js";
import { errorHandler } from "./lib/error-handler.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/menus", menuRoutes);

app.use("/docs", docsRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use(errorHandler);

export default app;