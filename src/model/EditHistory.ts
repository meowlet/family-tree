// EditHistory.ts
import { Schema, model } from "mongoose";
import { IEditHistory } from "../util/Entity";

const editHistorySchema = new Schema<IEditHistory>(
  {
    familyTree: {
      type: Schema.Types.ObjectId,
      ref: "FamilyTree",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    editedAt: { type: Date, default: Date.now },
    detail: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  {
    timestamps: true,
  },
);

export const EditHistory = model<IEditHistory>(
  "EditHistory",
  editHistorySchema,
);
