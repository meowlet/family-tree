import { User } from "../model/User";
import { AuthorizationError } from "../util/Error";

export class UserRepository {
  public userId: string;

  constructor(userID: string) {
    this.userId = userID;
  }

  async getUser() {
    const user = await User.findOne({ _id: this.userId }).select(
      "-passwordHash",
    );

    if (!user) {
      throw new AuthorizationError("User not found");
    }

    return user;
  }

  async getUsers(query: string) {
    const searchCriteria = {
      $or: [
        { userName: { $regex: query, $options: "i" } }, // Case-insensitive search on username
        { fullName: { $regex: query, $options: "i" } }, // Case-insensitive search on fullName
      ],
    };

    const users = await User.find(searchCriteria).select("-passwordHash");

    if (users.length === 0) {
      return [];
    }

    return users;
  }
}
