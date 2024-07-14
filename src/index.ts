import { Elysia } from "elysia";
import "./database/MongoDB";
import { ErrorPlugin } from "./plugin/ErrorPlugin";
import { AuthController } from "./controller/AuthController";
import { TreeController } from "./controller/TreeController";
import { NodeController } from "./controller/NodeController";
import { UserController } from "./controller/UserController";
import swagger from "@elysiajs/swagger";
import cors from "@elysiajs/cors";

const app = new Elysia()
  .use(swagger())
  .use(ErrorPlugin)
  .use(
    cors({
      origin: "http://localhost:3001",
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .group("/api", (app) =>
    app
      .group("/auth", (app) => app.use(AuthController))
      .use(TreeController)
      .use(NodeController)
      .group("/user", (app) => app.use(UserController)),
  )
  .get("/", ({ body }) => {
    console.log(body);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
