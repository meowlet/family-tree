import { Document, Types } from "mongoose";

export interface IUser {
  userName: string;
  passwordHash: string;
  email: string;
  bio: string;
  fullName: string;
  homeTown: string;
}

export interface IFamilyTree {
  name: string;
  description: string;
  creator: Types.ObjectId | string;
  admin: Types.ObjectId | string;
  rootNode: Types.ObjectId | string;
}

export interface INode {
  familyTree: Types.ObjectId | string;
  user: Types.ObjectId | string;
  parentNode: Types.ObjectId | string | null;
  spouse: Types.ObjectId | string;
  gender: boolean;
  birthDate: Date;
  deathDate: Date;
  marriageDate: Date;
}

export interface IEditHistory {
  familyTree: Types.ObjectId | string;
  user: Types.ObjectId | string;
  editedAt: Date;
  detail: string;
  status: "pending" | "approved" | "rejected";
  approvedBy: Types.ObjectId | string;
}

export interface IBackup {
  familyTree: Types.ObjectId | string;
  user: Types.ObjectId | string;
}
