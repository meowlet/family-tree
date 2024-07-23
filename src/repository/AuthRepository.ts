import bcrypt from "bcrypt";
import { IUser } from "../util/Entity";
import { AuthorizationError, ConflictedError } from "../util/Error";
import { User } from "../model/User";
import EmailUtil from "../util/EmailUtil";
import jwt from "jsonwebtoken";
import { NotFoundError } from "elysia";

export class AuthRepository {
  async signUp(user: IUser) {
    try {
      const newUser = await User.create(user);
      return newUser;
    } catch (error: any) {
      if (error.name === "MongoServerError" && error.code === 11000) {
        throw new ConflictedError("Username or email already exists!");
      }
    }
  }

  async signIn(identifier: string, password: string) {
    const existingUser = await User.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    });

    if (!existingUser) {
      throw new AuthorizationError(`User not found!`);
    }

    const passwordMatched = bcrypt.compareSync(
      password,
      existingUser.passwordHash,
    );

    if (passwordMatched) {
      return existingUser;
    } else {
      throw new AuthorizationError("Password does not match!");
    }
  }

  async sendPasswordReset(identifier: string) {
    const existingUser = await User.findOne({
      $or: [{ userName: identifier }, { email: identifier }],
    });

    if (!existingUser) {
      throw new NotFoundError(`User not found!`);
    }

    const token = jwt.sign({ userId: existingUser._id }, "meow");

    const emailUtil = new EmailUtil();

    emailUtil.sendEmail({
      from: '"Meow" <meow@gmail.com>',
      to: existingUser.email,
      subject: `Reset password request for ${existingUser.userName}`,
      text: "Click the link to reset your password",
      html: `<a href='http://localhost:3001/reset/${token}'>Reset password</a>`,
    });
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded: any = jwt.verify(token, "meow");
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new NotFoundError("User not found!");
    }

    const updatedUser = await User.updateOne(
      { _id: user._id },
      { passwordHash: newPassword },
    );

    if (!updatedUser) {
      throw new AuthorizationError("Password not updated, please try again!");
    }

    return updatedUser;
  }
}

export const authRepository = new AuthRepository();
