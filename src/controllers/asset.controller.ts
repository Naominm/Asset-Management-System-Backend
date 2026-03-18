import type { Response } from "express";
import { prisma } from "../prisma.js";
import type { AuthRequest } from "../types/auth.types.js";

export const createAsset = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      tagNo,
      systemAssetId,
      category,
      subCategory,
      assetDescription,
      make,
      model,
      physicalCondition,
      serialNumber,
      macAddress,
      imeiNumber,
      color,
      departmentId,
    } = req.body;

    if (
      !tagNo ||
      !serialNumber ||
      !category ||
      !make ||
      !model ||
      !departmentId
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const existingAsset = await prisma.asset.findUnique({
      where: { serialNumber },
    });

    if (existingAsset) {
      return res.status(400).json({
        message: "Asset with this serial number already exists",
      });
    }

    const asset = await prisma.asset.create({
      data: {
        tagNo,
        systemAssetId,
        category,
        subCategory,
        assetDescription,
        make,
        model,
        physicalCondition,
        serialNumber,
        macAddress,
        imeiNumber,
        color,
        departmentId,
      },
    });
    return res.status(201).json({
      message: "Asset created successfully",
      asset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error creating asset",
    });
  }
};
