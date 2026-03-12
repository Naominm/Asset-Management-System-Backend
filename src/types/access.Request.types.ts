import { Role } from "@prisma/client";
export interface CreateAccessRequestBody {
  fullName: string;
  staffNo: string;
  jobTitle: string;
  email: string;
  departmentId: number;
  roleRequested: Role;
  reason: string;
}
