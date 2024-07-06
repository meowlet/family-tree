import Elysia, { t } from "elysia";
import { Types } from "mongoose";
import { FamilyTree } from "../model/FamilyTree";
import { AuthPlugin } from "../plugin/AuthPlugin";
import { JsonResponse } from "../util/JsonResponse";

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
    .get("/tree/:treeId", async ({ treeRepository, params }) => {
      return new JsonResponse(
        await treeRepository.getTree(params.treeId),
        "Tree fetched successfully",
      ).toJson();
    })
    .get("/tree", async ({ treeRepository }) => {
      return new JsonResponse(
        await treeRepository.getTrees(),
        "Trees fetched successfully",
      ).toJson();
    });
