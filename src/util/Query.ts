import { Types } from "mongoose";

interface BaseQuery {
  page?: number;
  limit?: number;
}

export interface UserQuery extends BaseQuery {
  userName?: string;
  fullName?: string;
  email?: string;
  birthDateFrom?: Date;
  birthDateTo?: Date;
}

export interface FamilyTreeQuery extends BaseQuery {
  name?: string;
  creatorId?: Types.ObjectId | string;
  adminId?: Types.ObjectId | string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
}

export interface NodeQuery extends BaseQuery {
  familyTreeId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  parentNodeId?: Types.ObjectId | string;
  spouseId?: Types.ObjectId | string;
  gender?: boolean;
}

export interface EditHistoryQuery extends BaseQuery {
  familyTreeId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  editedAtFrom?: Date;
  editedAtTo?: Date;
  status?: "pending" | "approved" | "rejected";
  approvedBy?: Types.ObjectId | string;
}

export interface BackupQuery extends BaseQuery {
  familyTreeId?: Types.ObjectId | string;
  userId?: Types.ObjectId | string;
  backupDateFrom?: Date;
  backupDateTo?: Date;
}
