import { Elysia } from "elysia";
import "./database/MongoDB";
import { ErrorPlugin } from "./plugin/ErrorPlugin";
import { AuthController } from "./controller/AuthController";
import { TreeController } from "./controller/TreeController";
import { NodeController } from "./controller/NodeController";

const app = new Elysia()
  .use(ErrorPlugin)
  .use(AuthController)
  .use(TreeController)
  .use(NodeController)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
