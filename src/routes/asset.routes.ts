import { Router } from "express";
import { createAsset } from "../controllers/asset.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticateToken, createAsset);

export default router;
