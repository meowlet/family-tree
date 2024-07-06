import Elysia, { t } from "elysia";
import { Types } from "mongoose";
import { FamilyTree } from "../model/FamilyTree";
import { AuthPlugin } from "../plugin/AuthPlugin";
import { JsonResponse } from "../util/JsonResponse";

export const UserController = (app: Elysia) =>
  app.use(AuthPlugin).get("/", async ({ userRepository }) => {
    return new JsonResponse(
      await userRepository.getUser(),
      "User fetched successfully",
    ).toJson();
  });
