import type { Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";
import { generateTempPassword } from "../utils/generateRandomPassword.js";
import { sendAccessEmail, notifyAdmin } from "../services/emailService.js";
import type { AuthRequest } from "../types/auth.types.js";
import type { CreateAccessRequestBody } from "../types/access.Request.types.js";

export const createAccessRequest = async (
  req: AuthRequest<CreateAccessRequestBody>,
  res: Response,
) => {
  try {
    const {
      fullName,
      staffNo,
      jobTitle,
      email,
      departmentId,
      roleRequested,
      reason,
    } = req.body;

    const existing = await prisma.accessRequest.findFirst({
      where: { email: email.toLowerCase() },
    });
    if (existing)
      return res.status(400).json({ message: "Request already exists" });

    const request = await prisma.accessRequest.create({
      data: {
        fullName,
        staffNo,
        jobTitle,
        email: email.toLowerCase(),
        departmentId,
        roleRequested,
        reason,
        approved: false,
      },
    });

    await notifyAdmin(fullName, email);

    return res.status(201).json({
      message: "Request submitted. Admin notified.",
      requestId: request.id,
    });
  } catch (error) {
    console.error("Request Error:", error);
    return res.status(500).json({ message: "Failed to submit request" });
  }
};

export const approveAccessRequest = async (
  req: AuthRequest<any>,
  res: Response,
) => {
  const { requestId } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const request = await tx.accessRequest.findUnique({
        where: { id: requestId },
      });
      if (!request || request.approved)
        throw new Error("Invalid request or already approved");

      const tempPassword = generateTempPassword();
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      const user = await tx.user.create({
        data: {
          fullName: request.fullName,
          email: request.email,
          staffNo: request.staffNo,
          jobTitle: request.jobTitle,
          password: hashedPassword,
          role: request.roleRequested,
          departmentId: request.departmentId,
        },
      });

      await tx.accessRequest.update({
        where: { id: requestId },
        data: { approved: true },
      });

      return { user, tempPassword };
    });

    await sendAccessEmail({
      to: result.user.email,
      name: result.user.fullName,
      tempPassword: result.tempPassword,
    });

    return res.json({ message: "User approved and created" });
  } catch (error) {
    console.error("Approval Error:", error);
    return res.status(500).json({ message: String(error) });
  }
};
