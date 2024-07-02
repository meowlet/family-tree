import { FamilyTree } from "../model/FamilyTree";
import { User } from "../model/User";
import { IFamilyTree } from "../util/Entity";
import { AuthorizationError } from "../util/Error";

export class TreeRepository {
  public userId: string;

  constructor(userID: string) {
    this.userId = userID;
  }

  async getUser() {
    const user = await User.findOne({ _id: this.userId });

    if (!user) {
      throw new AuthorizationError("User not found");
    }

    return user;
  }

  async createTree(tree: IFamilyTree) {
    FamilyTree.create(tree);
  }
}
