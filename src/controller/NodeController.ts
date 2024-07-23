import Elysia, { t } from "elysia";
import { Node } from "../model/Node";
import { AuthPlugin } from "../plugin/AuthPlugin";
import { JsonResponse } from "../util/JsonResponse";
import { INode } from "../util/Entity";

export const NodeController = (app: Elysia) =>
  app
    .use(AuthPlugin)
    .post(
      "/node",
      async ({ body, nodeRepository }) => {
        const node = new Node({
          _id: body.nodeId,
          familyTree: body.familyTree,
          user: body.user,
          parentNode: body.parentNode,
          spouse: body.spouse,
          gender: body.gender,
          birthDate: body.birthDate,
          deathDate: body.deathDate,
          marriageDate: body.marriageDate,
        });
        nodeRepository.createNode(node);
      },
      {
        body: t.Object({
          nodeId: t.Optional(t.String()),
          familyTree: t.String(),
          user: t.String(),
          parentNode: t.Nullable(t.String()),
          spouse: t.Nullable(t.String()),
          gender: t.Boolean(),
          birthDate: t.String(),
          deathDate: t.Nullable(t.String()),
          marriageDate: t.Nullable(t.String()),
        }),
      },
    )
    .post(
      "/node/spouse",
      async ({ body, nodeRepository }) => {
        nodeRepository.newSpouse(
          body.firstOneId,
          body.secondOneId,
          body.marriageDate,
        );
      },
      {
        body: t.Object({
          firstOneId: t.String(),
          secondOneId: t.String(),
          marriageDate: t.String(),
        }),
      },
    )
    .delete("/node/:nodeId", async ({ nodeRepository, params }) => {
      return new JsonResponse(
        await nodeRepository.deleteNode(params.nodeId),
        "Node deleted successfully",
      ).toJson();
    })
    .get("/node/:nodeId", async ({ nodeRepository, params }) => {
      return new JsonResponse(
        await nodeRepository.getNode(params.nodeId),
        "Node fetched successfully",
      ).toJson();
    })
    .put(
      "/node/:nodeId",
      async ({ body, nodeRepository, params }) => {
        const newNode: Partial<INode> = {
          user: body.user ? body.user : undefined,
          gender: body.gender ? body.gender : false,
          birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
          deathDate: body.deathDate ? new Date(body.deathDate) : undefined,
          marriageDate: body.marriageDate
            ? new Date(body.marriageDate)
            : undefined,
        };

        nodeRepository.updateNode(params.nodeId, newNode);
      },
      {
        body: t.Object({
          user: t.String(),
          gender: t.Boolean(),
          birthDate: t.String(),
          deathDate: t.String(),
          spouse: t.String(),
          marriageDate: t.String(),
        }),
      },
    );
