import { Node } from "../model/Node";
import { User } from "../model/User";
import { INode } from "../util/Entity";
import { AuthorizationError } from "../util/Error";

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
    return await Node.find({ tree: treeId });
  }

  async createNode(node: INode) {
    Node.create(node);
  }
}
