import { prisma } from "../prisma.js";

export const createAsset = async (data: any, userId: number) => {
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
  } = data;

  // ✅ Validation
  if (
    !tagNo ||
    !serialNumber ||
    !category ||
    !make ||
    !model ||
    !departmentId
  ) {
    throw new Error("Missing required fields");
  }

  // ✅ Check duplicate
  const existing = await prisma.asset.findUnique({
    where: { serialNumber },
  });

  if (existing) {
    throw new Error("Asset with this serial number already exists");
  }

  // ✅ Transaction (asset + log together)
  const asset = await prisma.$transaction(async (tx) => {
    const newAsset = await tx.asset.create({
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

    await tx.activityLog.create({
      data: {
        type: "REGISTRATION",
        message: `Asset ${newAsset.tagNo} registered`,
        assetId: newAsset.id,
        userId,
      },
    });

    return newAsset;
  });

  return asset;
};
