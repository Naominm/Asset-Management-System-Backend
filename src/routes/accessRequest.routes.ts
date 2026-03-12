import { Router } from "express";
import {
  createAccessRequest,
  approveAccessRequest,
} from "../controllers/access.controller.js";

const router = Router();

router.post("/", createAccessRequest);
router.post("/", approveAccessRequest);

export default router;
