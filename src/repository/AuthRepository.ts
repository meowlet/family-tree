import bcrypt from "bcrypt";
import { IUser } from "../util/Entity";
import { AuthorizationError, ConflictedError } from "../util/Error";
import { User } from "../model/User";

export class AuthRepository {
  async signUp(user: IUser) {
    try {
      await User.create(user);
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
}

export const authRepository = new AuthRepository();
