import { Elysia } from "elysia";
import "./database/MongoDB";
import { ErrorPlugin } from "./plugin/ErrorPlugin";
import { AuthController } from "./controller/AuthController";
import { TreeController } from "./controller/TreeController";
import { NodeController } from "./controller/NodeController";
import cors from "@elysiajs/cors";
import { UserController } from "./controller/UserController";

const app = new Elysia()
  .use(ErrorPlugin)
  .use(cors())
  .group("/api", (app) =>
    app
      .group("/auth", (app) => app.use(AuthController))
      .use(TreeController)
      .use(NodeController)
      .group("/user", (app) => app.use(UserController)),
  )
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
