import type { Response } from "express";
import type { AuthRequest } from "../types/auth.types.js";
import * as assetService from "../services/asset.service.js";

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const asset = await assetService.createAsset(req.body, req.user.id);

    return res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Error creating asset",
    });
  }
};
