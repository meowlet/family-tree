import { NotFoundError } from "elysia";
import { Node } from "../model/Node";
import { User } from "../model/User";
import { INode, IUser } from "../util/Entity";
import { AuthorizationError, ConflictedError } from "../util/Error";

export class NodeRepository {
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

  async getNodesOfATree(treeId: string) {
    return await Node.find({ familyTree: treeId });
  }

  async createNode(node: INode) {
    Node.create(node);
  }

  async getNode(nodeId: string) {
    const node = await Node.findOne({ _id: nodeId }).populate<{
      user: IUser;
    }>("user");

    if (!node) {
      throw new NotFoundError("Node not found");
    }

    return node;
  }

  async deleteNode(nodeId: string) {
    const deletedNode = await Node.deleteOne({ _id: nodeId });
    if (!deletedNode) {
      throw new AuthorizationError("Node not found");
    }
    return deletedNode;
  }

  async newSpouse(
    firstOneNodeId: string,
    secondOneUserId: string,
    marriageDate: string
  ) {
    console.log(firstOneNodeId, secondOneUserId, marriageDate);
    const firstOne = await Node.findOne({ _id: firstOneNodeId });
    const secondOne = await Node.findOne({ user: secondOneUserId });

    if (!firstOne || !secondOne) {
      throw new NotFoundError("Node not found");
    }

    if (firstOne.spouse && firstOne.spouse === secondOneUserId) {
      throw new ConflictedError("They are already spouses");
    }

    firstOne.spouse = secondOneUserId;
    firstOne.marriageDate = new Date(marriageDate);

    secondOne.spouse = firstOneNodeId;
    secondOne.marriageDate = new Date(marriageDate);
    secondOne.familyTree = firstOne.familyTree;
    secondOne.parentNode = null;

    return [await firstOne.save(), await secondOne.save()];
  }
}
