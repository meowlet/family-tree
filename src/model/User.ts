// User.ts
import { Schema, model } from "mongoose";
import { IUser } from "../util/Entity";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    birthDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  const saltRound = 8;
  if (this.isModified("passwordHash")) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, saltRound);
  }
  next();
});

export const User = model<IUser>("User", userSchema);
