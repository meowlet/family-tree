import Elysia, { t } from "elysia";
import { authRepository } from "../repository/AuthRepository";
import jwt from "@elysiajs/jwt";
import { User } from "../model/User";
import { JsonResponse } from "../util/JsonResponse";

export const AuthController = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "The ultimate secret",
      exp: "3d",
    }),
  )
  .post(
    "/signin",
    async ({ jwt, body }) => {
      const user = await authRepository.signIn(body.identifier, body.password);
      const token = await jwt.sign({
        userId: user._id.toString(),
      });
      return new JsonResponse(
        { token },
        `Sucessfully signed in as ${user.userName}`,
      ).toJson();
    },
    { body: t.Object({ identifier: t.String(), password: t.String() }) },
  )
  .post(
    "/signup",
    async ({ body }) => {
      const newUser = new User({
        userName: body.userName,
        email: body.email,
        fullName: body.fullName,
        passwordHash: body.passwordHash,
      });

      await authRepository.signUp(newUser);
      console.log(newUser);
      return new JsonResponse(newUser, "Sign up sucessfully").toJson();
    },
    {
      body: t.Object({
        userName: t.String(),
        email: t.String(),
        fullName: t.String(),
        passwordHash: t.String(),
      }),
    },
  );
