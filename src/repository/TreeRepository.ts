import { FamilyTree } from "../model/FamilyTree";
import { Node } from "../model/Node";
import { User } from "../model/User";
import { IFamilyTree, IUser } from "../util/Entity";
import { AuthorizationError, ForbiddenError } from "../util/Error";

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

  async getTree(treeId: string) {
    const treeInfo = await FamilyTree.findOne({
      _id: treeId,
      creator: this.userId,
    });
    const treeNodes = await Node.find({ familyTree: treeId }).populate<{
      user: IUser;
    }>("user");

    if (!treeInfo) {
      throw new ForbiddenError("You are not authorized to view this tree");
    }

    return {
      treeInfo,
      treeNodes,
    };
  }

  async getTrees() {
    return FamilyTree.find({ creator: this.userId });
  }

  async deleteTree(treeId: string) {
    const deletedTree = await FamilyTree.findOneAndDelete({
      $and: [{ _id: treeId }, { creator: this.userId }],
    });

    if (!deletedTree) {
      throw new ForbiddenError("You are not authorized to delete this tree");
    }

    return deletedTree;
  }
}
