import Elysia, { t } from "elysia";
import { AuthPlugin } from "../plugin/AuthPlugin";
import { JsonResponse } from "../util/JsonResponse";

export const UserController = (app: Elysia) =>
  app
    .use(AuthPlugin)
    .get("/me", async ({ userRepository }) => {
      return new JsonResponse(
        await userRepository.getUser(),
        "User fetched successfully",
      ).toJson();
    })
    .get(
      "/",
      async ({ userRepository, query }) => {
        return new JsonResponse(
          await userRepository.getUsers(query.query || ""),
          "Users fetched successfully",
        ).toJson();
      },
      {
        query: t.Object({
          query: t.Optional(t.String()),
        }),
      },
    );
