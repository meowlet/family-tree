// Node.ts
import { Schema, model } from "mongoose";
import { INode } from "../util/Entity";

const nodeSchema = new Schema<INode>(
  {
    familyTree: {
      type: Schema.Types.ObjectId,
      ref: "FamilyTree",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentNode: { type: Schema.Types.ObjectId, ref: "Node", default: null },
    spouse: { type: Schema.Types.ObjectId, ref: "Node", default: null },
    gender: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  },
);

export const Node = model<INode>("Node", nodeSchema);
