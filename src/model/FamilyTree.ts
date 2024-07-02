// FamilyTree.ts
import { Schema, model } from "mongoose";
import { IFamilyTree } from "../util/Entity";

const familyTreeSchema = new Schema<IFamilyTree>(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    admin: { type: Schema.Types.ObjectId, ref: "User" },
    rootNode: { type: Schema.Types.ObjectId, ref: "Node", required: true },
  },
  {
    timestamps: true,
  },
);

export const FamilyTree = model<IFamilyTree>("FamilyTree", familyTreeSchema);
