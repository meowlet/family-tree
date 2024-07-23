// User.ts
import { Schema, model } from "mongoose";
import { IUser } from "../util/Entity";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, unique: true },
    passwordHash: { type: String },
    email: { type: String, unique: true },
    fullName: { type: String, required: true },
    bio: { type: String },
    homeTown: { type: String },
  },
  {
    timestamps: true,
  },
);

async function hashPassword(password: string): Promise<string> {
  const saltRound = 8;
  return bcrypt.hash(password, saltRound);
}

userSchema.pre("save", async function (next) {
  if (this.isModified("passwordHash")) {
    this.passwordHash = await hashPassword(this.passwordHash);
  }
  next();
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as { passwordHash?: string };
  if (update.passwordHash) {
    update.passwordHash = await hashPassword(update.passwordHash);
  }
  next();
});

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { passwordHash?: string };
  if (update.passwordHash) {
    update.passwordHash = await hashPassword(update.passwordHash);
  }
  next();
});

export const User = model<IUser>("User", userSchema);
