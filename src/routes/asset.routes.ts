import { Router } from "express";
import {
  createAsset,
  getAssets,
  getStats,
} from "../controllers/asset.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/status", authenticateToken, getStats);

router.get("/assets", authenticateToken, getAssets);

router.post("/create", authenticateToken, createAsset);

export default router;
