import Elysia, { t } from "elysia";
import { authRepository } from "../repository/AuthRepository";
import jwt from "@elysiajs/jwt";
import { User } from "../model/User";
import { JsonResponse } from "../util/JsonResponse";
import { Types } from "mongoose";

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

      return new JsonResponse(
        await authRepository.signUp(newUser),
        "Sign up sucessfully",
      ).toJson();
    },
    {
      body: t.Object({
        userName: t.String(),
        email: t.String(),
        fullName: t.String(),
        passwordHash: t.String(),
      }),
    },
  )
  .post(
    "/signup/temp",
    async ({ body }) => {
      const newUser = new User({
        userName: new Types.ObjectId(),
        email: `${new Types.ObjectId()}@temp.com`,
        fullName: body.fullName,
        bio: body.bio,
        homeTown: body.homeTown,
      });

      await authRepository.signUp(newUser);
      return new JsonResponse(
        await authRepository.signUp(newUser),
        "Succesfully created a new tempoary user",
      ).toJson();
    },
    {
      body: t.Object({
        fullName: t.String(),
        bio: t.String(),
        homeTown: t.String(),
      }),
    },
  );
