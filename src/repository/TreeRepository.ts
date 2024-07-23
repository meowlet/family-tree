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
    });

    const treeNodes = await Node.find({ familyTree: treeId }).populate<{
      user: IUser;
    }>("user");

    const myNode = treeNodes.find(
      (node) =>
        (node.user as any)?._id.toString() === this.userId ||
        treeInfo?.creator === this.userId ||
        treeInfo?.admin.toString() === this.userId,
    );

    if (!treeInfo) {
      throw new AuthorizationError("Tree not found");
    }

    if (!myNode && !treeInfo) {
      throw new ForbiddenError("You are not authorized to view this tree");
    }

    return {
      treeInfo,
      treeNodes,
    };
  }

  async getTrees() {
    const createdTrees = await FamilyTree.find({ creator: this.userId });

    const memberNodes = await Node.find({ user: this.userId });
    const memberTreeIds = memberNodes.map((node) => node.familyTree);

    const memberTrees = await FamilyTree.find({
      _id: { $in: memberTreeIds },
      creator: { $ne: this.userId },
    });

    return {
      createdTrees,
      memberTrees,
    };
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
