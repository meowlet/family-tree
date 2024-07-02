import Elysia, { t } from "elysia";
import { Node } from "../model/Node";
import { AuthPlugin } from "../plugin/AuthPlugin";

export const NodeController = (app: Elysia) =>
  app
    .use(AuthPlugin)
    .post(
      "/node",
      async ({ body, nodeRepository }) => {
        const node = new Node({
          familyTree: body.familyTree,
          user: body.user,
          parentNode: body.parentNode,
          spouse: body.spouse,
          gender: body.gender,
        });
        nodeRepository.createNode(node);
      },
      {
        body: t.Object({
          familyTree: t.String(),
          user: t.String(),
          parentNode: t.String(),
          spouse: t.String(),
          gender: t.Boolean(),
        }),
      },
    )
    .get("/:treeId", async ({ params, nodeRepository }) => {
      return nodeRepository.getNodesOfATree(params.treeId);
    });
