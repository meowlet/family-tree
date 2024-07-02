import Elysia, { t } from "elysia";
import { Types } from "mongoose";
import { FamilyTree } from "../model/FamilyTree";
import { AuthPlugin } from "../plugin/AuthPlugin";

export const TreeController = (app: Elysia) =>
  app
    .use(AuthPlugin)
    .post(
      "/tree",
      async ({ body, treeRepository }) => {
        const tree = new FamilyTree({
          name: body.name,
          description: body.description,
          creator: treeRepository.userId,
          admin: treeRepository.userId,
          rootNode: new Types.ObjectId(),
        });
        treeRepository.createTree(tree);
      },
      {
        body: t.Object({
          name: t.String(),
          description: t.String(),
        }),
      },
    )
    .get("/tree", async ({ params, nodeRepository }) => {});
