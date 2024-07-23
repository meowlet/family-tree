import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { NodeRepository } from "../repository/NodeRepository";
import { AuthorizationError } from "../util/Error";
import { TreeRepository } from "../repository/TreeRepository";
import { UserRepository } from "../repository/UserRepository";

export const AuthPlugin = async (app: Elysia) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "The ultimate secret",
      }),
    )
    .derive(async ({ headers, jwt }) => {
      const token = headers["authorization"]?.replace("Bearer ", "");
      if (!token) {
        throw new AuthorizationError("Token not found");
      }

      const decodedToken = await jwt.verify(token);
      if (!decodedToken) {
        throw new AuthorizationError("Error authenticating");
      } else {
        console.log(decodedToken);
        return {
          nodeRepository: new NodeRepository(decodedToken.userId as string),
          treeRepository: new TreeRepository(decodedToken.userId as string),
          userRepository: new UserRepository(decodedToken.userId as string),
        };
      }
    });
