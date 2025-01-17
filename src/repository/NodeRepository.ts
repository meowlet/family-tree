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
    const deletedNode = await Node.findOne({ _id: nodeId });
    if (!deletedNode) {
      throw new AuthorizationError("Node not found");
    }

    deletedNode.user = "999999999999999999999999";

    return deletedNode.save();
  }

  async updateNode(nodeId: string, node: Partial<INode>) {
    console.log(nodeId, node);

    const updatedNode = await Node.findOneAndUpdate({ _id: nodeId }, node, {
      new: true,
    });
    if (!updatedNode) {
      throw new NotFoundError("Node not found");
    }
    return updatedNode;
  }

  async newSpouse(
    firstOneNodeId: string,
    secondOneUserId: string,
    marriageDate: string,
  ) {
    console.log(firstOneNodeId, secondOneUserId, marriageDate);
    const firstOne = await Node.findOne({ _id: firstOneNodeId });
    const secondOne = await User.findOne({ _id: secondOneUserId });

    if (!firstOne || !secondOne) {
      throw new NotFoundError("Node not found");
    }

    const secondOneNode = new Node({
      user: secondOne._id,
      familyTree: firstOne.familyTree,
      spouse: firstOne._id,
      marriageDate: new Date(marriageDate),
      birthDate: new Date(),
      gender: !firstOne.gender,
    });

    if (firstOne.spouse && firstOne.spouse === secondOneNode._id.toString()) {
      throw new ConflictedError("They are already spouses");
    }

    firstOne.spouse = secondOneNode._id;
    firstOne.marriageDate = new Date(marriageDate);

    return [await firstOne.save(), await secondOneNode.save()];
  }
}
