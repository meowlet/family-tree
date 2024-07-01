// Backup.ts
import { Schema, model } from "mongoose";
import { IBackup } from "../util/Entity";

const backupSchema = new Schema<IBackup>(
  {
    familyTree: {
      type: Schema.Types.ObjectId,
      ref: "FamilyTree",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    backupDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export const Backup = model<IBackup>("Backup", backupSchema);
